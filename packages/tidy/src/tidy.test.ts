import { tidy, groupBy } from './index';
type BasicDatum = { value: number };

describe('tidy', () => {
  it('tidy works', () => {
    const data = [{ value: 1 }, { value: 2 }, { value: 3 }];
    expect(
      tidy(
        data,
        (items: BasicDatum[]) => items.filter((d) => d.value % 2 === 1),
        (items: BasicDatum[]) => items.filter((d) => d.value > 2)
      )
    ).toEqual([{ value: 3 }]);
  });

  it('works with different outputs', () => {
    const data = [
      { str: 'a', value: 1 },
      { str: 'b', value: 2 },
      { str: 'a', value: 3 },
    ];
    const results = tidy(data, groupBy('str', [], groupBy.grouped()));
    expect(results).toBeInstanceOf(Map);

    const results2 = tidy(data, groupBy('str', [], groupBy.object()));
    expect(typeof results2).toBe('object');
    expect(Array.isArray(results2)).toBe(false);

    const results3 = tidy(data, (items: typeof data[number][]) =>
      items.filter((d) => d.value > 2)
    );
    expect(Array.isArray(results3)).toBe(true);
    expect(results3.length).toBe(1);
  });
});
