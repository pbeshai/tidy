---
name: tidyjs
description: Write correct, idiomatic tidyjs code. Activates when the user works with @tidyjs/tidy imports, mentions tidyjs, or asks about JavaScript data wrangling in a project that uses tidyjs.
---

**Before writing any tidyjs code, you MUST read the relevant docs.** tidyjs has a distinctive pipeline pattern and function taxonomy that differs from pandas, SQL, and lodash. Pre-training knowledge is often wrong for this library — always prefer the docs.

## Locating the docs

The genai-docs should be found at one of these locations. Check in order:

1. **npm package**: `node_modules/@tidyjs/tidy/genai-docs/`

If found, use that path as `DOCS_ROOT` below and proceed to **How to navigate**.

### If docs are not found locally

Fetch them from the public docs site. The AI-optimized docs are available at:

`https://pbeshai.github.io/tidy/genai-docs/`

The site also has `llms.txt` at `https://pbeshai.github.io/tidy/llms.txt` with a full index.

Key files to fetch:
- `https://pbeshai.github.io/tidy/genai-docs/mental-model.md` — start here
- `https://pbeshai.github.io/tidy/genai-docs/quick-reference.md` — task-to-function lookup
- `https://pbeshai.github.io/tidy/genai-docs/gotchas.md` — common mistakes
- Then fetch specific `api-*.md` files as needed

## How to navigate

1. **Start**: Read `DOCS_ROOT/mental-model.md` for the pipeline pattern, accessor conventions, and function taxonomy. This is essential before writing any code.
2. **Quick lookup**: Read `DOCS_ROOT/quick-reference.md` to find which function to use for a given task.
3. **API details**: Read the relevant `api-*.md` file for function signatures, parameters, and examples:
   - Core verbs (tidy, filter, mutate, arrange, select, etc.): `api-core.md`
   - Grouping: `api-grouping.md`
   - Summarize + aggregation functions: `api-summarize.md`
   - Vector/cross-item operations: `api-vector.md`
   - Joins: `api-joins.md`
   - Pivoting: `api-pivot.md`
   - Slicing: `api-slice.md`
   - Column selectors: `api-selectors.md`
   - Sequences: `api-sequences.md`
   - Other (complete, expand, fill, TMath, etc.): `api-other.md`
4. **Recipes**: Read `DOCS_ROOT/patterns.md` for multi-verb composition patterns.
5. **Avoid mistakes**: Read `DOCS_ROOT/gotchas.md` before finalizing code.

## Key principles

- **Always read before writing**: Read the relevant api doc for every function you use.
- **Pipeline pattern**: All transformations flow through `tidy(data, verb1(), verb2())`. Verbs are curried functions.
- **Accessor functions, not strings**: Use `(d) => d.column` for field access, not string column names (except in summary functions like `sum('key')` and sort helpers like `desc('key')`).
- **mutate vs mutateWithSummary**: `mutate` is per-item `(item, index, array) => value`. `mutateWithSummary` receives the full array `(items[]) => value[] | value`. Using summary/vector functions inside `mutate()` is a silent bug. Always check `gotchas.md` if unsure.
- **groupBy export modes**: Without an export option, `groupBy` returns a flat array. With `groupBy.object()`, `.entries()`, `.map()`, etc., the output shape changes. Export modes must be the last pipeline step.
- **Check the function taxonomy**: Summary functions go inside `summarize()`. Vector functions go inside `mutateWithSummary()`. Item functions go inside `mutate()`. Selectors go inside `select()`. Getting this wrong produces incorrect results.
