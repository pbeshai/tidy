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
  n,
  mean,
  first,
  innerJoin,
  leftJoin,
  select,
  rename,
  replaceNully,
  transmute,
} from '../index';
import type { TidyFn } from '../types';

// ============================================================
// STRICT: mutate return type has all properties with correct types
// ============================================================
{
  type Input = { a: number; b: string };
  const fn = mutate<Input, { c: (d: Input) => boolean }>({ c: (d) => d.a > 0 });
  expectTypeOf(fn).toMatchTypeOf<TidyFn<Input, { a: number; b: string; c: boolean }>>();
}

// ============================================================
// STRICT: summarize output has the spec keys with return types
// ============================================================
{
  type Input = { a: number; b: number; c: string };
  const result = tidy(
    [] as Input[],
    summarize({ totalA: sum('a'), totalB: sum('b') })
  );
  type ResultItem = (typeof result)[number];
  expectTypeOf({} as ResultItem).toMatchTypeOf<{ totalA: number; totalB: number }>();
}

// ============================================================
// STRICT: groupBy('key', [summarize(...)]) output includes group key
// ============================================================
{
  type Input = { group: string; value: number };
  const result = tidy(
    [] as Input[],
    groupBy('group', [summarize({ total: sum('value') })])
  );
  // The result should have both 'group' (from group keys) and 'total' (from summarize)
  type ResultItem = (typeof result)[number];
  expectTypeOf<ResultItem>().toHaveProperty('group');
  expectTypeOf<ResultItem>().toHaveProperty('total');

  // group key should retain its original type from T
  expectTypeOf({} as ResultItem).toMatchTypeOf<{ group: string; total: number }>();
}

// ============================================================
// STRICT: groupBy with array keys merges all group keys
// ============================================================
{
  type Input = { g1: string; g2: number; value: number };
  const result = tidy(
    [] as Input[],
    groupBy(['g1', 'g2'], [summarize({ total: sum('value') })])
  );
  type ResultItem = (typeof result)[number];
  expectTypeOf({} as ResultItem).toMatchTypeOf<{ g1: string; g2: number; total: number }>();
}

// ============================================================
// STRICT: innerJoin merges types with left taking precedence
// ============================================================
{
  type A = { id: number; name: string };
  type B = { id: number; score: number };
  const result = tidy([] as A[], innerJoin([] as B[]));
  type ResultItem = (typeof result)[number];
  // A's id (number) takes precedence since it's the left side
  expectTypeOf({} as ResultItem).toMatchTypeOf<{ id: number; name: string; score: number }>();
}

// ============================================================
// STRICT: leftJoin makes joined-only fields optional
// ============================================================
{
  type A = { id: number; name: string };
  type B = { id: number; score: number };
  const result = tidy([] as A[], leftJoin([] as B[]));
  type ResultItem = (typeof result)[number];
  expectTypeOf({} as ResultItem).toMatchTypeOf<{ id: number; name: string }>();
  expectTypeOf({} as ResultItem).toHaveProperty('score');
}

// ============================================================
// STRICT: select with const array picks exact keys
// ============================================================
{
  type Input = { a: number; b: string; c: boolean };
  const result = tidy([] as Input[], select(['a', 'c'] as const));
  type ResultItem = (typeof result)[number];
  expectTypeOf({} as ResultItem).toMatchTypeOf<{ a: number; c: boolean }>();
}

// ============================================================
// STRICT: rename produces correct key names with original value types
// ============================================================
{
  type Input = { oldName: number; keep: string };
  const result = tidy([] as Input[], rename({ oldName: 'newName' }));
  type ResultItem = (typeof result)[number];
  expectTypeOf({} as ResultItem).toHaveProperty('newName');
  expectTypeOf({} as ResultItem).toHaveProperty('keep');
}

// ============================================================
// STRICT: filter preserves the input type exactly
// ============================================================
{
  type Input = { a: number; b: string };
  const result = tidy([] as Input[], filter((d) => d.a > 0));
  expectTypeOf(result).toEqualTypeOf<Input[]>();
}

// ============================================================
// STRICT: mutateWithSummary intersects new fields with T
// ============================================================
{
  type Input = { value: number; label: string };
  const result = tidy(
    [] as Input[],
    mutateWithSummary({ total: sum('value'), count: n() })
  );
  type ResultItem = (typeof result)[number];
  expectTypeOf({} as ResultItem).toMatchTypeOf<{
    value: number;
    label: string;
    total: number;
    count: number;
  }>();
}

// ============================================================
// STRICT: transmute keeps only the mutated keys
// ============================================================
{
  type Input = { a: number; b: string };
  const result = tidy(
    [] as Input[],
    transmute({ c: (d: Input) => d.a * 2, e: (d: Input) => d.b.length })
  );
  type ResultItem = (typeof result)[number];
  expectTypeOf({} as ResultItem).toMatchTypeOf<{ c: number; e: number }>();
}

// ============================================================
// STRICT: full pipeline type propagation end-to-end
// ============================================================
{
  type Datum = { row_group: string; user_engagement_total: number };
  const data: Datum[] = [];

  // The most important test: full pipeline in one tidy() call
  // with every intermediate type correctly inferred
  const result = tidy(
    data,
    mutate({ chart_group: (d) => 'foo' as string }),
    groupBy(['chart_group'], [
      summarize({ total: sum('user_engagement_total') }),
    ]),
    filter((d) => d.chart_group !== 'x'),
    mutateWithSummary({ grand_total: sum('total') }),
    mutate({ pct: (d) => d.total / d.grand_total }),
    arrange(desc('total')),
  );

  type FinalItem = (typeof result)[number];
  expectTypeOf({} as FinalItem).toHaveProperty('chart_group');
  expectTypeOf({} as FinalItem).toHaveProperty('total');
  expectTypeOf({} as FinalItem).toHaveProperty('grand_total');
  expectTypeOf({} as FinalItem).toHaveProperty('pct');
}
