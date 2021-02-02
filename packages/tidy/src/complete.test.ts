import { tidy, complete, fullSeqDateISOString } from './index';

describe('complete', () => {
  it('complete works', () => {
    const data = [
      { a: 1, b: 'b1', c: 100 },
      { a: 2, b: 'b1', c: 200 },
      { a: 3, b: 'b1', c: 300 },
      { a: 1, b: 'b2', c: 101 },
      { a: 2, b: 'b2', c: 201 },
    ];

    const results = tidy(
      data,
      complete<typeof data[0]>('a', { b: 'n/a' })
    );

    expect(results).toEqual([
      { a: 1, b: 'b1', c: 100 },
      { a: 1, b: 'b2', c: 101 },
      { a: 2, b: 'b1', c: 200 },
      { a: 2, b: 'b2', c: 201 },
      { a: 3, b: 'b1', c: 300 },
    ]);

    expect(
      tidy(
        data,
        complete<typeof data[0]>(['a', 'b'])
      )
    ).toEqual([
      { a: 1, b: 'b1', c: 100 },
      { a: 1, b: 'b2', c: 101 },
      { a: 2, b: 'b1', c: 200 },
      { a: 2, b: 'b2', c: 201 },
      { a: 3, b: 'b1', c: 300 },
      { a: 3, b: 'b2', c: undefined },
    ]);

    expect(
      tidy(
        data,
        complete<typeof data[0]>(['a', 'b'], { c: -1 })
      )
    ).toEqual([
      { a: 1, b: 'b1', c: 100 },
      { a: 1, b: 'b2', c: 101 },
      { a: 2, b: 'b1', c: 200 },
      { a: 2, b: 'b2', c: 201 },
      { a: 3, b: 'b1', c: 300 },
      { a: 3, b: 'b2', c: -1 },
    ]);
  });

  it('works with sequences', () => {
    const data = [
      { str: 'foo', val: 1, timestamp: '2020-04-01T00:00:00.000Z' },
      { str: 'foo', val: 9, timestamp: '2020-04-05T00:00:00.000Z' },
    ];

    const results = tidy(
      data,
      complete<typeof data[0]>(
        { timestamp: fullSeqDateISOString('timestamp', 'day') },
        { val: 0, str: 'n/a' }
      )
    );
    expect(results).toEqual([
      { str: 'foo', val: 1, timestamp: '2020-04-01T00:00:00.000Z' },
      { str: 'n/a', val: 0, timestamp: '2020-04-02T00:00:00.000Z' },
      { str: 'n/a', val: 0, timestamp: '2020-04-03T00:00:00.000Z' },
      { str: 'n/a', val: 0, timestamp: '2020-04-04T00:00:00.000Z' },
      { str: 'foo', val: 9, timestamp: '2020-04-05T00:00:00.000Z' },
    ]);
  });
});
