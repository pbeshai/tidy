import { rate as mathRate } from '../math/math';

type RateOptions<T> = {
  predicate?: (d: T) => boolean;
  allowDivideByZero?: boolean;
};

/**
 * Returns a function that computes a rate (numerator / denominator), setting the value to
 * 0 if denominator = 0 and numerator = 0.
 */
export function rate<T extends object>(
  numerator: keyof T | ((d: T) => number),
  denominator: keyof T | ((d: T) => number),
  options?: RateOptions<T>
) {
  const numeratorFn =
    typeof numerator === 'function'
      ? numerator
      : (d: T) => (d[numerator] as unknown) as number;
  const denominatorFn =
    typeof denominator === 'function'
      ? denominator
      : (d: T) => (d[denominator] as unknown) as number;

  const { predicate, allowDivideByZero } = options ?? {};
  return predicate == null
    ? (d: T) => {
        const denom = denominatorFn(d);
        const numer = numeratorFn(d);
        return mathRate(numer, denom, allowDivideByZero);
      }
    : (d: T) => {
        if (!predicate(d)) return undefined;

        const denom = denominatorFn(d);
        const numer = numeratorFn(d);
        return mathRate(numer, denom, allowDivideByZero);
      };
}
