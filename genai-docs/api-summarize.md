# Summarize API Reference

> Functions for aggregating data: tidy verbs that reduce collections, and summary helpers that compute single values.

---

## Tidy Verbs (pipeline functions)

These go inside a `tidy()` call: `tidy(data, summarize({...}))`.

---

<!-- keywords: summarize, summarise, aggregate, reduce, group summary, spec -->
## summarize

Reduces all items to a single summary row based on a spec of summary functions.

**Signature:** `summarize(spec, options?)`
**Goes inside:** `tidy()` pipeline (or `groupBy()` export functions)

### Parameters
- `spec` -- `Record<string, (items: T[]) => any>` -- object mapping output keys to summary functions
- `options?` -- `{ rest?: (key: keyof T) => (items: T[]) => any }` -- `rest` applies a summary function to all keys not in `spec`

### Example
```js
import { tidy, summarize, sum, mean, n } from '@tidyjs/tidy';

const data = [
  { group: 'a', value: 10 },
  { group: 'a', value: 20 },
  { group: 'b', value: 30 },
];

tidy(data, summarize({
  total: sum('value'),
  avg: mean('value'),
  count: n(),
}))
// output:
// [{ total: 60, avg: 20, count: 3 }]
```

---

<!-- keywords: summarizeAll, summarise all, apply to all columns -->
## summarizeAll

Applies one summary function to every column.

**Signature:** `summarizeAll(summaryFn)`
**Goes inside:** `tidy()` pipeline

### Parameters
- `summaryFn` -- `(key: keyof T) => (items: T[]) => any` -- a summary key function (e.g., `sum`, `mean`)

### Example
```js
import { tidy, summarizeAll, sum } from '@tidyjs/tidy';

const data = [
  { x: 1, y: 10 },
  { x: 2, y: 20 },
];

tidy(data, summarizeAll(sum))
// output:
// [{ x: 3, y: 30 }]
```

---

<!-- keywords: summarizeIf, summarise if, conditional columns, predicate -->
## summarizeIf

Applies a summary function only to columns whose values match a predicate.

**Signature:** `summarizeIf(predicateFn, summaryFn)`
**Goes inside:** `tidy()` pipeline

### Parameters
- `predicateFn` -- `(vector: T[keyof T][]) => boolean` -- receives all values for a column; return `true` to include
- `summaryFn` -- `(key: keyof T) => (items: T[]) => any` -- summary key function to apply

### Example
```js
import { tidy, summarizeIf, sum } from '@tidyjs/tidy';

const data = [
  { str: 'foo', value: 3 },
  { str: 'bar', value: 7 },
];

tidy(data, summarizeIf(
  (vector) => vector.every(v => typeof v === 'number'),
  sum
))
// output:
// [{ value: 10 }]
```

---

<!-- keywords: summarizeAt, summarise at, specific columns, named keys -->
## summarizeAt

Applies a summary function to specific named columns.

**Signature:** `summarizeAt(keys, summaryFn)`
**Goes inside:** `tidy()` pipeline

### Parameters
- `keys` -- `(keyof T)[]` -- array of column names to summarize
- `summaryFn` -- `(key: keyof T) => (items: T[]) => any` -- summary key function to apply

### Example
```js
import { tidy, summarizeAt, sum } from '@tidyjs/tidy';

const data = [
  { a: 1, b: 10, c: 100 },
  { a: 2, b: 20, c: 200 },
];

tidy(data, summarizeAt(['a', 'b'], sum))
// output:
// [{ a: 3, b: 30 }]
```

---

<!-- keywords: count, group count, tally by key, frequency -->
## count

Counts items per group for given keys. Shorthand for `groupBy(key, [tally()])`.

**Signature:** `count(groupKeys, options?)`
**Goes inside:** `tidy()` pipeline

### Parameters
- `groupKeys` -- `string | string[] | accessor | accessor[]` -- key(s) to group by
- `options?` -- `{ name?: string, sort?: boolean, wt?: string }`
  - `name` -- output column name (default `'n'`)
  - `sort` -- if `true`, sorts descending by count
  - `wt` -- key to use as weight (sums that column instead of counting)

### Example
```js
import { tidy, count } from '@tidyjs/tidy';

const data = [
  { color: 'red' },
  { color: 'red' },
  { color: 'blue' },
];

tidy(data, count('color', { sort: true }))
// output:
// [{ color: 'red', n: 2 }, { color: 'blue', n: 1 }]
```

---

<!-- keywords: tally, count items, row count, weighted count -->
## tally

Counts items in the current group (or all items). Use inside `groupBy` exports or standalone.

**Signature:** `tally(options?)`
**Goes inside:** `tidy()` pipeline (commonly inside `groupBy()` export functions)

### Parameters
- `options?` -- `{ name?: string, wt?: string }`
  - `name` -- output column name (default `'n'`)
  - `wt` -- key to use as weight (sums that column instead of counting)

### Example
```js
import { tidy, tally, groupBy } from '@tidyjs/tidy';

const data = [
  { group: 'a', value: 10 },
  { group: 'a', value: 20 },
  { group: 'b', value: 30 },
];

tidy(data, tally())
// output:
// [{ n: 3 }]

tidy(data, tally({ wt: 'value' }))
// output:
// [{ n: 60 }]
```

---

<!-- keywords: total, total row, append summary, grand total -->
## total

Like `summarize`, but appends the summary as a total row while keeping all original rows.

**Signature:** `total(summarizeSpec, mutateSpec)`
**Goes inside:** `tidy()` pipeline

### Parameters
- `summarizeSpec` -- `Record<string, (items: T[]) => any>` -- summary functions (same as `summarize` spec)
- `mutateSpec` -- `Record<string, (items: T[]) => any>` -- mutations to apply to the total row (e.g., set a label)

### Example
```js
import { tidy, total, sum } from '@tidyjs/tidy';

const data = [
  { group: 'a', value: 10 },
  { group: 'b', value: 20 },
];

tidy(data, total({ value: sum('value') }, { group: () => 'Total' }))
// output:
// [
//   { group: 'a', value: 10 },
//   { group: 'b', value: 20 },
//   { group: 'Total', value: 30 },
// ]
```

---

<!-- keywords: totalAll, total all columns -->
## totalAll

Like `total`, but applies one summary function to all columns.

**Signature:** `totalAll(summaryFn, mutateSpec)`
**Goes inside:** `tidy()` pipeline

### Parameters
- `summaryFn` -- `(key: keyof T) => (items: T[]) => any` -- summary key function
- `mutateSpec` -- mutations for the total row

---

<!-- keywords: totalIf, total conditional columns -->
## totalIf

Like `total`, but applies summary only to columns matching a predicate.

**Signature:** `totalIf(predicateFn, summaryFn, mutateSpec)`
**Goes inside:** `tidy()` pipeline

### Parameters
- `predicateFn` -- `(vector: T[keyof T][]) => boolean` -- column predicate
- `summaryFn` -- summary key function
- `mutateSpec` -- mutations for the total row

---

<!-- keywords: totalAt, total specific columns -->
## totalAt

Like `total`, but applies summary to specific named columns.

**Signature:** `totalAt(keys, summaryFn, mutateSpec)`
**Goes inside:** `tidy()` pipeline

### Parameters
- `keys` -- `(keyof T)[]` -- columns to summarize
- `summaryFn` -- summary key function
- `mutateSpec` -- mutations for the total row

---

## Summary Functions (aggregation helpers)

These go inside `summarize()`, `total()`, or `mutateWithSummary()` specs.

They accept a **string key** or **accessor function**: `sum('value')` or `sum((d) => d.value)`.
They return `(items: T[]) => number|any` -- a function that reduces an array to a single value.

---

<!-- keywords: sum, total, add, aggregate sum, conditional sum, predicate -->
## sum

Computes the sum of values for a key. Uses d3-array `fsum` for floating-point precision.

**Signature:** `sum(key, options?)`
**Goes inside:** `summarize()`, `total()`, `mutateWithSummary()` spec

### Parameters
- `key` -- `string | (d: T, index: number, array: Iterable<T>) => number`
- `options?` -- `{ predicate?: (d: T, index: number, array: Iterable<T>) => boolean }` -- only sum items matching predicate

### Example
```js
tidy(data, summarize({
  value: sum('value'),
  fooOnly: sum('value', { predicate: d => d.str === 'foo' }),
}))
// input:  [{ str: 'foo', value: 3 }, { str: 'bar', value: 7 }]
// output: [{ value: 10, fooOnly: 3 }]
```

---

<!-- keywords: mean, average, avg, arithmetic mean -->
## mean

Computes the arithmetic mean. Uses `fsum` internally for precision.

**Signature:** `mean(key)`
**Goes inside:** `summarize()`, `total()`, `mutateWithSummary()` spec

### Parameters
- `key` -- `string | (d: T, index: number, array: Iterable<T>) => number`

### Example
```js
tidy(data, summarize({ avg: mean('value') }))
// input:  [{ value: 3 }, { value: 1 }, { value: 7 }]
// output: [{ avg: 3.667 }]
```

---

<!-- keywords: median, middle value, 50th percentile -->
## median

Computes the median value (via d3-array).

**Signature:** `median(key)`
**Goes inside:** `summarize()`, `total()`, `mutateWithSummary()` spec

### Parameters
- `key` -- `string | (d: T, index: number, array: Iterable<T>) => number`

### Example
```js
tidy(data, summarize({ med: median('value') }))
// input:  [{ value: 3 }, { value: 1 }, { value: 7 }]
// output: [{ med: 3 }]
```

---

<!-- keywords: min, minimum, smallest -->
## min

Returns the minimum value (via d3-array).

**Signature:** `min(key)`
**Goes inside:** `summarize()`, `total()`, `mutateWithSummary()` spec

### Parameters
- `key` -- `string | (d: T, index: number, array: Iterable<T>) => number`

### Example
```js
tidy(data, summarize({ lo: min('value') }))
// input:  [{ value: 3 }, { value: 1 }, { value: 7 }]
// output: [{ lo: 1 }]
```

---

<!-- keywords: max, maximum, largest, highest -->
## max

Returns the maximum value (via d3-array).

**Signature:** `max(key)`
**Goes inside:** `summarize()`, `total()`, `mutateWithSummary()` spec

### Parameters
- `key` -- `string | (d: T, index: number, array: Iterable<T>) => number`

### Example
```js
tidy(data, summarize({ hi: max('value') }))
// input:  [{ value: 3 }, { value: 1 }, { value: 7 }]
// output: [{ hi: 7 }]
```

---

<!-- keywords: n, count, length, number of items, row count, predicate count -->
## n

Counts the number of items. Takes no key argument.

**Signature:** `n(options?)`
**Goes inside:** `summarize()`, `total()`, `mutateWithSummary()` spec

### Parameters
- `options?` -- `{ predicate?: (d: T, index: number, array: Iterable<T>) => boolean }` -- only count items matching predicate

### Example
```js
tidy(data, summarize({
  count: n(),
  countFoo: n({ predicate: d => d.str === 'foo' }),
}))
// input:  [{ str: 'foo', value: 3 }, { str: 'foo', value: 1 }, { str: 'bar', value: 7 }]
// output: [{ count: 3, countFoo: 2 }]
```

---

<!-- keywords: nDistinct, distinct count, unique values, count unique, cardinality -->
## nDistinct

Counts the number of distinct values for a key. By default includes `null` but excludes `undefined`.

**Signature:** `nDistinct(key, options?)`
**Goes inside:** `summarize()`, `total()`, `mutateWithSummary()` spec

### Parameters
- `key` -- `string | (d: T, index: number, array: Iterable<T>) => any`
- `options?` -- `{ includeNull?: boolean, includeUndefined?: boolean }` -- defaults: `includeNull: true`, `includeUndefined: false`

### Example
```js
tidy(data, summarize({ numStr: nDistinct('str') }))
// input:  [{ str: 'foo' }, { str: 'foo' }, { str: 'bar' }]
// output: [{ numStr: 2 }]
```

---

<!-- keywords: first, first value, head, pick first -->
## first

Returns the value of a key from the first item in the collection.

**Signature:** `first(key)`
**Goes inside:** `summarize()`, `total()`, `mutateWithSummary()` spec

### Parameters
- `key` -- `string | (d: T) => any`

### Example
```js
tidy(data, summarize({ str: first('str'), value: sum('value') }))
// input:  [{ str: 'foo', value: 3 }, { str: 'bar', value: 7 }]
// output: [{ str: 'foo', value: 10 }]
```

---

<!-- keywords: last, last value, tail, pick last -->
## last

Returns the value of a key from the last item in the collection.

**Signature:** `last(key)`
**Goes inside:** `summarize()`, `total()`, `mutateWithSummary()` spec

### Parameters
- `key` -- `string | (d: T) => any`

### Example
```js
tidy(data, summarize({ str: last('str'), value: sum('value') }))
// input:  [{ str: 'foo', value: 3 }, { str: 'bar', value: 7 }]
// output: [{ str: 'bar', value: 10 }]
```

---

<!-- keywords: deviation, standard deviation, stdev, spread, dispersion -->
## deviation

Computes the standard deviation (via d3-array).

**Signature:** `deviation(key)`
**Goes inside:** `summarize()`, `total()`, `mutateWithSummary()` spec

### Parameters
- `key` -- `string | (d: T, index: number, array: Iterable<T>) => number`

### Example
```js
tidy(data, summarize({ stdev: deviation('value') }))
// input:  [{ value: 3 }, { value: 1 }, { value: 3 }, { value: 1 }, { value: 7 }]
// output: [{ stdev: 2.449 }]
```

---

<!-- keywords: variance, var, spread, dispersion squared -->
## variance

Computes the variance (via d3-array).

**Signature:** `variance(key)`
**Goes inside:** `summarize()`, `total()`, `mutateWithSummary()` spec

### Parameters
- `key` -- `string | (d: T, index: number, array: Iterable<T>) => number`

### Example
```js
tidy(data, summarize({ v: variance('value') }))
// input:  [{ value: 3 }, { value: 1 }, { value: 3 }, { value: 1 }, { value: 7 }]
// output: [{ v: 6 }]
```

---

<!-- keywords: meanRate, weighted mean, rate, ratio, numerator denominator -->
## meanRate

Computes a weighted mean rate by summing numerator and denominator independently, then dividing. Avoids bias from averaging pre-computed rates.

**Signature:** `meanRate(numerator, denominator)`
**Goes inside:** `summarize()`, `total()`, `mutateWithSummary()` spec

### Parameters
- `numerator` -- `string | (d: T, index: number, array: Iterable<T>) => number`
- `denominator` -- `string | (d: T, index: number, array: Iterable<T>) => number`

### Example
```js
tidy(data, summarize({ rate: meanRate('hits', 'attempts') }))
// input:  [{ hits: 3, attempts: 10 }, { hits: 7, attempts: 10 }]
// output: [{ rate: 0.5 }]
```
