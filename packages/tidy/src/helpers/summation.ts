import { fsum, Adder } from 'd3-array';

// See also https://observablehq.com/@fil/fcumsum
export function fcumsum<T>(
  items: T[],
  accessor: (element: T, i: number, array: Iterable<T>) => any
): Float64Array {
  let sum = new Adder(),
    i = 0;

  return Float64Array.from(
    items,
    // we do not actually need to coerce the Adder to number,
    // as @Fil demonstrated here: https://github.com/pbeshai/tidy/pull/5
    // so we can just tell typescript to be quiet.
    (value: T): number =>
      (sum.add(+(accessor(value, i++, items) || 0)) as unknown) as number
  );
}

export function mean<T>(
  items: T[],
  accessor: (element: T, i: number, array: Iterable<T>) => any
): number | undefined {
  let n = 0;
  for (let i = 0; i < items.length; ++i) {
    const value = accessor(items[i], i, items);
    // count it if we have a valid number
    if (+value === value) {
      n += 1;
    }
  }

  return n ? fsum(items, accessor) / n : undefined;
}
