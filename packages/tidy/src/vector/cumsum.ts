import { fcumsum } from '../helpers/summation';

export function cumsum<T extends object>(
  key: keyof T | ((d: T) => number | null | undefined)
) {
  const keyFn =
    typeof key === 'function' ? key : (d: T) => (d[key] as unknown) as number;

  // note returns Float64Array not a normal array
  return (items: T[]) => fcumsum(items, keyFn);
}
