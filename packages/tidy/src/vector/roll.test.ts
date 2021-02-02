import {
  tidy,
  select,
  meanRate,
  mutateWithSummary,
  roll,
  mean,
  sum,
  TMath,
} from '../index';

describe('roll', () => {
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
        mutateWithSummary({
          movingAvg: roll(3, mean('value'), { partial: true }),
        })
      )
    ).toEqual([
      { str: 'foo', value: 3, movingAvg: 3 / 1 },
      { str: 'foo', value: 1, movingAvg: 4 / 2 },
      { str: 'bar', value: 3, movingAvg: 7 / 3 },
      { str: 'bar', value: 1, movingAvg: 5 / 3 },
      { str: 'bar', value: 7, movingAvg: 11 / 3 },
    ]);

    expect(
      tidy(
        data,
        mutateWithSummary({
          movingAvg: roll(3, mean('value')),
        })
      )
    ).toEqual([
      { str: 'foo', value: 3, movingAvg: undefined },
      { str: 'foo', value: 1, movingAvg: undefined },
      { str: 'bar', value: 3, movingAvg: 7 / 3 },
      { str: 'bar', value: 1, movingAvg: 5 / 3 },
      { str: 'bar', value: 7, movingAvg: 11 / 3 },
    ]);

    // test that it works when re-using the same name
    expect(
      tidy(
        data,
        mutateWithSummary({
          value: roll(3, mean('value')),
        })
      )
    ).toEqual([
      { str: 'foo', value: undefined },
      { str: 'foo', value: undefined },
      { str: 'bar', value: 7 / 3 },
      { str: 'bar', value: 5 / 3 },
      { str: 'bar', value: 11 / 3 },
    ]);
  });

  it('works with rates', () => {
    const data = [
      { str: 'foo', value: 3, value2: 4 },
      { str: 'foo', value: 0, value2: 0 },
      { str: 'bar', value: 0, value2: 3 },
      { str: 'bar', value: 1, value2: 2 },
      { str: 'bar', value: 7, value2: 10 },
    ];

    const results = tidy(
      data,
      mutateWithSummary({
        movingAvgNumerator: roll(3, sum('value'), { partial: true }),
        movingAvgDenominator: roll(3, sum('value2'), { partial: true }),
        movingAvg: (items) =>
          items.map((d: any) =>
            TMath.rate(d.movingAvgNumerator, d.movingAvgDenominator)
          ),
      }),
      select(['-movingAvgNumerator', '-movingAvgDenominator'])
    );
    expect(results).toEqual([
      { str: 'foo', value: 3, value2: 4, movingAvg: 3 / 4 },
      { str: 'foo', value: 0, value2: 0, movingAvg: 3 / 4 },
      { str: 'bar', value: 0, value2: 3, movingAvg: 3 / 7 },
      { str: 'bar', value: 1, value2: 2, movingAvg: 1 / 5 },
      { str: 'bar', value: 7, value2: 10, movingAvg: 8 / 15 },
    ]);

    /// simpler
    expect(
      tidy(
        data,
        mutateWithSummary({
          movingAvg: roll(3, meanRate('value', 'value2'), { partial: true }),
        })
      )
    ).toEqual(results);
  });
});
