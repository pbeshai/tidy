# Sequences

Generate full sequences of values. Typically used inside `complete()` or `expand()` to define the full range of a variable.

```js
import { tidy, complete, expand,
  fullSeq, fullSeqDate, fullSeqDateISOString,
  vectorSeq, vectorSeqDate
} from '@tidyjs/tidy';
```

---

<!-- keywords: full sequence, numeric sequence, fill range, step -->
## fullSeq

Generate a full numeric sequence from min to max of a column's values.

**Signature:** `fullSeq<T>(key: keyof T | ((d: T) => number), period?: number)`
**Returns:** `(items: T[]) => number[]`

### Parameters
- **key** `keyof T | ((d: T) => number)` -- column name or accessor to read numeric values from.
- **period** `number` -- step size between values. Default: `1`.

### Example
```js
const data = [
  { year: 2020, value: 10 },
  { year: 2023, value: 30 },
];

tidy(data, complete({ year: fullSeq('year') }));
// fills in missing years: 2020, 2021, 2022, 2023
// rows for 2021 and 2022 are added with value: undefined
```

---

<!-- keywords: full date sequence, date range, granularity, day week month -->
## fullSeqDate

Generate a full date sequence from min to max of a column's Date values.

**Signature:** `fullSeqDate<T>(key: keyof T | ((d: T) => Date), granularity?: Granularity, period?: number)`
**Returns:** `(items: T[]) => Date[]`

### Parameters
- **key** `keyof T | ((d: T) => Date)` -- column name or accessor to read Date values from.
- **granularity** `Granularity` -- step unit. One of: `'second'` / `'s'`, `'minute'` / `'min'`, `'day'` / `'d'`, `'week'` / `'w'`, `'month'` / `'m'`, `'year'` / `'y'` (and plural forms). Default: `'day'`.
- **period** `number` -- number of granularity units per step. Default: `1`.

### Example
```js
const data = [
  { date: new Date('2023-01-01'), value: 1 },
  { date: new Date('2023-01-04'), value: 4 },
];

tidy(data, complete({ date: fullSeqDate('date', 'day') }));
// fills in Jan 1, 2, 3, 4 -- adds rows for Jan 2 and Jan 3
```

---

<!-- keywords: full date sequence ISO, date string, ISO 8601 -->
## fullSeqDateISOString

Same as `fullSeqDate` but returns ISO 8601 strings instead of Date objects.

**Signature:** `fullSeqDateISOString<T>(key: keyof T | ((d: T) => string), granularity?: Granularity, period?: number)`
**Returns:** `(items: T[]) => string[]`

### Parameters
Same as `fullSeqDate`. The key accessor should return a string parseable by `new Date(...)`.

### Example
```js
const data = [
  { date: '2023-01-01', value: 1 },
  { date: '2023-01-03', value: 3 },
];

tidy(data, complete({ date: fullSeqDateISOString('date', 'day') }));
// fills dates as ISO strings: '2023-01-01T00:00:00.000Z', '2023-01-02T00:00:00.000Z', ...
```

---

<!-- keywords: vector sequence, explicit values, numeric -->
## vectorSeq

Generate a numeric sequence from an explicit array of values (min to max with a step).

**Signature:** `vectorSeq(values: number[], period?: number): number[]`
**Returns:** `number[]` (not a factory function -- returns the sequence directly)

### Parameters
- **values** `number[]` -- array of numbers. The sequence spans from `min(values)` to `max(values)`.
- **period** `number` -- step size. Default: `1`.

### Example
```js
vectorSeq([2, 8], 2);
// output: [2, 4, 6, 8]
```

---

<!-- keywords: vector date sequence, explicit date values -->
## vectorSeqDate

Generate a date sequence from an explicit array of Date values (min to max).

**Signature:** `vectorSeqDate(values: Date[], granularity?: Granularity, period?: number): Date[]`
**Returns:** `Date[]` (not a factory function -- returns the sequence directly)

### Parameters
- **values** `Date[]` -- array of Dates. The sequence spans from earliest to latest.
- **granularity** `Granularity` -- step unit. Default: `'day'`.
- **period** `number` -- number of granularity units per step. Default: `1`.

### Example
```js
vectorSeqDate([new Date('2023-01-01'), new Date('2023-01-03')], 'day');
// output: [Date(Jan 1), Date(Jan 2), Date(Jan 3)]
```
