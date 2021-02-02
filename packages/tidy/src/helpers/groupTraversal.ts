import { Grouped, Datum } from '../types';

/**
 * Traverse the leaves of the grouped items and and run the
 * groupFn on them. Basically an in-order traversal. Can you
 * believe this is real and not part of a coding interview??
 */
export function groupTraversal<
  T extends object,
  T2 extends Datum = T,
  OutputType = Grouped<T2>
>(
  grouped: Grouped<T>,
  outputGrouped: OutputType,
  keys: any[],
  addSubgroup: (root: OutputType, keys: any[], level: number) => OutputType,
  addLeaves: (root: OutputType, keys: any[], items: T[], level: number) => void,
  level: number = 0
) {
  for (const [key, value] of grouped.entries()) {
    const keysHere = [...keys, key];

    // internal node
    if (value instanceof Map) {
      const subgroup = addSubgroup(outputGrouped, keysHere, level);

      // recurse
      groupTraversal(
        value,
        subgroup,
        keysHere,
        addSubgroup,
        addLeaves,
        level + 1
      );
    } else {
      // leaf
      addLeaves(outputGrouped, keysHere, value, level);
    }
  }

  return outputGrouped;
}
