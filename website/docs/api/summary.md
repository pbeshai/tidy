---
title: Summarizer API
sidebar_label: Summarizers
---

Aggregation functions that given a collection of items produce a single value.



## deviation 

Computes the standard deviation as per [d3-array::deviation](https://github.com/d3/d3-array#deviation).

### Parameters

#### `key`

```ts
| string /* key of object */
| (item: object) => number
```

Either the key to compute the value over or an accessor function that maps a given item to the value to compute over.

### Usage

```js
const data = [
  { str: 'foo', value: 3 },
  { str: 'foo', value: 1 },
  { str: 'bar', value: 3 },
  { str: 'bar', value: 1 },
  { str: 'bar', value: 7 },
];

tidy(data, summarize({
  stdev: deviation('value'),
})
// output:
[{ stdev: 2.449 }]
```


---



## first 

Returns the value for the specified key from first item in the collection.

### Parameters

#### `key`

```ts
| string /* key of object */
| (item: object) => number
```

Either the key to compute the value over or an accessor function that maps a given item to the value to compute over.

### Usage

```js
const data = [
  { str: 'foo', value: 3 },
  { str: 'foo', value: 1 },
  { str: 'bar', value: 3 },
  { str: 'bar', value: 1 },
  { str: 'bar', value: 7 },
];

tidy(data, summarize({
  str: first('str'),
  value: sum('value'),
})
// output:
[{ str: 'foo', value: 15 }]
```


---



## last 

Returns the value for the specified key from last item in the collection.

### Parameters

#### `key`

```ts
| string /* key of object */
| (item: object) => number
```

Either the key to compute the value over or an accessor function that maps a given item to the value to compute over.

### Usage

```js
const data = [
  { str: 'foo', value: 3 },
  { str: 'foo', value: 1 },
  { str: 'bar', value: 3 },
  { str: 'bar', value: 1 },
  { str: 'bar', value: 7 },
];

tidy(data, summarize({
  str: last('str'),
  value: sum('value'),
})
// output:
[{ str: 'bar', value: 15 }]
```


---



## max 

Computes the max value as per [d3-array::max](https://github.com/d3/d3-array#max).

### Parameters

#### `key`

```ts
| string /* key of object */
| (item: object) => number
```

Either the key to compute the value over or an accessor function that maps a given item to the value to compute over.

### Usage

```js
const data = [
  { str: 'foo', value: 3 },
  { str: 'foo', value: 1 },
  { str: 'bar', value: 3 },
  { str: 'bar', value: 1 },
  { str: 'bar', value: 7 },
];

tidy(data, summarize({
  value: max('value'),
})
// output:
[{ value: 7 }]
```


---



## mean 

Computes the mean value as per [d3-array::mean](https://github.com/d3/d3-array#mean), using [d3-array::fsum](https://github.com/d3/d3-array#fsum) to reduce floating point errors.

### Parameters

#### `key`

```ts
| string /* key of object */
| (item: object) => number
```

Either the key to compute the value over or an accessor function that maps a given item to the value to compute over.

### Usage

```js
const data = [
  { str: 'foo', value: 3 },
  { str: 'foo', value: 1 },
  { str: 'bar', value: 3 },
  { str: 'bar', value: 1 },
  { str: 'bar', value: 7 },
];

tidy(data, summarize({
  value: mean('value'),
})
// output:
[{ value: 3 }]
```

---



## meanRate 

Computes the mean for fractional values by summing over the numerator and denominator individually first before dividing.

### Parameters

#### `numerator`

```ts
| string /* key of object */
| (item: object) => number
```

Either the key to compute the numerator over or an accessor function that maps a given item to the numerator value to compute over.

#### `denominator`

```ts
| string /* key of object */
| (item: object) => number
```

Either the key to compute the denominator over or an accessor function that maps a given item to the denominator value to compute over.

### Usage

```js
const data = [
  { str: 'foo', value: 3, value2: 4 },
  { str: 'foo', value: 0, value2: 0 },
  { str: 'bar', value: 0, value2: 3 },
  { str: 'bar', value: 1, value2: 2 },
  { str: 'bar', value: 7, value2: 10 },
];

tidy(data, summarize({
  meanValue: meanRate('value', 'value2'),
}))
// output:
[{ meanValue: 11 / 19 }]
```


---



## median 

Computes the median value as per [d3-array::median](https://github.com/d3/d3-array#median).

### Parameters

#### `key`

```ts
| string /* key of object */
| (item: object) => number
```

Either the key to compute the value over or an accessor function that maps a given item to the value to compute over.

### Usage

```js
const data = [
  { str: 'foo', value: 3 },
  { str: 'foo', value: 1 },
  { str: 'bar', value: 3 },
  { str: 'bar', value: 1 },
  { str: 'bar', value: 7 },
];

tidy(data, summarize({
  value: median('value'),
})
// output:
[{ value: 3 }]
```

---



## min 

Computes the min value as per [d3-array::min](https://github.com/d3/d3-array#min).

### Parameters

#### `key`

```ts
| string /* key of object */
| (item: object) => number
```

Either the key to compute the value over or an accessor function that maps a given item to the value to compute over.

### Usage

```js
const data = [
  { str: 'foo', value: 3 },
  { str: 'foo', value: 1 },
  { str: 'bar', value: 3 },
  { str: 'bar', value: 1 },
  { str: 'bar', value: 7 },
];

tidy(data, summarize({
  value: min('value'),
})
// output:
[{ value: 1 }]
```


---



## n 

Computes the number of items in the collection.

### Parameters

#### `options?` 

```ts
{ 
  predicate?: (item: object, index: number, items: object[]) => boolean
}   
```

* `predicate`: When provided, only count items that return true when passed to this function.

### Usage

```js
const data = [
  { str: 'foo', value: 3 },
  { str: 'foo', value: 1 },
  { str: 'bar', value: 3 },
  { str: 'bar', value: 1 },
  { str: 'bar', value: 7 },
];

tidy(data, summarize({
  count: n(),
  countFoo: n({ predicate: d => d.str === 'foo' })
})
// output:
[{ count: 5, countFoo: 2 }]
```



---



## nDistinct

Computes the number of distinct values for a key in the collection.

### Parameters

#### `key`

```ts
| string /* key of object */
| (item: object) => any
```

The key or function to compute the distinct values over.


#### `options`

```ts
{ 
  includeNull?: boolean = true
  includeUndefined?: boolean = false
}
```

* `includeNull = true` whether or not to count `null` as a distinct value
* `includeUndefined = false` whether or not to count `undefined` as a distinct value


### Usage

```js
const data = [
  { str: 'foo', value: 3 },
  { str: 'foo', value: 1 },
  { str: 'bar', value: 3 },
  { str: 'bar', value: 1 },
  { str: 'bar', value: 7 },
  { str: 'bar', value: undefined },
];

tidy(data, summarize({
  numStr: nDistinct('str'),
})
// output:
[{ numStr: 2 }]

tidy(data, summarize({
  numValue: nDistinct(d => d.value),
})
// output:
[{ numValue: 3 }]

tidy(data, summarize({
  numValue: nDistinct(d => d.value, { includeUndefined: true }),
})
// output:
[{ numValue: 4 }]
```


---



## sum 

Computes the sum as per [d3-array::fsum](https://github.com/d3/d3-array#fsum).

### Parameters

#### `key`

```ts
| string /* key of object */
| (item: object) => number
```

Either the key to compute the value over or an accessor function that maps a given item to the value to compute over.

#### `options?` 

```ts
{ 
  predicate?: (item: object, index: number, items: object[]) => boolean
}   
```

* `predicate`: When provided, only sum items that return true when passed to this function.



### Usage

```js
const data = [
  { str: 'foo', value: 3 },
  { str: 'foo', value: 1 },
  { str: 'bar', value: 3 },
  { str: 'bar', value: 1 },
  { str: 'bar', value: 7 },
];

tidy(data, summarize({
  value: sum('value'),
  valueFoo: sum('value', { predicate: d => d.str === 'foo' })
})
// output:
[{ value: 15, valueFoo: 4 }]
```


---




## variance 

Computes the variance as per [d3-array::variance](https://github.com/d3/d3-array#variance).

### Parameters

#### `key`

```ts
| string /* key of object */
| (item: object) => number
```

Either the key to compute the value over or an accessor function that maps a given item to the value to compute over.

### Usage

```js
const data = [
  { str: 'foo', value: 3 },
  { str: 'foo', value: 1 },
  { str: 'bar', value: 3 },
  { str: 'bar', value: 1 },
  { str: 'bar', value: 7 },
];

tidy(data, summarize({
  value: variance('value'),
})
// output:
[{ value: 6 }]
```


---