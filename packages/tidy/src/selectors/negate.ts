import { SingleOrArray, singleOrArray } from '../helpers/singleOrArray';

/**
 * Given a set of selectors, inverts their output to be drop keys. e.g.,
 * `key` becomes `-key`.
 */
export function negate<T extends object>(
  selectors: SingleOrArray<keyof T | ((items: T[]) => (keyof T)[])>
) {
  return (items: T[]) => {
    let keySet = new Set<keyof T>();
    for (const selector of singleOrArray(selectors as any)) {
      if (typeof selector === 'function') {
        const keys = selector(items) as (keyof T)[];
        for (const key of keys) {
          keySet.add(key);
        }
      } else {
        keySet.add(selector);
      }
    }
    const keys = Array.from(keySet).map((key) => `-${key}`);
    return keys as (keyof T)[];
  };
}
