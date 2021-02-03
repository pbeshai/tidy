import { tidy, mutateWithSummary, cumsum, pick } from '../index';
import { cumsum as d3cumsum } from 'd3-array';

describe('cumsum', () => {
  it('it works', () => {
    const data = [
      { str: 'foo', value: 3, value2: 1 },
      { str: 'bar', value: 1, value2: 3 },
      { str: 'bar', value: null, value2: undefined },
      { str: 'bar', value: 5, value2: 4 },
    ];

    const results = tidy(
      data,
      mutateWithSummary({
        cumsum1: cumsum('value'),
        cumsum2: cumsum((d) => (d.value == null ? d.value : d.value2 * 2)),
      })
    );

    expect(results).toEqual([
      { str: 'foo', value: 3, value2: 1, cumsum1: 3, cumsum2: 2 },
      { str: 'bar', value: 1, value2: 3, cumsum1: 4, cumsum2: 8 },
      { str: 'bar', value: null, value2: undefined, cumsum1: 4, cumsum2: 8 },
      { str: 'bar', value: 5, value2: 4, cumsum1: 9, cumsum2: 16 },
    ]);
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

    const results = tidy(
      data,
      mutateWithSummary({
        cumsum: cumsum('value'),
        cumsumFn: cumsum((d) => d.value),
        cumsumD3: (items) => d3cumsum(items.map((d) => d.value)),
      })
    );

    expect(tidy(results, pick(['value', 'cumsum']))).toEqual([
      { value: 18.7, cumsum: 18.7 },
      { value: 14.3, cumsum: 33 },
      { value: 16.4, cumsum: 49.4 },
      { value: 17.3, cumsum: 66.7 },
      { value: 15.2, cumsum: 81.9 },
      { value: 10.4, cumsum: 92.3 },
      { value: 10.4, cumsum: 102.7 },
      { value: 14.7, cumsum: 117.4 },
      { value: 15.5, cumsum: 132.9 },
      { value: 15.2, cumsum: 148.1 },
      { value: 13.3, cumsum: 161.4 },
      { value: 19.2, cumsum: 180.6 },
    ]);

    results.forEach((item, i) => {
      if (i < 5) {
        expect(item.cumsum).toEqual(item.cumsumD3);
      } else {
        expect(item.cumsum).toBeCloseTo(item.cumsumD3);
        expect(item.cumsum).not.toEqual(item.cumsumD3);
      }
    });
  });
});
