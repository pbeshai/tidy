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
  asc,
  sum,
  mean,
  n,
  first,
  last,
  innerJoin,
  leftJoin,
  fullJoin,
  select,
  rename,
  replaceNully,
  transmute,
  expand,
} from '../index';

// ============================================================
// EDGE: mutate callback receives the already-mutated type
// so subsequent properties in the same spec should see prior mutations
// ============================================================
{
  type Input = { x: number };
  const result = tidy(
    [] as Input[],
    mutate({
      doubled: (d) => d.x * 2,
    }),
    mutate({
      tripled: (d) => d.doubled * 1.5,
    })
  );
  type R = (typeof result)[number];
  expectTypeOf({} as R).toHaveProperty('x');
  expectTypeOf({} as R).toHaveProperty('doubled');
  expectTypeOf({} as R).toHaveProperty('tripled');
}

// ============================================================
// EDGE: groupBy with function key (not string key) still works
// ============================================================
{
  type Input = { value: number; category: string };
  const result = tidy(
    [] as Input[],
    groupBy((d: Input) => d.category, [
      summarize({ total: sum('value') }),
    ])
  );
  // Function keys don't get merged back as named properties
  expectTypeOf(result[0]).toHaveProperty('total');
}

// ============================================================
// EDGE: groupBy with addGroupKeys: false
// ============================================================
{
  type Input = { group: string; value: number };
  const result = tidy(
    [] as Input[],
    groupBy('group', [summarize({ total: sum('value') })], {
      addGroupKeys: false,
    })
  );
  expectTypeOf(result[0]).toHaveProperty('total');
}

// ============================================================
// EDGE: multiple groupBy in sequence
// ============================================================
{
  type Input = { region: string; city: string; sales: number };
  const step1 = tidy(
    [] as Input[],
    groupBy(['region', 'city'], [
      summarize({ city_total: sum('sales') }),
    ])
  );
  expectTypeOf(step1[0]).toHaveProperty('region');
  expectTypeOf(step1[0]).toHaveProperty('city');
  expectTypeOf(step1[0]).toHaveProperty('city_total');

  const step2 = tidy(
    step1,
    groupBy('region', [
      summarize({ region_total: sum('city_total') }),
    ])
  );
  expectTypeOf(step2[0]).toHaveProperty('region');
  expectTypeOf(step2[0]).toHaveProperty('region_total');
}

// ============================================================
// EDGE: replaceNully narrows nullable fields
// ============================================================
{
  type Input = { a: number | null; b: string | undefined; c: boolean };
  const result = tidy(
    [] as Input[],
    replaceNully({ a: 0 })
  );
  type R = (typeof result)[number];
  expectTypeOf({} as R).toHaveProperty('a');
  expectTypeOf({} as R).toHaveProperty('b');
  expectTypeOf({} as R).toHaveProperty('c');
}

// ============================================================
// EDGE: select with drop key (negative prefix)
// ============================================================
{
  type Input = { a: number; b: string; c: boolean };
  const result = tidy(
    [] as Input[],
    select(['-c'] as const)
  );
  type R = (typeof result)[number];
  expectTypeOf({} as R).toHaveProperty('a');
  expectTypeOf({} as R).toHaveProperty('b');
}

// ============================================================
// EDGE: expand with keys produces correct partial type
// ============================================================
{
  type Input = { a: number; b: string; c: boolean };
  const result = tidy(
    [] as Input[],
    expand(['a', 'b'] as ['a', 'b'])
  );
  type R = (typeof result)[number];
  expectTypeOf({} as R).toMatchTypeOf<{ a: number; b: string }>();
}

// ============================================================
// EDGE: innerJoin then groupBy+summarize
// ============================================================
{
  type Orders = { order_id: number; customer_id: number; amount: number };
  type Customers = { customer_id: number; name: string };
  const result = tidy(
    [] as Orders[],
    innerJoin([] as Customers[]),
    groupBy('name', [
      summarize({
        total_orders: n(),
        total_amount: sum('amount'),
      }),
    ])
  );
  type R = (typeof result)[number];
  expectTypeOf({} as R).toHaveProperty('name');
  expectTypeOf({} as R).toHaveProperty('total_orders');
  expectTypeOf({} as R).toHaveProperty('total_amount');
  expectTypeOf(({} as R).total_orders).toBeNumber();
  expectTypeOf(({} as R).total_amount).toBeNumber();
}

// ============================================================
// EDGE: 10-step pipeline (maximum overload length)
// ============================================================
{
  type Input = { a: number; b: string };
  const result = tidy(
    [] as Input[],
    filter((d) => d.a > 0),           // 1
    mutate({ c: (d) => d.a * 2 }),     // 2
    filter((d) => d.c > 5),            // 3
    mutate({ d: (d) => d.c + d.a }),   // 4
    filter((d) => d.d > 10),           // 5
    mutate({ e: (d) => String(d.d) }), // 6
    filter((d) => d.e !== ''),         // 7
    mutate({ f: (d) => d.e.length }),  // 8
    filter((d) => d.f > 0),           // 9
    arrange(asc('f')),                 // 10
  );
  type R = (typeof result)[number];
  expectTypeOf({} as R).toHaveProperty('a');
  expectTypeOf({} as R).toHaveProperty('b');
  expectTypeOf({} as R).toHaveProperty('c');
  expectTypeOf({} as R).toHaveProperty('d');
  expectTypeOf({} as R).toHaveProperty('e');
  expectTypeOf({} as R).toHaveProperty('f');
}

// ============================================================
// EDGE: rename then mutate referencing new key name
// ============================================================
{
  type Input = { oldKey: number; other: string };
  const result = tidy(
    [] as Input[],
    rename({ oldKey: 'newKey' }),
    mutate({ derived: (d) => d.newKey * 2 })
  );
  type R = (typeof result)[number];
  expectTypeOf({} as R).toHaveProperty('newKey');
  expectTypeOf({} as R).toHaveProperty('other');
  expectTypeOf({} as R).toHaveProperty('derived');
}
