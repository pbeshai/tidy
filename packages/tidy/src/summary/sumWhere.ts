import { sum } from './sum';

/**
 * Returns a function that computes the sum over an array of items
 * @param key A string key of the object or an accessor converting the object to a number
 */
export function sumWhere<T extends object>(
  predicateFn: (d: T, index: number, array: Iterable<T>) => boolean,
  key: keyof T | ((d: T, index: number, array: Iterable<T>) => number)
) {
  const keyFn =
    typeof key === 'function' ? key : (d: T) => (d[key] as unknown) as number;

  const conditionedKeyFn = (d: T, index: number, array: Iterable<T>) =>
    predicateFn(d, index, array) ? keyFn(d, index, array) : 0;

  return sum(conditionedKeyFn);
}
