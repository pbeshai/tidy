# Other Functions

Miscellaneous tidyjs functions for completing, filling, replacing, adding rows, and math utilities.

```js
import { tidy, complete, expand, fill, replaceNully, addRows, rate, TMath } from '@tidyjs/tidy';
```

---

<!-- keywords: complete, fill missing combinations, add missing rows -->
## complete

Fill in missing combinations of data. Adds rows for any combination of specified keys that does not already exist.

**Signature:** `complete<T>(expandKeys: string | string[] | KeyMap<T>, replaceNullySpec?: Partial<T>)`
**Goes inside:** `tidy(data, complete(...))`

### Parameters
- **expandKeys** `string | string[] | KeyMap<T>` -- defines which columns to expand. As a `KeyMap`, each key maps to an array of values or a sequence function (e.g., `fullSeq`).
- **replaceNullySpec** `Partial<T>` (optional) -- replace null/undefined in newly created rows. E.g., `{ value: 0 }`.

### Example
```js
const data = [
  { group: 'a', year: 2020, value: 10 },
  { group: 'a', year: 2021, value: 20 },
  { group: 'b', year: 2020, value: 30 },
];

tidy(data, complete({ group: ['a', 'b'], year: [2020, 2021] }, { value: 0 }));
// output:
// [
//   { group: 'a', year: 2020, value: 10 },
//   { group: 'a', year: 2021, value: 20 },
//   { group: 'b', year: 2020, value: 30 },
//   { group: 'b', year: 2021, value: 0 },  // added, value filled with 0
// ]
```

---

<!-- keywords: expand, all combinations, cartesian product, cross join -->
## expand

Generate all combinations of the specified keys. Unlike `complete`, returns only the expanded combination rows (does not merge with original data).

**Signature:** `expand<T>(expandKeys: string | string[] | KeyMap<T>)`
**Goes inside:** `tidy(data, expand(...))`

### Parameters
- **expandKeys** `string | string[] | KeyMap<T>` -- columns to expand. As a string or array, uses distinct values from the data. As a `KeyMap`, values can be explicit arrays or sequence functions.

### Example
```js
const data = [
  { group: 'a', year: 2020 },
  { group: 'b', year: 2021 },
];

tidy(data, expand(['group', 'year']));
// output: all combinations of distinct group and year values
// [
//   { group: 'a', year: 2020 },
//   { group: 'a', year: 2021 },
//   { group: 'b', year: 2020 },
//   { group: 'b', year: 2021 },
// ]
```

---

<!-- keywords: fill, fill down, forward fill, last observation carried forward -->
## fill

Fill null/undefined values forward (downward) using the last non-null value.

**Signature:** `fill<T>(keys: string | string[])`
**Goes inside:** `tidy(data, fill(...))`

### Parameters
- **keys** `string | string[]` -- column name(s) to fill.

### Example
```js
const data = [
  { name: 'Alice', value: 10 },
  { name: undefined, value: 20 },
  { name: undefined, value: 30 },
  { name: 'Bob', value: 40 },
];

tidy(data, fill('name'));
// output:
// [
//   { name: 'Alice', value: 10 },
//   { name: 'Alice', value: 20 },  // filled from above
//   { name: 'Alice', value: 30 },  // filled from above
//   { name: 'Bob', value: 40 },
// ]
```

---

<!-- keywords: replace nully, replace null, replace undefined, default values, coalesce -->
## replaceNully

Replace null or undefined values with specified defaults.

**Signature:** `replaceNully<T>(replaceSpec: Partial<T>)`
**Goes inside:** `tidy(data, replaceNully(...))`

### Parameters
- **replaceSpec** `Partial<T>` -- object mapping column names to replacement values. Only null/undefined values are replaced.

### Example
```js
const data = [
  { name: 'Alice', score: null, grade: undefined },
  { name: 'Bob', score: 85, grade: 'B' },
];

tidy(data, replaceNully({ score: 0, grade: 'N/A' }));
// output:
// [
//   { name: 'Alice', score: 0, grade: 'N/A' },
//   { name: 'Bob', score: 85, grade: 'B' },
// ]
```

---

<!-- keywords: add rows, add items, append, insert rows -->
## addRows

Append rows to the data. Alias: `addItems`.

**Signature:** `addRows<T>(itemsToAdd: T | T[] | ((items: T[]) => T | T[]))`
**Goes inside:** `tidy(data, addRows(...))`

### Parameters
- **itemsToAdd** `T | T[] | ((items: T[]) => T | T[])` -- rows to append. Can be a single item, an array, or a function that receives the current items and returns new rows.

### Example
```js
const data = [{ name: 'Alice', value: 10 }];

tidy(data, addRows([{ name: 'Bob', value: 20 }]));
// output: [{ name: 'Alice', value: 10 }, { name: 'Bob', value: 20 }]

// dynamic: add a total row
tidy(data, addRows((items) => ({
  name: 'Total',
  value: items.reduce((s, d) => s + d.value, 0),
})));
```

---

<!-- keywords: rate, ratio, divide, item accessor, mutate rate -->
## rate (item accessor)

Create a per-item rate accessor for use inside `mutate()`. Computes `numerator / denominator` for each row.

**Signature:** `rate<T>(numerator: keyof T | Accessor, denominator: keyof T | Accessor, options?: { predicate?, allowDivideByZero? })`
**Goes inside:** `mutate({ col: rate('num', 'denom') })`

### Parameters
- **numerator** `keyof T | ((d, i, arr) => number)` -- column name or accessor for the numerator.
- **denominator** `keyof T | ((d, i, arr) => number)` -- column name or accessor for the denominator.
- **options.predicate** `(d, i, arr) => boolean` -- if provided, returns `undefined` when predicate is false.
- **options.allowDivideByZero** `boolean` -- if `true`, allows division by zero (returns `Infinity`). Default: `false` (returns `undefined` when denominator is 0, except 0/0 which returns 0).

### Example
```js
const data = [
  { hits: 30, attempts: 100 },
  { hits: 0, attempts: 0 },
  { hits: 5, attempts: 0 },
];

tidy(data, mutate({ pct: rate('hits', 'attempts') }));
// output:
// [
//   { hits: 30, attempts: 100, pct: 0.3 },
//   { hits: 0, attempts: 0, pct: 0 },       // 0/0 = 0
//   { hits: 5, attempts: 0, pct: undefined }, // div by zero = undefined
// ]
```

**Do not confuse with `TMath.rate`** (see below), which is a plain math function, not an item accessor.

---

<!-- keywords: TMath, math rate, math add, math subtract, null safe math -->
## TMath

Plain math utility functions with null/undefined safety. These are standalone functions, not tidy pipeline operators.

```js
import { TMath } from '@tidyjs/tidy';
```

### TMath.rate(numerator, denominator, allowDivideByZero?)

Compute `numerator / denominator` with null safety.

- Returns `undefined` if either argument is null/undefined.
- Returns `0` if both numerator and denominator are 0.
- Returns `undefined` if denominator is 0 (unless `allowDivideByZero` is `true`).

```js
TMath.rate(30, 100);       // 0.3
TMath.rate(0, 0);          // 0
TMath.rate(5, 0);          // undefined
TMath.rate(null, 100);     // undefined
TMath.rate(5, 0, true);    // Infinity
```

### TMath.add(a, b, nullyZero?)

Null-safe addition. Returns `undefined` if either value is null/undefined, unless `nullyZero` is `true` (treats null/undefined as 0).

```js
TMath.add(1, 2);           // 3
TMath.add(1, null);        // undefined
TMath.add(1, null, true);  // 1
```

### TMath.subtract(a, b, nullyZero?)

Null-safe subtraction. Returns `undefined` if either value is null/undefined, unless `nullyZero` is `true`.

```js
TMath.subtract(5, 3);           // 2
TMath.subtract(5, null);        // undefined
TMath.subtract(5, null, true);  // 5
```
