import { TidyFn, NonFunctionValue, Key } from './types';
import { A } from 'ts-toolbelt';

type MutateSpecValue<T, O = any> = ((item: T) => O) | NonFunctionValue;
export type MutateSpec<T> = Record<Key, MutateSpecValue<T>>;
export type ResolvedObj<Obj extends Record<Key, MutateSpecValue<any>>> = {
  [K in keyof Obj]: Obj[K] extends (...args: any) => any
    ? ReturnType<Obj[K]> extends any[]
      ? ReturnType<Obj[K]>[number]
      : ReturnType<Obj[K]>
    : Obj[K];
};

type Mutated<T, MSpec extends MutateSpec<T>> = T & ResolvedObj<MSpec>;

type Compute<T> = A.Compute<T>;

/**
 * Mutates items, one item at a time. For mutating across multiple items,
 * use mutateWithSummary.
 * @param mutateSpec
 */
export function mutate<T extends object, MSpec extends MutateSpec<T>>(
  mutateSpec: MSpec
): TidyFn<T, Compute<Mutated<T, MSpec>>> {
  type MutatedT = Mutated<T, MSpec>;
  // use Compute for better intellisense (reveals all keys in obj)
  const _mutate: TidyFn<T, Compute<MutatedT>> = (
    items: T[]
  ): Compute<MutatedT>[] => {
    // create the base items to merge mutated values into
    const mutatedItems: MutatedT[] = [];

    // we can update each item completely one at a time, since mutate doesn't
    // support looking across items. Use mutateWithSummary for that.
    for (const item of items) {
      const mutatedItem = { ...item } as MutatedT;

      for (const key in mutateSpec) {
        // get the mutated value for this item (either run the fn or use the constant)
        const mutateSpecValue = mutateSpec[key];
        const mutatedResult =
          typeof mutateSpecValue === 'function'
            ? mutateSpecValue(mutatedItem)
            : mutateSpecValue;

        mutatedItem[key as keyof MutatedT] = mutatedResult;
      }

      mutatedItems.push(mutatedItem);
    }

    return mutatedItems as Compute<MutatedT>[];
  };

  return _mutate;
}
