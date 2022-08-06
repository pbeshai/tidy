import { tidy, summarize, sumWhere } from '../index';
import { sum as d3sum } from 'd3-array';

type MixedDatum = { str: string; value: number };
type Datum = { value: number };

describe('sumWhere', () => {
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
          megaSum: sumWhere(
            (d) => d.str === 'foo',
            (d: MixedDatum) => d.value * 100
          ),
          summedValue: sumWhere<MixedDatum>((d) => d.str === 'foo', 'value'),
          summedValue2: sumWhere((d) => d.str === 'bar', 'value'),
        })
      )
    ).toEqual([{ summedValue: 4, summedValue2: 11, megaSum: 400 }]);
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
        summedValue: sumWhere<Datum>((d, i) => i % 2 === 0, 'value'),
      })
    )[0].summedValue;
    const d3Result = d3sum(data.map((d, i) => (i % 2 === 0 ? d.value : 0)));
    expect(result).toEqual(89.5);
    expect(result).toBeCloseTo(d3Result);
    expect(result).not.toEqual(d3Result);
  });
});
