import { mutate, MutateSpec } from './mutate';
import {
  SummarizeSpec,
  summarize,
  summarizeAll,
  summarizeAt,
  summarizeIf,
  SummaryKeyFn,
} from './summarize';
import { TidyFn, Vector } from './types';

/**
 * Adds a summarized total row
 */
export function total<
  T extends object,
  SummarizedSpec extends SummarizeSpec<T> = SummarizeSpec<T>,
  MutSpec extends MutateSpec<T> = MutateSpec<T>
>(summarizeSpec: SummarizedSpec, mutateSpec: MutSpec): TidyFn<T> {
  const _total: TidyFn<T, T> = (items: T[]): T[] => {
    const summarized = summarize<T, SummarizedSpec>(summarizeSpec)(items);
    const mutated = mutate<T, MutSpec>(mutateSpec)(summarized as T[]) as T[];
    return [...items, ...mutated];
  };

  return _total;
}

// ----------------------------------------------------------------------------

/**
 * Adds a summarized total row
 */
export function totalAll<
  T extends object,
  F extends SummaryKeyFn<T>,
  MutSpec extends MutateSpec<T> = MutateSpec<T>
>(summaryFn: F, mutateSpec: MutSpec): TidyFn<T> {
  const _totalAll: TidyFn<T, T> = (items: T[]): T[] => {
    const summarized = summarizeAll<T, F>(summaryFn)(items);
    const mutated = mutate<T, MutSpec>(mutateSpec)(summarized as T[]) as T[];
    return [...items, ...mutated];
  };

  return _totalAll;
}

// ----------------------------------------------------------------------------

/**
 * Adds a summarized total row
 */
export function totalIf<
  T extends object,
  F extends SummaryKeyFn<T>,
  MutSpec extends MutateSpec<T> = MutateSpec<T>
>(
  predicateFn: (vector: Vector<T>) => boolean,
  summaryFn: F,
  mutateSpec: MutSpec
): TidyFn<T> {
  const _totalIf: TidyFn<T, T> = (items: T[]): T[] => {
    const summarized = summarizeIf<T, F>(predicateFn, summaryFn)(items);
    const mutated = mutate<T, MutSpec>(mutateSpec)(summarized as T[]) as T[];
    return [...items, ...mutated];
  };

  return _totalIf;
}

// ----------------------------------------------------------------------------

/**
 * Adds a summarized total row
 */
export function totalAt<
  T extends object,
  Keys extends (keyof T)[],
  F extends SummaryKeyFn<T, Keys[number]>,
  MutSpec extends MutateSpec<T> = MutateSpec<T>
>(keys: Keys, summaryFn: F, mutateSpec: MutSpec): TidyFn<T> {
  const _totalAt: TidyFn<T, T> = (items: T[]): T[] => {
    const summarized = summarizeAt<T, Keys, F>(keys, summaryFn)(items);
    const mutated = mutate<T, MutSpec>(mutateSpec)(summarized as T[]) as T[];
    return [...items, ...mutated];
  };

  return _totalAt;
}
