/**
 * Returns a function that returns the last value for the specified key
 * @param key A string key of the object or an accessor converting the object to a number
 */
export function last<T extends object>(key: keyof T | ((d: T) => any)) {
  const keyFn = typeof key === 'function' ? key : (d: T) => d[key];

  return (items: T[]) =>
    items.length ? keyFn(items[items.length - 1]) : undefined;
}
