import { expectTypeOf } from 'expect-type';
import { tidy, innerJoin, leftJoin, fullJoin } from '../index';

// innerJoin merges both types
{
  type A = { id: number; a: string };
  type B = { id: number; b: number };
  const result = tidy(
    [] as A[],
    innerJoin([] as B[])
  );
  expectTypeOf(result[0]).toHaveProperty('id');
  expectTypeOf(result[0]).toHaveProperty('a');
  expectTypeOf(result[0]).toHaveProperty('b');
}

// leftJoin makes join fields partial
{
  type A = { id: number; a: string };
  type B = { id: number; b: number };
  const result = tidy(
    [] as A[],
    leftJoin([] as B[])
  );
  expectTypeOf(result[0]).toHaveProperty('id');
  expectTypeOf(result[0]).toHaveProperty('a');
  expectTypeOf(result[0]).toHaveProperty('b');
}

// fullJoin makes join fields partial
{
  type A = { id: number; a: string };
  type B = { id: number; b: number };
  const result = tidy(
    [] as A[],
    fullJoin([] as B[])
  );
  expectTypeOf(result[0]).toHaveProperty('id');
  expectTypeOf(result[0]).toHaveProperty('a');
  expectTypeOf(result[0]).toHaveProperty('b');
}
