import { median as d3median } from 'd3-array';

/**
 * Returns a function that computes the median over an array of items
 * @param key A string key of the object or an accessor converting the object to a number
 */
export function median<T extends object>(key: keyof T | ((d: T) => number)) {
  const keyFn =
    typeof key === 'function' ? key : (d: T) => (d[key] as unknown) as number;

  return (items: T[]) => d3median(items, keyFn);
}
