import { summarizeMomentGranularity } from './index';
import { tidy, sum } from '@tidyjs/tidy';
import moment from 'moment';

describe('moment', () => {
  describe('summarizeMomentGranularity', () => {
    it('it works', () => {
      const data = [
        { str: 'foo', date: moment.utc('2020-01-01'), value: 3 },
        { str: 'foo', date: moment.utc('2020-01-03'), value: 1 },
        { str: 'bar', date: moment.utc('2020-01-10'), value: 3 },
        { str: 'bar', date: moment.utc('2020-01-21'), value: 1 },
        { str: 'bar', date: moment.utc('2020-02-01'), value: 7 },
      ];

      let results = tidy(
        data,
        summarizeMomentGranularity('weeks', { summedValue: sum('value') })
      );

      results = results.map((d) => {
        d.date = d.date.toISOString() as any;
        return d;
      });

      expect(results).toEqual([
        {
          summedValue: 4,
          str: 'foo',
          date: moment.utc('2019-12-30').toISOString(),
          value: 3,
          timestamp: '2019-12-30T00:00:00.000Z',
        },
        {
          summedValue: 3,
          str: 'bar',
          date: moment.utc('2020-01-06').toISOString(),
          value: 3,
          timestamp: '2020-01-06T00:00:00.000Z',
        },
        {
          summedValue: 1,
          str: 'bar',
          date: moment.utc('2020-01-20').toISOString(),
          value: 1,
          timestamp: '2020-01-20T00:00:00.000Z',
        },
        {
          summedValue: 7,
          str: 'bar',
          date: moment.utc('2020-01-27').toISOString(),
          value: 7,
          timestamp: '2020-01-27T00:00:00.000Z',
        },
      ]);
    });
  });
});
