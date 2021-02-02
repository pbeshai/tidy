import { groupBy } from './groupBy';
import { SingleOrArray } from './helpers/singleOrArray';
import { tidy } from './tidy';
import { Key, TidyFn } from './types';

type PivotOutput = Record<Key, any>;

type PivotWiderOptions<T extends object> = {
  namesFrom: SingleOrArray<keyof T>;
  namesSep?: string;
  valuesFrom: SingleOrArray<keyof T>;
  valuesFill?: any;
  valuesFillMap?: Partial<Record<Key, any>>;
};

export function pivotWider<T extends object>(
  options: PivotWiderOptions<T>
): TidyFn<T, PivotOutput> {
  const _pivotWider: TidyFn<T, PivotOutput> = (items: T[]): PivotOutput[] => {
    const {
      namesFrom,
      valuesFrom,
      valuesFill,
      valuesFillMap,
      namesSep = '_',
    } = options;

    const namesFromKeys: (keyof T)[] = Array.isArray(namesFrom)
      ? namesFrom
      : [namesFrom];
    const valuesFromKeys: (keyof T)[] = Array.isArray(valuesFrom)
      ? valuesFrom
      : [valuesFrom];
    const wider: PivotOutput[] = [];

    if (!items.length) return wider;

    // get all the keys that are left (id columns)
    const idColumns = Object.keys(items[0]).filter(
      (key) =>
        !namesFromKeys.includes(key as keyof T) &&
        !valuesFromKeys.includes(key as keyof T)
    ) as (keyof T)[];

    // get all possibilities for the name properties so we can fill them
    const nameValuesMap: any = {};
    for (const item of items) {
      for (const nameKey of namesFromKeys) {
        if (nameValuesMap[nameKey] == null) {
          nameValuesMap[nameKey] = {};
        }
        nameValuesMap[nameKey][item[nameKey]] = true;
      }
    }

    const nameValuesLists: string[][] = [];
    for (const nameKey in nameValuesMap) {
      nameValuesLists.push(Object.keys(nameValuesMap[nameKey]));
    }

    // prefill values if valuesFill is set for each name values combination
    const baseWideObj: any = {};
    const combos = makeCombinations(namesSep, nameValuesLists);

    for (const nameKey of combos) {
      if (valuesFromKeys.length === 1) {
        baseWideObj[nameKey] =
          valuesFillMap != null
            ? valuesFillMap[valuesFromKeys[0] as any]
            : valuesFill;
        continue;
      }

      for (const valueKey of valuesFromKeys) {
        baseWideObj[`${valueKey}${namesSep}${nameKey}`] =
          valuesFillMap != null ? valuesFillMap[valueKey as any] : valuesFill;
      }
    }

    // given a collection of items, widen
    function widenItems(items: T[]) {
      if (!items.length) return [];

      const wide: PivotOutput = { ...baseWideObj };

      // add the id columns (same for each object, so just look at first)
      for (const idKey of idColumns) {
        wide[idKey as keyof PivotOutput] = items[0][idKey];
      }

      // go through each object and widen their values
      for (const item of items) {
        const nameKey = namesFromKeys.map((key) => item[key]).join(namesSep);

        if (valuesFromKeys.length === 1) {
          wide[nameKey] = item[valuesFromKeys[0]];
          continue;
        }

        for (const valueKey of valuesFromKeys) {
          wide[`${valueKey}${namesSep}${nameKey}`] = item[valueKey];
        }
      }
      return [wide];
    }

    // no id columns, don't do any grouping, just widen and return
    if (!idColumns.length) {
      return widenItems(items);
    }

    // group by the id columns
    // for each group, widen/flatten to a single value
    const finish = tidy(items, groupBy(idColumns, [widenItems]));
    return finish;
  };

  return _pivotWider;
}

/*
  Recursively compute key combinations
*/
function makeCombinations(separator = '_', arrays: string[][]): string[] {
  function combine(
    accum: string[],
    prefix: string | null,
    remainingArrays: string[][]
  ) {
    if (!remainingArrays.length && prefix != null) {
      accum.push(prefix);
      return;
    }

    const array = remainingArrays[0];
    const newRemainingArrays = remainingArrays.slice(1);
    for (const item of array) {
      combine(
        accum,
        prefix == null ? item : `${prefix}${separator}${item}`,
        newRemainingArrays
      );
    }
  }

  const result: string[] = [];
  combine(result, null, arrays);
  return result;
}
