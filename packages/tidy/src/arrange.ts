import { ascending, descending } from 'd3-array';
import { SingleOrArray, singleOrArray } from './helpers/singleOrArray';
import { Comparator, Key, KeyOrFn, Primitive, TidyFn } from './types';

/**
 * Sorts items
 * @param comparators Given a, b return -1 if a comes before b, 0 if equal, 1 if after
 */
export function arrange<T extends object>(
  comparators: SingleOrArray<Key | Comparator<T>>
): TidyFn<T> {
  const _arrange: TidyFn<T> = (items: T[]): T[] => {
    // expand strings `key` to `asc(key)`
    const comparatorFns = singleOrArray(comparators).map((comp) =>
      typeof comp === 'function' ? comp : asc<T>(comp)
    );

    return items.slice().sort((a, b) => {
      for (const comparator of comparatorFns) {
        const result = comparator(a, b);
        if (result !== 0) return result;
      }

      return 0;
    });
  };

  return _arrange;
}

/**
 * Creates an ascending comparator based on a key
 * @param key property key of T
 */
export function asc<T>(key: Key): Comparator<T> {
  return function _asc(a: T, b: T) {
    return ascending(
      (a[key as keyof T] as unknown) as Primitive,
      (b[key as keyof T] as unknown) as Primitive
    );
  };
}

/**
 * Creates a descending comparator based on a key
 * @param key property key of T
 */
export function desc<T>(key: Key): Comparator<T> {
  return function _desc(a: T, b: T) {
    return descending(
      (a[key as keyof T] as unknown) as Primitive,
      (b[key as keyof T] as unknown) as Primitive
    );
  };
}

/**
 * Creates a comparator that sorts values based on a key
 * and a supplied array of the desired order for the values.
 * Items not found in the array will be sorted last.
 * @param order array of desired sort order
 */
export function fixedOrder<T>(
  key: KeyOrFn<T>,
  order: Array<T[keyof T]>,
  options?: { position?: 'start' | 'end' }
): (a: T, b: T) => number {
  let { position = 'start' } = options ?? {};
  const positionFactor = position === 'end' ? -1 : 1;

  const indexMap = new Map();
  for (let i = 0; i < order.length; ++i) {
    indexMap.set(order[i], i);
  }

  const keyFn =
    typeof key === 'function'
      ? key
      : (d: T) => (d[key as keyof T] as unknown) as any;

  return function _fixedOrder(a: T, b: T) {
    const aIndex: number = indexMap.get(keyFn(a)) ?? -1;
    const bIndex: number = indexMap.get(keyFn(b)) ?? -1;

    if (aIndex >= 0 && bIndex >= 0) {
      return aIndex - bIndex;
    }

    if (aIndex >= 0) {
      return positionFactor * -1;
    }

    if (bIndex >= 0) {
      return positionFactor * 1;
    }

    return 0;
  };
}
