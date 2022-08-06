type LagOptions = {
  /** Number of positions to lag by (default: 1) */
  n?: number;
  /** The default value for non-existent rows. */
  default?: any;
};

/**
 * Returns a function that lags a vector by a specified offset (n). Useful for
 * finding previous values to compute deltas with later.
 * @param key The key or accessor to lag
 * @param options Options to configure roll. e.g. whether to run on partial windows.
 */
export function lag<T extends object>(
  key: keyof T | ((d: T, index: number, array: Iterable<T>) => any),
  options?: LagOptions | undefined | null
) {
  const keyFn = typeof key === 'function' ? key : (d: T) => d[key];

  const { n = 1, default: defaultValue } = options ?? {};

  return (items: T[]) => {
    return items.map((_, i) => {
      const lagItem = items[i - n];
      return lagItem == null ? defaultValue : keyFn(lagItem, i, items);
    });
  };
}
