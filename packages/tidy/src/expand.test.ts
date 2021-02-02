import { tidy, expand, fullSeq } from './index';

describe('expand', () => {
  it('expand works', () => {
    const data = [
      { a: 1, b: 'b1', c: 100 },
      { a: 2, b: 'b1', c: 200 },
      { a: 4, b: 'b1', c: 300 },
      { a: 1, b: 'b2', c: 101 },
      { a: 2, b: 'b2', c: 201 },
    ];

    const results = tidy(data, expand('a'));
    expect(results).toEqual([{ a: 1 }, { a: 2 }, { a: 4 }]);

    const results2 = tidy(data, expand(['a', 'b']));
    expect(results2).toEqual([
      { a: 1, b: 'b1' },
      { a: 1, b: 'b2' },
      { a: 2, b: 'b1' },
      { a: 2, b: 'b2' },
      { a: 4, b: 'b1' },
      { a: 4, b: 'b2' },
    ]);
  });

  it('expand works with mapping', () => {
    const data = [
      { a: 1, b: 'b1', c: 100 },
      { a: 2, b: 'b1', c: 200 },
      { a: 4, b: 'b1', c: 300 },
      { a: 1, b: 'b2', c: 101 },
      { a: 2, b: 'b2', c: 201 },
    ];

    const results = tidy(data, expand({ a: [1, 2, 3, 4, 5] }));
    expect(results).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }]);

    const results2 = tidy(data, expand({ a: [1, 2, 3, 4, 5], b: 'b' }));
    expect(results2).toEqual([
      { a: 1, b: 'b1' },
      { a: 1, b: 'b2' },
      { a: 2, b: 'b1' },
      { a: 2, b: 'b2' },
      { a: 3, b: 'b1' },
      { a: 3, b: 'b2' },
      { a: 4, b: 'b1' },
      { a: 4, b: 'b2' },
      { a: 5, b: 'b1' },
      { a: 5, b: 'b2' },
    ]);
  });

  it('expand works with mapping functions', () => {
    const data = [
      { a: 1, b: 'b1', c: 100 },
      { a: 2, b: 'b1', c: 200 },
      { a: 5, b: 'b1', c: 300 },
      { a: 1, b: 'b2', c: 101 },
      { a: 2, b: 'b2', c: 201 },
    ];

    const results = tidy(data, expand({ a: fullSeq('a') }));
    expect(results).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }]);
  });
});
