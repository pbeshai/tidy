export type Datum = Record<Key, any>;
export type Vector<T, K extends keyof T = keyof T> = T[K][];
export type Key = string | number;
export type KeyOrFn<T> = keyof T | ((item: T) => unknown);
export type Comparator<T> = (a: T, b: T) => number;
export type Primitive = number | string | boolean | Date;
export type NonFunctionValue =
  | boolean
  | string
  | number
  | null
  | undefined
  | Array<any>
  | { [key: string]: NonFunctionValue };
// ---

export type GroupKey<K = any> = [string, K]; // tuple representing key name then key value
export type Grouped<T> = Map<GroupKey<any>, T[] | Grouped<T>>;

export interface TidyContext {
  /** when grouped, tidy functions can access the grouping keys here */
  groupKeys?: Key[];
}

/**
 * Takes in array of items, outputs array of items
 */
export type TidyFn<InputT extends object, OutputT = InputT> = (
  items: InputT[],
  context?: TidyContext
) => OutputT[];

/**
 * Takes in grouped items and outputs some modified version that
 * will no longer be accepted in tidy flows.
 */
export type TidyGroupExportFn<InputT extends object, ExportedT> = (
  items: InputT[],
  context?: TidyContext
) => ExportedT;

export type Granularity =
  | 'd'
  | 'days'
  | 'day' // for backwards compatibility
  | 'w'
  | 'week' // for backwards compatibility
  | 'weeks'
  | 'm'
  | 'month' // for backwards compatibility
  | 'months'
  | 'y'
  | 'year' // for backwards compatibility
  | 'years';
