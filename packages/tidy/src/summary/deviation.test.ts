import { tidy, mutate, summarize, deviation } from '../index';

type MixedDatum = { str: string; value: number };

describe('deviation', () => {
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
          megaDeviation: deviation((d: MixedDatum) => d.value * 100),
          deviationValue: deviation('value'),
        }),
        mutate({
          megaDeviation: (d) => Math.floor(d.megaDeviation! * 1000) / 1000,
          deviationValue: (d) => Math.floor(d.deviationValue! * 1000) / 1000,
        })
      )
    ).toEqual([{ deviationValue: 2.449, megaDeviation: 244.948 }]);
  });
});
