/**
 * Returns a function that computes the distinct count for a key
 * over an array of items. By default it counts nulls but not undefined
 */
export function nDistinct<T extends object>(
  key: keyof T | ((d: T, index: number, array: Iterable<T>) => any),
  options: { includeNull?: boolean; includeUndefined?: boolean } = {}
) {
  const keyFn = typeof key === 'function' ? key : (d: T) => d[key];

  return (items: T[]) => {
    const uniques = new Map();
    let count = 0;

    let i = 0;
    for (const item of items) {
      const value = keyFn(item, i++, items);

      if (!uniques.has(value)) {
        // default includes null but not undefined
        if (
          (!options.includeUndefined && value === undefined) ||
          (options.includeNull === false && value === null)
        ) {
          continue;
        }

        count += 1;
        uniques.set(value, true);
      }
    }

    return count;
  };
}
