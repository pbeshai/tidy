import { Datum, TidyFn, Key } from './types';
import { singleOrArray } from './helpers/singleOrArray';
import { everything } from './selectors/everything';
import { O, U } from 'ts-toolbelt';

type DropKey<T extends Datum> = keyof T extends string | number
  ? `-${keyof T}`
  : never;
// type KeysInput1<T> = readonly (keyof T)[] | keyof T;
export type KeysInput<T> =
  | (Key | ((items: T[]) => Key[]))[]
  | readonly DropKey<T>[]
  | readonly (keyof T)[]
  | DropKey<T>
  | keyof T;

type Output<
  T extends object,
  KS extends KeysInput<T>
  // is it an array of drop keys?
> = KS extends readonly DropKey<T>[]
  ? O.Pick<
      T,
      {
        [TK in keyof T]: `-${U.Intersect<TK, string>}` extends KS[number]
          ? never
          : TK;
      }[keyof T]
    >
  : // is an array of keys?
  KS extends readonly Key[]
  ? O.Pick<T, KS[number]>
  : // is a single drop key?
  KS extends DropKey<T>
  ? O.Pick<
      T,
      {
        [TK in keyof T]: `-${U.Intersect<TK, string>}` extends KS ? never : TK;
      }[keyof T]
    >
  : // is a single key?
  KS extends Key
  ? O.Pick<T, U.Intersect<KS, keyof T>>
  : // any other case, just be dumb and say T was returned
    T;

export function processSelectors<T extends object, Keys extends KeysInput<T>>(
  items: T[],
  selectKeys: Keys
): string[] {
  let processedSelectKeys: string[] = [];
  // expand them all to a flat list of keys
  for (const keyInput of singleOrArray(selectKeys as any)) {
    if (typeof keyInput === 'function') {
      processedSelectKeys.push(...(keyInput(items) as string[]));
    } else {
      processedSelectKeys.push(keyInput);
    }
  }

  // if the first key is negative, add in everything at the front
  if (processedSelectKeys.length && processedSelectKeys[0][0] === '-') {
    processedSelectKeys = [...everything()(items), ...processedSelectKeys];
  }

  const negationMap: any = {};
  const keysWithoutNegations = [];
  // go through the list backwards and remove negations
  for (let k = processedSelectKeys.length - 1; k >= 0; k--) {
    const key: any = processedSelectKeys[k];
    if (key[0] === '-') {
      negationMap[key.substring(1)] = true;
      continue;
    }
    if (negationMap[key]) {
      negationMap[key] = false;
      continue;
    }
    keysWithoutNegations.unshift(key);
  }

  // remove duplicates
  processedSelectKeys = Array.from(new Set(keysWithoutNegations));

  return processedSelectKeys;
}

/**
 * selects subparts of the objects (aka pick)
 * @param selectFn Returns true to keep the item, false to select out
 */
// export function select<T extends object, Keys extends SingleOrArray<Key | ((items: T[]) => (keyof T)[])>>(
export function select<T extends object, Keys extends KeysInput<T>>(
  selectKeys: Keys
): TidyFn<T, Output<T, Keys>> {
  type OutputT = Output<T, Keys>;
  const _select: TidyFn<T, OutputT> = (items: T[]): OutputT[] => {
    let processedSelectKeys: string[] = processSelectors(items, selectKeys);

    if (!processedSelectKeys.length) return items as OutputT[];

    // use the processed keys to create reduced objects
    return items.map((d: T) => {
      const mapped: any = {};
      for (const key of processedSelectKeys) {
        mapped[key] = d[key as keyof T];
      }

      return mapped;
    });
  };

  return _select;
}
