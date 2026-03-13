import { TidyFn } from './types';
import { Merge, KeysMatching } from './type-utils';

type RenameSpec<T> = Partial<
  {
    [K in keyof T]: string;
  }
>;

type OutputT<T extends object, Spec extends RenameSpec<T>> = Merge<
  Omit<T, keyof Spec>,
  {
    [NewKey in Exclude<Spec[keyof Spec], undefined>]: T[KeysMatching<
      Spec,
      NewKey
    > &
      keyof T];
  }
>;

/**
 * Renames properties/columns in collection
 *
 * @param renameSpec Mapping of current name to new name { currKey: newKey }
 */
export function rename<T extends object, Spec extends RenameSpec<T>>(
  renameSpec: Spec
): TidyFn<T, OutputT<T, Spec>> {
  type Output = OutputT<T, Spec>;
  const _rename: TidyFn<T, Output> = (items: T[]): Output[] => {
    return items.map((d) => {
      const mapped = {} as any;
      const keys = Object.keys(d) as (keyof T)[];
      for (const key of keys) {
        const newKey: keyof Output =
          ((renameSpec[key] as unknown) as keyof Output) ?? key;
        mapped[newKey] = d[key];
      }

      return mapped as Output;
    });
  };

  return _rename;
}
