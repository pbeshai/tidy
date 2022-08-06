import { variance as d3variance } from 'd3-array';

/**
 * Returns a function that computes the variance over an array of items
 * @param key A string key of the object or an accessor converting the object to a number
 */
export function variance<T extends object>(
  key: keyof T | ((d: T, index: number, array: Iterable<T>) => number)
) {
  const keyFn =
    typeof key === 'function' ? key : (d: T) => (d[key] as unknown) as number;

  return (items: T[]) => d3variance(items, keyFn);
}
