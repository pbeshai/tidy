# tidyjs Core API Reference

> AI-optimized reference for the core tidy verbs. These functions go directly inside `tidy()` pipelines.
> Import: `import { tidy, filter, mutate, transmute, arrange, asc, desc, fixedOrder, select, distinct, rename, when, debug, map } from '@tidyjs/tidy'`

---

<!-- keywords: tidy, pipeline, pipe, chain, flow -->
## tidy

Run a pipeline of tidy functions on a flat array of objects.

**Signature:** `tidy(items, ...fns) => T[]`

### Parameters
- `items` -- the input array of objects (`T[]`). Must NOT be a function (throws if it is).
- `...fns` -- any number of tidy functions to apply sequentially. Output of each is input to the next. Falsy values are skipped.

### Behavior
- Supports up to 10 chained functions with full TypeScript inference.
- If the last function is a `groupBy` with an export option, the return type matches the export shape (not necessarily an array).
- Common mistake: passing a function as the first argument instead of data throws `"You must supply the data as the first argument to tidy()"`.

### Example
```js
const data = [
  { str: 'foo', value: 3 },
  { str: 'bar', value: 1 },
  { str: 'bar', value: 7 },
];

tidy(data,
  filter((d) => d.value > 1),
  arrange('value')
)
// => [{ str: 'foo', value: 3 }, { str: 'bar', value: 7 }]
```

---

<!-- keywords: filter, where, predicate, filterFn, keep, remove rows -->
## filter

Keep only items where the predicate returns true. Equivalent to `Array.prototype.filter`.

**Signature:** `filter(filterFn) => TidyFn<T>`
**Goes inside:** `tidy()` pipeline

### Parameters
- `filterFn` -- `(item: T, index: number, array: T[]) => boolean`. Returns true to keep the item.

### Example
```js
const data = [{ value: 1 }, { value: 2 }, { value: 3 }];

tidy(data, filter((d) => d.value > 1))
// => [{ value: 2 }, { value: 3 }]
```

---

<!-- keywords: mutate, add column, modify, transform, mutateSpec, computed column -->
## mutate

Add or modify columns on each item. Processes items one at a time.

**Signature:** `mutate(mutateSpec) => TidyFn<T, Mutated<T>>`
**Goes inside:** `tidy()` pipeline

### Parameters
- `mutateSpec` -- an object `{ [key]: value | (item, index, array) => value }`.
  - If value is a **function**, called as `(item: T, index: number, array: Iterable<T>) => any` per item.
  - If value is a **non-function**, assigned directly to every item.
  - Key order matters: later keys can reference values set by earlier keys in the same spec.

### Behavior
- Each item is shallow-copied (`{ ...item }`) before mutation; the original array is not modified.
- The mutate function receives the **already-mutated item** (with earlier keys applied), the index, and the mutated array.
- For mutations that need to look across multiple items (e.g. running totals), use `mutateWithSummary` instead.

### Example
```js
const data = [
  { str: 'foo', value: 3 },
  { str: 'bar', value: 1 },
];

tidy(data, mutate({
  x2: (d) => d.value * 2,
  x4: (d) => d.x2 * 2,   // references x2 from above
  constant: 99,
}))
// => [
//   { str: 'foo', value: 3, x2: 6, x4: 12, constant: 99 },
//   { str: 'bar', value: 1, x2: 2, x4: 4, constant: 99 },
// ]
```

---

<!-- keywords: transmute, mutate and select, drop columns, keep only new columns -->
## transmute

Like `mutate`, but drops all columns not specified in the spec. Internally runs `mutate` then `select` on the spec keys.

**Signature:** `transmute(mutateSpec) => TidyFn<T, ResolvedObj<MSpec>>`
**Goes inside:** `tidy()` pipeline

### Parameters
- `mutateSpec` -- same as `mutate`. Object `{ [key]: value | (item, index, array) => value }`.

### Example
```js
const data = [
  { str: 'foo', value: 3 },
  { str: 'bar', value: 1 },
];

tidy(data, transmute({
  value_x2: (d) => d.value * 2,
  value_x4: (d) => d.value_x2 * 2,
}))
// => [
//   { value_x2: 6, value_x4: 12 },
//   { value_x2: 2, value_x4: 4 },
// ]
```

---

<!-- keywords: arrange, sort, order, asc, desc, fixedOrder, comparator, ascending, descending -->
## arrange

Sort items by keys or comparator functions.

**Signature:** `arrange(comparators) => TidyFn<T>`
**Goes inside:** `tidy()` pipeline
**Alias:** `sort`

### Parameters
- `comparators` -- a single value or array of:
  - `string` (key name) -- auto-promoted to `asc(key)`.
  - `(d: T) => any` (single-arg accessor) -- auto-promoted to `asc(accessor)`.
  - `(a: T, b: T) => number` (two-arg comparator) -- used directly.

### Sorting helpers

- **`asc(key | accessor)`** -- ascending comparator. Nulls/undefined/NaN sort last.
- **`desc(key | accessor)`** -- descending comparator. Nulls/undefined/NaN sort last.
- **`fixedOrder(key, order, options?)`** -- sort values by a predefined order array.
  - `key` -- string key or accessor function.
  - `order` -- array of values in desired order.
  - `options.position` -- `'start'` (default) or `'end'`. Items not in the order array appear at the opposite end.

### Example
```js
const data = [
  { str: 'foo', value: 3 },
  { str: 'bar', value: 5 },
  { str: 'bar', value: 1 },
];

tidy(data, arrange(['str', desc('value')]))
// => [
//   { str: 'bar', value: 5 },
//   { str: 'bar', value: 1 },
//   { str: 'foo', value: 3 },
// ]

tidy(data, arrange([fixedOrder('str', ['foo', 'bar'])]))
// => [
//   { str: 'foo', value: 3 },
//   { str: 'bar', value: 5 },
//   { str: 'bar', value: 1 },
// ]
```

---

<!-- keywords: select, pick, columns, drop, omit, negate, selectors, everything, startsWith, endsWith, contains, matches, negate -->
## select

Pick or drop columns from items. Supports selector functions and `-` prefix negation.

**Signature:** `select(selectKeys) => TidyFn<T, Pick<T, ...>>`
**Goes inside:** `tidy()` pipeline
**Alias:** `pick`

### Parameters
- `selectKeys` -- a single key, or an array of:
  - `string` -- a key name to include.
  - `'-keyName'` -- a key prefixed with `-` to exclude.
  - `(items: T[]) => string[]` -- a selector function (e.g. `everything()`, `startsWith('foo')`, `contains('val')`, `matches(/regex/)`, `numRange('x', [1,3])`).

### Behavior
- If the first key starts with `-`, an implicit `everything()` is prepended (so `-foo` means "all keys except foo").
- Negations cancel out inclusions: `['a', 'b', '-b']` selects only `a`.
- Duplicates are removed.

### Example
```js
const data = [
  { foo: 1, bar: 2, baz: 3, qux: 4 },
];

tidy(data, select(['foo', 'bar']))
// => [{ foo: 1, bar: 2 }]

tidy(data, select(['-baz', '-qux']))
// => [{ foo: 1, bar: 2 }]

tidy(data, select([startsWith('b'), '-baz']))
// => [{ bar: 2 }]
```

---

<!-- keywords: distinct, unique, deduplicate, dedup, remove duplicates -->
## distinct

Remove items with duplicate values for the specified keys. Keeps the first occurrence.

**Signature:** `distinct(keys?) => TidyFn<T>`
**Goes inside:** `tidy()` pipeline

### Parameters
- `keys` (optional) -- a single key/accessor or array of keys/accessors:
  - `string` -- key name.
  - `(item: T) => any` -- accessor function.
  - If omitted or empty, uses strict reference equality on the whole item.

### Example
```js
const data = [
  { str: 'foo', value: 1 },
  { str: 'foo', value: 3 },
  { str: 'foo', value: 3 },
  { str: 'bar', value: 1 },
];

tidy(data, distinct(['str', 'value']))
// => [
//   { str: 'foo', value: 1 },
//   { str: 'foo', value: 3 },
//   { str: 'bar', value: 1 },
// ]
```

---

<!-- keywords: rename, rename columns, rename keys, renameSpec -->
## rename

Rename keys in each item. Non-renamed keys are preserved.

**Signature:** `rename(renameSpec) => TidyFn<T, OutputT>`
**Goes inside:** `tidy()` pipeline

### Parameters
- `renameSpec` -- `{ [oldKey]: 'newKey' }`. Maps existing key names to new names.

### Example
```js
const data = [
  { a: 1, b: 'b10', c: 100 },
  { a: 2, b: 'b20', c: 200 },
];

tidy(data, rename({ b: 'label', c: 'score' }))
// => [
//   { a: 1, label: 'b10', score: 100 },
//   { a: 2, label: 'b20', score: 200 },
// ]
```

---

<!-- keywords: when, conditional, if, predicate, branch, conditional pipeline -->
## when

Conditionally run a sub-pipeline. If the predicate is false, items pass through unchanged.

**Signature:** `when(predicate, fns) => TidyFn<T>`
**Goes inside:** `tidy()` pipeline

### Parameters
- `predicate` -- `boolean | (items: T[]) => boolean`. The condition to evaluate.
- `fns` -- `TidyFn[]`. Array of tidy functions to run when the predicate is true. Executed as a `tidy()` sub-pipeline.

### Example
```js
const data = [{ x: 1 }, { x: 2 }, { x: 3 }];

tidy(data, when(true, [mutate({ y: 10 })]))
// => [{ x: 1, y: 10 }, { x: 2, y: 10 }, { x: 3, y: 10 }]

tidy(data, when((items) => items.length > 5, [mutate({ y: 10 })]))
// => [{ x: 1 }, { x: 2 }, { x: 3 }]  (unchanged, predicate was false)
```

---

<!-- keywords: debug, log, console, inspect, table -->
## debug

Log the current pipeline state to the console. Data passes through unmodified.

**Signature:** `debug(label?, options?) => TidyFn<T>`
**Goes inside:** `tidy()` pipeline

### Parameters
- `label` (optional) -- `string`. Label displayed in the console output prefix.
- `options` (optional) -- `{ limit?: number | null, output?: 'log' | 'table' }`.
  - `limit` (default `10`) -- max items to display. Set to `null` for all.
  - `output` (default `'table'`) -- use `console.table` or `console.log`.

### Behavior
- Output is prefixed with `[tidy.debug]` (plus group keys if inside `groupBy`).
- Returns items unchanged -- safe to insert anywhere in a pipeline for inspection.

### Example
```js
tidy(data,
  filter((d) => d.value > 1),
  debug('after filter'),
  arrange('value')
)
// Logs: [tidy.debug] after filter --------
// (console.table of up to 10 items)
```

---

<!-- keywords: map, transform, mapFn, convert, reshape -->
## map

Transform each item to a new shape. Equivalent to `Array.prototype.map`.

**Signature:** `map(mapFn) => TidyFn<T, OutputT>`
**Goes inside:** `tidy()` pipeline

### Parameters
- `mapFn` -- `(item: T, index: number, array: T[]) => OutputT`. Returns the new item.

### Example
```js
const data = [
  { value: 1, nested: { a: 10, b: 100 } },
  { value: 2, nested: { a: 20, b: 200 } },
];

tidy(data, map((d) => ({ value: d.value, ...d.nested })))
// => [
//   { value: 1, a: 10, b: 100 },
//   { value: 2, a: 20, b: 200 },
// ]
```
