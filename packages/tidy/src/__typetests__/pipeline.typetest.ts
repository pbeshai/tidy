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
  select,
  innerJoin,
  leftJoin,
} from '../index';

// multi-step pipeline: mutate -> filter -> summarize
{
  type Input = { a: number; b: string };
  const result = tidy(
    [] as Input[],
    mutate({ c: (d) => d.a * 2 }),
    filter((d) => d.c > 5),
    summarize({ total: sum('c') })
  );
  expectTypeOf(result[0]).toHaveProperty('total');
  expectTypeOf(result[0].total).toBeNumber();
}

// multi-step pipeline: mutate -> groupBy+summarize -> filter -> arrange
{
  type Input = { category: string; value: number };
  const result = tidy(
    [] as Input[],
    mutate({ doubled: (d) => d.value * 2 }),
    groupBy('category', [summarize({ total: sum('doubled') })]),
    filter((d) => d.total > 10),
    arrange(desc('total'))
  );
  expectTypeOf(result[0]).toHaveProperty('category');
  expectTypeOf(result[0]).toHaveProperty('total');
}

// pipeline with join then mutate
{
  type A = { id: number; name: string };
  type B = { id: number; score: number };
  const result = tidy(
    [] as A[],
    innerJoin([] as B[]),
    mutate({ label: (d) => `${d.name}: ${d.score}` })
  );
  expectTypeOf(result[0]).toHaveProperty('id');
  expectTypeOf(result[0]).toHaveProperty('name');
  expectTypeOf(result[0]).toHaveProperty('score');
  expectTypeOf(result[0]).toHaveProperty('label');
}

// pipeline with select then mutate
{
  type Input = { a: number; b: string; c: boolean };
  const result = tidy(
    [] as Input[],
    select(['a', 'b'] as const),
    mutate({ d: (item) => item.a + 1 })
  );
  expectTypeOf(result[0]).toHaveProperty('a');
  expectTypeOf(result[0]).toHaveProperty('b');
  expectTypeOf(result[0]).toHaveProperty('d');
}

// the concrete example from the bug report (simplified)
{
  type Datum = { row_group: string; user_engagement_total: number };
  const data: Datum[] = [];
  const result = tidy(
    data,
    mutate({ chart_group: (d) => 'foo' as string }),
    groupBy(['chart_group'], [
      summarize({ total: sum('user_engagement_total') }),
    ]),
    filter((d) => d.chart_group !== 'x'),
  );
  expectTypeOf(result[0]).toHaveProperty('chart_group');
  expectTypeOf(result[0]).toHaveProperty('total');
}
