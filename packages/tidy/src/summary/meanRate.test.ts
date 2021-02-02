import { tidy, summarize, meanRate } from '../index';

type MixedDatum = { str: string; value: number; value2: number };

describe('meanRate', () => {
  it('it works', () => {
    const data = [
      { str: 'foo', value: 3, value2: 4 },
      { str: 'foo', value: 0, value2: 0 },
      { str: 'bar', value: 0, value2: 3 },
      { str: 'bar', value: 1, value2: 2 },
      { str: 'bar', value: 7, value2: 10 },
    ];

    expect(
      tidy(
        data,
        summarize({
          megaMean: meanRate(
            (d: MixedDatum) => d.value * 100,
            (d) => d.value2
          ),
          meanValue: meanRate('value', 'value2'),
        })
      )
    ).toEqual([{ meanValue: 11 / 19, megaMean: (100 * 11) / 19 }]);
  });
});
