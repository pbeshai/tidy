import { TidyFn } from './types';
import { mutate, MutateSpec, ResolvedObj } from './mutate';
import { select } from './select';
import { Prettify } from './type-utils';

/**
 * Transmutes items
 * @param mutateSpec
 */
export function transmute<T extends object, MSpec extends MutateSpec<T>>(
  mutateSpec: MSpec
): TidyFn<T, Prettify<ResolvedObj<MSpec>>> {
  const _transmute: TidyFn<T, Prettify<ResolvedObj<MSpec>>> = (items: T[]) => {
    const mutated = mutate<T, MSpec>(mutateSpec)(items);
    const picked = select(Object.keys(mutateSpec) as string[])(mutated);
    return picked as Prettify<ResolvedObj<MSpec>>[];
  };

  return _transmute;
}
