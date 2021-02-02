import { keysFromItems } from '../helpers/keysFromItems';

/**
 * Returns all keys that contain the specified substring
 */
export function contains<T extends object>(
  substring: string,
  ignoreCase: boolean = true
) {
  return (items: T[]) => {
    const regex = new RegExp(substring, ignoreCase ? 'i' : undefined);
    const keys = keysFromItems(items);
    return keys.filter((d) => regex.test(d as string));
  };
}
