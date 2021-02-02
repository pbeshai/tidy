import { O } from 'ts-toolbelt';
import { TidyFn } from './types';

type Spec<T extends object> = {
  [K in keyof T]: T[K];
};

type Output<T extends object, ReplaceSpec extends Partial<Spec<T>>> = O.Merge<
  Omit<T, keyof ReplaceSpec>,
  {
    [K in keyof ReplaceSpec]: K extends keyof T
      ? Exclude<T[K], null | undefined> | ReplaceSpec[K]
      : ReplaceSpec[K];
  }
>;

/**
 * Replaces nully values with what is specified in the spec
 */
export function replaceNully<
  T extends object,
  ReplaceSpec extends Spec<Partial<T>> = Spec<Partial<T>>
>(replaceSpec: ReplaceSpec): TidyFn<T, Output<T, ReplaceSpec>> {
  const _replaceNully: TidyFn<T, Output<T, ReplaceSpec>> = (
    items: T[]
  ): Output<T, ReplaceSpec>[] => {
    const replacedItems: Output<T, ReplaceSpec>[] = [];

    for (const d of items) {
      const obj = { ...d } as any;
      for (const key in replaceSpec) {
        if (obj[(key as unknown) as keyof T] == null) {
          obj[(key as unknown) as keyof T] = replaceSpec[key] as any;
        }
      }
      replacedItems.push(obj);
    }

    return replacedItems;
  };

  return _replaceNully;
}
