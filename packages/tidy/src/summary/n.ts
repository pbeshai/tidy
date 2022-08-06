type NOptions<T> = {
  predicate?: (d: T, index: number, array: Iterable<T>) => boolean;
};

/**
 * Returns a function that computes the count over an array of items
 */
export function n<T>(options?: NOptions<T>) {
  if (options?.predicate) {
    const predicate = options.predicate;
    return (items: T[]) =>
      items.reduce((n, d, i) => (predicate(d, i, items) ? n + 1 : n), 0);
  }

  return (items: T[]) => items.length;
}
