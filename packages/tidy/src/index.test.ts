import { tidy, summarize, filter, arrange, distinct } from './index';
import { sum as d3sum } from 'd3-array';

type MixedDatum = { str: string; value: number };

describe('integration', () => {
  it('it works with multiple steps', () => {
    let data = [
      { str: 'foo', value: 3 },
      { str: 'foo', value: 3 },
      { str: 'foo', value: 1 },
      { str: 'bar', value: 3 },
      { str: 'bar', value: 1 },
      { str: 'bar', value: 1 },
      { str: 'foo', value: 3 },
      { str: 'bar', value: 7 },
    ];

    let results = tidy(
      data,
      arrange(['str', 'value']),
      distinct(['str', 'value']),
      filter((d: MixedDatum) => d.value <= 3),
      summarize({
        summedValue: (items: MixedDatum[]) => d3sum(items, (d) => d.value),
      })
    );

    expect(results).toEqual([{ summedValue: 8 }]);
  });
});
