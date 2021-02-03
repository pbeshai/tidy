import { fsum, Adder } from 'd3-array';

// See also https://observablehq.com/@fil/fcumsum
export function fcumsum<T>(
  items: T[],
  accessor: (element: T, i: number, array: Iterable<T>) => any
): Float64Array {
  let sum = new Adder(),
    i = 0;

  return Float64Array.from(items, (value) =>
    sum.add(+accessor(value, i++, items) || 0)
  );
}

export function mean<T>(
  items: T[],
  accessor: (element: T, i: number, array: Iterable<T>) => any
): number | undefined {
  const n = items.filter((datum, i) => {
    const value = accessor(datum, i, items);
    return +value === value;
  }).length;

  return n ? fsum(items, accessor) / n : undefined;
}
