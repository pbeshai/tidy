# Vector Functions API Reference

Vector functions produce an array of values equal in length to the input collection. They operate across items (not one at a time), enabling running totals, lookbacks, sliding windows, and row numbering.

**CRITICAL:** Vector functions go inside `mutateWithSummary()`, NOT inside `mutate()`. `mutate` passes items one at a time; `mutateWithSummary` passes the full array. Using vector functions inside `mutate()` will silently produce wrong results.

```js
import { tidy, mutateWithSummary, cumsum, lag, lead, roll, rowNumber } from '@tidyjs/tidy';
```

---

<!-- keywords: mutateWithSummary, mutate summary, vector mutate, cross-item, broadcast, array function -->
## mutateWithSummary

Add or replace columns using functions that receive the full array of items.

**Signature:** `mutateWithSummary(spec: Record<string, (items[]) => value[] | value | NonFunctionValue>)`
**Goes inside:** `tidy()`

### Parameters
- `spec` -- an object where each key is a new (or existing) column name and each value is one of:
  - A function `(items: T[]) => T[keyof T][] | T[keyof T]` -- receives the full array. If it returns an **array**, each element maps to the corresponding item. If it returns a **single value**, that value is broadcast to all items.
  - A literal value (number, string, etc.) -- broadcast to all items.

### Example
```js
const data = [
  { name: 'a', val: 1 },
  { name: 'b', val: 2 },
  { name: 'c', val: 3 },
];

tidy(data, mutateWithSummary({
  // array return: each element maps to the corresponding row
  doubled: (items) => items.map(d => d.val * 2),
  // single value return: broadcast to every row
  total: (items) => items.reduce((s, d) => s + d.val, 0),
  // literal value: broadcast to every row
  flag: true,
}));
// output:
// [
//   { name: 'a', val: 1, doubled: 2, total: 6, flag: true },
//   { name: 'b', val: 2, doubled: 4, total: 6, flag: true },
//   { name: 'c', val: 3, doubled: 6, total: 6, flag: true },
// ]
```

### Why not mutate?
`mutate` processes items one at a time: `(item, index) => value`. It cannot look at other rows. Vector and summary functions need the full array, so they must go inside `mutateWithSummary`.

---

<!-- keywords: cumsum, cumulative sum, running total, running sum -->
## cumsum

Cumulative sum. Returns an array of running totals (uses full-precision floating-point summation).

**Signature:** `cumsum(key: keyof T | (d: T, index: number, array: Iterable<T>) => number | null | undefined)`
**Goes inside:** `mutateWithSummary()`

### Parameters
- `key` -- a property name (string) or accessor function returning a number. `null`/`undefined` values are skipped (running total stays the same).

### Example
```js
const data = [
  { item: 'a', val: 3 },
  { item: 'b', val: 1 },
  { item: 'c', val: null },
  { item: 'd', val: 5 },
];

tidy(data, mutateWithSummary({
  running: cumsum('val'),
}));
// output:
// [
//   { item: 'a', val: 3,    running: 3 },
//   { item: 'b', val: 1,    running: 4 },
//   { item: 'c', val: null, running: 4 },
//   { item: 'd', val: 5,    running: 9 },
// ]
```

---

<!-- keywords: lag, previous value, lookback, offset, delta, difference -->
## lag

Value from N rows before the current row. Useful for computing deltas (current minus previous).

**Signature:** `lag(key: keyof T | (d: T, index: number, array: Iterable<T>) => any, options?)`
**Goes inside:** `mutateWithSummary()`

### Parameters
- `key` -- a property name or accessor function.
- `options` (optional):
  - `n` (number, default `1`) -- how many rows back to look.
  - `default` (any, default `undefined`) -- fill value for the first N items where no previous row exists.

### Example
```js
const data = [
  { day: 1, val: 10 },
  { day: 2, val: 15 },
  { day: 3, val: 12 },
];

tidy(data, mutateWithSummary({
  prev: lag('val'),
  prev0: lag('val', { default: 0 }),
  prev2: lag('val', { n: 2 }),
}));
// output:
// [
//   { day: 1, val: 10, prev: undefined, prev0: 0,  prev2: undefined },
//   { day: 2, val: 15, prev: 10,        prev0: 10, prev2: undefined },
//   { day: 3, val: 12, prev: 15,        prev0: 15, prev2: 10 },
// ]
```

---

<!-- keywords: lead, next value, lookahead, forward, offset -->
## lead

Value from N rows after the current row. Useful for computing forward differences.

**Signature:** `lead(key: keyof T | (d: T, index: number, array: Iterable<T>) => any, options?)`
**Goes inside:** `mutateWithSummary()`

### Parameters
- `key` -- a property name or accessor function.
- `options` (optional):
  - `n` (number, default `1`) -- how many rows ahead to look.
  - `default` (any, default `undefined`) -- fill value for the last N items where no next row exists.

### Example
```js
const data = [
  { day: 1, val: 10 },
  { day: 2, val: 15 },
  { day: 3, val: 12 },
];

tidy(data, mutateWithSummary({
  next: lead('val'),
  next0: lead('val', { default: 0 }),
  next2: lead('val', { n: 2 }),
}));
// output:
// [
//   { day: 1, val: 10, next: 15,        next0: 15, next2: 12 },
//   { day: 2, val: 15, next: 12,        next0: 12, next2: undefined },
//   { day: 3, val: 12, next: undefined, next0: 0,  next2: undefined },
// ]
```

---

<!-- keywords: roll, rolling, sliding window, moving average, running mean, window function -->
## roll

Rolling/sliding window operation. Applies a summary function to a window of items as it slides across the array.

**Signature:** `roll(width: number, rollFn: (itemsInWindow: T[], endIndex: number) => any, options?)`
**Goes inside:** `mutateWithSummary()`

### Parameters
- `width` (number) -- the window size (number of items).
- `rollFn` -- a function `(itemsInWindow, endIndex) => value` applied to each window. Typically a summary function like `mean('col')`.
- `options` (optional):
  - `partial` (boolean, default `false`) -- if `true`, compute for windows smaller than `width` at the edges. If `false`, those positions are `undefined`.
  - `align` (`'right'` | `'center'` | `'left'`, default `'right'`) -- window alignment relative to the current row:
    - `'right'`: current row is the last item in the window (looks back).
    - `'left'`: current row is the first item in the window (looks forward).
    - `'center'`: current row is the center of the window.

### Example
```js
import { mean } from '@tidyjs/tidy';

const data = [
  { day: 1, val: 3 },
  { day: 2, val: 1 },
  { day: 3, val: 3 },
  { day: 4, val: 1 },
  { day: 5, val: 7 },
];

tidy(data, mutateWithSummary({
  avg3: roll(3, mean('val')),
  avg3p: roll(3, mean('val'), { partial: true }),
}));
// output:
// [
//   { day: 1, val: 3, avg3: undefined,    avg3p: 3/1 },  // partial
//   { day: 2, val: 1, avg3: undefined,    avg3p: 4/2 },  // partial
//   { day: 3, val: 3, avg3: 7/3,          avg3p: 7/3 },
//   { day: 4, val: 1, avg3: 5/3,          avg3p: 5/3 },
//   { day: 5, val: 7, avg3: 11/3,         avg3p: 11/3 },
// ]
```

---

<!-- keywords: rowNumber, row number, index, sequential, numbering -->
## rowNumber

Assigns sequential row numbers starting from 0 (configurable).

**Signature:** `rowNumber(options?)`
**Goes inside:** `mutateWithSummary()`

### Parameters
- `options` (optional):
  - `startAt` (number, default `0`) -- the number to assign to the first row.

### Example
```js
const data = [
  { name: 'a', val: 10 },
  { name: 'b', val: 20 },
  { name: 'c', val: 30 },
];

tidy(data, mutateWithSummary({
  row: rowNumber(),
  row1: rowNumber({ startAt: 1 }),
}));
// output:
// [
//   { name: 'a', val: 10, row: 0, row1: 1 },
//   { name: 'b', val: 20, row: 1, row1: 2 },
//   { name: 'c', val: 30, row: 2, row1: 3 },
// ]
```
