type RowNumberOptions = {
  /** what to start row numbers at, default is 0 */
  startAt?: number;
};

/**
 * Returns a vector of row numbers, starting at 0
 */
export function rowNumber<T>(options?: RowNumberOptions) {
  const startAt = options?.startAt ?? 0;
  return (items: T[]) => {
    return items.map((_, i) => i + startAt);
  };
}
