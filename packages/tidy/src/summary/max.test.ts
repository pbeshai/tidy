import { tidy, summarize, max } from '../index';

type MixedDatum = { str: string; value: number };

describe('max', () => {
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
          megaMax: max((d: MixedDatum) => d.value * 100),
          maxValue: max('value'),
        })
      )
    ).toEqual([{ maxValue: 7, megaMax: 700 }]);
  });
});
