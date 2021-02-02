import { TidyFn } from './types';

/**
 * Maps items
 * @param mapFn Maps items from one form to another
 */
export function map<T extends object, OutputT>(
  mapFn: (item: T, index: number, array: T[]) => OutputT
): TidyFn<T, OutputT> {
  const _map: TidyFn<T, OutputT> = (items: T[]) => items.map(mapFn);
  return _map;
}
