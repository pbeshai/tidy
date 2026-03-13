import { expectTypeOf } from 'expect-type';
import { tidy, replaceNully, expand, transmute } from '../index';

// replaceNully narrows the type for replaced keys
{
  type Input = { a: number | null; b: string };
  const result = tidy(
    [] as Input[],
    replaceNully({ a: 0 })
  );
  expectTypeOf(result[0]).toHaveProperty('a');
  expectTypeOf(result[0]).toHaveProperty('b');
}

// expand with array of keys produces Pick'd type
{
  type Input = { a: number; b: string; c: boolean };
  const result = tidy(
    [] as Input[],
    expand(['a', 'b'] as ['a', 'b'])
  );
  expectTypeOf(result[0]).toHaveProperty('a');
  expectTypeOf(result[0]).toHaveProperty('b');
}

// transmute keeps only mutated keys
{
  type Input = { a: number; b: string };
  const result = tidy(
    [] as Input[],
    transmute({ c: (d: Input) => d.a + 1 })
  );
  expectTypeOf(result[0]).toHaveProperty('c');
  expectTypeOf(result[0].c).toBeNumber();
}
