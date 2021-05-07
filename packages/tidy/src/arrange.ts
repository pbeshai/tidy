import { ascending } from 'd3-array';
import { SingleOrArray, singleOrArray } from './helpers/singleOrArray';
import { Comparator, Key, KeyOrFn, TidyFn } from './types';

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
        if (result) return result;
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
export function asc<T>(key: Key | ((d: T) => any)): Comparator<T> {
  const keyFn = typeof key === 'function' ? key : (d: any) => d[key];

  return function _asc(a: T, b: T) {
    return emptyAwareComparator(keyFn(a), keyFn(b), false);
  };
}

/**
 * Creates a descending comparator based on a key
 * @param key property key of T
 */
export function desc<T>(key: Key | ((d: T) => any)): Comparator<T> {
  const keyFn = typeof key === 'function' ? key : (d: any) => d[key];
  return function _desc(a: T, b: T) {
    return emptyAwareComparator(keyFn(a), keyFn(b), true);
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

function emptyAwareComparator(aInput: any, bInput: any, desc: boolean) {
  // we swap order to get descending behavior
  let a = desc ? bInput : aInput;
  let b = desc ? aInput : bInput;

  // NaN, null, undefined is the order for emptys
  if (isEmpty(a) && isEmpty(b)) {
    const rankA = a !== a ? 0 : a === null ? 1 : 2;
    const rankB = b !== b ? 0 : b === null ? 1 : 2;
    const order = rankA - rankB;
    return desc ? -order : order;
  }

  // keep empty values at the bottom
  if (isEmpty(a)) {
    return desc ? -1 : 1;
  }
  if (isEmpty(b)) {
    return desc ? 1 : -1;
  }

  // descending is handled by swapping the a and b args at the start
  return ascending(a, b);
}

function isEmpty(value: any) {
  return value == null || value !== value /* NaN check */;
}
