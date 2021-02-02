// note prettier is ignored here via .prettierignore
import { TidyFn, TidyGroupExportFn } from './types';

// pipe types not well supported: https://github.com/microsoft/TypeScript/issues/29904
// so manually make types overloaded for up to 10 steps

/**
 * Forms a tidy pipeline that can be called with (items)
 * @param items array of items to manipulate
 * @param fns Tidy functions
 */
export function tidy<T extends object, T1 extends object, T2 extends object, T3 extends object, T4 extends object, T5 extends object, T6 extends object, T7 extends object, T8 extends object, T9 extends object, T10 extends object>(items: T[], f1: TidyFn<T, T1>, f2: TidyFn<T1, T2>, f3: TidyFn<T2, T3>, f4: TidyFn<T3, T4>, f5: TidyFn<T4, T5>, f6: TidyFn<T5, T6>, f7: TidyFn<T6, T7>, f8: TidyFn<T7, T8>, f9: TidyFn<T8, T9>, f10: TidyFn<T9, T10>): T10[];
export function tidy<T extends object, T1 extends object, T2 extends object, T3 extends object, T4 extends object, T5 extends object, T6 extends object, T7 extends object, T8 extends object, T9 extends object, T10 extends object>(items: T[], f1: TidyFn<T, T1>, f2: TidyFn<T1, T2>, f3: TidyFn<T2, T3>, f4: TidyFn<T3, T4>, f5: TidyFn<T4, T5>, f6: TidyFn<T5, T6>, f7: TidyFn<T6, T7>, f8: TidyFn<T7, T8>, f9: TidyFn<T8, T9>, f10: TidyGroupExportFn<T9, T10>): T10;
export function tidy<T extends object, T1 extends object, T2 extends object, T3 extends object, T4 extends object, T5 extends object, T6 extends object, T7 extends object, T8 extends object, T9 extends object>(items: T[], f1: TidyFn<T, T1>, f2: TidyFn<T1, T2>, f3: TidyFn<T2, T3>, f4: TidyFn<T3, T4>, f5: TidyFn<T4, T5>, f6: TidyFn<T5, T6>, f7: TidyFn<T6, T7>, f8: TidyFn<T7, T8>, f9: TidyFn<T8, T9>): T9[];
export function tidy<T extends object, T1 extends object, T2 extends object, T3 extends object, T4 extends object, T5 extends object, T6 extends object, T7 extends object, T8 extends object, T9 extends object>(items: T[], f1: TidyFn<T, T1>, f2: TidyFn<T1, T2>, f3: TidyFn<T2, T3>, f4: TidyFn<T3, T4>, f5: TidyFn<T4, T5>, f6: TidyFn<T5, T6>, f7: TidyFn<T6, T7>, f8: TidyFn<T7, T8>, f9: TidyGroupExportFn<T8, T9>): T9;
export function tidy<T extends object, T1 extends object, T2 extends object, T3 extends object, T4 extends object, T5 extends object, T6 extends object, T7 extends object, T8 extends object>(items: T[], f1: TidyFn<T, T1>, f2: TidyFn<T1, T2>, f3: TidyFn<T2, T3>, f4: TidyFn<T3, T4>, f5: TidyFn<T4, T5>, f6: TidyFn<T5, T6>, f7: TidyFn<T6, T7>, f8: TidyFn<T7, T8>): T8[];
export function tidy<T extends object, T1 extends object, T2 extends object, T3 extends object, T4 extends object, T5 extends object, T6 extends object, T7 extends object, T8 extends object>(items: T[], f1: TidyFn<T, T1>, f2: TidyFn<T1, T2>, f3: TidyFn<T2, T3>, f4: TidyFn<T3, T4>, f5: TidyFn<T4, T5>, f6: TidyFn<T5, T6>, f7: TidyFn<T6, T7>, f8: TidyGroupExportFn<T7, T8>): T8;
export function tidy<T extends object, T1 extends object, T2 extends object, T3 extends object, T4 extends object, T5 extends object, T6 extends object, T7 extends object>(items: T[], f1: TidyFn<T, T1>, f2: TidyFn<T1, T2>, f3: TidyFn<T2, T3>, f4: TidyFn<T3, T4>, f5: TidyFn<T4, T5>, f6: TidyFn<T5, T6>, f7: TidyFn<T6, T7>): T7[];
export function tidy<T extends object, T1 extends object, T2 extends object, T3 extends object, T4 extends object, T5 extends object, T6 extends object, T7 extends object>(items: T[], f1: TidyFn<T, T1>, f2: TidyFn<T1, T2>, f3: TidyFn<T2, T3>, f4: TidyFn<T3, T4>, f5: TidyFn<T4, T5>, f6: TidyFn<T5, T6>, f7: TidyGroupExportFn<T6, T7>): T7;
export function tidy<T extends object, T1 extends object, T2 extends object, T3 extends object, T4 extends object, T5 extends object, T6 extends object>(items: T[], f1: TidyFn<T, T1>, f2: TidyFn<T1, T2>, f3: TidyFn<T2, T3>, f4: TidyFn<T3, T4>, f5: TidyFn<T4, T5>, f6: TidyFn<T5, T6>): T6[];
export function tidy<T extends object, T1 extends object, T2 extends object, T3 extends object, T4 extends object, T5 extends object, T6 extends object>(items: T[], f1: TidyFn<T, T1>, f2: TidyFn<T1, T2>, f3: TidyFn<T2, T3>, f4: TidyFn<T3, T4>, f5: TidyFn<T4, T5>, f6: TidyGroupExportFn<T5, T6>): T6;
export function tidy<T extends object, T1 extends object, T2 extends object, T3 extends object, T4 extends object, T5 extends object>(items: T[], f1: TidyFn<T, T1>, f2: TidyFn<T1, T2>, f3: TidyFn<T2, T3>, f4: TidyFn<T3, T4>, f5: TidyFn<T4, T5> ): T5[];
export function tidy<T extends object, T1 extends object, T2 extends object, T3 extends object, T4 extends object, T5 extends object>(items: T[], f1: TidyFn<T, T1>, f2: TidyFn<T1, T2>, f3: TidyFn<T2, T3>, f4: TidyFn<T3, T4>, f5: TidyGroupExportFn<T4, T5> ): T5;
export function tidy<T extends object, T1 extends object, T2 extends object, T3 extends object, T4 extends object>(items: T[], f1: TidyFn<T, T1>, f2: TidyFn<T1, T2>, f3: TidyFn<T2, T3>, f4: TidyFn<T3, T4>): T4[];
export function tidy<T extends object, T1 extends object, T2 extends object, T3 extends object, T4 extends object>(items: T[], f1: TidyFn<T, T1>, f2: TidyFn<T1, T2>, f3: TidyFn<T2, T3>, f4: TidyGroupExportFn<T3, T4>): T4;
export function tidy<T extends object, T1 extends object, T2 extends object, T3 extends object>(items: T[], f1: TidyFn<T, T1>, f2: TidyFn<T1, T2>, f3: TidyFn<T2, T3>): T3[];
export function tidy<T extends object, T1 extends object, T2 extends object, T3 extends object>(items: T[], f1: TidyFn<T, T1>, f2: TidyFn<T1, T2>, f3: TidyGroupExportFn<T2, T3>): T3;
export function tidy<T extends object, T1 extends object, T2 extends object>(items: T[], f1: TidyFn<T, T1>, f2: TidyFn<T1, T2>): T2[];
export function tidy<T extends object, T1 extends object, T2 extends object>(items: T[], f1: TidyFn<T, T1>, f2: TidyGroupExportFn<T1, T2>): T2;
export function tidy<T extends object, T1 extends object>(items: T[], f1: TidyFn<T, T1>): T1[];
export function tidy<T extends object, T1 extends object>(items: T[], f1: TidyGroupExportFn<T, T1>): T1;
export function tidy<InputT extends object>(
  items: InputT[],
  ...fns: (TidyFn<any, any> | TidyGroupExportFn<any, any>)[]
): any {
  if (typeof items === 'function') {
    throw new Error('You must supply the data as the first argument to tidy()');
  }

  let result: any = items;
  for (const fn of fns) {
    result = fn(result);
  }

  return result;
}
