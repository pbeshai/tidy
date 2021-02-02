---
title: Selectors API
sidebar_label: Selectors 
---

A collection of helper functions to get a subset of keys for a set of objects. Typically used by [**select**](./tidy.md#select--pick).


## contains 

Returns all keys that contain the specified substring.

### Parameters

#### `substring`

```ts
string
```

The substring that must exist in the keys.

#### `ignoreCase`

```ts
boolean = true
```

If true, matches without considering whether letters are upper or lower case (default: true).


### Usage

```js
const data = [
  { foo: 1, bar: 20, foobar: 300, FoObAR: 90 },
];

tidy(data, select([contains('oba')]))
// output:
[{ foobar: 300, FoObAR: 90 }]

tidy(data, select([contains('oba', false)]))
// output:
[{ foobar: 300 }]
```


---


## endsWith 

Returns all keys that end with the specified substring.

### Parameters

#### `suffix`

```ts
string
```

The suffix that must exist in the keys.

#### `ignoreCase`

```ts
boolean = true
```

If true, matches without considering whether letters are upper or lower case (default: true).


### Usage

```js
const data = [
  { foo: 1, bar: 20, foobar: 300, FoObAR: 90 },
];

tidy(data, select([endsWith('bAR')]))
// output:
[{ foobar: 300, FoObAR: 90 }]

tidy(data, select([endsWith('bAR', false)]))
// output:
[{ FoObAR: 90 }]
```

---



## everything 

Returns all keys for items in the collection. It is naive and looks only at the first element in the collection.

### Usage

```js
const data = [
  { foo: 1, bar: 20, foobar: 300, FoObAR: 90 },
];

tidy(data, select(['foobar', everything(), '-FoObAR']))
// output:
[{ foobar: 300, foo: 1, bar: 20 }]
```

---


## matches 

Returns all keys that start with the specified substring.

### Parameters

#### `regex`

```ts
RegExp
```

The regular expression used to match keys against. You must provide the `i` flag to have case ignored.

### Usage

```js
const data = [
  { foo: 1, bar: 20, foobar: 300, FoObAR: 90 },
];

tidy(data, select([matches(/oba/i)]))
// output:
[{ foobar: 300, FoObAR: 90 }]

tidy(data, select([matches(/oba/)]))
// output:
[{ foobar: 300 }]
```


## negate 

Converts the output of any given selector(s) to be prefixed with `-`, so when combined with select, those keys are dropped.

### Parameters

#### `selectors`

```ts
| string /* keys in the object */  
| (items: T[]) => string[] /* selector functions */
| (string | (items: T[]) => string[])[]
```

Single or array of selector keys or functions.


### Usage

```js
const data = [{
  date: '2021-01-01',
  test_bigint: 123,
  test: 12,
  foo_bigint: 99,
  bar: 13,
}];

tidy(data, 
  select([negate(endsWith('_bigint')), '-date']))
// output:
[{ test: 12, bar: 13 }]

// same as:
tidy(data, 
  select(['-test_bigint', '-foo_bigint', '-date']))
```



---

## numRange 

Returns all keys that start with the specified substring combined with a numerical suffix within a specified range.

### Parameters

#### `prefix`

```ts
string
```

The prefix for the keys that will have the numbers appended to.

#### `range`

```ts
[number, number]
```

The `[min, max]` numbers to generate the keys over.


#### `width?`

```ts
number | undefined
```

How many leading zeroes the numbers should have, defaults to none. 



### Usage

```js
const data = [
  { foo07: 1, foo08: 20, foo10: 300, foo11: 90, foo12: 12, bar08: 8, foo: 1 },
];

tidy(data, select([numRange('foo', [8, 11], 2)]))
// output:
[{ foo08: 20, foo10: 300, foo11: 90 }]
```

---


## startsWith 

Returns all keys that start with the specified substring.

### Parameters

#### `prefix`

```ts
string
```

The prefix that must exist in the keys.

#### `ignoreCase`

```ts
boolean = true
```

If true, matches without considering whether letters are upper or lower case (default: true).


### Usage

```js
const data = [
  { foo: 1, bar: 20, foobar: 300, FoObAR: 90 },
];

tidy(data, select([startsWith('bAR')]))
// output:
[{ foobar: 300, FoObAR: 90 }]

tidy(data, select([startsWith('bAR', false)]))
// output:
[{ FoObAR: 90 }]
```

---