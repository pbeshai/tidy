import { tidy, mutateWithSummary, summarize, nDistinct } from '../index';

describe('nDistinct', () => {
  it('it works', () => {
    const data = [
      { str: 'foo', value: 3 },
      { str: 'foo', value: 1 },
      { str: 'bar', value: 3 },
      { str: 'bar', value: 1 },
      { str: 'bar', value: 7 },
      { str: 'bar', value: 1 },
    ];

    expect(
      tidy(
        data,
        summarize({
          numStr: nDistinct('str'),
          numValue: nDistinct((d) => d.value),
          numDistinct: nDistinct((d) => `${d.str}_${d.value}`),
          numNone: nDistinct('foo' as any),
        })
      )
    ).toEqual([{ numStr: 2, numValue: 3, numDistinct: 5, numNone: 0 }]);

    expect(
      tidy(
        data,
        mutateWithSummary({
          numStr: nDistinct('str'),
        })
      )
    ).toEqual([
      { str: 'foo', value: 3, numStr: 2 },
      { str: 'foo', value: 1, numStr: 2 },
      { str: 'bar', value: 3, numStr: 2 },
      { str: 'bar', value: 1, numStr: 2 },
      { str: 'bar', value: 7, numStr: 2 },
      { str: 'bar', value: 1, numStr: 2 },
    ]);

    expect(tidy([], summarize({ n: nDistinct('foo') }))).toEqual([{ n: 0 }]);

    expect(
      tidy(
        [
          { foo: null, bar: undefined },
          { foo: 1, bar: 'a' },
          { foo: 1, bar: null },
          { foo: 2, bar: 'b' },
          { foo: null, bar: 'b' },
        ],
        summarize({
          numFooBoth: nDistinct('foo', {
            includeNull: true,
            includeUndefined: true,
          }),
          numFooNull: nDistinct('foo', {
            includeNull: true,
            includeUndefined: false,
          }),
          numFooUndef: nDistinct('foo', {
            includeNull: false,
            includeUndefined: true,
          }),
          numFooNone: nDistinct('foo', {
            includeNull: false,
            includeUndefined: false,
          }),

          numBarBoth: nDistinct('bar', {
            includeNull: true,
            includeUndefined: true,
          }),
          numBarNull: nDistinct('bar', {
            includeNull: true,
            includeUndefined: false,
          }),
          numBarUndef: nDistinct('bar', {
            includeNull: false,
            includeUndefined: true,
          }),
          numBarNone: nDistinct('bar', {
            includeNull: false,
            includeUndefined: false,
          }),

          numBazBoth: nDistinct('baz' as any, {
            includeNull: true,
            includeUndefined: true,
          }),
          numBazNull: nDistinct('baz' as any, {
            includeNull: true,
            includeUndefined: false,
          }),
          numBazUndef: nDistinct('baz' as any, {
            includeNull: false,
            includeUndefined: true,
          }),
          numBazNone: nDistinct('baz' as any, {
            includeNull: false,
            includeUndefined: false,
          }),
        })
      )
    ).toEqual([
      {
        numFooBoth: 3,
        numFooNull: 3,
        numFooUndef: 2,
        numFooNone: 2,
        numBarBoth: 4,
        numBarNull: 3,
        numBarUndef: 3,
        numBarNone: 2,
        numBazBoth: 1,
        numBazNull: 0,
        numBazUndef: 1,
        numBazNone: 0,
      },
    ]);
  });
});
