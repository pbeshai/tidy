import { tidy, groupBy, count, arrange, desc } from './index';

describe('count', () => {
  it('count works', () => {
    const data = [
      { a: 1, b: 10, c: 100 },
      { a: 1, b: 10, c: 101 },
      { a: 2, b: 20, c: 200 },
      { a: 3, b: 30, c: 300 },
    ];
    const results = tidy(data, count('a'));
    expect(results).toEqual([
      { a: 1, n: 2 },
      { a: 2, n: 1 },
      { a: 3, n: 1 },
    ]);
  });
  it('count works with wt', () => {
    const data = [
      { a: 1, b: 10, c: 100 },
      { a: 1, b: 10, c: 101 },
      { a: 2, b: null, c: 200 },
      { a: 3, b: 30, c: 300 },
    ];
    const results = tidy(data, count('a', { wt: 'b' }));
    expect(results).toEqual([
      { a: 1, n: 20 },
      { a: 2, n: 0 },
      { a: 3, n: 30 },
    ]);
  });

  it('count grouped works', () => {
    const data = [
      { a: 1, b: 10, c: 100 },
      { a: 1, b: 10, c: 101 },
      { a: 1, b: 20, c: 200 },
      { a: 2, b: 30, c: 300 },
      { a: 2, b: 30, c: 301 },
      { a: 2, b: 30, c: 302 },
    ];
    const results = tidy(data, groupBy('a', [count('b')]));
    expect(results).toEqual([
      { a: 1, b: 10, n: 2 },
      { a: 1, b: 20, n: 1 },
      { a: 2, b: 30, n: 3 },
    ]);
  });
});
