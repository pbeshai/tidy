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

    // expand each item into multiple items
    for (const item of items) {
      // keys not included in colsKeys must be kept
      const remainingKeys = Object.keys(item).filter(
        (key) => !colsKeys.includes(key as keyof T)
      ) as (keyof T)[];

      // the keys not in `cols` are the same for each row
      const baseObj = {} as PivotOutput;
      for (const key of remainingKeys) {
        baseObj[key as keyof PivotOutput] = item[key];
      }

      // remove the `${valueKey}_` prefix when we have multiple values
      const nameValueKeysWithoutValuePrefix = hasMultipleValuesTo
        ? Array.from(
            new Set(
              colsKeys.map((key) =>
                (key as string).substring((key as string).indexOf(namesSep) + 1)
              )
            )
          )
        : colsKeys;

      // e.g. `nameValue` or `nameValue1_nameValue2`
      for (const nameValue of nameValueKeysWithoutValuePrefix) {
        const entryObj = { ...baseObj };
        for (const valueKey of valuesToKeys) {
          // e.g. `valueKey_nameValue1_nameValue2`
          const itemKey = hasMultipleValuesTo
            ? `${valueKey}${namesSep}${nameValue}`
            : nameValue;
          const nameValueParts = hasMultipleNamesTo
            ? (nameValue as string).split(namesSep)
            : [nameValue];

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
