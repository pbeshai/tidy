# Joins

Join two collections by matching keys.

```js
import { tidy, innerJoin, leftJoin, fullJoin } from '@tidyjs/tidy';
```

---

<!-- keywords: inner join, merge, combine, matching rows -->
## innerJoin

Keep only rows that have a match in both collections.

**Signature:** `innerJoin<T, JoinT>(itemsToJoin: JoinT[], options?: { by?: string | string[] | Record<string, string> })`
**Goes inside:** `tidy(data, innerJoin(...))`

### Parameters
- **itemsToJoin** `JoinT[]` -- the right-side array to join against.
- **options.by** `string | string[] | { [rightKey]: leftKey }` -- how to match rows. A single key name, array of shared key names, or an object mapping right-side keys to left-side keys. If omitted, auto-detects shared keys from the first elements of each array.

### Example
```js
const data = [
  { id: 1, value: 10 },
  { id: 2, value: 20 },
];
const lookup = [
  { id: 1, label: 'a' },
  { id: 3, label: 'c' },
];

tidy(data, innerJoin(lookup, { by: 'id' }));
// output: [{ id: 1, value: 10, label: 'a' }]
// row id=2 dropped (no match), row id=3 dropped (not in left)
```

---

<!-- keywords: left join, merge, keep all left, nullable right -->
## leftJoin

Keep all left-side rows. Adds right-side columns where a match exists; fills with `undefined` where no match is found.

**Signature:** `leftJoin<T, JoinT>(itemsToJoin: JoinT[], options?: { by?: string | string[] | Record<string, string> })`
**Goes inside:** `tidy(data, leftJoin(...))`

### Parameters
- **itemsToJoin** `JoinT[]` -- the right-side array to join against.
- **options.by** -- same as `innerJoin`. If omitted, auto-detects shared keys.

### Example
```js
const data = [
  { id: 1, value: 10 },
  { id: 2, value: 20 },
];
const lookup = [
  { id: 1, label: 'a' },
];

tidy(data, leftJoin(lookup, { by: 'id' }));
// output:
// [
//   { id: 1, value: 10, label: 'a' },
//   { id: 2, value: 20, label: undefined },
// ]
```

---

<!-- keywords: full join, outer join, merge, keep all rows -->
## fullJoin

Keep all rows from both sides. Unmatched columns are filled with `undefined`.

**Signature:** `fullJoin<T, JoinT>(itemsToJoin: JoinT[], options?: { by?: string | string[] | Record<string, string> })`
**Goes inside:** `tidy(data, fullJoin(...))`

### Parameters
- **itemsToJoin** `JoinT[]` -- the right-side array to join against.
- **options.by** -- same as `innerJoin`. If omitted, auto-detects shared keys.

### Example
```js
const data = [
  { id: 1, value: 10 },
  { id: 2, value: 20 },
];
const other = [
  { id: 2, label: 'b' },
  { id: 3, label: 'c' },
];

tidy(data, fullJoin(other, { by: 'id' }));
// output:
// [
//   { id: 1, value: 10, label: undefined },
//   { id: 2, value: 20, label: 'b' },
//   { id: undefined, value: undefined, label: 'c' },
// ]
// id=3 row added from right side with left columns undefined
```

---

## Joining on different key names

Use an object `{ rightKey: 'leftKey' }` to join when column names differ:

```js
const orders = [{ orderId: 1, userId: 100 }];
const users = [{ uid: 100, name: 'Alice' }];

tidy(orders, leftJoin(users, { by: { uid: 'userId' } }));
// output: [{ orderId: 1, userId: 100, uid: 100, name: 'Alice' }]
```
