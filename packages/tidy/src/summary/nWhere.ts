/**
 * Returns a function that computes the count over an array of items
 */
export function nWhere<T>(
  predicateFn: (d: T, index: number, array: Iterable<T>) => boolean
) {
  return (items: T[]) =>
    items.reduce((n, d, i) => (predicateFn(d, i, items) ? n + 1 : n), 0);
}
