import { keysFromItems } from '../helpers/keysFromItems';

/**
 * Returns all keys that match the specified regex
 */
export function matches<T extends object>(regex: RegExp) {
  return (items: T[]) => {
    const keys = keysFromItems(items);
    return keys.filter((d) => regex.test(d as string));
  };
}
