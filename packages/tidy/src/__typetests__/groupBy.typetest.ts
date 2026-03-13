import { expectTypeOf } from 'expect-type';
import { tidy, groupBy, summarize, sum } from '../index';

// groupBy with summarize merges group keys into output
{
  type Input = { group: string; value: number };
  const result = tidy(
    [] as Input[],
    groupBy('group', [summarize({ total: sum('value') })])
  );
  expectTypeOf(result[0]).toHaveProperty('group');
  expectTypeOf(result[0]).toHaveProperty('total');
  expectTypeOf(result[0].total).toBeNumber();
}

// groupBy with array of keys
{
  type Input = { g1: string; g2: string; value: number };
  const result = tidy(
    [] as Input[],
    groupBy(['g1', 'g2'], [summarize({ total: sum('value') })])
  );
  expectTypeOf(result[0]).toHaveProperty('g1');
  expectTypeOf(result[0]).toHaveProperty('g2');
  expectTypeOf(result[0]).toHaveProperty('total');
}

// groupBy with entries export returns tuple array
{
  type Input = { group: string; value: number };
  const result = tidy(
    [] as Input[],
    groupBy('group', [summarize({ total: sum('value') })], groupBy.entries())
  );
  expectTypeOf(result).toBeArray();
}

// groupBy with object export returns Record
{
  type Input = { group: string; value: number };
  const result = tidy(
    [] as Input[],
    groupBy('group', [summarize({ total: sum('value') })], groupBy.object())
  );
  expectTypeOf(result).toBeObject();
}

// groupBy with no fns passes through input type with group keys
{
  type Input = { group: string; value: number };
  const result = tidy(
    [] as Input[],
    groupBy('group')
  );
  expectTypeOf(result[0]).toHaveProperty('group');
  expectTypeOf(result[0]).toHaveProperty('value');
}
