# Slice

Subset rows by position, value, or random sampling.

```js
import { tidy, slice, sliceHead, sliceTail, sliceMin, sliceMax, sliceSample } from '@tidyjs/tidy';
```

---

<!-- keywords: slice, range, index, subset rows -->
## slice

Keep rows in a given index range (uses `Array.prototype.slice` semantics).

**Signature:** `slice<T>(start: number, end?: number)`
**Goes inside:** `tidy(data, slice(...))`

### Parameters
- **start** `number` -- start index (inclusive). Negative values count from the end.
- **end** `number` (optional) -- end index (exclusive). If omitted, slices to the end.

### Example
```js
const data = [{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }];

tidy(data, slice(1, 3));
// output: [{ v: 2 }, { v: 3 }]
```

---

<!-- keywords: head, first n, top rows, limit -->
## sliceHead

Keep the first N rows.

**Signature:** `sliceHead<T>(n: number)`
**Goes inside:** `tidy(data, sliceHead(...))`

### Parameters
- **n** `number` -- number of rows to keep from the start.

### Example
```js
tidy(data, sliceHead(2));
// output: [{ v: 1 }, { v: 2 }]
```

---

<!-- keywords: tail, last n, bottom rows -->
## sliceTail

Keep the last N rows.

**Signature:** `sliceTail<T>(n: number)`
**Goes inside:** `tidy(data, sliceTail(...))`

### Parameters
- **n** `number` -- number of rows to keep from the end.

### Example
```js
tidy(data, sliceTail(2));
// output: [{ v: 4 }, { v: 5 }]
```

---

<!-- keywords: min, smallest, bottom n, order by ascending -->
## sliceMin

Keep the N rows with the smallest values for a given key.

**Signature:** `sliceMin<T>(n: number, orderBy: string | string[] | Comparator<T>)`
**Goes inside:** `tidy(data, sliceMin(...))`

### Parameters
- **n** `number` -- number of rows to keep.
- **orderBy** `string | string[] | ((a, b) => number)` -- key name(s) to sort ascending by, or a custom comparator function.

### Example
```js
const data = [
  { name: 'a', score: 50 },
  { name: 'b', score: 10 },
  { name: 'c', score: 30 },
  { name: 'd', score: 80 },
];

tidy(data, sliceMin(2, 'score'));
// output: [{ name: 'b', score: 10 }, { name: 'c', score: 30 }]
```

---

<!-- keywords: max, largest, top n, order by descending -->
## sliceMax

Keep the N rows with the largest values for a given key.

**Signature:** `sliceMax<T>(n: number, orderBy: string | string[] | Comparator<T>)`
**Goes inside:** `tidy(data, sliceMax(...))`

### Parameters
- **n** `number` -- number of rows to keep.
- **orderBy** `string | string[] | ((a, b) => number)` -- key name(s) to sort descending by, or a custom comparator function.

### Example
```js
tidy(data, sliceMax(2, 'score'));
// output: [{ name: 'd', score: 80 }, { name: 'a', score: 50 }]
```

---

<!-- keywords: sample, random, shuffle -->
## sliceSample

Keep a random sample of N rows.

**Signature:** `sliceSample<T>(n: number, options?: { replace?: boolean })`
**Goes inside:** `tidy(data, sliceSample(...))`

### Parameters
- **n** `number` -- number of rows to sample.
- **options.replace** `boolean` -- if `true`, sample with replacement (same row can appear multiple times). Default: `false`.

### Example
```js
tidy(data, sliceSample(2));
// output: 2 randomly selected rows (without replacement)

tidy(data, sliceSample(5, { replace: true }));
// output: 5 rows sampled with replacement (may include duplicates)
```
