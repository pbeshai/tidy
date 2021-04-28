/** Tidy math helpers */

/** Compute a fraction while handling common edge cases */
export function rate(
  numerator: number | null | undefined,
  denominator: number | null | undefined,
  allowDivideByZero?: boolean
): number | undefined {
  return numerator == null || denominator == null
    ? undefined
    : denominator === 0 && numerator === 0
    ? 0
    : !allowDivideByZero && denominator === 0
    ? undefined
    : numerator / denominator;
}

export function subtract(
  a: number | null | undefined,
  b: number | null | undefined,
  nullyZero?: boolean
) {
  return a == null || b == null
    ? nullyZero
      ? (a ?? 0) - (b ?? 0)
      : undefined
    : a - b;
}

export function add(
  a: number | null | undefined,
  b: number | null | undefined,
  nullyZero?: boolean
) {
  return a == null || b == null
    ? nullyZero
      ? (a ?? 0) + (b ?? 0)
      : undefined
    : a + b;
}
