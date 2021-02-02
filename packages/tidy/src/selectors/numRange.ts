import { keysFromItems } from '../helpers/keysFromItems';

/**
 * Returns all keys that match the prefix + num range.
 * e.g., wk, [10, 15], width=3 -> wk010, wk011, wk012, wk013, wk014, wk015
 */
export function numRange<T extends object>(
  prefix: string,
  range: [number, number],
  width?: number
) {
  return (items: T[]) => {
    const keys = keysFromItems(items);
    const matchKeys: string[] = [];
    for (let i = range[0]; i <= range[1]; ++i) {
      const num = width == null ? i : new String('00000000' + i).slice(-width);
      matchKeys.push(`${prefix}${num}`);
    }

    return keys.filter((d) => (matchKeys as (keyof T)[]).includes(d));
  };
}
