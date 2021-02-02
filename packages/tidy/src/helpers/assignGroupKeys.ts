import { GroupKey } from '../types';

/**
 * Given an object and a set of group keys [[keyName, keyValue], ...]
 * set the keys as properties within the object: { [keyName]: keyValue, ... }
 * (creates a new object with these properties added)
 */
export function assignGroupKeys<T extends object>(d: T, keys: GroupKey[]) {
  return {
    ...d,
    ...keys.reduce((accum: any, key) => ((accum[key[0]] = key[1]), accum), {}),
  };
}
