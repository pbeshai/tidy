import { extent } from 'd3-array';
import { Granularity } from '../types';

/**
 * Create a full sequence given a vector of values
 */
export function vectorSeq(values: number[], period: number = 1): number[] {
  let [min, max] = extent(values) as [number, number];

  const sequence: number[] = [];
  let value = min;
  while (value <= max) {
    sequence.push(value);
    value += period;
  }

  return sequence;
}

/**
 * Create a full sequence given a vector of values
 */
export function vectorSeqDate(
  values: Date[],
  granularity: Granularity = 'day',
  period: number = 1
): Date[] {
  let [min, max] = extent(values) as [Date, Date];

  const sequence: Date[] = [];
  let value = new Date(min);
  while (value <= max) {
    sequence.push(new Date(value));

    // increment date
    if (
      granularity === 'day' ||
      granularity === 'd' ||
      granularity === 'days'
    ) {
      value.setUTCDate(value.getUTCDate() + 1 * period);
    } else if (
      granularity === 'week' ||
      granularity === 'w' ||
      granularity === 'weeks'
    ) {
      value.setUTCDate(value.getUTCDate() + 7 * period);
    } else if (
      granularity === 'month' ||
      granularity === 'm' ||
      granularity === 'months'
    ) {
      value.setUTCMonth(value.getUTCMonth() + 1 * period);
    } else if (
      granularity === 'year' ||
      granularity === 'y' ||
      granularity === 'years'
    ) {
      value.setUTCFullYear(value.getUTCFullYear() + 1 * period);
    } else {
      throw new Error('Invalid granularity for date sequence: ' + granularity);
    }
  }

  return sequence;
}

/**
 * Create a full sequence given a set of data.
 * @param items
 * @param key
 */
export function fullSeq<T extends object>(
  key: keyof T | ((d: T) => number),
  period?: number | null | undefined
): (items: T[]) => number[] {
  return function fullSeqInner(items: T[]): number[] {
    period = period ?? 1;

    const keyFn =
      typeof key === 'function' ? key : (d: T) => (d[key] as unknown) as number;

    return vectorSeq(items.map(keyFn), period);
  };
}

export function fullSeqDate<T extends object>(
  key: keyof T | ((d: T) => Date),
  granularity?: Granularity | null | undefined,
  period?: number | null | undefined
): (items: T[]) => Date[] {
  return function fullSeqDateInner(items: T[]): Date[] {
    granularity = granularity ?? 'day';
    period = period ?? 1;

    const keyFn =
      typeof key === 'function' ? key : (d: T) => (d[key] as unknown) as Date;

    return vectorSeqDate(items.map(keyFn), granularity, period);
  };
}

export function fullSeqDateISOString<T extends object>(
  key: keyof T | ((d: T) => string),
  granularity?: Granularity | null | undefined,
  period?: number | null | undefined
): (items: T[]) => string[] {
  return function fullSeqDateISOStringInner(items: T[]): string[] {
    granularity = granularity ?? 'day';
    period = period ?? 1;

    const keyFn =
      typeof key === 'function' ? key : (d: T) => (d[key] as unknown) as string;

    return vectorSeqDate(
      items.map((d) => new Date(keyFn(d))),
      granularity,
      period
    ).map((date) => date.toISOString());
  };
}
