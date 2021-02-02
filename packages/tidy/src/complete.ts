import { expand, KeyMap } from './expand';
import { leftJoin } from './leftJoin';
import { Key, TidyFn } from './types';
import { replaceNully } from './replaceNully';
import { SingleOrArray } from './helpers/singleOrArray';

/**
 * Complete a collection with missing combinations of data
 * @param expandKeys The keys to expand to all combinations of
 * @param replaceNullySpec a map from key name to value of how to deal with undefined values
 */
export function complete<T extends object>(
  expandKeys: SingleOrArray<Key> | KeyMap<T>,
  replaceNullySpec?: Partial<T> | null | undefined
): TidyFn<T> {
  const _complete: TidyFn<T> = (items: T[]): T[] => {
    const expanded = expand<T, any>(expandKeys)(items);
    const joined = leftJoin(items)(expanded) as T[]; // actually may have some undefineds...
    return replaceNullySpec
      ? (replaceNully(replaceNullySpec)(joined) as T[])
      : joined;
  };

  return _complete;
}
