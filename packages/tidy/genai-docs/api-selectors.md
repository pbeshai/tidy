# Selectors

Functions that dynamically select column names based on patterns. Selectors return `(items: T[]) => string[]`.

Use selectors inside `select()`, `summarizeAt()`, `totalAt()`, and `pivotLonger({ cols: ... })`.

```js
import { tidy, select,
  everything, startsWith, endsWith, contains, matches, numRange, negate
} from '@tidyjs/tidy';
```

---

<!-- keywords: everything, all columns, select all -->
## everything

Select all columns.

**Signature:** `everything<T>()`
**Returns:** `(items: T[]) => string[]`

### Example
```js
tidy(data, select([everything(), '-secret']));
// selects all columns except 'secret'
```

---

<!-- keywords: starts with, prefix, column prefix -->
## startsWith

Select columns whose names start with a prefix.

**Signature:** `startsWith<T>(prefix: string, ignoreCase?: boolean)`
**Returns:** `(items: T[]) => string[]`

### Parameters
- **prefix** `string` -- the prefix to match.
- **ignoreCase** `boolean` -- case-insensitive matching. Default: `true`.

### Example
```js
// data has columns: rev_q1, rev_q2, cost_q1
tidy(data, select([startsWith('rev_')]));
// keeps: rev_q1, rev_q2
```

---

<!-- keywords: ends with, suffix, column suffix -->
## endsWith

Select columns whose names end with a suffix.

**Signature:** `endsWith<T>(suffix: string, ignoreCase?: boolean)`
**Returns:** `(items: T[]) => string[]`

### Parameters
- **suffix** `string` -- the suffix to match.
- **ignoreCase** `boolean` -- case-insensitive matching. Default: `true`.

### Example
```js
// data has columns: name_en, name_fr, age
tidy(data, select([endsWith('_en')]));
// keeps: name_en
```

---

<!-- keywords: contains, substring, column search -->
## contains

Select columns whose names contain a substring.

**Signature:** `contains<T>(substring: string, ignoreCase?: boolean)`
**Returns:** `(items: T[]) => string[]`

### Parameters
- **substring** `string` -- the substring to search for.
- **ignoreCase** `boolean` -- case-insensitive matching. Default: `true`.

### Example
```js
// data has columns: total_revenue, net_revenue, cost
tidy(data, select([contains('revenue')]));
// keeps: total_revenue, net_revenue
```

---

<!-- keywords: matches, regex, pattern, column regex -->
## matches

Select columns whose names match a regular expression.

**Signature:** `matches<T>(regex: RegExp)`
**Returns:** `(items: T[]) => string[]`

### Parameters
- **regex** `RegExp` -- the regular expression to test against.

### Example
```js
// data has columns: q1_sales, q2_sales, q1_cost, notes
tidy(data, select([matches(/^q\d+_sales$/)]));
// keeps: q1_sales, q2_sales
```

---

<!-- keywords: num range, numbered columns, prefix with numbers -->
## numRange

Select columns matching a prefix followed by numbers in a range.

**Signature:** `numRange<T>(prefix: string, range: [number, number], width?: number)`
**Returns:** `(items: T[]) => string[]`

### Parameters
- **prefix** `string` -- the column name prefix.
- **range** `[number, number]` -- inclusive `[start, end]` range of numbers.
- **width** `number` (optional) -- zero-pad numbers to this width. E.g., `width=3` turns `1` into `001`.

### Example
```js
// data has columns: wk1, wk2, wk3, ..., wk52, name
tidy(data, select([numRange('wk', [1, 4])]));
// keeps: wk1, wk2, wk3, wk4

// with zero-padded columns: wk001, wk002, ...
tidy(data, select([numRange('wk', [1, 4], 3)]));
// keeps: wk001, wk002, wk003, wk004
```

---

<!-- keywords: negate, invert, exclude, drop columns -->
## negate

Invert a selector to exclude the matched columns. Prefixes matched keys with `-`.

**Signature:** `negate<T>(selectors: Selector | Selector[])`
**Returns:** `(items: T[]) => string[]`

### Parameters
- **selectors** -- one or more selectors (or key names) to invert.

### Example
```js
// data has columns: id, rev_q1, rev_q2, cost_q1
tidy(data, select([negate(startsWith('rev_'))]));
// drops rev_q1, rev_q2 -- keeps id, cost_q1

// equivalent to:
tidy(data, select(['-rev_q1', '-rev_q2']));
```
