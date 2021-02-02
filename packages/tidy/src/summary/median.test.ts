import { tidy, summarize, median } from '../index';

type MixedDatum = { str: string; value: number };

describe('median', () => {
  it('it works', () => {
    const data = [
      { str: 'foo', value: 1 },
      { str: 'foo', value: 1 },
      { str: 'bar', value: 4 },
      { str: 'bar', value: 2 },
      { str: 'bar', value: 7 },
    ];

    expect(
      tidy(
        data,
        summarize({
          megaMean: median((d: MixedDatum) => d.value * 100),
          medianValue: median('value'),
        })
      )
    ).toEqual([{ medianValue: 2, megaMean: 200 }]);
  });
});
