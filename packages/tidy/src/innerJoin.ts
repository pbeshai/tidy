import { O } from 'ts-toolbelt';
import { TidyFn, Datum } from './types';

type ByMap<JoinT extends Datum, T extends Datum> = Partial<
  Record<keyof JoinT, keyof T>
>;

export type JoinOptions<JoinT extends Datum, T extends Datum> = {
  by?: keyof T | (keyof T)[] | ByMap<JoinT, T>;
};

/**
 * Compares first two sets of items to find overlapping keys
 * Naively looks at first element... could cause problems if first
 * elements don't have all keys, but scanning each entire set seems
 * unnecessarily slow for most cases.
 */
export function autodetectByMap<A, B>(itemsA: A[], itemsB: B[]) {
  if (itemsA.length === 0 || itemsB.length === 0) return {};

  // intersection of shared keys
  const keysA = Object.keys(itemsA[0]);
  const keysB = Object.keys(itemsB[0]);

  // naive linear intersection, but we don't expect objects to have tons of keys
  // so it's probably fine.
  const byMap: any = {};
  for (const key of keysA) {
    if (keysB.includes(key)) {
      byMap[key] = key;
    }
  }

  return byMap;
}

// convert by option in to a map from JoinT to T key
export function makeByMap<T extends Datum, JoinT extends Datum>(
  by: JoinOptions<JoinT, T>['by']
): ByMap<JoinT, T> {
  // convert by option in to a map from JoinT to T key
  if (Array.isArray(by)) {
    const byMap: ByMap<JoinT, T> = {};
    for (const key of by) {
      byMap[key as any] = key;
    }
    return byMap;
  } else if (typeof by === 'object') {
    return by;
  }
  return { [by as keyof JoinT]: by as keyof T } as ByMap<JoinT, T>;
}

export function isMatch<T extends object, JoinT extends object>(
  d: T,
  j: JoinT,
  byMap: ByMap<JoinT, T>
) {
  for (const jKey in byMap) {
    const dKey = byMap[jKey];
    if ((d[dKey as keyof T] as any) !== j[jKey as keyof JoinT]) {
      return false;
    }
  }
  return true;
}

/**
 * Performs an inner join on two collections
 * @param itemsToJoin The rows/items to be appended to end of collection
 */
export function innerJoin<T extends object, JoinT extends object>(
  itemsToJoin: JoinT[],
  options?: JoinOptions<JoinT, T> | null | undefined
): TidyFn<T, O.Merge<T, JoinT>> {
  const _innerJoin: TidyFn<T, O.Merge<T, JoinT>> = (
    items: T[]
  ): O.Merge<T, JoinT>[] => {
    // convert by option in to a map from JoinT to T key
    const byMap =
      options?.by == null
        ? autodetectByMap(items, itemsToJoin)
        : makeByMap(options.by);

    const joined = items.flatMap((d: T) => {
      const matches = itemsToJoin.filter((j: JoinT) => isMatch(d, j, byMap));
      return matches.map((j: JoinT) => ({ ...d, ...j }));
    });

    return joined as O.Merge<T, JoinT>[];
  };
  return _innerJoin;
}
