import { Datum, TidyFn } from './types';
import { makeByMap, autodetectByMap, JoinOptions, buildJoinIndex, computeKey } from './innerJoin';
import { Merge } from './type-utils';

/**
 * Performs a full join on two collections
 * @param itemsToJoin The rows/items to be appended to end of collection
 */
export function fullJoin<T extends Datum, JoinT extends Datum>(
  itemsToJoin: JoinT[],
  options?: JoinOptions<JoinT, T> | null | undefined
): TidyFn<T, Merge<T, Partial<JoinT>>> {
  const _fullJoin: TidyFn<T, Merge<T, Partial<JoinT>>> = (
    items: T[]
  ): Merge<T, Partial<JoinT>>[] => {
    if (!itemsToJoin.length) return items as any;
    if (!items.length) return itemsToJoin as any;

    // convert by option in to a map from T key to JoinT key
    const byMap =
      options?.by == null
        ? autodetectByMap(items, itemsToJoin)
        : makeByMap(options.by);

    const joinKeys = Object.keys(byMap);
    const itemKeys = joinKeys.map((jKey) => byMap[jKey] as string);
    const index = buildJoinIndex(itemsToJoin, joinKeys);

    // keep track of matched join items by reference
    const matchedItems = new Set<JoinT>();

    // when we miss a join, we want to explicitly add in undefined
    // so our rows all have the same keys. get those keys here.
    const joinObjectKeys = Object.keys(itemsToJoin[0]);

    const joined = items.flatMap((d: T) => {
      const key = computeKey(d, itemKeys);
      const matches = index.get(key);

      if (matches !== undefined) {
        for (const j of matches) {
          matchedItems.add(j);
        }
        return matches.map((j: JoinT) => ({ ...d, ...j }));
      }

      // add in missing keys explicitly as undefined without
      // overriding existing values and while maintaining order
      // of keys
      const undefinedFill = Object.fromEntries(
        joinObjectKeys
          .filter((key) => d[key] == null)
          .map((key) => [key, undefined])
      );

      return { ...d, ...undefinedFill };
    });

    // add in the ones we missed
    if (matchedItems.size < itemsToJoin.length) {
      const leftEmptyObject = Object.fromEntries(
        Object.keys(items[0]).map((key) => [key, undefined])
      );
      for (const item of itemsToJoin) {
        if (!matchedItems.has(item)) {
          joined.push({ ...leftEmptyObject, ...item });
        }
      }
    }

    return joined;
  };
  return _fullJoin;
}
