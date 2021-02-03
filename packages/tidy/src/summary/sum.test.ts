import { tidy, summarize, sum } from '../index';
import { sum as d3sum } from 'd3-array';

type MixedDatum = { str: string; value: number };
type Datum = { value: number };

describe('sum', () => {
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
          megaSum: sum((d: MixedDatum) => d.value * 100),
          summedValue: sum<MixedDatum>('value'),
          summedValue2: sum('value'),
        })
      )
    ).toEqual([{ summedValue: 15, summedValue2: 15, megaSum: 1500 }]);
  });
  it('corrects floating point errors', () => {
    const data = [
      { value: 18.7 },
      { value: 14.3 },
      { value: 16.4 },
      { value: 17.3 },
      { value: 15.2 },
      { value: 10.4 },
      { value: 10.4 },
      { value: 14.7 },
      { value: 15.5 },
      { value: 15.2 },
      { value: 13.3 },
      { value: 19.2 },
    ];
    const result = tidy(
      data,
      summarize({
        summedValue: sum<Datum>('value'),
      })
    )[0].summedValue;
    const d3Result = d3sum(data.map((d) => d.value));
    expect(result).toEqual(180.6);
    expect(result).toBeCloseTo(d3Result);
    expect(result).not.toEqual(d3Result);
  });
});
