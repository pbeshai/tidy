import { TidyFn, Datum } from './types';
import { Merge } from './type-utils';

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
export function autodetectByMap<A extends object, B extends object>(itemsA: A[], itemsB: B[]) {
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

const KEY_DELIMITER = '\x00';
const NULL_SENTINEL = '\x01N';
const UNDEF_SENTINEL = '\x01U';

function serializeValue(v: any): string {
  if (v === null) return NULL_SENTINEL;
  if (v === undefined) return UNDEF_SENTINEL;
  return String(v);
}

export function computeKey(row: any, keys: string[]): string {
  if (keys.length === 1) return serializeValue(row[keys[0]]);
  let key = '';
  for (let i = 0; i < keys.length; i++) {
    if (i > 0) key += KEY_DELIMITER;
    key += serializeValue(row[keys[i]]);
  }
  return key;
}

export function buildJoinIndex<JoinT extends object>(
  itemsToJoin: JoinT[],
  joinKeys: string[]
): Map<string, JoinT[]> {
  const index = new Map<string, JoinT[]>();
  for (const j of itemsToJoin) {
    const key = computeKey(j, joinKeys);
    let bucket = index.get(key);
    if (bucket === undefined) {
      bucket = [];
      index.set(key, bucket);
    }
    bucket.push(j);
  }
  return index;
}

/**
 * Performs an inner join on two collections
 * @param itemsToJoin The rows/items to be appended to end of collection
 */
export function innerJoin<T extends object, JoinT extends object>(
  itemsToJoin: JoinT[],
  options?: JoinOptions<JoinT, T> | null | undefined
): TidyFn<T, Merge<T, JoinT>> {
  const _innerJoin: TidyFn<T, Merge<T, JoinT>> = (
    items: T[]
  ): Merge<T, JoinT>[] => {
    // convert by option in to a map from JoinT to T key
    const byMap =
      options?.by == null
        ? autodetectByMap(items, itemsToJoin)
        : makeByMap(options.by);

    const joinKeys = Object.keys(byMap);
    const itemKeys = joinKeys.map((jKey) => byMap[jKey] as string);
    const index = buildJoinIndex(itemsToJoin, joinKeys);

    const joined = items.flatMap((d: T) => {
      const key = computeKey(d, itemKeys);
      const matches = index.get(key);
      if (matches === undefined) return [];
      return matches.map((j: JoinT) => ({ ...d, ...j }));
    });

    return joined as Merge<T, JoinT>[];
  };
  return _innerJoin;
}
