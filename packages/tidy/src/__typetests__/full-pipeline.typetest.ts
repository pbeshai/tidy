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
  innerJoin,
  leftJoin,
} from '../index';

// ============================================================
// THE EXACT BUG REPORT PIPELINE (7 steps in one tidy() call)
// ============================================================
{
  type Datum = { row_group: string; user_engagement_total: number };
  const data: Datum[] = [];
  const result = tidy(
    data,
    mutate({ chart_group: (d) => 'foo' as string }),
    groupBy(
      ['chart_group'],
      [summarize({ total: sum('user_engagement_total') })]
    ),
    filter((d) => d.chart_group !== 'x'),
    mutateWithSummary({ grand_total: sum('total') }),
    mutate({ pct: (d) => d.total / d.grand_total }),
    arrange(desc('total'))
  );
  expectTypeOf(result[0]).toHaveProperty('chart_group');
  expectTypeOf(result[0]).toHaveProperty('total');
  expectTypeOf(result[0]).toHaveProperty('grand_total');
  expectTypeOf(result[0]).toHaveProperty('pct');
  expectTypeOf(result[0].pct).toBeNumber();
}

// ============================================================
// 5-step: mutate -> groupBy+summarize -> filter -> mutate -> arrange
// ============================================================
{
  type Input = { category: string; value: number };
  const result = tidy(
    [] as Input[],
    mutate({ doubled: (d) => d.value * 2 }),
    groupBy('category', [
      summarize({ total: sum('doubled'), avg: mean('doubled') }),
    ]),
    filter((d) => d.total > 100),
    mutate({ label: (d) => `${d.category}: ${d.total}` }),
    arrange(desc('total'))
  );
  expectTypeOf(result[0]).toHaveProperty('category');
  expectTypeOf(result[0]).toHaveProperty('total');
  expectTypeOf(result[0]).toHaveProperty('avg');
  expectTypeOf(result[0]).toHaveProperty('label');
  expectTypeOf(result[0].label).toBeString();
}

// ============================================================
// join -> mutate -> groupBy -> summarize -> arrange (5 steps)
// ============================================================
{
  type Orders = { order_id: number; product_id: number; qty: number };
  type Products = { product_id: number; price: number; category: string };
  const result = tidy(
    [] as Orders[],
    innerJoin([] as Products[]),
    mutate({ line_total: (d) => d.qty * d.price }),
    groupBy('category', [summarize({ revenue: sum('line_total') })]),
    arrange(desc('revenue'))
  );
  expectTypeOf(result[0]).toHaveProperty('category');
  expectTypeOf(result[0]).toHaveProperty('revenue');
  expectTypeOf(result[0].revenue).toBeNumber();
}

// ============================================================
// leftJoin -> filter -> mutateWithSummary -> mutate
// ============================================================
{
  type A = { id: number; name: string };
  type B = { id: number; score: number };
  const result = tidy(
    [] as A[],
    leftJoin([] as B[]),
    filter((d) => d.score != null),
    mutateWithSummary({ avg_score: mean('score') }),
    mutate({ above_avg: (d) => (d.score ?? 0) > (d.avg_score ?? 0) })
  );
  expectTypeOf(result[0]).toHaveProperty('name');
  expectTypeOf(result[0]).toHaveProperty('score');
  expectTypeOf(result[0]).toHaveProperty('avg_score');
  expectTypeOf(result[0]).toHaveProperty('above_avg');
}

// ============================================================
// Multiple groupBy summarize layers
// ============================================================
{
  type Input = { region: string; city: string; sales: number };
  const result = tidy(
    [] as Input[],
    groupBy(['region', 'city'], [summarize({ city_total: sum('sales') })]),
    groupBy('region', [summarize({ region_total: sum('city_total') })])
  );
  expectTypeOf(result[0]).toHaveProperty('region');
  expectTypeOf(result[0]).toHaveProperty('region_total');
  expectTypeOf(result[0].region_total).toBeNumber();
}
