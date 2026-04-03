# Grouping API Reference

Detailed reference for `groupBy` and its export modes.

```js
import { tidy, groupBy, summarize, sum, mean, n } from '@tidyjs/tidy';
```

---

<!-- keywords: groupBy, group, nest, aggregate, split-apply-combine, grouped data -->
## groupBy

Groups data by one or more keys, runs tidy functions on each group, and returns results either as a flat array (default) or in a structured export format.

**Signature:**
```ts
groupBy(
  groupKeys: string | (d: T) => any | Array<string | (d: T) => any>,
  fns: TidyFn | TidyFn[],
  options?: GroupByOptions | ExportShortcut
)
```
**Goes inside:** `tidy()` pipeline

### Parameters

- **groupKeys** -- what to group by
  - `string` -- a property name: `'category'`
  - `(d) => any` -- an accessor function: `(d) => d.date.getFullYear()`
  - `Array<string | (d) => any>` -- multiple keys: `['category', 'region']`
  - Grouping uses strict equality (`===`). For non-primitive keys, return a primitive from an accessor function.
- **fns** -- tidy functions to run on each group's subset
  - A single function: `summarize({ total: sum('value') })`
  - An array of functions: `[filter((d) => d.active), summarize({ n: n() })]`
- **options?** -- controls output shape
  - Omitted or `undefined` -- returns a flat array with group keys merged back in (default)
  - `{ addGroupKeys: false }` -- flat array without merging group keys into results
  - An export shortcut (`groupBy.object()`, `groupBy.entries()`, etc.) -- returns structured output; makes the function a `TidyGroupExportFn` (must be last in the pipeline)

### Behavior

- Group keys are automatically merged back into each result item (disable with `addGroupKeys: false`).
- Without an export option, output is a flat `T[]` -- the results from all groups concatenated.
- With an export option, the return type changes (object, entries, Map, etc.) and the `groupBy` call must be the **last** step in the `tidy()` pipeline.

### Example: Default (flat array)

```js
const data = [
  { str: 'a', ing: 'x', value: 1 },
  { str: 'b', ing: 'x', value: 100 },
  { str: 'a', ing: 'y', value: 2 },
  { str: 'b', ing: 'y', value: 300 },
];

tidy(data, groupBy('str', [summarize({ total: sum('value') })]))
// output:
// [
//   { str: 'a', total: 3 },
//   { str: 'b', total: 400 }
// ]
```

### Example: Multi-key grouping

```js
tidy(data, groupBy(['str', 'ing'], [summarize({ total: sum('value') })]))
// output:
// [
//   { str: 'a', ing: 'x', total: 1 },
//   { str: 'a', ing: 'y', total: 2 },
//   { str: 'b', ing: 'x', total: 100 },
//   { str: 'b', ing: 'y', total: 300 }
// ]
```

### Example: Accessor function as key

```js
tidy(
  data,
  groupBy(
    (d) => (d.value >= 100 ? 'high' : 'low'),
    [summarize({ n: n() })]
  )
)
// output:
// [{ n: 2 }, { n: 2 }]
// Note: accessor-function keys are not merged back (no property name to use).
```

---

<!-- keywords: export, entries, nested, key-value pairs -->
## groupBy.entries()

Returns `[[key, values], ...]` -- an array of `[key, nestedEntriesOrLeafArray]` tuples.

**Signature:** `groupBy.entries(options?: ExportOptions)`
**Goes inside:** 3rd argument of `groupBy()`

### Example

```js
tidy(
  data,
  groupBy('str', [summarize({ total: sum('value') })], groupBy.entries())
)
// output:
// [
//   ['a', [{ str: 'a', total: 3 }]],
//   ['b', [{ str: 'b', total: 400 }]]
// ]
```

With `single: true` (unwraps single-item leaf arrays):

```js
tidy(
  data,
  groupBy('str', [summarize({ total: sum('value') })], groupBy.entries({ single: true }))
)
// output:
// [
//   ['a', { str: 'a', total: 3 }],
//   ['b', { str: 'b', total: 400 }]
// ]
```

---

<!-- keywords: export, entriesObject, key values object -->
## groupBy.entriesObject()

Returns `[{ key, values }, ...]` -- like `entries()` but as objects instead of tuples.

**Signature:** `groupBy.entriesObject(options?: ExportOptions)`
**Goes inside:** 3rd argument of `groupBy()`

### Example

```js
tidy(
  data,
  groupBy('str', [summarize({ total: sum('value') })], groupBy.entriesObject())
)
// output:
// [
//   { key: 'a', values: [{ str: 'a', total: 3 }] },
//   { key: 'b', values: [{ str: 'b', total: 400 }] }
// ]
```

---

<!-- keywords: export, object, dictionary, lookup, key-value -->
## groupBy.object()

Returns `{ key: values, ... }` -- a plain object keyed by group values.

**Signature:** `groupBy.object(options?: ExportOptions)`
**Goes inside:** 3rd argument of `groupBy()`

### Example

```js
tidy(
  data,
  groupBy('str', [summarize({ total: sum('value') })], groupBy.object())
)
// output:
// {
//   a: [{ str: 'a', total: 3 }],
//   b: [{ str: 'b', total: 400 }]
// }
```

Multi-key produces nested objects:

```js
tidy(
  data,
  groupBy(
    ['str', 'ing'],
    [summarize({ total: sum('value') })],
    groupBy.object({ single: true })
  )
)
// output:
// {
//   a: {
//     x: { str: 'a', ing: 'x', total: 1 },
//     y: { str: 'a', ing: 'y', total: 2 }
//   },
//   b: {
//     x: { str: 'b', ing: 'x', total: 100 },
//     y: { str: 'b', ing: 'y', total: 300 }
//   }
// }
```

---

<!-- keywords: export, map, ES Map -->
## groupBy.map()

Returns an ES `Map` where keys are group values (not tuples) and values are nested Maps or leaf arrays.

**Signature:** `groupBy.map(options?: ExportOptions)`
**Goes inside:** 3rd argument of `groupBy()`

### Example

```js
tidy(
  data,
  groupBy('str', [summarize({ total: sum('value') })], groupBy.map())
)
// output:
// new Map([
//   ['a', [{ str: 'a', total: 3 }]],
//   ['b', [{ str: 'b', total: 400 }]]
// ])
```

---

<!-- keywords: export, grouped, internal, Grouped Map, tuple keys -->
## groupBy.grouped()

Returns the raw internal `Grouped<T>` structure -- a `Map` where keys are `[keyName, keyValue]` tuples.

**Signature:** `groupBy.grouped(options?: ExportOptions)`
**Goes inside:** 3rd argument of `groupBy()`

### Example

```js
tidy(
  data,
  groupBy('str', [summarize({ total: sum('value') })], groupBy.grouped())
)
// output:
// new Map([
//   [['str', 'a'], [{ str: 'a', total: 3 }]],
//   [['str', 'b'], [{ str: 'b', total: 400 }]]
// ])
```

---

<!-- keywords: export, keys, group keys only -->
## groupBy.keys()

Returns just the group key values, no data.

**Signature:** `groupBy.keys(options?: ExportOptions)`
**Goes inside:** 3rd argument of `groupBy()`

### Example

```js
tidy(
  data,
  groupBy('str', [summarize({ total: sum('value') })], groupBy.keys())
)
// output:
// ['a', 'b']

// Multi-key:
tidy(
  data,
  groupBy(['str', 'ing'], [summarize({ total: sum('value') })], groupBy.keys())
)
// output:
// [['a', ['x', 'y']], ['b', ['x', 'y']]]
```

---

<!-- keywords: export, values, grouped values only -->
## groupBy.values()

Returns just the grouped value arrays, no keys.

**Signature:** `groupBy.values(options?: ExportOptions)`
**Goes inside:** 3rd argument of `groupBy()`

### Example

```js
tidy(
  data,
  groupBy('str', [summarize({ total: sum('value') })], groupBy.values())
)
// output:
// [
//   [{ str: 'a', total: 3 }],
//   [{ str: 'b', total: 400 }]
// ]
```

---

<!-- keywords: export, levels, per-level, mixed export, custom levels -->
## groupBy.levels()

Per-level export control for multi-key grouping. Each level can use a different export format. The last level specified repeats for remaining levels.

**Signature:** `groupBy.levels(options: ExportOptions & { levels: LevelSpec[] })`
**Goes inside:** 3rd argument of `groupBy()`

### Parameters (in the options object)

- **levels** (required) -- array of export type strings, one per grouping level:
  `'entries'` | `'entries-object'` | `'object'` | `'map'` | `'keys'` | `'values'` | `LevelSpec`
- Plus all common export options (`single`, `flat`, `mapLeaf`, etc.)

### Example

```js
tidy(
  data,
  groupBy(
    ['str', 'ing'],
    [summarize({ total: sum('value') })],
    groupBy.levels({ levels: ['entries-object', 'object'], single: true })
  )
)
// output:
// [
//   {
//     key: 'a',
//     values: {
//       x: { str: 'a', ing: 'x', total: 1 },
//       y: { str: 'a', ing: 'y', total: 2 }
//     }
//   },
//   {
//     key: 'b',
//     values: {
//       x: { str: 'b', ing: 'x', total: 100 },
//       y: { str: 'b', ing: 'y', total: 300 }
//     }
//   }
// ]
```

---

<!-- keywords: export options, single, flat, compositeKey, mapLeaf, mapLeaves, mapEntry, addGroupKeys -->
## Common Export Options

All export shortcut helpers (`groupBy.entries()`, `groupBy.object()`, etc.) accept an options object with these fields:

| Option | Type | Default | Description |
|---|---|---|---|
| `single` | `boolean` | `false` | Unwrap single-item leaf arrays to just the item. Typical after `summarize`. |
| `flat` | `boolean` | `false` | Flatten nested groups to a single level (multi-key grouping becomes one level). |
| `compositeKey` | `(keys: any[]) => string` | `keys.join('/')` | Custom function to create flat keys. Only used when `flat: true`. |
| `mapLeaf` | `(value: T) => any` | identity | Transform each individual leaf item during export. |
| `mapLeaves` | `(values: T[]) => any` | identity | Transform each leaf array (similar to d3 `rollup`). |
| `mapEntry` | `(entry: [key, values], level) => any` | identity | Transform each entry (for `entries` export only). |
| `addGroupKeys` | `boolean` | `true` | Set to `false` to prevent merging group keys back into result objects. |

### Example: flat with compositeKey

```js
tidy(
  data,
  groupBy(
    ['str', 'ing'],
    [summarize({ total: sum('value') })],
    groupBy.object({ flat: true, single: true, compositeKey: (keys) => keys.join('-') })
  )
)
// output:
// {
//   'a-x': { str: 'a', ing: 'x', total: 1 },
//   'a-y': { str: 'a', ing: 'y', total: 2 },
//   'b-x': { str: 'b', ing: 'x', total: 100 },
//   'b-y': { str: 'b', ing: 'y', total: 300 }
// }
```

### Example: mapLeaves

```js
tidy(
  data,
  groupBy(
    'str',
    [summarize({ total: sum('value') })],
    groupBy.entries({ mapLeaves: (leaves) => leaves.length })
  )
)
// output:
// [['a', 1], ['b', 1]]
```
