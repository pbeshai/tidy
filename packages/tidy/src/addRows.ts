import { SingleOrArray, singleOrArray } from './helpers/singleOrArray';
import { TidyFn } from './types';

/**
 * adds items to the end of the collection
 * @param itemsToAdd The rows/items to be appended to end of collection
 */
export function addRows<T extends object>(
  itemsToAdd: SingleOrArray<T> | ((items: T[]) => SingleOrArray<T>)
): TidyFn<T> {
  const _addRows: TidyFn<T> = (items: T[]): T[] => {
    // TODO: allow options for specifying where it is inserted?
    if (typeof itemsToAdd === 'function') {
      return [...items, ...singleOrArray((itemsToAdd as Function)(items))];
    }

    return [...items, ...singleOrArray(itemsToAdd)];
  };

  return _addRows;
}
