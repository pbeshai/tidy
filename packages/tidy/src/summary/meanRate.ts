import { fsum } from 'd3-array';
import { rate } from '../math/math';

/**
 * Returns a function that computes the mean of a rate over an array of items
 * @param numerator A string key of the object or an accessor converting the object to a number
 * @param denominator A string key of the object or an accessor converting the object to a number
 */
export function meanRate<T extends object>(
  numerator: keyof T | ((d: T, index: number, array: Iterable<T>) => number),
  denominator: keyof T | ((d: T, index: number, array: Iterable<T>) => number)
) {
  const numeratorFn =
    typeof numerator === 'function'
      ? numerator
      : (d: T) => (d[numerator] as unknown) as number;
  const denominatorFn =
    typeof denominator === 'function'
      ? denominator
      : (d: T) => (d[denominator] as unknown) as number;

  return (items: T[]) => {
    const numerator = fsum(items, numeratorFn);
    const denominator = fsum(items, denominatorFn);
    return rate(numerator, denominator);
  };
}
