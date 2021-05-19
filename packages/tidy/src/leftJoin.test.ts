import { tidy, leftJoin, select, everything } from './index';

describe('leftJoin', () => {
  it('leftJoin works', () => {
    const data = [
      { a: 1, b: 10, c: 100 },
      { a: 2, b: 20, c: 200 },
    ];

    const data2 = [{ a: 1, x: 'x1', y: 'y1' }];
    const results = tidy(
      data,
      leftJoin<typeof data[0], typeof data2[0]>(data2, { by: 'a' })
    );
    expect(results).toEqual([
      { a: 1, b: 10, c: 100, x: 'x1', y: 'y1' },
      { a: 2, b: 20, c: 200 },
    ]);

    const results4 = tidy(data, leftJoin(data2, { by: ['a'] }));
    expect(results4).toEqual([
      { a: 1, b: 10, c: 100, x: 'x1', y: 'y1' },
      { a: 2, b: 20, c: 200 },
    ]);

    const results2 = tidy(
      data,
      leftJoin<typeof data[0], typeof data2[0]>(data2, { by: 'a' })
    );
    expect(results2).toEqual([
      { a: 1, b: 10, c: 100, x: 'x1', y: 'y1' },
      { a: 2, b: 20, c: 200 },
    ]);

    const results3 = tidy(data, leftJoin(data2, { by: { a: 'a' } }));
    expect(results3).toEqual([
      { a: 1, b: 10, c: 100, x: 'x1', y: 'y1' },
      { a: 2, b: 20, c: 200 },
    ]);
  });

  // note we need this so our lazy functions that just look at first item find all the keys
  it('puts in explicit undefined for columns when there is no joined item', () => {
    const results = tidy(
      [
        { a: 123, b: 345 },
        { a: 452, b: 999 },
      ],
      leftJoin([{ a: 452, c: 456 }], { by: 'a' })
    );

    expect(Object.keys(results[0])).toEqual(['a', 'b', 'c']);
    expect(Object.keys(results[1])).toEqual(['a', 'b', 'c']);
  });

  it('does not lose columns with select', () => {
    const results = tidy(
      [
        { a: 123, b: 345 },
        { a: 452, b: 999 },
      ],
      leftJoin([{ a: 452, c: 456 }], { by: 'a' }),
      select([everything()])
    );

    expect(results).toEqual([
      { a: 123, b: 345, c: undefined },
      { a: 452, b: 999, c: 456 },
    ]);
  });

  it('leftJoin works with multiple by keys', () => {
    const data = [
      { a: 1, J: 'j', b: 10, c: 100 },
      { a: 1, J: 'k', b: 60, c: 600 },
      { a: 1, J: 'J', b: 30, c: 300 },
      { a: 2, J: 'j', b: 20, c: 200 },
      { a: 3, J: 'x', b: 50, c: 500 },
    ];

    const data2 = [
      { a: 1, J: 'j', altJ: 'j', x: 'x1', y: 'y1' },
      { a: 1, J: 'J', altJ: 'J', x: 'x9', y: 'y9' },
      { a: 2, J: 'j', altJ: 'j', x: 'x2', y: 'y2' },
    ];
    const results = tidy(
      data,
      leftJoin<typeof data[0], typeof data2[0]>(data2, { by: ['a', 'J'] })
    );
    expect(results).toEqual([
      { a: 1, J: 'j', altJ: 'j', b: 10, c: 100, x: 'x1', y: 'y1' },
      { a: 1, J: 'k', b: 60, c: 600 },
      { a: 1, J: 'J', altJ: 'J', b: 30, c: 300, x: 'x9', y: 'y9' },
      { a: 2, J: 'j', altJ: 'j', b: 20, c: 200, x: 'x2', y: 'y2' },
      { a: 3, J: 'x', b: 50, c: 500 },
    ]);

    expect(tidy(data, leftJoin(data2, { by: { a: 'a', altJ: 'J' } }))).toEqual([
      { a: 1, J: 'j', altJ: 'j', b: 10, c: 100, x: 'x1', y: 'y1' },
      { a: 1, J: 'k', b: 60, c: 600 },
      { a: 1, J: 'J', altJ: 'J', b: 30, c: 300, x: 'x9', y: 'y9' },
      { a: 2, J: 'j', altJ: 'j', b: 20, c: 200, x: 'x2', y: 'y2' },
      { a: 3, J: 'x', b: 50, c: 500 },
    ]);
  });

  it('leftJoin works with auto-detected keys', () => {
    const data = [
      { a: 1, J: 'j', b: 10, c: 100 },
      { a: 1, J: 'k', b: 60, c: 600 },
      { a: 1, J: 'J', b: 30, c: 300 },
      { a: 2, J: 'j', b: 20, c: 200 },
      { a: 3, J: 'x', b: 50, c: 500 },
    ];

    const data2 = [
      { a: 1, J: 'j', altJ: 'j', x: 'x1', y: 'y1' },
      { a: 1, J: 'J', altJ: 'J', x: 'x9', y: 'y9' },
      { a: 2, J: 'j', altJ: 'j', x: 'x2', y: 'y2' },
    ];
    const results = tidy(
      data,
      leftJoin<typeof data[0], typeof data2[0]>(data2)
    );
    expect(results).toEqual([
      { a: 1, J: 'j', altJ: 'j', b: 10, c: 100, x: 'x1', y: 'y1' },
      { a: 1, J: 'k', b: 60, c: 600 },
      { a: 1, J: 'J', altJ: 'J', b: 30, c: 300, x: 'x9', y: 'y9' },
      { a: 2, J: 'j', altJ: 'j', b: 20, c: 200, x: 'x2', y: 'y2' },
      { a: 3, J: 'x', b: 50, c: 500 },
    ]);
  });

  it('leftJoin works with multiple matching rows', () => {
    const data = [{ a: 1, b: 10, c: 100 }];

    const data2 = [
      { a: 1, x: 'x1', y: 'y1' },
      { a: 1, x: 'x11', y: 'y11' },
      { a: 2, x: 'x2', y: 'y2' },
    ];
    const results = tidy(
      data,
      leftJoin<typeof data[0], typeof data2[0]>(data2, { by: 'a' })
    );
    expect(results).toEqual([
      { a: 1, b: 10, c: 100, x: 'x1', y: 'y1' },
      { a: 1, b: 10, c: 100, x: 'x11', y: 'y11' },
    ]);
  });
});
