import 'd3-array';
import { Numeric } from 'd3-array';

declare module 'd3-array' {
  type Grouped<T> = Map<any, T[] | Grouped<T>>;

  /**
   * Groups the specified array of values into a Map from key to array of value.
   * @param a The array to group.
   * @param key The key function.
   */
  export function group<TObject>(
    a: Iterable<TObject>,
    ...keyFns: ((value: TObject) => any)[]
  ): Grouped<TObject>;

  export function cumsum<T>(
    array: Iterable<T>,
    accessor: (
      datum: T,
      index: number,
      array: Iterable<T>
    ) => string | undefined | null
  ): Float64Array;

  export function cumsum<T, U extends Numeric>(
    array: Iterable<T>,
    accessor: (
      datum: T,
      index: number,
      array: Iterable<T>
    ) => U | undefined | null
  ): Float64Array;
}
