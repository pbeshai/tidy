import { SingleOrArray } from './helpers/singleOrArray';
import { TidyFn, Key } from './types';
import { processSelectors } from './select';

type PivotLongerOptions = {
  cols?: any; // Typescript gives me max call stack failed if I use KeysInput from `select`
  namesTo: SingleOrArray<Key>;
  namesSep?: string;
  valuesTo: SingleOrArray<Key>;
};

type PivotOutput = Record<Key, any>;

export function pivotLonger<T extends object>(
  options: PivotLongerOptions
): TidyFn<T, PivotOutput> {
  const _pivotLonger: TidyFn<T, PivotOutput> = (items: T[]): PivotOutput[] => {
    const { namesTo, valuesTo, namesSep = '_' } = options;
    const cols = options.cols ?? [];
    const colsKeys = processSelectors(items, cols) as (keyof T)[];

    const namesToKeys = Array.isArray(namesTo) ? namesTo : [namesTo];
    const valuesToKeys = Array.isArray(valuesTo) ? valuesTo : [valuesTo];
    const hasMultipleNamesTo = namesToKeys.length > 1;
    const hasMultipleValuesTo = valuesToKeys.length > 1;

    const longer: PivotOutput[] = [];

    if (!items.length) return longer;

    // keys not included in colsKeys must be kept (same for all items)
    const colsKeysSet = new Set<keyof T>(colsKeys);
    const remainingKeys = Object.keys(items[0]).filter(
      (key) => !colsKeysSet.has(key as keyof T)
    ) as (keyof T)[];

    // remove the `${valueKey}_` prefix when we have multiple values
    // (invariant across items, compute once)
    const nameValueKeysWithoutValuePrefix = hasMultipleValuesTo
      ? Array.from(
          new Set(
            colsKeys.map((key) =>
              (key as string).substring((key as string).indexOf(namesSep) + 1)
            )
          )
        )
      : colsKeys;

    // pre-compute split parts for each nameValue (invariant across items)
    const nameValuePartsMap = hasMultipleNamesTo
      ? new Map(
          (nameValueKeysWithoutValuePrefix as string[]).map((nv) => [
            nv,
            nv.split(namesSep),
          ])
        )
      : null;

    // pre-compute item keys for each nameValue+valueKey combination
    const itemKeysMap = hasMultipleValuesTo
      ? new Map(
          (nameValueKeysWithoutValuePrefix as string[]).map((nv) => [
            nv,
            valuesToKeys.map((vk) => `${String(vk)}${namesSep}${String(nv)}`),
          ])
        )
      : null;

    // expand each item into multiple items
    for (const item of items) {
      // the keys not in `cols` are the same for each row
      const baseObj = {} as PivotOutput;
      for (const key of remainingKeys) {
        baseObj[key as keyof PivotOutput] = item[key];
      }

      // e.g. `nameValue` or `nameValue1_nameValue2`
      for (const nameValue of nameValueKeysWithoutValuePrefix) {
        const entryObj = { ...baseObj };
        const nameValueParts = nameValuePartsMap
          ? nameValuePartsMap.get(nameValue as string)!
          : [nameValue];
        const itemKeys = itemKeysMap
          ? itemKeysMap.get(nameValue as string)!
          : null;

        for (let vi = 0; vi < valuesToKeys.length; vi++) {
          const valueKey = valuesToKeys[vi];
          const itemKey = itemKeys ? itemKeys[vi] : nameValue;

          let i = 0;
          for (const nameKey of namesToKeys) {
            const nameValuePart = nameValueParts[i++];
            entryObj[nameKey] = nameValuePart;
            entryObj[valueKey] = item[itemKey as keyof T];
          }
        }

        longer.push(entryObj);
      }
    }

    return longer;
  };

  return _pivotLonger;
}
