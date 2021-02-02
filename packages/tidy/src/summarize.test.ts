import {
  tidy,
  summarize,
  summarizeAll,
  summarizeIf,
  summarizeAt,
  sum,
  groupBy,
  startsWith,
} from './index';
import { sum as d3sum } from 'd3-array';
import { endsWith } from './selectors/endsWith';

type MixedDatum2 = { str: string; value: number; value2: number };

describe('summarize', () => {
  describe('summarize', () => {
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
        summarize({
          summedValue: (items) => d3sum(items, (d) => d.value),
        })
      );
      expect(results).toEqual([{ summedValue: 15 }]);
    });

    it('it works with rest option', () => {
      const data = [
        { str: 'foo', value: 3 },
        { str: 'foo', value: 1 },
        { str: 'bar', value: 3 },
        { str: 'bar', value: 1 },
        { str: 'bar', value: 7 },
      ];
      const results = tidy(
        data,
        summarize(
          {
            value: (items) => d3sum(items, (d) => d.value),
          },
          { rest: (key) => (items) => items[0][key] }
        )
      );
      expect(results).toEqual([{ value: 15, str: 'foo' }]);
    });

    it('it works grouped', () => {
      const data = [
        { str: 'foo', value: 3 },
        { str: 'foo', value: 1 },
        { str: 'bar', value: 3 },
        { str: 'bar', value: 1 },
        { str: 'bar', value: 7 },
      ];

      const results = tidy(
        data,
        groupBy('str', [
          summarize({
            summedValue: (items) => d3sum(items, (d) => d.value),
          }),
        ])
      );
      expect(results).toEqual([
        { str: 'foo', summedValue: 4 },
        { str: 'bar', summedValue: 11 },
      ]);

      const results2 = tidy(
        data,
        groupBy(
          'str',
          [
            summarize({
              summedValue: (items) => d3sum(items, (d) => d.value),
            }),
          ],
          groupBy.grouped()
        )
      );
      expect(results2).toEqual(
        new Map([
          [['str', 'foo'], [{ str: 'foo', summedValue: 4 }]],
          [['str', 'bar'], [{ str: 'bar', summedValue: 11 }]],
        ])
      );
    });
  });

  describe('summarizeAll', () => {
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
        summarizeAll((key) => (items) => d3sum(items, (d) => d[key]))
      );

      expect(results).toEqual([{ value: 15, value2: 23 }]);

      expect(tidy(data, summarizeAll(sum))).toEqual([
        { value: 15, value2: 23 },
      ]);
    });
  });
  type NumberProps<T> = {
    [P in keyof T]: T[P] extends number ? P : never;
  }[keyof T];

  describe('summarizeIf', () => {
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
        summarizeIf(
          (vector) => Number.isFinite(vector[0] as any),
          (key) => (items) =>
            d3sum(items, (d) => d[key as NumberProps<MixedDatum2>])
        )
      );
      expect(results).toEqual([{ value: 15, value2: 23 }]);

      expect(
        tidy(
          data,
          summarizeIf((vector) => Number.isFinite(vector[0] as any), sum)
        )
      ).toEqual([{ value: 15, value2: 23 }]);
    });
  });

  describe('summarizeAt', () => {
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
        summarizeAt(['value', 'value2'], (key) => (items) =>
          d3sum(items, (d) => d[key])
        )
      );

      expect(results).toEqual([{ value: 15, value2: 23 }]);

      expect(tidy(data, summarizeAt(['value'], sum))).toEqual([{ value: 15 }]);
    });

    it('works with selectors', () => {
      const data = [
        { str: 'foo1', value2: 3, value: 3 },
        { str: 'bar1', value2: 4, value: 1 },
        { str: 'baz1', value2: 5, value: 3 },
        { str: 'foo2', value2: 1, value: 1 },
        { str: 'bar2', value2: 10, value: 7 },
      ];
      expect(
        tidy(data, summarizeAt([startsWith('val') as any /* TODO */], sum))
      ).toEqual([{ value: 15, value2: 23 }]);

      const data2 = [
        { str: 'foo1', value2: 3, value: 3, foo: 9 },
        { str: 'bar1', value2: 4, value: 1, foo: 8 },
        { str: 'baz1', value2: 5, value: 3, foo: 7 },
        { str: 'foo2', value2: 1, value: 1, foo: 6 },
        { str: 'bar2', value2: 10, value: 7, foo: 5 },
      ];
      expect(
        tidy(
          data2,
          summarizeAt([startsWith('val') as any, endsWith('foo')], sum)
        )
      ).toEqual([{ value: 15, value2: 23, foo: 35 }]);
    });
  });
});
