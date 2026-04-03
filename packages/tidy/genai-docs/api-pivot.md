# Pivot (Reshape)

Reshape data between long and wide formats.

```js
import { tidy, pivotWider, pivotLonger } from '@tidyjs/tidy';
```

---

<!-- keywords: pivot wider, spread, long to wide, reshape, widen -->
## pivotWider

Reshape from long format to wide format by spreading values into new columns.

**Signature:** `pivotWider<T>(options: { namesFrom, valuesFrom, valuesFill?, valuesFillMap?, namesSep? })`
**Goes inside:** `tidy(data, pivotWider(...))`

### Parameters
- **namesFrom** `keyof T | (keyof T)[]` -- column(s) whose values become new column names.
- **valuesFrom** `keyof T | (keyof T)[]` -- column(s) whose values fill the new columns.
- **valuesFill** `any` -- value to use when a combination has no data. Default: `undefined`.
- **valuesFillMap** `Record<string, any>` -- per-valuesFrom fill values (e.g., `{ count: 0, total: 0 }`).
- **namesSep** `string` -- separator when combining multiple namesFrom or valuesFrom keys. Default: `'_'`.

### Example
```js
const data = [
  { name: 'Alice', subject: 'math', score: 90 },
  { name: 'Alice', subject: 'reading', score: 85 },
  { name: 'Bob', subject: 'math', score: 70 },
  { name: 'Bob', subject: 'reading', score: 95 },
];

tidy(data, pivotWider({
  namesFrom: 'subject',
  valuesFrom: 'score',
  valuesFill: 0,
}));
// output:
// [
//   { name: 'Alice', math: 90, reading: 85 },
//   { name: 'Bob', math: 70, reading: 95 },
// ]
```

### Multiple valuesFrom
```js
tidy(data, pivotWider({
  namesFrom: 'subject',
  valuesFrom: ['score', 'grade'],
  namesSep: '_',
}));
// columns become: name, score_math, score_reading, grade_math, grade_reading
```

---

<!-- keywords: pivot longer, melt, gather, wide to long, unpivot, reshape -->
## pivotLonger

Reshape from wide format to long format by collapsing columns into rows.

**Signature:** `pivotLonger<T>(options: { cols?, namesTo, valuesTo, namesSep? })`
**Goes inside:** `tidy(data, pivotLonger(...))`

### Parameters
- **cols** `(keyof T)[] | SelectorFn` -- columns to pivot into longer format. Accepts an array of column names or selector functions like `startsWith()`, `contains()`, etc.
- **namesTo** `string | string[]` -- name for the new column(s) that will hold the former column names.
- **valuesTo** `string | string[]` -- name for the new column(s) that will hold the values.
- **namesSep** `string` -- separator to split column names when `namesTo` is an array. Default: `'_'`.

### Example
```js
const data = [
  { name: 'Alice', math: 90, reading: 85 },
  { name: 'Bob', math: 70, reading: 95 },
];

tidy(data, pivotLonger({
  cols: ['math', 'reading'],
  namesTo: 'subject',
  valuesTo: 'score',
}));
// output:
// [
//   { name: 'Alice', subject: 'math', score: 90 },
//   { name: 'Alice', subject: 'reading', score: 85 },
//   { name: 'Bob', subject: 'math', score: 70 },
//   { name: 'Bob', subject: 'reading', score: 95 },
// ]
```

### Using selectors for cols
```js
import { startsWith } from '@tidyjs/tidy';

const data = [
  { id: 1, rev_q1: 100, rev_q2: 200, cost_q1: 50 },
];

tidy(data, pivotLonger({
  cols: [startsWith('rev_')],
  namesTo: 'quarter',
  valuesTo: 'revenue',
}));
// output:
// [
//   { id: 1, cost_q1: 50, quarter: 'rev_q1', revenue: 100 },
//   { id: 1, cost_q1: 50, quarter: 'rev_q2', revenue: 200 },
// ]
```
