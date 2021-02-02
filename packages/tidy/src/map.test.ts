import { tidy, map } from './index';

describe('map', () => {
  it('map works', () => {
    const data = [
      { value: 1, nested: { a: 10, b: 100 } },
      { value: 2, nested: { a: 20, b: 200 } },
    ];
    const results = tidy(
      data,
      map((d) => ({ value: d.value, ...d.nested }))
    );
    expect(results).toEqual([
      { value: 1, a: 10, b: 100 },
      { value: 2, a: 20, b: 200 },
    ]);
  });
});
