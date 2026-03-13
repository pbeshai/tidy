import { Prettify } from './type-utils';
import { singleOrArray } from './helpers/singleOrArray';
import { Key, TidyFn, Vector } from './types';

export type SummarizeSpec<T> = Record<Key, (items: T[]) => any>;

export interface SummarizeOptions<T = any> {
  rest?: (key: keyof T) => (items: T[]) => any;
}

type SummarizedT<
  T extends object,
  SumSpec extends SummarizeSpec<T>,
  Options extends SummarizeOptions<T> | undefined
> = {
  [K in keyof SumSpec]: ReturnType<SumSpec[K]>;
} & (NonNullable<Options>['rest'] extends Function
    ? Omit<T, keyof SumSpec>
    : {});

/**
 * summarizes items
 */
export function summarize<
  T extends object,
  SummarizedSpec extends SummarizeSpec<T> = SummarizeSpec<T>,
  Options extends SummarizeOptions<T> = SummarizeOptions<T>
>(
  summarizeSpec: SummarizedSpec,
  options?: Options
): TidyFn<T, Prettify<SummarizedT<T, SummarizedSpec, Options>>> {
  type Output = SummarizedT<T, SummarizedSpec, Options>;

  const _summarize: TidyFn<T, Prettify<Output>> = (
    items: T[]
  ): Prettify<Output>[] => {
    options = options ?? ({} as Options);

    // reduce but use a loop to be more readable
    const summarized = {} as Output;
    const keys = Object.keys(summarizeSpec) as (keyof SummarizedSpec)[];

    for (const key of keys) {
      summarized[key as keyof Output] = summarizeSpec[key](items);
    }

    // if we a function to apply to the rest of the keys is supplied, use it
    // TODO: improve types for rest
    if (options.rest && items.length) {
      const objectKeys = Object.keys(items[0]) as (keyof T)[];
      for (const objKey of objectKeys) {
        if (keys.includes(objKey as any)) {
          continue;
        }

        (summarized as any)[objKey] = options.rest(objKey)(items);
      }
    }

    return [summarized] as Prettify<Output>[];
  };

  return _summarize;
}

/*-------- summarize helpers ----------------------------------------*/

export type SummaryKeyFn<T, K = keyof T> = (key: K) => (items: T[]) => any;

function _summarizeHelper<
  T extends object,
  SummarizedT extends object = { [K in keyof T]: any }
>(
  items: T[],
  summaryFn: SummaryKeyFn<T>,
  predicateFn?: (vector: Vector<T>) => boolean,
  keys?: Array<keyof T | ((items: T[]) => (keyof T)[])>
): SummarizedT[] {
  if (!items.length) return [];

  // reduce but use a loop to be more readable
  const summarized = {} as SummarizedT;

  // read in keys from first object if not provided
  let keysArr: (keyof T)[];
  if (keys == null) {
    keysArr = Object.keys(items[0]) as (keyof T)[];
  } else {
    // expand them all to a flat list of keys
    keysArr = [];
    for (const keyInput of singleOrArray(keys as any)) {
      if (typeof keyInput === 'function') {
        keysArr.push(...(keyInput(items) as (keyof T)[]));
      } else {
        keysArr.push(keyInput);
      }
    }
  }

  for (const key of keysArr) {
    if (predicateFn) {
      // inefficient to compute this vector here, wonder if it should
      // be computed prior to this func being called somehow? (TODO)
      const vector = items.map((d) => d[key]);
      if (!predicateFn(vector)) {
        continue;
      }
    }
    summarized[(key as unknown) as keyof SummarizedT] = summaryFn(key)(
      items
    ) as any;
  }

  return [summarized];
}

/*---- summarizeAll() --------------------------------------------*/

type SummaryFnOutput<T extends object, F extends SummaryKeyFn<T>> = ReturnType<
  ReturnType<F>
>;

export function summarizeAll<T extends object, F extends SummaryKeyFn<T>>(
  summaryFn: F
): TidyFn<T, Prettify<Record<keyof T, SummaryFnOutput<T, F>>>> {
  const _summarizeAll: TidyFn<
    T,
    Prettify<Record<keyof T, SummaryFnOutput<T, F>>>
  > = (items: T[]): Prettify<Record<keyof T, SummaryFnOutput<T, F>>>[] =>
    _summarizeHelper(items, summaryFn);

  return _summarizeAll;
}

/*---- summarizeIf() --------------------------------------------*/
// type is not perfect since it returns all keys of T, but better to have more than less I figure
export function summarizeIf<T extends object, F extends SummaryKeyFn<T>>(
  predicateFn: (vector: Vector<T>) => boolean,
  summaryFn: F
): TidyFn<T, Prettify<Record<keyof T, SummaryFnOutput<T, F>>>> {
  const _summarizeIf: TidyFn<
    T,
    Prettify<Record<keyof T, SummaryFnOutput<T, F>>>
  > = (items: T[]): Prettify<Record<keyof T, SummaryFnOutput<T, F>>>[] =>
    _summarizeHelper(items, summaryFn, predicateFn);

  return _summarizeIf;
}

/*---- summarizeAt() --------------------------------------------*/
export function summarizeAt<
  T extends object,
  Keys extends (keyof T)[],
  F extends SummaryKeyFn<T, Keys[number]>
>(
  keys: Keys,
  summaryFn: F
): TidyFn<T, Prettify<Record<Keys[number], SummaryFnOutput<T, F>>>> {
  const _summarizeAt: TidyFn<
    T,
    Prettify<Record<Keys[number], SummaryFnOutput<T, F>>>
  > = (items: T[]): Prettify<Record<Keys[number], SummaryFnOutput<T, F>>>[] =>
    _summarizeHelper(items, summaryFn, undefined, keys);

  return _summarizeAt;
}
