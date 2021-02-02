export type SingleOrArray<T> = T | T[];

/**
 * Given an arg that may or may not be an array, make it an array if it isn't one.
 */
export function singleOrArray<T>(d: SingleOrArray<T> | null | undefined): T[] {
  return d == null ? [] : Array.isArray(d) ? d : [d];
}
