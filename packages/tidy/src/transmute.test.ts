import { tidy, transmute, groupBy, sum } from './index';

describe('transmute', () => {
  it('it works', () => {
    const data = [
      { str: 'foo', value: 3 },
      { str: 'bar', value: 1 },
      { str: 'bar', value: 7 },
    ];

    const results = tidy(
      data,
      transmute({
        valuex2: (d) => d.value * 2,
        valuex4: (d) => (d as any).valuex2 * 2,
      })
    );

    expect(results).toEqual([
      { valuex2: 6, valuex4: 12 },
      { valuex2: 2, valuex4: 4 },
      { valuex2: 14, valuex4: 28 },
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
        transmute({
          concat: (d) => `${d.str}->${d.value}`,
          x: 4,
        }),
      ])
    );
    expect(results).toEqual([
      { str: 'a', x: 4, concat: 'a->1' },
      { str: 'a', x: 4, concat: 'a->2' },
      { str: 'a', x: 4, concat: 'a->5' },
      { str: 'a', x: 4, concat: 'a->3' },
      { str: 'a', x: 4, concat: 'a->4' },
      { str: 'a', x: 4, concat: 'a->6' },
      { str: 'b', x: 4, concat: 'b->100' },
      { str: 'b', x: 4, concat: 'b->200' },
      { str: 'b', x: 4, concat: 'b->300' },
      { str: 'b', x: 4, concat: 'b->400' },
    ]);
  });
});
