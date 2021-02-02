import { KeyOrFn, TidyFn } from './types';
import { SingleOrArray, singleOrArray } from './helpers/singleOrArray';

/**
 * Removes items with duplicate values for the specified keys.
 * If no keys provided, uses strict equality.
 *
 * @param keys Keys to compute distinct across
 */
export function distinct<T extends object>(
  keys?: SingleOrArray<KeyOrFn<T>> | null | undefined
): TidyFn<T> {
  const _distinct: TidyFn<T> = (items: T[]): T[] => {
    keys = singleOrArray(keys);

    if (!keys.length) {
      // https://jsperf.com/unique-array-by-strict-equality
      const set = new Set<T>();
      for (const item of items) {
        set.add(item);
      }
      return Array.from(set);
    }

    // compare keys
    // https://jsperf.com/distinct-by-key
    // turns out nested Maps are faster than string keys. AND they support
    // and arbitrary value.
    const rootMap = new Map();
    const distinctItems: T[] = [];
    const lastKey = keys[keys.length - 1];
    for (const item of items) {
      let map = rootMap;
      let hasItem = false;

      // go through each key to find out if we have it
      for (const key of keys) {
        const mapItemKey =
          typeof key === 'function' ? key(item) : item[key as keyof T];
        // last key, check if we already added it
        if (key === lastKey) {
          hasItem = map.has(mapItemKey);
          if (!hasItem) {
            distinctItems.push(item);
            map.set(mapItemKey, true);
          }
          break;
        }

        // create maps all the way down
        if (!map.has(mapItemKey)) {
          map.set(mapItemKey, new Map());
        }

        // move to next inner map
        map = map.get(mapItemKey);
      }
    }

    return distinctItems;
  };

  return _distinct;
}
