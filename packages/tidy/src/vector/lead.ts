type LeadOptions = {
  /** Number of positions to lead by (default: 1) */
  n?: number;
  /** The default value for non-existent rows. */
  default?: any;
};

/**
 * Returns a functions that leads a vector by a specified offset (n). Useful for
 * finding next values for computing deltas with.
 * @param key The key or accessor to lead
 * @param options Options to configure roll. e.g. whether to run on partial windows.
 */
export function lead<T extends object>(
  key: keyof T | ((d: T, index: number, array: Iterable<T>) => any),
  options?: LeadOptions | undefined | null
) {
  const keyFn = typeof key === 'function' ? key : (d: T) => d[key];

  const { n = 1, default: defaultValue } = options ?? {};

  return (items: T[]) => {
    return items.map((_, i) => {
      const leadItem = items[i + n];
      return leadItem == null ? defaultValue : keyFn(leadItem, i, items);
    });
  };
}
