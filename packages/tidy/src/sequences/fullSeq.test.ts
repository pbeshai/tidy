import { fullSeq, fullSeqDate, fullSeqDateISOString } from '../index';

describe('fullSeq', () => {
  it('it works', () => {
    const data = [
      { str: 'foo', value: 3 },
      { str: 'foo', value: 1 },
      { str: 'foo', value: 5 },
      { str: 'foo', value: 10 },
      { str: 'foo', value: 1 },
    ];
    expect(fullSeq('value', 1)(data)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});

describe('fullSeqDate', () => {
  it('it works', () => {
    const data = [
      { str: 'foo', date: new Date('2020-04-01') },
      { str: 'foo', date: new Date('2020-04-02') },
      { str: 'foo', date: new Date('2020-04-03') },
      { str: 'foo', date: new Date('2020-04-06') },
      { str: 'foo', date: new Date('2020-04-08') },
    ];
    expect(fullSeqDate('date', 'day', 1)(data)).toEqual([
      new Date('2020-04-01'),
      new Date('2020-04-02'),
      new Date('2020-04-03'),
      new Date('2020-04-04'),
      new Date('2020-04-05'),
      new Date('2020-04-06'),
      new Date('2020-04-07'),
      new Date('2020-04-08'),
    ]);
  });
});

describe('fullSeqDate', () => {
  it('seconds granularity works', () => {
    const data = [
      { str: 'foo', date: new Date('2077-01-01T00:00:00.000Z') },
      { str: 'foo', date: new Date('2077-01-01T00:00:04.000Z') },
    ];
    expect(fullSeqDate('date', 'second', 2)(data)).toEqual([
      new Date('2077-01-01T00:00:00.000Z'),
      new Date('2077-01-01T00:00:02.000Z'),
      new Date('2077-01-01T00:00:04.000Z'),
    ]);
  });
});

describe('fullSeqDate', () => {
  it('minute granularity works', () => {
    const data = [
      { str: 'foo', date: new Date('2077-01-01T00:01:00.000Z') },
      { str: 'foo', date: new Date('2077-01-01T00:05:00.000Z') },
      { str: 'foo', date: new Date('2077-01-01T00:03:00.000Z') },
    ];
    expect(fullSeqDate('date', 'minute', 1)(data)).toEqual([
      new Date('2077-01-01T00:01:00.000Z'),
      new Date('2077-01-01T00:02:00.000Z'),
      new Date('2077-01-01T00:03:00.000Z'),
      new Date('2077-01-01T00:04:00.000Z'),
      new Date('2077-01-01T00:05:00.000Z'),
    ]);
  });
});

describe('fullSeqDateISOString', () => {
  it('it works', () => {
    const data = [
      { str: 'foo', timestamp: '2020-04-01T00:00:00.000Z' },
      { str: 'foo', timestamp: '2020-04-02T00:00:00.000Z' },
      { str: 'foo', timestamp: '2020-04-03T00:00:00.000Z' },
      { str: 'foo', timestamp: '2020-04-06T00:00:00.000Z' },
      { str: 'foo', timestamp: '2020-04-08T00:00:00.000Z' },
    ];
    const results = fullSeqDateISOString('timestamp', 'day', 1)(data);
    expect(results).toEqual([
      '2020-04-01T00:00:00.000Z',
      '2020-04-02T00:00:00.000Z',
      '2020-04-03T00:00:00.000Z',
      '2020-04-04T00:00:00.000Z',
      '2020-04-05T00:00:00.000Z',
      '2020-04-06T00:00:00.000Z',
      '2020-04-07T00:00:00.000Z',
      '2020-04-08T00:00:00.000Z',
    ]);
  });
});
