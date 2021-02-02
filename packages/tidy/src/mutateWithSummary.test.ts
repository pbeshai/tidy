import { tidy, mutateWithSummary, groupBy, sum } from './index';

describe('mutateWithSummary', () => {
  it('it works', () => {
    const data = [
      { str: 'foo', value: 3 },
      { str: 'bar', value: 1 },
      { str: 'bar', value: 7 },
    ];

    const results = tidy(
      data,
      mutateWithSummary({
        str2: 0,
      }),
      mutateWithSummary({
        valuex2: (items) => items.map((d) => d.value * 2),
        valuex4: (items) => items.map((d) => (d as any).valuex2 * 2),
      }),
      mutateWithSummary({
        total: sum('value'),
        totalx2: sum('valuex2'),
        totalx4: sum('valuex4'),
        totalSquared: (items) =>
          (items[0] as any).total * (items[0] as any).total,
      })
    );

    // prettier-ignore
    expect(results).toEqual([
      { str: 'foo', str2: 0, value: 3, valuex2: 6, valuex4: 12, total: 11, totalx2: 22, totalx4: 44, totalSquared: 121 },
      { str: 'bar', str2: 0, value: 1, valuex2: 2, valuex4: 4, total: 11, totalx2: 22, totalx4: 44, totalSquared: 121 },
      { str: 'bar', str2: 0, value: 7, valuex2: 14, valuex4: 28, total: 11, totalx2: 22, totalx4: 44, totalSquared: 121 },
    ]);

    const test1 = tidy(
      data,
      mutateWithSummary({
        str2: (items) => items.map((d) => 0),
      })
    );
    const test2 = mutateWithSummary<
      typeof data[number],
      { str2: (d: any) => number }
    >({
      str2: (items) => 0,
    })(data);
    expect(test1).toEqual(test2);
  });

  it('it works with a variety of types', () => {
    const data = [
      { str: 'foo', value: 3 },
      { str: 'bar', value: 1 },
      { str: 'bar', value: 7 },
    ];

    const results = tidy(
      data,
      mutateWithSummary({
        fullArr: [1, 2, 3],
        partialArr: [1, 2],
        undefinedValue: undefined,
        nullValue: null,
        str: 'foo',
        num: 123,
        bool: true,
        obj: { foo: 1 },
        obj3: { foo: 1, bar: 2, baz: 3 },
      })
    );

    expect(results).toEqual([
      {
        str: 'foo',
        value: 3,
        fullArr: 1,
        partialArr: 1,
        undefinedValue: undefined,
        nullValue: null,
        num: 123,
        bool: true,
        obj: { foo: 1 },
        obj3: { foo: 1, bar: 2, baz: 3 },
      },
      {
        str: 'foo',
        value: 1,
        fullArr: 2,
        partialArr: 2,
        undefinedValue: undefined,
        nullValue: null,
        num: 123,
        bool: true,
        obj: { foo: 1 },
        obj3: { foo: 1, bar: 2, baz: 3 },
      },
      {
        str: 'foo',
        value: 7,
        fullArr: 3,
        partialArr: undefined,
        undefinedValue: undefined,
        nullValue: null,
        num: 123,
        bool: true,
        obj: { foo: 1 },
        obj3: { foo: 1, bar: 2, baz: 3 },
      },
    ]);
  });

  it('works on grouped', () => {
    const data = [
      { str: 'a', ing: 'x', foo: 'G', value: 1 },
      { str: 'b', ing: 'x', foo: 'H', value: 100 },
      { str: 'b', ing: 'x', foo: 'K', value: 200 },
      { str: 'a', ing: 'y', foo: 'G', value: 2 },
      { str: 'a', ing: 'z', foo: 'K', value: 5 },
      { str: 'a', ing: 'y', foo: 'H', value: 3 },
      { str: 'a', ing: 'y', foo: 'K', value: 4 },
      { str: 'b', ing: 'y', foo: 'G', value: 300 },
      { str: 'b', ing: 'z', foo: 'H', value: 400 },
      { str: 'a', ing: 'z', foo: 'G', value: 6 },
    ];

    const results = tidy(
      data,
      groupBy('str', [
        mutateWithSummary({
          summed: sum('value'),
          x: 4,
        }),
      ])
    );
    expect(results).toEqual([
      { str: 'a', ing: 'x', foo: 'G', x: 4, summed: 21, value: 1 },
      { str: 'a', ing: 'y', foo: 'G', x: 4, summed: 21, value: 2 },
      { str: 'a', ing: 'z', foo: 'K', x: 4, summed: 21, value: 5 },
      { str: 'a', ing: 'y', foo: 'H', x: 4, summed: 21, value: 3 },
      { str: 'a', ing: 'y', foo: 'K', x: 4, summed: 21, value: 4 },
      { str: 'a', ing: 'z', foo: 'G', x: 4, summed: 21, value: 6 },
      { str: 'b', ing: 'x', foo: 'H', x: 4, summed: 1000, value: 100 },
      { str: 'b', ing: 'x', foo: 'K', x: 4, summed: 1000, value: 200 },
      { str: 'b', ing: 'y', foo: 'G', x: 4, summed: 1000, value: 300 },
      { str: 'b', ing: 'z', foo: 'H', x: 4, summed: 1000, value: 400 },
    ]);
  });

  it('works with types', () => {
    type Item = {
      num1: number;
      num2: number;
      rate1: number | undefined;
      rate2: number | undefined;
      rate3: number | undefined;
    };
    let values: Item[] = [
      { num1: 123, num2: 421, rate1: 0, rate2: 0, rate3: 0 },
    ];
    const values2 = tidy(
      values,

      mutateWithSummary({
        rate1: (items) =>
          items.map((d) => (d.rate1 === Infinity ? undefined : d.rate1)),
      })
    );
    const values3 = tidy(
      values,
      mutateWithSummary({
        rate1: (items) =>
          items.map((d) => (d.rate1 === Infinity ? undefined : d.rate1)),
        num1: (items) => items.map((d) => d.num1 * 2),
        rate2: (items: Item[]) =>
          items.map((d) => (d.rate2 === Infinity ? undefined : d.rate2)),
        rate3: (items) =>
          items.map((d) => (d.rate3 === Infinity ? undefined : d.rate3)),
      })
    );
  });
});
