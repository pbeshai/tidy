/**
 * Helper to get keys from a collection of items.
 * For now, it naively just looks at the first item, but a more complete
 * solution involves looking at all of them (in case keys are omitted).
 * This isn't very efficient though, so perhaps there's a future where
 * the keys are stored sneakily on the object somewhere and that set
 * is updated after each tidy fn is called (if we can do it efficiently)
 *
 * Or perhaps this function can be memoized in a smart way where we don't
 * call it more than necessary?
 */
export function keysFromItems<T extends object>(items: T[]): (keyof T)[] {
  if (items.length < 1) return [];
  const keys = Object.keys(items[0]) as (keyof T)[];
  return keys;
}
