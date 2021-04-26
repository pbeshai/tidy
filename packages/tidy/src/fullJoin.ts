import { Datum, TidyFn } from './types';
import { isMatch, makeByMap, autodetectByMap, JoinOptions } from './innerJoin';
import { O } from 'ts-toolbelt';

/**
 * Performs a full join on two collections
 * @param itemsToJoin The rows/items to be appended to end of collection
 */
export function fullJoin<T extends Datum, JoinT extends Datum>(
  itemsToJoin: JoinT[],
  options?: JoinOptions<JoinT, T> | null | undefined
): TidyFn<T, O.Merge<T, Partial<JoinT>>> {
  const _fullJoin: TidyFn<T, O.Merge<T, Partial<JoinT>>> = (
    items: T[]
  ): O.Merge<T, Partial<JoinT>>[] => {
    // convert by option in to a map from T key to JoinT key
    const byMap =
      options?.by == null
        ? autodetectByMap(items, itemsToJoin)
        : makeByMap(options.by);

    // keep track of what has been matched
    const matchMap = new Map();

    const joined = items.flatMap((d: T) => {
      const matches = itemsToJoin.filter((j: JoinT) => {
        const matched = isMatch(d, j, byMap);
        if (matched) {
          matchMap.set(j, true);
        }
        return matched;
      });
      return matches.length ? matches.map((j: JoinT) => ({ ...d, ...j })) : d;
    });

    // add in the ones we missed
    for (const item of itemsToJoin) {
      if (!matchMap.has(item)) {
        joined.push(item);
      }
    }

    return joined;
  };
  return _fullJoin;
}
