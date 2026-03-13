import { Datum, TidyFn } from './types';
import {
  makeByMap,
  autodetectByMap,
  JoinOptions,
  buildJoinIndex,
  computeKey,
} from './innerJoin';
import { Merge } from './type-utils';

/**
 * Performs a left join on two collections
 * @param itemsToJoin The rows/items to be appended to end of collection
 */
export function leftJoin<T extends Datum, JoinT extends Datum>(
  itemsToJoin: JoinT[],
  options?: JoinOptions<JoinT, T> | null | undefined
): TidyFn<T, Merge<T, Partial<JoinT>>> {
  const _leftJoin: TidyFn<T, Merge<T, Partial<JoinT>>> = (
    items: T[]
  ): Merge<T, Partial<JoinT>>[] => {
    if (!itemsToJoin.length) return items as any;

    // convert by option in to a map from T key to JoinT key
    const byMap =
      options?.by == null
        ? autodetectByMap(items, itemsToJoin)
        : makeByMap(options.by);

    const joinKeys = Object.keys(byMap);
    const itemKeys = joinKeys.map((jKey) => byMap[jKey] as string);
    const index = buildJoinIndex(itemsToJoin, joinKeys);

    // when we miss a join, we want to explicitly add in undefined
    // so our rows all have the same keys. get those keys here.
    const joinObjectKeys = Object.keys(itemsToJoin[0]);

    const joined = items.flatMap((d: T) => {
      const key = computeKey(d, itemKeys);
      const matches = index.get(key);
      if (matches !== undefined) {
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

    return joined;
  };
  return _leftJoin;
}
