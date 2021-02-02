import { tidy, total, totalAll, totalIf, totalAt, sum } from './index';
import { sum as d3sum } from 'd3-array';
import { startsWith } from './selectors/startsWith';

type MixedDatum2 = { str: string; value: number; value2: number };

describe('total', () => {
  describe('total', () => {
    it('it works', () => {
      const data = [
        { str: 'foo', value: 3 },
        { str: 'foo', value: 1 },
        { str: 'bar', value: 3 },
        { str: 'bar', value: 1 },
        { str: 'bar', value: 7 },
      ];

      const results = tidy(
        data,
        total(
          {
            value: (items) => d3sum(items, (d) => d.value),
          },
          { str: 'total' }
        )
      );
      expect(results).toEqual([
        { str: 'foo', value: 3 },
        { str: 'foo', value: 1 },
        { str: 'bar', value: 3 },
        { str: 'bar', value: 1 },
        { str: 'bar', value: 7 },
        { str: 'total', value: 15 },
      ]);
    });
  });

  describe('totalAll', () => {
    it('it works', () => {
      const data = [
        { value2: 3, value: 3 },
        { value2: 4, value: 1 },
        { value2: 5, value: 3 },
        { value2: 1, value: 1 },
        { value2: 10, value: 7 },
      ];
      const results = tidy(
        data,
        totalAll((key) => (items) => d3sum(items, (d) => d[key]), {
          str: 'total',
        })
      );
      expect(results).toEqual([
        { value2: 3, value: 3 },
        { value2: 4, value: 1 },
        { value2: 5, value: 3 },
        { value2: 1, value: 1 },
        { value2: 10, value: 7 },
        { value: 15, value2: 23, str: 'total' },
      ]);
    });
  });

  type NumberProps<T> = {
    [P in keyof T]: T[P] extends number ? P : never;
  }[keyof T];

  describe('totalIf', () => {
    it('it works', () => {
      const data = [
        { str: 'foo1', value2: 3, value: 3 },
        { str: 'bar1', value2: 4, value: 1 },
        { str: 'baz1', value2: 5, value: 3 },
        { str: 'foo2', value2: 1, value: 1 },
        { str: 'bar2', value2: 10, value: 7 },
      ];
      const results = tidy(
        data,
        totalIf(
          (vector) => Number.isFinite(vector[0] as any),
          (key) => (items) =>
            d3sum(items, (d) => d[key as NumberProps<MixedDatum2>]),
          { str: 'total' }
        )
      );
      expect(results).toEqual([
        { str: 'foo1', value2: 3, value: 3 },
        { str: 'bar1', value2: 4, value: 1 },
        { str: 'baz1', value2: 5, value: 3 },
        { str: 'foo2', value2: 1, value: 1 },
        { str: 'bar2', value2: 10, value: 7 },
        { str: 'total', value: 15, value2: 23 },
      ]);
    });
  });

  describe('totalAt', () => {
    it('it works', () => {
      const data = [
        { str: 'foo1', value2: 3, value: 3 },
        { str: 'bar1', value2: 4, value: 1 },
        { str: 'baz1', value2: 5, value: 3 },
        { str: 'foo2', value2: 1, value: 1 },
        { str: 'bar2', value2: 10, value: 7 },
      ];
      const results = tidy(
        data,
        totalAt(
          ['value', 'value2'],
          (key) => (items) =>
            d3sum(items, (d) => d[key as NumberProps<typeof d>]),
          { str: 'total' }
        )
      );
      expect(results).toEqual([
        { str: 'foo1', value2: 3, value: 3 },
        { str: 'bar1', value2: 4, value: 1 },
        { str: 'baz1', value2: 5, value: 3 },
        { str: 'foo2', value2: 1, value: 1 },
        { str: 'bar2', value2: 10, value: 7 },
        { str: 'total', value: 15, value2: 23 },
      ]);

      // with selector
      const results2 = tidy(
        data,
        totalAt([startsWith('val') as any /* TODO */], sum, {
          str: 'total',
        })
      );
      expect(results2).toEqual([
        { str: 'foo1', value2: 3, value: 3 },
        { str: 'bar1', value2: 4, value: 1 },
        { str: 'baz1', value2: 5, value: 3 },
        { str: 'foo2', value2: 1, value: 1 },
        { str: 'bar2', value2: 10, value: 7 },
        { str: 'total', value: 15, value2: 23 },
      ]);
    });
  });
});
