import { Datum, TidyFn } from './types';
import { isMatch, makeByMap, autodetectByMap, JoinOptions } from './innerJoin';
import { O } from 'ts-toolbelt';

/**
 * Performs a left join on two collections
 * @param itemsToJoin The rows/items to be appended to end of collection
 */
export function leftJoin<T extends Datum, JoinT extends Datum>(
  itemsToJoin: JoinT[],
  options?: JoinOptions<JoinT, T> | null | undefined
): TidyFn<T, O.Merge<T, Partial<JoinT>>> {
  const _leftJoin: TidyFn<T, O.Merge<T, Partial<JoinT>>> = (
    items: T[]
  ): O.Merge<T, Partial<JoinT>>[] => {
    // convert by option in to a map from T key to JoinT key
    const byMap =
      options?.by == null
        ? autodetectByMap(items, itemsToJoin)
        : makeByMap(options.by);

    const joined = items.flatMap((d: T) => {
      const matches = itemsToJoin.filter((j: JoinT) => isMatch(d, j, byMap));
      return matches.length ? matches.map((j: JoinT) => ({ ...d, ...j })) : d;
    });

    return joined;
  };
  return _leftJoin;
}
