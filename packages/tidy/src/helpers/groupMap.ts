import { Grouped } from '../types';
import { groupTraversal } from './groupTraversal';

export function groupMap<T extends object, OutputT extends object = T>(
  grouped: Grouped<T>,
  groupFn: (items: T[], keys: any[]) => OutputT[],
  keyFn: (keys: any[]) => any = (keys) =>
    keys[
      keys.length - 1
    ] /* optional func to transform key based on all keys in map so far */
): Grouped<OutputT> {
  function addSubgroup(parentGrouped: Grouped<OutputT>, keys: any[]) {
    const subgroup = new Map();
    parentGrouped.set(keyFn(keys), subgroup);
    return subgroup;
  }

  function addLeaves(
    parentGrouped: Grouped<OutputT>,
    keys: any[],
    values: T[]
  ) {
    parentGrouped.set(keyFn(keys), groupFn(values, keys));
  }

  const outputGrouped: Grouped<OutputT> = new Map();

  groupTraversal(grouped, outputGrouped, [], addSubgroup, addLeaves);

  return outputGrouped;
}
