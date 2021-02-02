import { tidy, replaceNully } from './index';

describe('replaceNully', () => {
  it('replaceNully works', () => {
    const data: {
      value?: number | null;
      foo?: number | null;
      bar?: string;
      x: number;
    }[] = [
      { value: 1, foo: null, bar: '', x: 1 },
      { value: null, foo: undefined, bar: 'xx', x: 2 },
      { value: undefined, foo: 0, x: 3 },
    ];
    const results = tidy(
      data,
      replaceNully({ value: -1, foo: NaN, bar: 'N/A' })
    );

    expect(results).toEqual([
      { value: 1, foo: NaN, bar: '', x: 1 },
      { value: -1, foo: NaN, bar: 'xx', x: 2 },
      { value: -1, foo: 0, bar: 'N/A', x: 3 },
    ]);

    const results2 = tidy(data, replaceNully({ value: -1, bar: 'N/A' }));

    expect(results2).toEqual([
      { value: 1, foo: null, bar: '', x: 1 },
      { value: -1, foo: undefined, bar: 'xx', x: 2 },
      { value: -1, foo: 0, bar: 'N/A', x: 3 },
    ]);
  });
});
