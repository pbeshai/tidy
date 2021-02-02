type RollOptions = {
  partial?: boolean;
};

/**
 * Returns a function that computes the a rolling value (e.g. moving average) by
 * applying a function over a window of data
 * @param width The size of the window
 * @param rollFn The function to apply to the window (should reduce to a single value)
 * @param options Options to configure roll. e.g. whether to run on partial windows.
 */
export function roll<T extends object>(
  width: number,
  rollFn: (itemsInWindow: T[], endIndex: number) => any,
  options?: RollOptions | undefined | null
) {
  const { partial = false } = options ?? {};

  return (items: any[]) => {
    return items.map((_, i) => {
      const endIndex = i;

      // partial window and we don't allow partial computation, return undefined
      if (!partial && endIndex - width + 1 < 0) {
        return undefined;
      }

      const startIndex = Math.max(0, endIndex - width + 1);
      const itemsInWindow = items.slice(startIndex, endIndex + 1);

      // reduce them to a single value
      return rollFn(itemsInWindow, endIndex);
    });
  };
}
