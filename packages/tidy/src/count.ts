import { arrange, desc } from './arrange';
import { groupBy } from './groupBy';
import { identity } from './helpers/identity';
import { SingleOrArray } from './helpers/singleOrArray';
import { tally } from './tally';
import { tidy } from './tidy';
import { KeyOrFn } from './types';

type CountOptions = {
  name?: string;
  sort?: boolean;
  wt?: string;
};

/**
 * Tallies the number distinct values for the specified keys and adds
 * the count as a new key (default `n`). Optionally sorts by the count.
 */
export function count<T extends object, Keys extends SingleOrArray<KeyOrFn<T>>>(
  groupKeys: Keys,
  options?: CountOptions | null | undefined
) {
  const _count = (items: T[]) => {
    options = options ?? {};
    const { name = 'n', sort } = options;

    const results = tidy(
      items,
      groupBy(groupKeys, [tally(options)]),
      sort ? arrange(desc(name)) : identity
    );

    return results;
  };

  return _count;
}
