# Gotchas and Anti-Patterns

Common mistakes AI assistants make when generating tidyjs code, ordered by severity.

---

## 1. Using summary functions inside `mutate()` instead of `mutateWithSummary()`

This is the **most dangerous mistake** — it produces code that runs without errors but returns wrong data.

```js
// WRONG — sum() receives one item at a time, not the full array
tidy(data, mutate({ total: sum('value') }))

// CORRECT — mutateWithSummary passes the full array to sum()
tidy(data, mutateWithSummary({ total: sum('value') }))
```

**Rule:** If the function needs to see all items (summary functions like `sum`, `mean`, `median`, or vector functions like `cumsum`, `lag`, `lead`), use `mutateWithSummary`. If it only needs the current item, use `mutate`.

---

## 2. Using string column names instead of accessor functions

tidyjs is **not** pandas or SQL. Most verbs require accessor functions.

```js
// WRONG
tidy(data, filter('value > 10'))
tidy(data, mutate({ doubled: 'value * 2' }))

// CORRECT
tidy(data, filter((d) => d.value > 10))
tidy(data, mutate({ doubled: (d) => d.value * 2 }))
```

**Exception:** Summary functions and sort helpers accept string keys as shorthand:
```js
sum('value')       // OK — shorthand for sum((d) => d.value)
asc('name')        // OK — shorthand for ascending sort by name
desc('value')      // OK — shorthand for descending sort by value
```

---

## 3. Forgetting the outer `tidy()` wrapper

Every transformation should go through `tidy()`. Verbs are curried — they return functions, not results.

```js
// WRONG — filter() returns a function, not filtered data
const result = filter((d) => d.active);
// result is a function, not an array!

// CORRECT
const result = tidy(data, filter((d) => d.active));
```

---

## 4. Confusing `TMath.rate()` with item-level `rate()`

These are two different functions with the same name but different purposes:

```js
import { rate, TMath } from '@tidyjs/tidy';

// TMath.rate — simple math: (numerator, denominator) => number
TMath.rate(10, 100); // => 0.1

// rate — item-level mutator for use inside mutate()
tidy(data, mutate({
  convRate: rate('conversions', 'impressions')
}))
// rate('conversions', 'impressions') creates (d) => d.conversions / d.impressions
```

---

## 5. Not understanding groupBy export modes

Without an export option, `groupBy` returns a flat array. With one, the output shape changes completely.

```js
// Returns flat array (default)
tidy(data, groupBy('type', [summarize({ n: n() })]))
// => [{ type: 'A', n: 5 }, { type: 'B', n: 3 }]

// Returns a plain object — DIFFERENT output shape
tidy(data, groupBy('type', [summarize({ n: n() })], groupBy.object()))
// => { A: [{ type: 'A', n: 5 }], B: [{ type: 'B', n: 3 }] }
```

**Important:** When using an export mode, `groupBy` must be the **last step** in the pipeline. It returns a non-array type that cannot be piped further.

---

## 6. `select` negation syntax requires negation first

The `-` prefix for excluding columns only works when negation keys come first (or all keys are negations).

```js
// CORRECT — all negations
tidy(data, select(['-password', '-secret']))

// CORRECT — negations after selector that produces all keys
tidy(data, select([everything(), '-password']))

// WRONG — mixing positive and negative keys unpredictably
tidy(data, select(['name', '-password', 'email']))
```

---

## 7. `fill()` only fills forward (down), not backward

`fill` replaces `null`/`undefined` with the most recent non-null value going **downward** through the array.

```js
const data = [
  { group: 'A', value: 10 },
  { group: null, value: 20 },
  { group: null, value: 30 },
  { group: 'B', value: 40 },
];

tidy(data, fill('group'))
// => [{ group: 'A', value: 10 }, { group: 'A', value: 20 },
//     { group: 'A', value: 30 }, { group: 'B', value: 40 }]
```

If you need backward fill, sort your data in reverse first, fill, then sort back.

---

## 8. Wrapping accessors in `asc()` unnecessarily

`arrange` auto-promotes single-argument accessor functions to ascending comparators. You don't need `asc()` for the basic case.

```js
// These are equivalent:
tidy(data, arrange((d) => d.name))
tidy(data, arrange(asc('name')))

// Use desc() explicitly for descending:
tidy(data, arrange(desc('value')))

// Multiple sort keys:
tidy(data, arrange(asc('category'), desc('value')))
```

---

## 9. Relying on join auto-detection for `by` keys

`innerJoin`, `leftJoin`, and `fullJoin` auto-detect matching keys from the **first element** of each array. This can break with inconsistent data shapes.

```js
// RISKY — auto-detects join keys from first element
tidy(data, leftJoin(lookupTable))

// SAFER — explicitly specify join keys
tidy(data, leftJoin(lookupTable, { by: 'id' }))
tidy(data, leftJoin(lookupTable, { by: { id: 'lookupId' } }))
```

---

## 10. Exceeding the 10-step pipeline type limit

`tidy()` has TypeScript overloads for up to 10 pipeline steps. Beyond that, types fall back to `any`.

```js
// If you need more than 10 steps, split into multiple tidy() calls:
const intermediate = tidy(data, step1(), step2(), /* ...up to 10 */);
const result = tidy(intermediate, step11(), step12());
```

---

## 11. Using `summarize` when you want `total`

`summarize` reduces to a single row. `total` appends a summary row while keeping all original rows.

```js
// summarize: replaces all rows with one summary row
tidy(data, summarize({ sum: sum('value') }))
// => [{ sum: 150 }]

// total: keeps all rows, adds a summary row at the end
tidy(data, total({ value: sum('value') }))
// => [{ name: 'a', value: 50 }, { name: 'b', value: 100 }, { name: 'Total', value: 150 }]
```
