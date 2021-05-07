import { GroupKey } from '../types';

/**
 * Given an object and a set of group keys [[keyName, keyValue], ...]
 * set the keys as properties within the object: { [keyName]: keyValue, ... }
 * (creates a new object with these properties added)
 */
export function assignGroupKeys<T extends object>(d: T, keys: GroupKey[]) {
  // abort if atypical input
  if (d == null || typeof d !== 'object' || Array.isArray(d)) return d;

  // transform to { groupKey1: value, ... } excluding function group keys
  const keysObj = Object.fromEntries(
    keys.filter((key) => typeof key[0] !== 'function')
  );

  return Object.assign(keysObj, d);
}
