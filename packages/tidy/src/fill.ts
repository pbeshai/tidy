import { SingleOrArray, singleOrArray } from './helpers/singleOrArray';
import { Key, TidyFn } from './types';

/**
 * Fills values for the specified keys to match the last seen value in the collection.
 */
export function fill<T extends object>(keys: SingleOrArray<Key>): TidyFn<T> {
  const _fill: TidyFn<T> = (items: T[]): T[] => {
    const keysArray = singleOrArray(keys);

    const replaceMap: Partial<T> = {};

    return items.map((d) => {
      let needsCopy = false;
      for (const key of keysArray) {
        if (d[key as keyof T] != null) {
          replaceMap[key as keyof T] = d[key as keyof T];
        } else if (replaceMap[key as keyof T] != null) {
          needsCopy = true;
        }
      }
      if (!needsCopy) return d;
      const obj = { ...d };
      for (const key of keysArray) {
        if (obj[key as keyof T] == null && replaceMap[key as keyof T] != null) {
          obj[key as keyof T] = replaceMap[key as keyof T] as any;
        }
      }
      return obj;
    });
  };

  return _fill;
}
