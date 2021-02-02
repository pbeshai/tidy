import { TidyFn, NonFunctionValue, Key } from './types';
import { A } from 'ts-toolbelt';

type MutateSpecValue<T, O = any> = ((items: T[]) => O[] | O) | NonFunctionValue;
export type MutateSummarySpec<T> = Record<Key, MutateSpecValue<T>>;
export type ResolvedObj<Obj extends Record<Key, MutateSpecValue<any>>> = {
  [K in keyof Obj]: Obj[K] extends (...args: any) => any
    ? ReturnType<Obj[K]> extends any[]
      ? ReturnType<Obj[K]>[number]
      : ReturnType<Obj[K]>
    : Obj[K];
};

type Mutated<T, MSpec extends MutateSummarySpec<T>> = T & ResolvedObj<MSpec>;

type Compute<T> = A.Compute<T>;

/**
 * Mutates items, looking at multiple items at a time to enable summarization.
 * For simpler, item by item mutations, use mutate.
 * @param mutateSpec
 */
export function mutateWithSummary<
  T extends object,
  MSpec extends MutateSummarySpec<T>
>(mutateSpec: MSpec): TidyFn<T, Compute<Mutated<T, MSpec>>> {
  type MutatedT = Mutated<T, MSpec>;
  // use Compute for better intellisense (reveals all keys in obj)
  const _mutate: TidyFn<T, Compute<MutatedT>> = (
    items: T[]
  ): Compute<MutatedT>[] => {
    // create the base items to merge mutated values into
    const mutatedItems: MutatedT[] = items.map((d) => ({ ...d })) as MutatedT[];

    // create vectors for each mutated value
    for (const key in mutateSpec) {
      // convert individual values to a vector of the same value
      // this allows mutate functions to return single numbers and still work
      const mutateSpecValue = mutateSpec[key];
      const mutatedResult =
        typeof mutateSpecValue === 'function'
          ? mutateSpecValue(mutatedItems)
          : mutateSpecValue;
      const mutatedVector =
        mutatedResult?.[Symbol.iterator] && typeof mutatedResult !== 'string'
          ? mutatedResult
          : items.map(() => mutatedResult);

      // merge the mutated vector into the mutated items
      let i = -1;
      for (const mutatedItem of mutatedItems) {
        mutatedItem[key as keyof MutatedT] = mutatedVector[++i];
      }
    }

    return mutatedItems as Compute<MutatedT>[];
  };

  return _mutate;
}
