---
title: Item Function API
sidebar_label: Item Functions
---

Mapping functions that map from a single item (or row) to a value. Typically used with [**mutate**](./tidy.md#mutate).



## rate 

Returns a function that computes a rate (numerator / denominator), setting the value to 0 if denominator = 0 and numerator = 0. If denominator or numerator are nully, the result is undefined.

### Parameters

#### `numerator`

```ts
| string /* key of object */
| (item: object, index: number, array: object[]) => number
```

Either a key of the object or an accessor function that returns a number given the object. This will be used as the numerator when computing the rate.

#### `denominator`

```ts
| string /* key of object */
| (item: object, index: number, array: object[]) => number
```

Either a key of the object or an accessor function that returns a number given the object. This will be used as the denominator when computing the rate.


#### `options?` 

```ts
{ 
  predicate?: (item: object, index: number, array: object[]) => boolean
  allowDivideByZero?: boolean
}   
```

* `allowDivideByZero = false`: If true, evaluates division when denominator is 0 (typically resulting in Infinity), otherwise rates with 0 denominators are `undefined`. 
* `predicate`: Optional parameter that when provided will return undefined as the value of the rate when the predicate function returns false. This is typically used for only computing rates when there is sufficient sample size (i.e., checking if the denominator is large enough). For example:

```js
rate('numerator', 'denominator', { predicate: d => d.denominator > 1000 })
```

### Usage

```js
const data = [
  { str: 'foo', value: 3, value2: 0 },
  { str: 'foo', value: 1, value2: 1 },
  { str: 'bar', value: 3, value2: null },
  { str: 'bar', value: null, value2: 4 },
  { str: 'bar', value: 0, value2: 0 },
  { str: 'bar', value: 7, value2: 35 },
];

tidy(
  data,
  mutate({
    rate1: rate(
      (d) => d.value * 100,
      (d) => d.value2
    ),
    rate2: rate('value', 'value2'),
  })
)
// output:
[
  { str: 'foo', value: 3, value2: 0, rate1: Infinity, rate2: Infinity },
  { str: 'foo', value: 1, value2: 1, rate1: 100, rate2: 1 },
  { str: 'bar', value: 3, value2: null, rate1: undefined, rate2: undefined, },
  { str: 'bar', value: null, value2: 4, rate1: 0, rate2: undefined },
  { str: 'bar', value: 0, value2: 0, rate1: 0, rate2: 0 },
  { str: 'bar', value: 7, value2: 35, rate1: 20, rate2: 0.2 },
]
```

---