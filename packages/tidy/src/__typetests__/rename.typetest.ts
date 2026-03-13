import { expectTypeOf } from 'expect-type';
import { tidy, rename } from '../index';

// rename changes key names while preserving value types
{
  type Input = { a: number; b: string };
  const result = tidy([] as Input[], rename({ a: 'x' }));
  expectTypeOf(result[0]).toHaveProperty('x');
  expectTypeOf(result[0]).toHaveProperty('b');
  expectTypeOf(result[0].x).toBeNumber();
}
