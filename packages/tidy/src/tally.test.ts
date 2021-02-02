import { tidy, groupBy, tally } from './index';

describe('tally', () => {
  it('tally works', () => {
    const data = [
      { a: 1, b: 10, c: 100 },
      { a: 2, b: 20, c: 200 },
      { a: 3, b: 30, c: 300 },
    ];
    const results = tidy(data, tally());
    expect(results).toEqual([{ n: 3 }]);
  });

  it('tally works with name', () => {
    const data = [
      { a: 1, b: 10, c: 100 },
      { a: 2, b: 20, c: 200 },
      { a: 3, b: 30, c: 300 },
    ];
    const results = tidy(data, tally({ name: 'numItems' } as const));
    expect(results).toEqual([{ numItems: 3 }]);

    const results2 = tidy(data, tally({ name: 'numItems' }));
    expect(results2).toEqual([{ numItems: 3 }]);
  });

  it('tally works with wt', () => {
    const data = [
      { a: 1, b: 10, c: 100 },
      { a: 2, b: null, c: 200 },
      { a: 3, b: 30, c: 300 },
    ];
    const results = tidy(data, tally({ wt: 'b' } as const));
    expect(results).toEqual([{ n: 40 }]);
  });

  it('tally grouped works', () => {
    const data = [
      { a: 1, b: 10, c: 100 },
      { a: 1, b: 20, c: 200 },
      { a: 2, b: 30, c: 300 },
    ];
    const results = tidy(data, groupBy('a', [tally()]));
    expect(results).toEqual([
      { a: 1, n: 2 },
      { a: 2, n: 1 },
    ]);
  });
});
