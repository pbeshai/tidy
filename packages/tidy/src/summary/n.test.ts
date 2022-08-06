import { tidy, summarize, n } from '../index';

type MixedDatum = { str: string; value: number };

describe('n', () => {
  it('it works', () => {
    const data = [
      { str: 'foo', value: 3 },
      { str: 'foo', value: 1 },
      { str: 'bar', value: 3 },
      { str: 'bar', value: 1 },
      { str: 'bar', value: 7 },
    ];

    expect(
      tidy(
        data,
        summarize({
          n: n(),
          nWhere: n({ predicate: (d) => d.str === 'bar' }),
        })
      )
    ).toEqual([{ n: 5, nWhere: 3 }]);
  });
});
