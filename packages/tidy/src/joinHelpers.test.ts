import { computeKey, buildJoinIndex } from './innerJoin';

describe('computeKey', () => {
  it('works with a single key', () => {
    expect(computeKey({ a: 1 }, ['a'])).toBe('1');
    expect(computeKey({ a: 'hello' }, ['a'])).toBe('hello');
  });

  it('works with multiple keys', () => {
    const row = { a: 1, b: 'x', c: true };
    const key = computeKey(row, ['a', 'b', 'c']);
    expect(key).toBe('1\x00x\x00true');
  });

  it('distinguishes null from the string "null"', () => {
    const keyNull = computeKey({ a: null }, ['a']);
    const keyString = computeKey({ a: 'null' }, ['a']);
    expect(keyNull).not.toBe(keyString);
  });

  it('distinguishes undefined from the string "undefined"', () => {
    const keyUndef = computeKey({ a: undefined }, ['a']);
    const keyString = computeKey({ a: 'undefined' }, ['a']);
    expect(keyUndef).not.toBe(keyString);
  });

  it('distinguishes null from undefined', () => {
    const keyNull = computeKey({ a: null }, ['a']);
    const keyUndef = computeKey({ a: undefined }, ['a']);
    expect(keyNull).not.toBe(keyUndef);
  });

  it('avoids composite key collisions from value boundaries', () => {
    // "ab" + "c" vs "a" + "bc" should produce different keys
    const key1 = computeKey({ x: 'ab', y: 'c' }, ['x', 'y']);
    const key2 = computeKey({ x: 'a', y: 'bc' }, ['x', 'y']);
    expect(key1).not.toBe(key2);
  });
});

describe('buildJoinIndex', () => {
  it('builds an index from join items', () => {
    const items = [
      { id: 1, val: 'a' },
      { id: 2, val: 'b' },
      { id: 3, val: 'c' },
    ];
    const index = buildJoinIndex(items, ['id']);
    expect(index.get('1')).toEqual([{ id: 1, val: 'a' }]);
    expect(index.get('2')).toEqual([{ id: 2, val: 'b' }]);
    expect(index.get('3')).toEqual([{ id: 3, val: 'c' }]);
    expect(index.get('4')).toBeUndefined();
  });

  it('groups duplicate keys into the same bucket', () => {
    const items = [
      { id: 1, val: 'a' },
      { id: 1, val: 'b' },
      { id: 2, val: 'c' },
    ];
    const index = buildJoinIndex(items, ['id']);
    expect(index.get('1')).toEqual([
      { id: 1, val: 'a' },
      { id: 1, val: 'b' },
    ]);
    expect(index.get('2')).toEqual([{ id: 2, val: 'c' }]);
  });

  it('works with composite keys', () => {
    const items = [
      { a: 1, b: 'x', val: 10 },
      { a: 1, b: 'y', val: 20 },
      { a: 2, b: 'x', val: 30 },
    ];
    const index = buildJoinIndex(items, ['a', 'b']);
    expect(index.get('1\x00x')).toEqual([{ a: 1, b: 'x', val: 10 }]);
    expect(index.get('1\x00y')).toEqual([{ a: 1, b: 'y', val: 20 }]);
    expect(index.get('2\x00x')).toEqual([{ a: 2, b: 'x', val: 30 }]);
  });

  it('returns an empty map for empty input', () => {
    const index = buildJoinIndex([], ['id']);
    expect(index.size).toBe(0);
  });
});
