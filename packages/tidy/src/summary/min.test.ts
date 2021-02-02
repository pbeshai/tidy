import { tidy, summarize, min } from '../index';

type MixedDatum = { str: string; value: number };

describe('min', () => {
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
          megaMin: min((d: MixedDatum) => d.value * 100),
          minValue: min('value'),
        })
      )
    ).toEqual([{ minValue: 1, megaMin: 100 }]);
  });
});
