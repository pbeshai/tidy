import { keysFromItems } from '../helpers/keysFromItems';

/**
 * Returns all keys that start with the specified prefix
 */
export function startsWith<T extends object>(
  prefix: string,
  ignoreCase: boolean = true
) {
  return (items: T[]) => {
    const regex = new RegExp(`^${prefix}`, ignoreCase ? 'i' : undefined);
    const keys = keysFromItems(items);
    return keys.filter((d) => regex.test(d as string));
  };
}
