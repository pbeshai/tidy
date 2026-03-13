import { SingleOrArray } from './helpers/singleOrArray';
import { Key, TidyFn } from './types';
import { Prettify } from './type-utils';

// helper types
export type KeyMap<T extends object = any> = Partial<
  {
    [key in keyof T]: keyof T | Array<T[key]> | ((items: T[]) => T[key][]);
  }
>;

/**
 * Expands a set of items to include all combinations of the specified keys.
 */
// prettier-ignore
export function expand<T extends object = any, K extends keyof T = keyof T>(expandKeys: K): TidyFn<T, Prettify<Pick<T, K>>>;
// prettier-ignore
export function expand<T extends object = any, K extends (keyof T)[] = (keyof T)[]>(expandKeys: K): TidyFn<T, Prettify<Pick<T, K[number]>>>;
// prettier-ignore
export function expand<T extends object = any, K extends KeyMap<T> = KeyMap<T>>(expandKeys: K): TidyFn<T, Pick<T, Extract<keyof K, keyof T>>>
// prettier-ignore
export function expand<T extends object>(expandKeys: SingleOrArray<Key> | KeyMap<T>): TidyFn<T> {
  const _expand: TidyFn<T> = (items: T[]) => {
    const keyMap = makeKeyMap(expandKeys);

    // for each key, get all distinct values or use the provided values
    const vectors = [];
    for (const key in keyMap) {
      const keyValue = keyMap[key];
      let values;
      if (typeof keyValue === 'function') {
        values = keyValue(items);
      } else if (Array.isArray(keyValue)) {
        values = keyValue;
      } else {
        // read distinct values from the key in the data
        values = Array.from(new Set(items.map((d) => d[key as keyof T])));
      }

      vectors.push(values.map((value: any) => ({ [key]: value })));
    }

    // make all combinations of all value sets
    return makeCombinations(vectors);
  };

  return _expand;
}

/*
  Recursively compute key combinations
*/
const EXPAND_WARN_THRESHOLD = 100_000;

/*
  Iteratively compute key combinations (avoids recursive array slicing)
*/
function makeCombinations(vectors: any[][]): any[] {
  if (!vectors.length) return [];

  // warn if Cartesian product will be very large
  const totalSize = vectors.reduce((acc, v) => acc * v.length, 1);
  if (totalSize > EXPAND_WARN_THRESHOLD) {
    console.warn(
      `tidy expand: generating ${totalSize.toLocaleString()} combinations. ` +
        `This may be slow or use excessive memory.`
    );
  }

  let result: any[] = [null];
  for (const vector of vectors) {
    const next: any[] = [];
    for (const baseObj of result) {
      for (const item of vector) {
        next.push(baseObj == null ? item : { ...baseObj, ...item });
      }
    }
    result = next;
  }
  return result;
}

// convert by option in to a map from T key to JoinT key
export function makeKeyMap(keys: SingleOrArray<Key> | KeyMap): KeyMap {
  if (Array.isArray(keys)) {
    const keyMap: KeyMap = {};
    for (const key of keys) {
      keyMap[key as any] = key;
    }
    return keyMap;
  } else if (typeof keys === 'object') {
    return keys;
  }

  return { [keys]: keys as any } as KeyMap;
}
