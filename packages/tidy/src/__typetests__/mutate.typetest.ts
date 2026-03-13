import { expectTypeOf } from 'expect-type';
import { tidy, mutate } from '../index';

// mutate with a function adds the new property
{
  type Input = { a: number; b: string };
  const result = tidy([] as Input[], mutate({ c: (d) => d.a + 1 }));
  expectTypeOf(result[0]).toHaveProperty('a');
  expectTypeOf(result[0]).toHaveProperty('b');
  expectTypeOf(result[0]).toHaveProperty('c');
  expectTypeOf(result[0].a).toBeNumber();
  expectTypeOf(result[0].b).toBeString();
  expectTypeOf(result[0].c).toBeNumber();
}

// mutate with a constant value
{
  type Input = { a: number };
  const result = tidy([] as Input[], mutate({ b: 'hello' }));
  expectTypeOf(result[0]).toHaveProperty('a');
  expectTypeOf(result[0]).toHaveProperty('b');
}

// mutate overriding an existing property narrows the type
{
  type Input = { a: number | undefined; b: string };
  const result = tidy([] as Input[], mutate({ a: (d) => 42 }));
  expectTypeOf(result[0]).toHaveProperty('a');
  expectTypeOf(result[0]).toHaveProperty('b');
}

// chaining multiple mutates
{
  type Input = { a: number };
  const result = tidy(
    [] as Input[],
    mutate({ b: (d) => String(d.a) }),
    mutate({ c: (d) => d.b.length })
  );
  expectTypeOf(result[0]).toHaveProperty('a');
  expectTypeOf(result[0]).toHaveProperty('b');
  expectTypeOf(result[0]).toHaveProperty('c');
  expectTypeOf(result[0].c).toBeNumber();
}
