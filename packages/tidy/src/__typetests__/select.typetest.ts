import { expectTypeOf } from 'expect-type';
import { tidy, select } from '../index';

// select with array of keys picks those keys
{
  type Input = { a: number; b: string; c: boolean };
  const result = tidy([] as Input[], select(['a', 'b'] as const));
  expectTypeOf(result[0]).toHaveProperty('a');
  expectTypeOf(result[0]).toHaveProperty('b');
}

// select with single key
{
  type Input = { a: number; b: string; c: boolean };
  const result = tidy([] as Input[], select('a' as const));
  expectTypeOf(result[0]).toHaveProperty('a');
}

// select with drop key (negative) removes that key
{
  type Input = { a: number; b: string; c: boolean };
  const result = tidy([] as Input[], select(['-c'] as const));
  expectTypeOf(result[0]).toHaveProperty('a');
  expectTypeOf(result[0]).toHaveProperty('b');
}
