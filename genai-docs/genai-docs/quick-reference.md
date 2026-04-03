# Quick Reference

Map common data tasks to the right tidyjs function.

```js
import { tidy, filter, mutate, mutateWithSummary, arrange, asc, desc,
  select, distinct, rename, groupBy, summarize, count, tally,
  sum, mean, median, min, max, n, nDistinct, first, last,
  cumsum, lag, lead, roll, rowNumber,
  innerJoin, leftJoin, fullJoin,
  pivotWider, pivotLonger,
  sliceHead, sliceTail, sliceMin, sliceMax, sliceSample,
  complete, expand, fill, replaceNully, addRows, when, total,
  everything, startsWith, endsWith, contains, matches,
  rate, TMath } from '@tidyjs/tidy';
```

## Row Operations

| I want to... | Use |
|---|---|
| Filter rows by condition | `filter((d) => d.value > 10)` |
| Keep only unique rows | `distinct(['col1', 'col2'])` |
| Sort rows ascending | `arrange(asc('name'))` or `arrange((d) => d.name)` |
| Sort rows descending | `arrange(desc('value'))` |
| Sort by multiple columns | `arrange(asc('category'), desc('value'))` |
| Take first N rows | `sliceHead(5)` |
| Take last N rows | `sliceTail(5)` |
| Take rows with smallest values | `sliceMin(3, 'score')` |
| Take rows with largest values | `sliceMax(3, 'score')` |
| Take random sample | `sliceSample(10)` |
| Take a range of rows | `slice(2, 5)` |
| Add rows to the data | `addRows([{ name: 'new', value: 0 }])` |

## Column Operations

| I want to... | Use |
|---|---|
| Add or modify a column (per item) | `mutate({ newCol: (d) => d.a + d.b })` |
| Add a column using cross-item calculation | `mutateWithSummary({ total: sum('value') })` |
| Keep only certain columns | `select(['name', 'value'])` |
| Drop specific columns | `select(['-password', '-secret'])` |
| Select columns by prefix | `select([startsWith('revenue_')])` |
| Select all columns except... | `select([everything(), '-internal'])` |
| Rename columns | `rename({ oldName: 'newName' })` |
| Keep only selected columns + transform | `transmute({ newCol: (d) => d.a * 2 })` |
| Replace null/undefined values | `replaceNully({ score: 0, name: 'unknown' })` |
| Set a constant value on all items | `mutate({ status: 'active' })` |

## Aggregation

| I want to... | Use |
|---|---|
| Sum a column | `summarize({ total: sum('value') })` |
| Average a column | `summarize({ avg: mean('score') })` |
| Find median | `summarize({ med: median('value') })` |
| Find min/max | `summarize({ lo: min('val'), hi: max('val') })` |
| Count rows | `summarize({ count: n() })` |
| Count distinct values | `summarize({ unique: nDistinct('category') })` |
| Get first/last value | `summarize({ start: first('date'), end: last('date') })` |
| Standard deviation | `summarize({ sd: deviation('value') })` |
| Variance | `summarize({ v: variance('value') })` |
| Count shorthand | `count('category')` |
| Tally rows | `tally()` |
| Append a total row (keep originals) | `total({ value: sum('value') })` |

## Grouping

| I want to... | Use |
|---|---|
| Group and aggregate | `groupBy('key', [summarize({ total: sum('val') })])` |
| Group by multiple keys | `groupBy(['cat', 'subcat'], [summarize(...)])` |
| Group by computed key | `groupBy((d) => d.date.getFullYear(), [summarize(...)])` |
| Get result as plain object | `groupBy('key', [ops], groupBy.object())` |
| Get result as entries array | `groupBy('key', [ops], groupBy.entries())` |
| Get result as Map | `groupBy('key', [ops], groupBy.map())` |
| Get single item per group (after summarize) | `groupBy('key', [summarize(...)], groupBy.object({ single: true }))` |

## Cross-Item Column Operations

| I want to... | Use |
|---|---|
| Running total (cumulative sum) | `mutateWithSummary({ cum: cumsum('value') })` |
| Previous row's value | `mutateWithSummary({ prev: lag('value') })` |
| Next row's value | `mutateWithSummary({ next: lead('value') })` |
| Rolling average (window of N) | `mutateWithSummary({ avg: roll(3, mean('value')) })` |
| Row number / rank | `mutateWithSummary({ rank: rowNumber() })` |
| Percentage of total | `mutateWithSummary({ pct: (items) => items.map(d => d.value / sum('value')(items)) })` |

## Reshaping

| I want to... | Use |
|---|---|
| Long to wide (pivot columns out) | `pivotWider({ namesFrom: 'key', valuesFrom: 'value' })` |
| Wide to long (unpivot) | `pivotLonger({ cols: ['col1', 'col2'], namesTo: 'key', valuesTo: 'value' })` |
| Fill missing combinations | `complete({ col1: ['a', 'b'], col2: [1, 2] })` |
| Generate all combinations | `expand({ col1: ['a', 'b'], col2: [1, 2] })` |
| Fill nulls forward (down) | `fill('column')` |

## Joins

| I want to... | Use |
|---|---|
| Inner join (matching rows only) | `innerJoin(otherData, { by: 'id' })` |
| Left join (keep all left rows) | `leftJoin(otherData, { by: 'id' })` |
| Full outer join | `fullJoin(otherData, { by: 'id' })` |
| Join on different column names | `leftJoin(other, { by: { myId: 'theirId' } })` |

## Conditional & Utility

| I want to... | Use |
|---|---|
| Conditionally apply a transform | `when(condition, [filter(...)])` |
| Apply a custom function to each item | `map((d) => ({ ...d, upper: d.name.toUpperCase() }))` |
| Log intermediate pipeline state | `debug()` or `debug('label')` |
| Calculate a rate per item | `mutate({ r: rate('num', 'denom') })` |
| Simple math rate | `TMath.rate(numerator, denominator)` |

## Aliases

| Canonical | Alias |
|---|---|
| `arrange` | `sort` |
| `select` | `pick` |
| `addRows` | `addItems` |
