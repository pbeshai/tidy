import {
  tidy,
  pick,
  select,
  startsWith,
  everything,
  negate,
  endsWith,
  matches,
} from './index';

describe('select', () => {
  it('select works', () => {
    const data = [
      { a: 1, b: 10, c: 100, d: 'foo' },
      { a: 2, b: 20, c: 200, d: 'foo' },
      { a: 3, b: 30, c: 300, d: 'foo' },
    ];
    const results = tidy(data, select(['c', 'a']));
    expect(results).toEqual([
      { a: 1, c: 100 },
      { a: 2, c: 200 },
      { a: 3, c: 300 },
    ]);

    // reorders
    expect(Object.keys(results[0])).toEqual(['c', 'a']);

    // alternative name
    const results2 = tidy(data, pick('b'));
    expect(results2).toEqual([{ b: 10 }, { b: 20 }, { b: 30 }]);
  });

  it('handles no keys being selected', () => {
    const data = [
      { a: 1, b: 10, c: 100, d: 'foo' },
      { a: 2, b: 20, c: 200, d: 'foo' },
      { a: 3, b: 30, c: 300, d: 'foo' },
    ];
    const results = tidy(data, select([]));
    expect(results).toEqual(data);

    const results2 = tidy(data, select([startsWith('p')]));
    expect(results2).toEqual(data);
  });

  it('works with selectors', () => {
    const data = [
      { foo: 1, bar: 20, foobar: 300, FoObAR: 90, a: 'a1', b: 'b1' },
      { foo: 2, bar: 21, foobar: 301, FoObAR: 91, a: 'a2', b: 'b2' },
      { foo: 3, bar: 22, foobar: 302, FoObAR: 92, a: 'a3', b: 'b3' },
      { foo: 4, bar: 23, foobar: 303, FoObAR: 93, a: 'a4', b: 'b4' },
    ];

    const results = tidy(data, select(['a', startsWith('foo')]));
    expect(results).toEqual([
      { a: 'a1', foo: 1, foobar: 300, FoObAR: 90 },
      { a: 'a2', foo: 2, foobar: 301, FoObAR: 91 },
      { a: 'a3', foo: 3, foobar: 302, FoObAR: 92 },
      { a: 'a4', foo: 4, foobar: 303, FoObAR: 93 },
    ]);
  });

  it('works with negation', () => {
    const data = [
      { a: 1, b: 10, c: 100 },
      { a: 2, b: 20, c: 200 },
      { a: 3, b: 30, c: 300 },
    ];
    const results = tidy(data, select(['-b']));
    expect(results).toEqual([
      { a: 1, c: 100 },
      { a: 2, c: 200 },
      { a: 3, c: 300 },
    ]);

    const results2 = tidy(data, select(['c', everything(), '-b']));
    expect(results2).toEqual([
      { a: 1, c: 100 },
      { a: 2, c: 200 },
      { a: 3, c: 300 },
    ]);

    const results3 = tidy(data, select('-b'));

    expect(results3).toEqual([
      { a: 1, c: 100 },
      { a: 2, c: 200 },
      { a: 3, c: 300 },
    ]);

    const results4 = tidy(data, select(['-b', '-c']));
    expect(results4).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }]);
  });

  it('regex faux negation check', () => {
    const data = [
      {
        settle_date: 'd1',
        test_bigint: 123,
        test: 12,
        foo_bigint: 99,
        bar: 13,
      },
    ];

    const results2 = tidy(
      data,
      select([matches(/.*(?<!_bigint)$/), '-settle_date'])
    );
    expect(results2).toEqual([{ test: 12, bar: 13 }]);
  });

  it('select negate test', () => {
    const data = [
      {
        settle_date: 'd1',
        test_bigint: 123,
        test: 12,
        foo_bigint: 99,
        bar: 13,
      },
    ];

    const results2 = tidy(
      data,
      select([negate(endsWith('_bigint')), '-settle_date'])
    );
    expect(results2).toEqual([{ test: 12, bar: 13 }]);
  });
});
