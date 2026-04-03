# @tidyjs/tidy — AI Documentation

> Tidy up your data with JavaScript! A data wrangling library inspired by R's dplyr and the tidyverse.

## How to Use These Docs

1. **Start here** — Read `mental-model.md` first. It teaches the pipeline pattern, accessor conventions, and function taxonomy that are essential for writing correct tidyjs code.
2. **Look up functions** — Use the `api-*.md` files to find specific function signatures, parameters, and examples.
3. **Find recipes** — Check `patterns.md` for multi-step transformation recipes.
4. **Avoid mistakes** — Read `gotchas.md` for common AI mistakes and anti-patterns.
5. **Quick lookup** — Use `quick-reference.md` to map a task ("I want to filter rows") to the right function.

## File Index

| File | Purpose |
|------|---------|
| [`mental-model.md`](mental-model.md) | Core concepts: pipeline pattern, accessors, function taxonomy, mutate vs mutateWithSummary |
| [`quick-reference.md`](quick-reference.md) | Task-to-function cheat sheet |
| [`gotchas.md`](gotchas.md) | Common mistakes and anti-patterns |
| [`patterns.md`](patterns.md) | Multi-verb recipes for real-world tasks |
| [`api-core.md`](api-core.md) | tidy, filter, mutate, transmute, arrange, select, distinct, rename, when, debug, map |
| [`api-grouping.md`](api-grouping.md) | groupBy + all 8 export modes |
| [`api-summarize.md`](api-summarize.md) | summarize, summarizeAll/At/If + summary functions (sum, mean, median, etc.) |
| [`api-vector.md`](api-vector.md) | mutateWithSummary + vector functions (cumsum, lag, lead, roll, rowNumber) |
| [`api-joins.md`](api-joins.md) | innerJoin, leftJoin, fullJoin |
| [`api-pivot.md`](api-pivot.md) | pivotWider, pivotLonger |
| [`api-slice.md`](api-slice.md) | slice, sliceHead, sliceTail, sliceMin, sliceMax, sliceSample |
| [`api-selectors.md`](api-selectors.md) | everything, startsWith, endsWith, contains, matches, numRange, negate |
| [`api-sequences.md`](api-sequences.md) | fullSeq, fullSeqDate, fullSeqDateISOString, vectorSeq, vectorSeqDate |
| [`api-other.md`](api-other.md) | complete, expand, fill, replaceNully, count, tally, total, addRows, TMath |

## Quick Install

```bash
npm install @tidyjs/tidy
```

```js
import { tidy, filter, mutate, arrange, desc, groupBy, summarize, sum } from '@tidyjs/tidy';
```

## Extension Packages

- `@tidyjs/tidy-moment` — Moment.js date/time extensions (not covered in these docs)
