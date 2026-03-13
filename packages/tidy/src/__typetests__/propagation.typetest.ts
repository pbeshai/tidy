import { expectTypeOf } from 'expect-type';
import {
  tidy,
  mutate,
  mutateWithSummary,
  groupBy,
  summarize,
  filter,
  arrange,
  desc,
  sum,
  mean,
  n,
  first,
  innerJoin,
  leftJoin,
  select,
  rename,
} from '../index';

// ============================================================
// FULL BUG REPORT PIPELINE
// mutate -> groupBy+summarize -> filter -> mutateWithSummary -> mutate -> arrange
// ============================================================
{
  type Datum = { row_group: string; user_engagement_total: number };
  const data: Datum[] = [];

  // Step 1: mutate adds chart_group
  const afterMutate = tidy(
    data,
    mutate({ chart_group: (d) => 'foo' as string })
  );
  expectTypeOf(afterMutate[0]).toHaveProperty('row_group');
  expectTypeOf(afterMutate[0]).toHaveProperty('user_engagement_total');
  expectTypeOf(afterMutate[0]).toHaveProperty('chart_group');
  expectTypeOf(afterMutate[0].chart_group).toBeString();

  // Step 2: groupBy with summarize should produce {chart_group: string, total: number}
  const afterGroupBy = tidy(
    afterMutate,
    groupBy(['chart_group'], [
      summarize({ total: sum('user_engagement_total') }),
    ])
  );
  expectTypeOf(afterGroupBy[0]).toHaveProperty('chart_group');
  expectTypeOf(afterGroupBy[0]).toHaveProperty('total');
  expectTypeOf(afterGroupBy[0].total).toBeNumber();
  expectTypeOf(afterGroupBy[0].chart_group).toBeString();

  // Step 3: filter preserves the type
  const afterFilter = tidy(
    afterGroupBy,
    filter((d) => d.chart_group !== 'x')
  );
  expectTypeOf(afterFilter[0]).toHaveProperty('chart_group');
  expectTypeOf(afterFilter[0]).toHaveProperty('total');

  // Step 4: mutateWithSummary adds grand_total
  const afterMWS = tidy(
    afterFilter,
    mutateWithSummary({ grand_total: sum('total') })
  );
  expectTypeOf(afterMWS[0]).toHaveProperty('chart_group');
  expectTypeOf(afterMWS[0]).toHaveProperty('total');
  expectTypeOf(afterMWS[0]).toHaveProperty('grand_total');
  expectTypeOf(afterMWS[0].grand_total).toBeNumber();

  // Step 5: mutate adds pct
  const afterPct = tidy(
    afterMWS,
    mutate({ pct: (d) => d.total / d.grand_total })
  );
  expectTypeOf(afterPct[0]).toHaveProperty('pct');
  expectTypeOf(afterPct[0].pct).toBeNumber();
}

// ============================================================
// COMBINED: mutate -> groupBy+summarize -> filter (3-step pipeline)
// ============================================================
{
  type Datum = { row_group: string; user_engagement_total: number };
  const data: Datum[] = [];
  const result = tidy(
    data,
    mutate({ chart_group: (d) => 'foo' as string }),
    groupBy(['chart_group'], [
      summarize({ total: sum('user_engagement_total') }),
    ]),
    filter((d) => d.total > 0),
  );
  expectTypeOf(result[0]).toHaveProperty('chart_group');
  expectTypeOf(result[0]).toHaveProperty('total');
  expectTypeOf(result[0].total).toBeNumber();
}

// ============================================================
// groupBy with single string key + summarize
// ============================================================
{
  type Input = { category: string; amount: number; label: string };
  const result = tidy(
    [] as Input[],
    groupBy('category', [
      summarize({ total: sum('amount'), count: n() }),
    ])
  );
  expectTypeOf(result[0]).toHaveProperty('category');
  expectTypeOf(result[0]).toHaveProperty('total');
  expectTypeOf(result[0]).toHaveProperty('count');
  expectTypeOf(result[0].category).toBeString();
  expectTypeOf(result[0].total).toBeNumber();
  expectTypeOf(result[0].count).toBeNumber();
}

// ============================================================
// groupBy with multiple keys + summarize
// ============================================================
{
  type Input = { g1: string; g2: number; value: number };
  const result = tidy(
    [] as Input[],
    groupBy(['g1', 'g2'], [
      summarize({ avg: mean('value') }),
    ])
  );
  expectTypeOf(result[0]).toHaveProperty('g1');
  expectTypeOf(result[0]).toHaveProperty('g2');
  expectTypeOf(result[0]).toHaveProperty('avg');
}

// ============================================================
// Deep pipeline: mutate -> mutate -> groupBy -> filter -> arrange
// ============================================================
{
  type Input = { x: number; y: number };
  const result = tidy(
    [] as Input[],
    mutate({ z: (d) => d.x + d.y }),
    mutate({ label: (d) => `${d.z}` }),
    groupBy('label', [summarize({ total: sum('z') })]),
    filter((d) => d.total > 0),
    arrange(desc('total'))
  );
  expectTypeOf(result[0]).toHaveProperty('label');
  expectTypeOf(result[0]).toHaveProperty('total');
}

// ============================================================
// join -> mutate -> summarize pipeline
// ============================================================
{
  type Orders = { order_id: number; product_id: number; quantity: number };
  type Products = { product_id: number; price: number };
  const result = tidy(
    [] as Orders[],
    innerJoin([] as Products[]),
    mutate({ line_total: (d) => d.quantity * d.price }),
    summarize({ revenue: sum('line_total') })
  );
  expectTypeOf(result[0]).toHaveProperty('revenue');
  expectTypeOf(result[0].revenue).toBeNumber();
}

// ============================================================
// mutateWithSummary then mutate referencing summary column
// ============================================================
{
  type Input = { value: number };
  const result = tidy(
    [] as Input[],
    mutateWithSummary({ total: sum('value') }),
    mutate({ pct: (d) => d.value / d.total })
  );
  expectTypeOf(result[0]).toHaveProperty('value');
  expectTypeOf(result[0]).toHaveProperty('total');
  expectTypeOf(result[0]).toHaveProperty('pct');
  expectTypeOf(result[0].pct).toBeNumber();
}
