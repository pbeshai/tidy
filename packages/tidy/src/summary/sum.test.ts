import { tidy, summarize, sum } from '../index';

type MixedDatum = { str: string; value: number };

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
});
