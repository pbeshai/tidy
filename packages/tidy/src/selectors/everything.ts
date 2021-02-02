import { keysFromItems } from '../helpers/keysFromItems';

/**
 * Returns all keys
 */
export function everything<T extends object>() {
  return (items: T[]) => {
    const keys = keysFromItems(items);
    return keys;
  };
}
