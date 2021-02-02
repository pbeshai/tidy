import { tidy, summarize, mean } from '../index';

type MixedDatum = { str: string; value: number };

describe('mean', () => {
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
          megaMean: mean((d: MixedDatum) => d.value * 100),
          meanValue: mean('value'),
        })
      )
    ).toEqual([{ meanValue: 3, megaMean: 300 }]);
  });
});
