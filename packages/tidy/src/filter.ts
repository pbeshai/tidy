import { TidyFn } from './types';

/**
 * Filters items
 * @param filterFn Returns true to keep the item, false to filter out
 */
export function filter<T extends object>(
  filterFn: (item: T, index: number, array: T[]) => boolean
): TidyFn<T> {
  const _filter: TidyFn<T> = (items: T[]): T[] => items.filter(filterFn);
  return _filter;
}
