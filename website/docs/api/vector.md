---
title: Vector Function API
sidebar_label: Vector Functions
---

Mapping functions that given a collection of items produce an array of values (a "vector") equal in length to the collection. Typically used with [**mutateWithSummary**](./tidy.md#mutatewithsummary).


## cumsum 

Returns a function that computes a cumulative sum as per [d3-array::cumsum](https://github.com/d3/d3-array#cumsum), using [d3-array::fsum](https://github.com/d3/d3-array#fsum) to reduce floating point errors.

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


## lag 

Lags a vector by a specified offset (`options.n`, default 1). Useful for finding previous values to compute deltas with later. It can be convenient to use [**TMath::subtract**](./math.md#subtract) and[**TMath::add**](./math.md#add) with these values to handle nulls.

### Parameters

#### `key`

```ts
| string /* key of object */
| (item: object) => any
```

Either the key to compute the value over or an accessor function that maps a given item to the value to compute over.


#### `options`

```ts
{
  n?: number = 1
  default?: any
}
```

- `n = 1` The number of positions to lag by. e.g. given `[1,2,3,4]` a lag `n` of 1 would produce `[undefined,1,2,3]`
- `default = undefined` The default value for non-existent rows (e.g. we've lagged before the first element).


### Usage

```js
const data = [
  { str: 'foo', value: 1 },
  { str: 'foo', value: 2 },
  { str: 'bar', value: 4 },
]

tidy(
  data,
  mutateWithSummary({
    prev1: lag('value'),
    prev1_0: lag('value', { default: 0 }),
    prev2: lag('value', { n: 2 }),
    prev3: lag('value', { n: 3 }),
    other: lag('other'),
  }),
  mutate({
    delta1_0: (d) => d.value - d.prev1_0,
  })
)

// output:
[
  { str: 'foo', value: 1, prev1: undefined, prev1_0: 0, delta1_0: 1 },
  { str: 'foo', value: 2, prev1: 1, prev1_0: 1, delta1_0: 1 },
  { str: 'bar', value: 4, prev1: 2, prev1_0: 2, prev2: 1 , delta1_0: 2 },
]
```



---


## lead 

Leads a vector by a specified offset (`options.n`, default 1). Useful for finding next values to compute deltas with later. It can be convenient to use [**TMath::subtract**](./math.md#subtract) and[**TMath::add**](./math.md#add) with these values to handle nulls.

### Parameters

#### `key`

```ts
| string /* key of object */
| (item: object) => any
```

Either the key to compute the value over or an accessor function that maps a given item to the value to compute over.


#### `options`

```ts
{
  n?: number = 1
  default?: any
}
```

- `n = 1` The number of positions to lead by. e.g. given `[1,2,3,4]` a lead `n` of 1 would produce `[2,3,4,undefined]`
- `default = undefined` The default value for non-existent rows (e.g. we've lagged before the first element).


### Usage

```js
const data = [
  { str: 'foo', value: 1 },
  { str: 'foo', value: 2 },
  { str: 'bar', value: 4 },
]

tidy(
  data,
  mutateWithSummary({
    next1: lead('value'),
    next1_0: lead('value', { default: 0 }),
    next2: lead('value', { n: 2 }),
    next3: lead('value', { n: 3 }),
    other: lead('other'),
  }),
  mutate({
    delta1: (d) => TMath.subtract(d.value, d.next1),
  })
)

// output:
[
  { str: 'foo', value: 1, next1: 2, next1_0: 2, next2: 4, delta1: -1 },
  { str: 'foo', value: 2, next1: 4, next1_0: 4, delta1: -2 },
  { str: 'bar', value: 4, next1: undefined, next1_0: 0, delta1: undefined },
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