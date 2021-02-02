---
title: Sequence API
sidebar_label: Sequences
---

## fullSeq

Creates a full sequence of number values for a key given a set of data. The bounds of the sequence are determined from the existing values within the data. Typically used in combination with [**expand**](#expand) or [**complete**](#complete).

### Parameters

#### `key`

```ts
| string 
| (item: object) => number
```

The key within the data to expand the sequence across.


#### `period`

```ts
number = 1
```

The gap between each value in the data (how much the sequence increments by).


### Usage

```js
const data = [
  { str: 'foo', value: 3 },
  { str: 'foo', value: 1 },
  { str: 'foo', value: 5 },
  { str: 'foo', value: 10 },
  { str: 'foo', value: 1 },
];

fullSeq(data, 'value', 1);
// output:
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

---

## fullSeqDate

Creates a full sequence of date values for a key given a set of data. The bounds of the sequence are determined from the existing values within the data. Typically used in combination with [**expand**](#expand) or [**complete**](#complete).

Similar to [**fullSeq**](#fullseq).

### Parameters

#### `key`

```ts
| string 
| (item: object) => Date
```

The key within the data to expand the sequence across.


#### `granularity`

```ts
'day' | 'week' | 'month' | 'year' = 'day'
```

The granularity to increment the data by.


#### `period`

```ts
number = 1
```

The gap between each value in the data (how much the sequence increments by).


### Usage

```js
const data = [
  { str: 'foo', date: new Date('2020-04-01') },
  { str: 'foo', date: new Date('2020-04-02') },
  { str: 'foo', date: new Date('2020-04-03') },
  { str: 'foo', date: new Date('2020-04-06') },
  { str: 'foo', date: new Date('2020-04-08') },
];

fullSeqDate(data, 'date', 'day', 1)
// output:
[
  new Date('2020-04-01'),
  new Date('2020-04-02'),
  new Date('2020-04-03'),
  new Date('2020-04-04'),
  new Date('2020-04-05'),
  new Date('2020-04-06'),
  new Date('2020-04-07'),
  new Date('2020-04-08'),
]
```

---

## fullSeqDateISOString

Creates a full sequence of date ISO string values for a key given a set of data. The bounds of the sequence are determined from the existing values within the data. Typically used in combination with [**expand**](#expand) or [**complete**](#complete).

Similar to [**fullSeq**](#fullseq).

### Parameters

#### `key`

```ts
| string /* key of item */
| (item: object) => string /* date ISO string */
```

The key within the data to expand the sequence across.


#### `granularity`

```ts
'day' | 'week' | 'month' | 'year' = 'day'
```

The granularity to increment the data by.


#### `period`

```ts
number = 1
```

The gap between each value in the data (how much the sequence increments by).


### Usage

```js
 const data = [
  { str: 'foo', timestamp: '2020-04-01T00:00:00.000Z' },
  { str: 'foo', timestamp: '2020-04-02T00:00:00.000Z' },
  { str: 'foo', timestamp: '2020-04-03T00:00:00.000Z' },
  { str: 'foo', timestamp: '2020-04-06T00:00:00.000Z' },
  { str: 'foo', timestamp: '2020-04-08T00:00:00.000Z' },
];

fullSeqDateISOString(data, 'timestamp', 'day', 1)
// output:
[
  '2020-04-01T00:00:00.000Z',
  '2020-04-02T00:00:00.000Z',
  '2020-04-03T00:00:00.000Z',
  '2020-04-04T00:00:00.000Z',
  '2020-04-05T00:00:00.000Z',
  '2020-04-06T00:00:00.000Z',
  '2020-04-07T00:00:00.000Z',
  '2020-04-08T00:00:00.000Z',
]
```
