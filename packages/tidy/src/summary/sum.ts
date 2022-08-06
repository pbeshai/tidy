import { fsum } from 'd3-array';

type SumOptions<T> = {
  predicate?: (d: T, index: number, array: Iterable<T>) => boolean;
};

/**
 * Returns a function that computes the sum over an array of items
 * @param key A string key of the object or an accessor converting the object to a number
 */
export function sum<T extends object>(
  key: keyof T | ((d: T, index: number, array: Iterable<T>) => number),
  options?: SumOptions<T>
) {
  let keyFn =
    typeof key === 'function' ? key : (d: T) => (d[key] as unknown) as number;

  if (options?.predicate) {
    const originalKeyFn = keyFn;
    const predicate = options.predicate;
    keyFn = (d: T, index: number, array: Iterable<T>) =>
      predicate(d, index, array) ? originalKeyFn(d, index, array) : 0;
  }

  return (items: T[]) => fsum(items, keyFn);
}
