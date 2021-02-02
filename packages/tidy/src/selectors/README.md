# Selectors

Selectors are helpers for selecting a subset of columns / keys.

e.g. select([{ foo: 1, foo2: 3, foobar: 4, baz: 5 }], startsWith('foo')) => [{ foo: 1, foo2: 3, foobar: 4 }]

Typically they return a function that when called on T[] resolves to a set of keys.

e.g. startsWith = (prefix) => (items: T[]) => (keyof T)[];
