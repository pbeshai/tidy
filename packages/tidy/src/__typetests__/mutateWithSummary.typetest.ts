import { expectTypeOf } from 'expect-type';
import { tidy, mutateWithSummary, sum } from '../index';

// mutateWithSummary adds new columns from array-level functions
{
  type Input = { a: number; b: string };
  const result = tidy(
    [] as Input[],
    mutateWithSummary({ total: sum('a') })
  );
  expectTypeOf(result[0]).toHaveProperty('a');
  expectTypeOf(result[0]).toHaveProperty('b');
  expectTypeOf(result[0]).toHaveProperty('total');
  expectTypeOf(result[0].total).toBeNumber();
}

// mutateWithSummary with constant value
{
  type Input = { a: number };
  const result = tidy(
    [] as Input[],
    mutateWithSummary({ label: 'constant' })
  );
  expectTypeOf(result[0]).toHaveProperty('a');
  expectTypeOf(result[0]).toHaveProperty('label');
}
