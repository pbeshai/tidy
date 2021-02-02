import { TidyFn } from './types';
import { tidy } from './tidy';

/**
 * Conditionally runs a tidy sub-flow
 */
export function when<T extends object>(
  predicate: ((items: T[]) => boolean) | boolean,
  fns: TidyFn<any, any>[]
): TidyFn<T, any> {
  const _when: TidyFn<T, any> = (items: T[]) => {
    if (typeof predicate === 'function') {
      if (!predicate(items)) return items;
    } else if (!predicate) {
      return items;
    }

    const results = (tidy as any)(items, ...fns);
    return results;
  };
  return _when;
}
