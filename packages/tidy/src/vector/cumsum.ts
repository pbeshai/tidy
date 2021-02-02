import { cumsum as d3cumsum } from 'd3-array';

export function cumsum<T extends object>(
  key: keyof T | ((d: T) => number | null | undefined)
) {
  const keyFn =
    typeof key === 'function' ? key : (d: T) => (d[key] as unknown) as number;

  // note d3cumsum returns Float64Array not a normal array
  return (items: T[]) => d3cumsum(items, keyFn);
}
