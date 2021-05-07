import { group } from 'd3-array';
import { A, O } from 'ts-toolbelt';
import { assignGroupKeys } from './helpers/assignGroupKeys';
import { groupMap } from './helpers/groupMap';
import { groupTraversal } from './helpers/groupTraversal';
import { identity } from './helpers/identity';
import { SingleOrArray, singleOrArray } from './helpers/singleOrArray';
import { Grouped, GroupKey, TidyGroupExportFn, Key, TidyFn } from './types';

/** [key, values] where values could be more nested entries */
type EntriesOutput = [any, any][];
type EntriesObjectOutput = { key: Key; values: any }[];

/** nested objects: { [key]: values } */
type ObjectOutput = Record<Key, any>;

/** nested keys: e.g. [key, key, key, [key, key, [key]]] */
type KeysOutput = any[];

/** nested values: e.g. [[value1_1, value1_2], [value2_1, value2_2]] */
type ValuesOutput = any[];

export type LevelSpec = {
  id?: string;
  createEmptySubgroup: () => any;
  addSubgroup: (
    parentGrouped: any,
    newSubgroup: any,
    key: any,
    level: number
  ) => void;
  addLeaf: (parentGrouped: any, key: any, values: any[], level: number) => void;
};

/**
 * Options to affect export type
 */
interface GroupByOptions {
  /** whether to merge group keys back into the objects */
  readonly addGroupKeys?: boolean;

  // -- export related -- //
  /** export method */
  readonly export?:
    | 'grouped'
    | 'entries'
    | 'entries-object'
    | 'object'
    | 'map'
    | 'keys'
    | 'values'
    | 'levels'
    | 'ungrouped';
  /** if all nested levels should be brought to a single top level */
  readonly flat?: boolean;
  /** when flat is true, how to flatten nested keys */
  readonly compositeKey?: (keys: any[]) => string;
  /** whether the leaf sets consist of just one item (typical after summarize).
   *  if true, uses the first element in the leaf set instead of an array
   */
  readonly single?: boolean;
  /** operation called on each leaf during export to map it to a different value
   *  (default: identity)
   */
  readonly mapLeaf?: (value: any) => any;
  /** operation called on each leaf set to map the array of values to a different value.
   * Similar to `rollup` from d3-collection nest or d3-array
   * (default: identity)
   */
  readonly mapLeaves?: (values: any[]) => any;
  /** [entries only] operation called on entries to map from [key, values] to
   * whatever the output of this is (e.g. `{ key, values }`)
   * (default: identity)
   */
  readonly mapEntry?: (entry: [any, any], level: number) => any;

  /** [required for levels] specifies the export operation for each level of the grouping */
  readonly levels?: (
    | 'entries'
    | 'entries-object'
    | 'object'
    | 'map'
    | 'keys'
    | 'values'
    | LevelSpec
  )[];
}

// aliases to make overloads shorter
type GK<T extends object> = SingleOrArray<keyof T | ((d: T) => any)>;
type F<I extends object, O extends object> = TidyFn<I, O>;

// merge back in group keys to output types
type MergeGroupKeys<
  T extends object,
  Out extends object,
  Keys extends GK<T>
> = Keys extends keyof T
  ? O.Merge<Pick<T, Keys>, Out>
  : Keys extends (keyof T)[]
  ? O.Merge<Pick<T, Keys[number]>, Out>
  : Out;

// do not merge in group keys if explicitly said not to
type WithGroupKeys<
  T extends object,
  Out extends object,
  Keys extends GK<T>,
  Opts extends GroupByOptions | undefined
> = NonNullable<Opts>['addGroupKeys'] extends false
  ? Out
  : MergeGroupKeys<T, Out, Keys>;

/**
 * output varies based on export options
 */
type GroupByOutput<
  T extends object,
  O extends object,
  Keys extends GK<T>,
  Opts extends GroupByOptions | undefined
> = A.Compute<
  NonNullable<Opts>['export'] extends 'grouped'
    ? Grouped<WithGroupKeys<T, O, Keys, Opts>>
    : NonNullable<Opts>['export'] extends 'entries'
    ? EntriesOutput
    : NonNullable<Opts>['export'] extends 'entries-object'
    ? EntriesObjectOutput
    : NonNullable<Opts>['export'] extends 'object'
    ? ObjectOutput
    : NonNullable<Opts>['export'] extends 'map'
    ? Map<any, any>
    : NonNullable<Opts>['export'] extends 'keys'
    ? KeysOutput
    : NonNullable<Opts>['export'] extends 'values'
    ? ValuesOutput
    : NonNullable<Opts>['export'] extends 'levels'
    ? any
    : WithGroupKeys<T, O, Keys, Opts>[]
>;

type GroupByFn<
  T extends object,
  O extends object,
  Keys extends GK<T>,
  Opts extends GroupByOptions
> = Opts['export'] extends
  | 'grouped'
  | 'entries'
  | 'entries-object'
  | 'object'
  | 'map'
  | 'keys'
  | 'values'
  | 'levels'
  ? TidyGroupExportFn<T, GroupByOutput<T, O, Keys, Opts>>
  : // default is no export, ungrouped and back in simple form
    TidyFn<T, WithGroupKeys<T, O, Keys, Opts>>;

/**
 * Nests the data by the specified groupings
 */
// prettier-ignore
export function groupBy<T extends object, T1 extends object, T2 extends object, T3 extends object, T4 extends object, T5 extends object, T6 extends object, T7 extends object, Keys extends GK<T>, Opts extends GroupByOptions>(groupKeys: Keys, fns: [F<T, T1>, F<T1, T2>, F<T2, T3>, F<T3, T4>, F<T4, T5>, F<T5, T6>, F<T6, T7>], options?: Opts): GroupByFn<T, T7, Keys, Opts>;
// prettier-ignore
export function groupBy<T extends object, T1 extends object, T2 extends object, T3 extends object, T4 extends object, T5 extends object, T6 extends object, Keys extends GK<T>, Opts extends GroupByOptions>(groupKeys: Keys, fns: [F<T, T1>, F<T1, T2>, F<T2, T3>, F<T3, T4>, F<T4, T5>, F<T5, T6>], options?: Opts): GroupByFn<T, T6, Keys, Opts>;
// prettier-ignore
export function groupBy<T extends object, T1 extends object, T2 extends object, T3 extends object, T4 extends object, T5 extends object, Keys extends GK<T>, Opts extends GroupByOptions>(groupKeys: Keys, fns: [F<T, T1>, F<T1, T2>, F<T2, T3>, F<T3, T4>, F<T4, T5>], options?: Opts): GroupByFn<T, T5, Keys, Opts>;
// prettier-ignore
export function groupBy<T extends object, T1 extends object, T2 extends object, T3 extends object, T4 extends object, Keys extends GK<T>, Opts extends GroupByOptions>(groupKeys: Keys, fns: [F<T, T1>, F<T1, T2>, F<T2, T3>, F<T3, T4>], options?: Opts): GroupByFn<T, T4, Keys, Opts>;
// prettier-ignore
export function groupBy<T extends object, T1 extends object, T2 extends object, T3 extends object, Keys extends GK<T>, Opts extends GroupByOptions>(groupKeys: Keys, fns: [F<T, T1>, F<T1, T2>, F<T2, T3>], options?: Opts): GroupByFn<T, T3, Keys, Opts>;
// prettier-ignore
export function groupBy<T extends object, T1 extends object, T2 extends object, Keys extends GK<T>, Opts extends GroupByOptions>(groupKeys: Keys, fns: [F<T, T1>, F<T1, T2>], options?: Opts): GroupByFn<T, T2, Keys, Opts>;
// prettier-ignore
export function groupBy<T extends object, T1 extends object, Keys extends GK<T>, Opts extends GroupByOptions>(groupKeys: Keys, fns: [F<T, T1>], options?: Opts): GroupByFn<T, T1, Keys, Opts>;
// prettier-ignore
export function groupBy<T extends object, Keys extends GK<T>, Opts extends GroupByOptions>(groupKeys: Keys, fns: [], options?: Opts): GroupByFn<T, T, Keys, Opts>;
export function groupBy<
  T extends object,
  O extends object,
  Keys extends GK<T>,
  Opts extends GroupByOptions
>(
  groupKeys: Keys,
  fns: TidyFn<any, any>[],
  options?: Opts
): GroupByFn<T, O, Keys, Opts> {
  const _groupBy: GroupByFn<T, O, Keys, Opts> = ((items: T[]) => {
    // form into a nested map
    const grouped = makeGrouped(items, groupKeys);

    // run group functions
    const results = runFlow(grouped, fns, options?.addGroupKeys);

    // export
    if (options?.export) {
      switch (options.export) {
        case 'grouped':
          return results;
        case 'levels':
          return exportLevels(results, options);
        case 'entries-obj' as any:
        case 'entriesObject' as any:
          return exportLevels(results, {
            ...options,
            export: 'levels',
            levels: ['entries-object'],
          });
        default:
          return exportLevels(results, {
            ...options,
            export: 'levels',
            levels: [options.export],
          });
      }
    }

    // export === 'ungrouped' or nully:
    const ungrouped = ungroup(results, options?.addGroupKeys);
    return ungrouped as any;
  }) as GroupByFn<T, O, Keys, Opts>;
  // (_groupBy as any).tidyType = 'group-export';

  return _groupBy;
}
// convenient export option configs
groupBy.grouped = (options?: Omit<GroupByOptions, 'export' | 'levels'>) =>
  ({ ...options, export: 'grouped' } as const);
groupBy.entries = (options?: Omit<GroupByOptions, 'export' | 'levels'>) =>
  ({ ...options, export: 'entries' } as const);
groupBy.entriesObject = (options?: Omit<GroupByOptions, 'export' | 'levels'>) =>
  ({ ...options, export: 'entries-object' } as const);
groupBy.object = (options?: Omit<GroupByOptions, 'export' | 'levels'>) =>
  ({ ...options, export: 'object' } as const);
groupBy.map = (options?: Omit<GroupByOptions, 'export' | 'levels'>) =>
  ({ ...options, export: 'map' } as const);
groupBy.keys = (options?: Omit<GroupByOptions, 'export' | 'levels'>) =>
  ({ ...options, export: 'keys' } as const);
groupBy.values = (options?: Omit<GroupByOptions, 'export' | 'levels'>) =>
  ({ ...options, export: 'values' } as const);
groupBy.levels = (options?: Omit<GroupByOptions, 'export'>) =>
  ({ ...options, export: 'levels' } as const);

function runFlow<T extends object>(
  items: Grouped<T>,
  fns?: TidyFn<any, any>[],
  addGroupKeys?: boolean
) {
  let result: any = items;
  if (!fns?.length) return result;

  for (const fn of fns) {
    if (!fn) continue;

    // otherwise break it up and call it on each leaf set
    result = groupMap(result, (items, keys) => {
      // ensure we kept the group keys in the object
      // (necessary for e.g. summarize which may remove them)
      const context = { groupKeys: keys };
      let leafItemsMapped = fn(items, context);
      if (addGroupKeys !== false) {
        leafItemsMapped = leafItemsMapped.map((item: T) =>
          assignGroupKeys(item, keys)
        );
      }

      return leafItemsMapped;
    });
  }

  return result;
}

function makeGrouped<T extends object>(
  items: T[],
  groupKeys: SingleOrArray<keyof T | ((d: T) => any)>
): Grouped<T> {
  // convert string based keys to functions and keep the key name with the key value in a tuple
  const groupKeyFns = singleOrArray(groupKeys).map((key, i) => {
    const keyFn = typeof key === 'function' ? key : (d: T) => d[key];

    // use a cache so we don't generate new keys for the same tuple
    const keyCache = new Map();
    return (d: T) => {
      const keyValue = keyFn(d);

      // used cache tuple if available
      if (keyCache.has(keyValue)) {
        return keyCache.get(keyValue) as GroupKey;
      }

      const keyWithName = [key, keyValue];
      keyCache.set(keyValue, keyWithName);

      return keyWithName;
    };
  });

  const grouped = group(items, ...groupKeyFns);
  return grouped;
}

/**
 * flattens a grouped collection back to a simple array
 */
function ungroup<T extends object>(
  grouped: Grouped<T>,
  addGroupKeys: boolean | undefined
): T[] {
  // flatten the groups
  const items: T[] = [];

  groupTraversal(grouped, items, [], identity, (root, keys, values) => {
    // ensure we have group keys on items (in case runFlow didn't run)
    let valuesToAdd = values;
    if (addGroupKeys !== false) {
      valuesToAdd = values.map((d) => assignGroupKeys(d, keys));
    }
    root.push(...valuesToAdd);
  });

  return items;
}

// -----------------------------------------------------------------------
// --- EXPORTS -----------------------------------------------------------
// -----------------------------------------------------------------------
const defaultCompositeKey = (keys: any[]) => keys.join('/');

function processFromGroupsOptions<T extends object>(options: GroupByOptions) {
  const {
    flat,
    single,
    mapLeaf = identity,
    mapLeaves = identity,
    addGroupKeys,
  } = options;
  let compositeKey: (keys: any[]) => string;
  if (options.flat) {
    compositeKey = options.compositeKey! ?? defaultCompositeKey;
  }

  const groupFn = (values: T[], keys: any[]) => {
    return single
      ? mapLeaf(
          addGroupKeys === false ? values[0] : assignGroupKeys(values[0], keys)
        )
      : mapLeaves(
          values.map((d) =>
            mapLeaf(addGroupKeys === false ? d : assignGroupKeys(d, keys))
          )
        );
  };

  const keyFn = flat
    ? (keys: GroupKey[]) => compositeKey(keys.map((d) => d[1]))
    : (keys: GroupKey[]) => keys[keys.length - 1][1];

  return { groupFn, keyFn };
}

// -- Levels -------------------------------------------------------------
function exportLevels<T extends object>(
  grouped: Grouped<T>,
  options: GroupByOptions
): any {
  type NestedEntries<T> = Array<[any, NestedEntries<T> | T[]]>;
  type NestedObject<T> = { [key: string]: NestedObject<T> | T[] };

  const { groupFn, keyFn } = processFromGroupsOptions(options);
  let { mapEntry = identity } = options;
  const { levels = ['entries'] } = options;

  const levelSpecs: LevelSpec[] = [];
  for (const levelOption of levels) {
    switch (levelOption) {
      // entries / entries-object -----------------------------------------
      case 'entries':
      case 'entries-object':
      case 'entries-obj' as any:
      case 'entriesObject' as any: {
        const levelMapEntry =
          (levelOption === 'entries-object' ||
            levelOption === ('entries-obj' as any) ||
            levelOption === ('entriesObject' as any)) &&
          options.mapEntry == null
            ? ([key, values]: any) => ({ key, values })
            : mapEntry;

        levelSpecs.push({
          id: 'entries',
          createEmptySubgroup: () => [],
          addSubgroup: (
            parentGrouped: NestedEntries<T>,
            newSubgroup: any,
            key: any,
            level: number
          ) => {
            parentGrouped.push(levelMapEntry([key, newSubgroup], level));
          },

          addLeaf: (
            parentGrouped: NestedEntries<T>,
            key: any,
            values: T[],
            level: number
          ) => {
            parentGrouped.push(levelMapEntry([key, values], level));
          },
        });
        break;
      }
      // map -------------------------------------------------------------
      case 'map':
        levelSpecs.push({
          id: 'map',
          createEmptySubgroup: () => new Map(),
          addSubgroup: (
            parentGrouped: Map<any, any>,
            newSubgroup: any,
            key: any
          ) => {
            parentGrouped.set(key, newSubgroup);
          },

          addLeaf: (parentGrouped: Map<any, any>, key: any, values: T[]) => {
            parentGrouped.set(key, values);
          },
        });
        break;

      // object ----------------------------------------------------------
      case 'object':
        levelSpecs.push({
          id: 'object',
          createEmptySubgroup: () => ({}),
          addSubgroup: (
            parentGrouped: NestedObject<T>,
            newSubgroup: any,
            key: any
          ) => {
            parentGrouped[key] = newSubgroup;
          },

          addLeaf: (parentGrouped: NestedObject<T>, key: any, values: T[]) => {
            parentGrouped[key] = values;
          },
        });
        break;

      // keys ------------------------------------------------------------
      case 'keys':
        levelSpecs.push({
          id: 'keys',
          createEmptySubgroup: () => [],
          addSubgroup: (parentGrouped: any, newSubgroup: any, key: any) => {
            parentGrouped.push([key, newSubgroup]);
          },

          addLeaf: (parentGrouped: any, key: any) => {
            parentGrouped.push(key);
          },
        });
        break;

      // values ----------------------------------------------------------
      case 'values':
        levelSpecs.push({
          id: 'values',
          createEmptySubgroup: () => [],
          addSubgroup: (parentGrouped: any, newSubgroup: any) => {
            parentGrouped.push(newSubgroup);
          },

          addLeaf: (parentGrouped: any, key: any, values: T[]) => {
            parentGrouped.push(values);
          },
        });
        break;

      // custom ----------------------------------------------------------
      default: {
        // LevelSpec obj already
        if (typeof levelOption === 'object') {
          levelSpecs.push(levelOption);
        }
      }
    }
  }

  // add subgroup
  const addSubgroup = (parentGrouped: any, keys: any[], level: number): any => {
    if (options.flat) {
      return parentGrouped;
    }

    const levelSpec = levelSpecs[level] ?? levelSpecs[levelSpecs.length - 1];
    const nextLevelSpec = levelSpecs[level + 1] ?? levelSpec;
    const newSubgroup = nextLevelSpec.createEmptySubgroup();
    levelSpec!.addSubgroup(parentGrouped, newSubgroup, keyFn(keys), level);
    return newSubgroup;
  };

  // add leaves
  const addLeaf = (
    parentGrouped: any,
    keys: any[],
    values: T[],
    level: number
  ) => {
    const levelSpec = levelSpecs[level] ?? levelSpecs[levelSpecs.length - 1];
    levelSpec!.addLeaf(
      parentGrouped,
      keyFn(keys),
      groupFn(values, keys),
      level
    );
  };

  const initialOutputObject = levelSpecs[0]!.createEmptySubgroup();
  return groupTraversal(grouped, initialOutputObject, [], addSubgroup, addLeaf);
}
