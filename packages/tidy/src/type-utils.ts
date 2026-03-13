/**
 * Flatten an intersection into a plain object type for better IntelliSense.
 * Replaces A.Compute from ts-toolbelt.
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

/**
 * Merge two object types where A's properties take precedence over B's.
 * Produces a flat object type (no leftover intersections) for clean
 * resolution in both tsc and tsgo.
 * Replaces O.Merge from ts-toolbelt (where first arg wins).
 */
export type Merge<A, B> = Prettify<Omit<B, keyof A> & A>;

/**
 * Find keys of T whose value type extends V.
 * Replaces O.SelectKeys from ts-toolbelt.
 */
export type KeysMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];
