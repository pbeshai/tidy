import { keysFromItems } from '../helpers/keysFromItems';

/**
 * Returns all keys that end with the specified suffix
 */
export function endsWith<T extends object>(
  suffix: string,
  ignoreCase: boolean = true
) {
  return (items: T[]) => {
    const regex = new RegExp(`${suffix}$`, ignoreCase ? 'i' : undefined);
    const keys = keysFromItems(items);
    return keys.filter((d) => regex.test(d as string));
  };
}
