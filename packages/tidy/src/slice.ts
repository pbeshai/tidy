import { shuffle } from 'd3-array';
import { arrange, desc } from './arrange';
import { SingleOrArray } from './helpers/singleOrArray';
import { Comparator, Key, TidyFn } from './types';

/**
 * Truncates the array to the specified range
 */
export function slice<T extends object>(
  start: number,
  end?: number
): TidyFn<T> {
  const _slice: TidyFn<T> = (items: T[]): T[] => items.slice(start, end);

  return _slice;
}

// -------------------------------------------------------------------
/**
 * Truncates the array to the first N items
 */
export const sliceHead = <T extends object>(n: number) => slice<T>(0, n);

// -------------------------------------------------------------------
/**
 * Truncates the array to the last N items
 */
export const sliceTail = <T extends object>(n: number) => slice<T>(-n);

// -------------------------------------------------------------------

/**
 * Truncates the array to the first N items ordered by some key
 */
export function sliceMin<T extends object>(
  n: number,
  orderBy: SingleOrArray<Key | Comparator<T>>
): TidyFn<T> {
  const _sliceMin: TidyFn<T> = (items: T[]): T[] =>
    arrange<T>(orderBy)(items).slice(0, n);

  return _sliceMin;
}

// -------------------------------------------------------------------

/**
 * Truncates the array to the last N items ordered by some key
 */
export function sliceMax<T extends object>(
  n: number,
  orderBy: SingleOrArray<Key | Comparator<T>>
): TidyFn<T> {
  // note: we use desc() so we get proper handling of nullish values
  // unless they provided an explicit comparator.
  const _sliceMax: TidyFn<T> = (items: T[]): T[] =>
    typeof orderBy === 'function'
      ? arrange<T>(orderBy)(items).slice(-n).reverse()
      : arrange<T>(desc(orderBy as any))(items).slice(0, n);

  return _sliceMax;
}

// -------------------------------------------------------------------

type SampleOptions = {
  replace?: boolean;
};
/**
 * Truncates the array to the last N items ordered by some key
 */
export function sliceSample<T extends object>(
  n: number,
  options?: SampleOptions | null | undefined
): TidyFn<T> {
  options = options ?? {};
  const { replace } = options;

  const _sliceSample: TidyFn<T> = (items: T[]) => {
    if (!items.length) return items.slice();

    // sample items with replacement
    if (replace) {
      const sliced = [];
      for (let i = 0; i < n; ++i) {
        sliced.push(items[Math.floor(Math.random() * items.length)]);
      }
      return sliced;
    }

    // sample items without replacement
    return shuffle(items.slice()).slice(0, n);
  };

  return _sliceSample;
}
