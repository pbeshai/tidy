import { tidy, rename } from './index';

describe('rename', () => {
  it('rename works', () => {
    const data = [
      { a: 1, b: 'b10', c: 100 },
      { a: 2, b: 'b20', c: 200 },
      { a: 3, b: 'b30', c: 300 },
    ];
    const results = tidy(data, rename({ b: 'newB', c: 'newC' }));
    expect(results).toEqual([
      { a: 1, newB: 'b10', newC: 100 },
      { a: 2, newB: 'b20', newC: 200 },
      { a: 3, newB: 'b30', newC: 300 },
    ]);
  });
});
