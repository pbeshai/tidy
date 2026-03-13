import { expectTypeOf } from 'expect-type';
import {
  tidy,
  summarize,
  summarizeAll,
  summarizeAt,
  sum,
  mean,
  first,
} from '../index';

// summarize produces an object with specified keys
{
  type Input = { a: number; b: number; c: string };
  const result = tidy(
    [] as Input[],
    summarize({
      totalA: sum('a'),
      totalB: sum('b'),
    })
  );
  expectTypeOf(result[0]).toHaveProperty('totalA');
  expectTypeOf(result[0]).toHaveProperty('totalB');
  expectTypeOf(result[0].totalA).toBeNumber();
  expectTypeOf(result[0].totalB).toBeNumber();
}

// summarizeAll applies a function to all keys
{
  type Input = { a: number; b: number };
  const result = tidy([] as Input[], summarizeAll(first));
  expectTypeOf(result[0]).toHaveProperty('a');
  expectTypeOf(result[0]).toHaveProperty('b');
}

// summarizeAt applies to specified keys
{
  type Input = { a: number; b: number; c: string };
  const result = tidy([] as Input[], summarizeAt(['a', 'b'], sum));
  expectTypeOf(result[0]).toHaveProperty('a');
  expectTypeOf(result[0]).toHaveProperty('b');
}
