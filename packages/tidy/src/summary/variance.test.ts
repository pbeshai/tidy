import { tidy, summarize, variance } from '../index';

type MixedDatum = { str: string; value: number };

describe('variance', () => {
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
          megaVariance: variance((d: MixedDatum) => d.value * 100),
          varianceValue: variance('value'),
        })
      )
    ).toEqual([{ varianceValue: 6, megaVariance: 60000 }]);
  });
});
