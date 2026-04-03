# Mental Model for tidyjs

## What is tidyjs?

tidyjs is a JavaScript/TypeScript library for data wrangling that works with **plain arrays of objects** — no special DataFrame wrapper. It is inspired by R's dplyr and the tidyverse. Think of it as a functional pipeline for transforming `{key: value}[]` data, similar to how you might chain SQL operations or pandas methods, but using composable JavaScript functions.

## The Pipeline Pattern

Everything in tidyjs flows through `tidy()`:

```js
import { tidy, filter, mutate, arrange, desc } from '@tidyjs/tidy';

const result = tidy(
  data,          // 1st arg: array of objects
  filter(...),   // 2nd+ args: transformation functions (verbs)
  mutate(...),
  arrange(desc('value'))
);
// result is a new array of objects
```

**Key rules:**
- First argument is always the data array — `tidy(data, ...fns)`
- Each subsequent argument is a **verb** — a function that returns a `TidyFn`
- Verbs are **curried**: `filter(predicate)` returns a function `(items[]) => items[]`
- The output of each verb feeds into the next
- `tidy()` returns a new array (never mutates the input)
- You can pass up to **10 pipeline steps** with full TypeScript type inference

**Common mistake — don't call verbs directly:**

```js
// WRONG: calling filter directly without tidy()
const result = filter((d) => d.value > 10)(data);

// CORRECT: use tidy() as the pipeline
const result = tidy(data, filter((d) => d.value > 10));
```

## Accessor Functions

tidyjs uses **accessor functions** `(d) => d.column` to reference data fields, NOT string column names.

```js
// CORRECT: accessor function
tidy(data, filter((d) => d.age > 30))
tidy(data, mutate({ fullName: (d) => `${d.first} ${d.last}` }))

// WRONG: string column names (this is NOT pandas or SQL)
tidy(data, filter('age > 30'))  // won't work
```

**Exception:** Some summary functions accept either a key string or accessor for convenience:
```js
sum('value')              // shorthand — string key
sum((d) => d.value)       // equivalent — accessor function
mean('score')             // string key shorthand
```

These are the **only** places strings work as field references: inside summary functions like `sum`, `mean`, `min`, `max`, `median`, `first`, `last`, `n`, `nDistinct`, `deviation`, `variance`, and sort helpers like `asc('key')`, `desc('key')`.

## The Function Taxonomy

This is **critical** — each function type belongs in a specific context:

### Tidy Verbs → go directly inside `tidy()`

These are pipeline steps that transform the array:

```js
tidy(data,
  filter((d) => d.active),        // filter rows
  mutate({ tax: (d) => d.price * 0.1 }), // add/modify columns per item
  arrange(desc('price')),          // sort rows
  select(['name', 'price', 'tax']), // pick columns
  distinct(['category']),          // deduplicate
  rename({ old_name: 'new_name' }) // rename columns
)
```

Full list: `filter`, `mutate`, `transmute`, `mutateWithSummary`, `arrange` (alias: `sort`), `select` (alias: `pick`), `distinct`, `rename`, `slice`, `sliceHead`, `sliceTail`, `sliceMin`, `sliceMax`, `sliceSample`, `groupBy`, `summarize`, `summarizeAll`, `summarizeAt`, `summarizeIf`, `total`, `totalAll`, `totalAt`, `totalIf`, `count`, `tally`, `innerJoin`, `leftJoin`, `fullJoin`, `pivotWider`, `pivotLonger`, `complete`, `expand`, `fill`, `replaceNully`, `addRows` (alias: `addItems`), `when`, `map`, `debug`

### Summary Functions → go inside `summarize()` or `total()`

These **reduce** an array of items to a single value:

```js
tidy(data,
  summarize({
    totalRevenue: sum('revenue'),
    avgScore: mean('score'),
    count: n(),
  })
)
// => [{ totalRevenue: 1500, avgScore: 85, count: 10 }]
```

Summary functions: `sum`, `mean`, `median`, `min`, `max`, `n`, `nDistinct`, `first`, `last`, `deviation`, `variance`, `meanRate`

**They also work inside `mutateWithSummary()`** to add summary-derived columns back to every row.

### Vector Functions → go inside `mutateWithSummary()`

These operate on the **full array** and return a new array of the same length:

```js
tidy(data,
  mutateWithSummary({
    runningTotal: cumsum('value'),
    prevValue: lag('value'),
    nextValue: lead('value'),
    rank: rowNumber(),
  })
)
```

Vector functions: `cumsum`, `lag`, `lead`, `roll`, `rowNumber`

### Item Functions → go inside `mutate()`

These transform **one item at a time**:

```js
tidy(data,
  mutate({
    conversionRate: rate('conversions', 'impressions'),
  })
)
```

Item functions: `rate`

### Selectors → go inside `select()`, `summarizeAt()`, `pivotLonger(cols:)`

These dynamically select columns by pattern:

```js
tidy(data,
  select([startsWith('revenue_'), 'name'])
)
```

Selectors: `everything`, `startsWith`, `endsWith`, `contains`, `matches`, `numRange`, `negate`

## mutate vs mutateWithSummary

This is the **most important distinction** in tidyjs. Getting this wrong produces silent bugs — code that runs but returns incorrect data.

### `mutate` — per-item transformation

The function receives `(item, index, array)` for each item individually:

```js
tidy(data,
  mutate({
    doubled: (d) => d.value * 2,
    label: (d) => `${d.name}: ${d.value}`,
    constant: 42,  // non-function values are applied to all items
  })
)
```

### `mutateWithSummary` — cross-item transformation

The function receives the **entire array** `(items[])` and must return an array of the same length OR a single value (broadcast to all items):

```js
tidy(data,
  mutateWithSummary({
    runningTotal: cumsum('value'),     // returns array
    pctOfTotal: (items) =>             // custom: returns array
      items.map(d => d.value / sum('value')(items)),
    totalValue: sum('value'),          // returns single value → broadcast
  })
)
```

### When to use which?

| Use `mutate` when... | Use `mutateWithSummary` when... |
|---|---|
| Each item's new value depends only on that item | New value depends on other items in the array |
| Simple calculations: `(d) => d.a + d.b` | Cumulative ops: `cumsum`, `lag`, `lead`, `roll` |
| String formatting: `(d) => d.name.toUpperCase()` | Summary-derived: adding `sum()` or `mean()` as a column |
| Setting constants: `{ status: 'active' }` | Row numbering: `rowNumber()` |

### The dangerous mistake

```js
// WRONG — sum() inside mutate() does NOT work correctly
// sum() expects the full array, but mutate passes one item at a time
tidy(data, mutate({ total: sum('value') }))

// CORRECT — use mutateWithSummary for cross-item operations
tidy(data, mutateWithSummary({ total: sum('value') }))
```

## groupBy Semantics

`groupBy` splits data into groups, runs operations per-group, then recombines:

```js
tidy(data,
  groupBy('category', [
    summarize({ total: sum('value') })
  ])
)
// => [{ category: 'A', total: 100 }, { category: 'B', total: 200 }]
```

**Key behaviors:**
- Group keys are automatically merged back into results (disable with `addGroupKeys: false`)
- Operations inside the `fns` array run on each group independently
- Without an export option, results are flattened back to a single array (ungrouped)
- Group by multiple keys: `groupBy(['category', 'region'], [...])`
- Group by computed key: `groupBy((d) => d.date.getFullYear(), [...])`

### Export Modes

By default, `groupBy` ungroups the result back into a flat array. Use export mode shortcuts to get different output shapes:

```js
// Flat array (default — no export option)
groupBy('key', [summarize(...)])
// => [{ key: 'a', total: 10 }, { key: 'b', total: 20 }]

// Nested entries: [[key, values], ...]
groupBy('key', [summarize(...)], groupBy.entries())

// Entries as objects: [{ key, values }, ...]
groupBy('key', [summarize(...)], groupBy.entriesObject())

// Plain object: { key: values, ... }
groupBy('key', [summarize(...)], groupBy.object())

// ES Map: Map { key => values }
groupBy('key', [summarize(...)], groupBy.map())

// Grouped Map (raw internal structure)
groupBy('key', [summarize(...)], groupBy.grouped())

// Just the keys
groupBy('key', [summarize(...)], groupBy.keys())

// Just the values (arrays)
groupBy('key', [summarize(...)], groupBy.values())

// Per-level control for multi-level grouping
groupBy(['cat', 'subcat'], [summarize(...)], groupBy.levels({ levels: ['object', 'entries'] }))
```

Export options also accept: `flat`, `single`, `mapLeaf`, `mapLeaves`, `mapEntry`, `compositeKey`.

**Important:** When using an export mode, `groupBy` becomes a `TidyGroupExportFn` — it must be the **last step** in the `tidy()` pipeline (or used inside another `groupBy`).

## TypeScript Tips

- **Accessor typing:** `(d: MyType) => d.value` gives full type inference inside `mutate`, `filter`, etc.
- **Pipeline step limit:** `tidy()` has type overloads for up to 10 steps. For longer pipelines, split into multiple `tidy()` calls or use `as` assertions.
- **groupBy return types:** The return type changes based on the export option. `groupBy.object()` returns `ObjectOutput`, `groupBy.entries()` returns `EntriesOutput`, etc. Without an export option, it returns the flat array type.
- **Summary function keys:** `sum('value')` infers the key must exist on the input type. Use accessor functions `sum((d) => d.value)` for computed values.

## What tidyjs is NOT

- **Not a DataFrame wrapper** — works directly with `{key: value}[]` arrays, no special data structure
- **Not lazy-evaluated** — each verb executes immediately in the pipeline
- **Not a database query builder** — all data is in memory
- **Not a charting library** — it transforms data; use a separate library to visualize
- **Not a replacement for lodash/Array methods** — use it when you need multi-step data wrangling pipelines; for simple `.filter()` or `.map()`, plain JS is fine
