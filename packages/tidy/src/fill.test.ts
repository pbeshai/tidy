import { tidy, fill, complete, fullSeqDateISOString } from './index';

describe('fill', () => {
  it('fill works', () => {
    const data: {
      a?: number | null;
      b?: number | null;
      c?: number | null;
      d?: number | null;
      e?: number | null;
    }[] = [
      { a: 1, b: null, c: undefined, d: 1 },
      { a: null, b: 2, c: undefined },
      { a: null, c: 3, d: 3 },
      { a: 4, b: 4, c: 4, d: 4 },
      {},
      { c: 6 },
      { c: 7, d: 7 },
    ];
    const results = tidy(data, fill<typeof data[number]>('a'));

    expect(results).toEqual([
      { a: 1, b: null, c: undefined, d: 1 },
      { a: 1, b: 2, c: undefined },
      { a: 1, c: 3, d: 3 },
      { a: 4, b: 4, c: 4, d: 4 },
      { a: 4 },
      { a: 4, c: 6 },
      { a: 4, c: 7, d: 7 },
    ]);

    const results2 = tidy(data, fill('a'));
    expect(results).toEqual(results2);

    expect(tidy(data, fill(['a', 'b', 'c', 'd']))).toEqual([
      { a: 1, b: null, c: undefined, d: 1 },
      { a: 1, b: 2, c: undefined, d: 1 },
      { a: 1, b: 2, c: 3, d: 3 },
      { a: 4, b: 4, c: 4, d: 4 },
      { a: 4, b: 4, c: 4, d: 4 },
      { a: 4, b: 4, c: 6, d: 4 },
      { a: 4, b: 4, c: 7, d: 7 },
    ]);
  });

  it('works with complete', () => {
    const data: { str?: string; val: number; timestamp: string }[] = [
      { str: undefined, val: 3, timestamp: '2020-03-30T00:00:00.000Z' },
      { str: 'foo', val: 1, timestamp: '2020-04-01T00:00:00.000Z' },
      { str: 'bar', val: 5, timestamp: '2020-04-03T00:00:00.000Z' },
      { str: 'baz', val: 9, timestamp: '2020-04-05T00:00:00.000Z' },
    ];

    const results = tidy(
      data,
      complete<typeof data[0]>(
        { timestamp: fullSeqDateISOString('timestamp', 'day') },
        { val: 0 }
      ),
      fill('str')
    );
    expect(results).toEqual([
      { str: undefined, val: 3, timestamp: '2020-03-30T00:00:00.000Z' },
      { str: undefined, val: 0, timestamp: '2020-03-31T00:00:00.000Z' },
      { str: 'foo', val: 1, timestamp: '2020-04-01T00:00:00.000Z' },
      { str: 'foo', val: 0, timestamp: '2020-04-02T00:00:00.000Z' },
      { str: 'bar', val: 5, timestamp: '2020-04-03T00:00:00.000Z' },
      { str: 'bar', val: 0, timestamp: '2020-04-04T00:00:00.000Z' },
      { str: 'baz', val: 9, timestamp: '2020-04-05T00:00:00.000Z' },
    ]);
  });
});
