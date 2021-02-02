---
title: Vector Function API
sidebar_label: Vector Functions
---

Mapping functions that given a collection of items produce an array of values (a "vector") equal in length to the collection. Typically used with [**mutateWithSummary**](./tidy.md#mutatewithsummary).


## cumsum 

Returns a function that computes a cumulative sum as per [d3-array::cumsum](https://github.com/d3/d3-array#cumsum). 

### Parameters


#### `key`

```ts
| string /* key of object */
| (item: object) => number | null | undefined
```

Either the key to compute the value over or an accessor function that maps a given item to the value to compute over.

### Usage

```js
const data = [
  { str: 'foo', value: 3, value2: 1 },
  { str: 'bar', value: 1, value2: 3 },
  { str: 'bar', value: null, value2: undefined },
  { str: 'bar', value: 5, value2: 4 },
];

tidy(
  data,
  mutateWithSummary({
    cumsum1: cumsum('value'),
    cumsum2: cumsum((d) => (d.value == null ? d.value : d.value2 * 2)),
  })
);
// output:
[
  { str: 'foo', value: 3,    value2: 1,         cumsum1: 3, cumsum2: 2 },
  { str: 'bar', value: 1,    value2: 3,         cumsum1: 4, cumsum2: 8 },
  { str: 'bar', value: null, value2: undefined, cumsum1: 4, cumsum2: 8 },
  { str: 'bar', value: 5,    value2: 4,         cumsum1: 9, cumsum2: 16 },
]
```


---


## roll 

Computes values over a rolling window. Typically used for calculating moving averages or running sums.

### Parameters

#### `width`

```ts
number
```

The size of the window.


#### `rollFn`

```ts
(itemsInWindow: object[], endIndex: number) => any
```

The function used to apply to the window, reduces to a single value for the window. Given the subset of items that are within the window as well as the ending index in the original array.


#### `options`

```ts
{
  partial?: boolean
}
```

- `partial = false` If true, will compute the value even if the size of the window is less than the specified width. Otherwise, the rolled up value will be undefined.


### Usage

```js
const data = [
  { str: 'foo', value: 3 },
  { str: 'foo', value: 1 },
  { str: 'bar', value: 3 },
  { str: 'bar', value: 1 },
  { str: 'bar', value: 7 },
];

tidy(data, mutateWithSummary({
  movingAvg: roll(3, mean('value'), { partial: true }),
}))
// output:
[
  { str: 'foo', value: 3, movingAvg: 3 / 1 }, // partial
  { str: 'foo', value: 1, movingAvg: 4 / 2 }, // partial
  { str: 'bar', value: 3, movingAvg: 7 / 3 },
  { str: 'bar', value: 1, movingAvg: 5 / 3 },
  { str: 'bar', value: 7, movingAvg: 11 / 3 },
]
```


---