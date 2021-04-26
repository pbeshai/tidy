---
title: Tidy Function API
sidebar_label: Tidy Functions
---

Tidy functions are the main function used in a `tidy(...)` flow. These are the primary functions to be used when wrangling data. They expect their input to either be a flat list of items.


## tidy 

The main function that starts a tidy flow. Used to chain multiple tidy functions together and to smartly handle working with grouped data. The items it works with must be a flat list.

### Parameters

#### `items`

```ts
object[]
```

The collection of data to work with, a flat array of items.

#### `...tidyFns`

```ts
| (items: object[]) => object[]
| groupBy() => any /* with export options specified */
```

Any number of functions can be supplied to tidy which will be called as if in a pipeline: the output of function 1 is the input to function 2.

The typical case is `(items: object[]) => object[]`, but [**groupBy**](./groupby.md) may output something different if you specify an [export option](./groupby.md#group-exports). If you do export from groupBy, it must be the last function called in the tidy flow.


### Usage

```js
const data = [
  { str: 'foo', value: 3 },
  { str: 'foo', value: 3 },
  { str: 'foo', value: 1 },
  { str: 'bar', value: 3 },
  { str: 'bar', value: 1 },
  { str: 'bar', value: 1 },
  { str: 'foo', value: 3 },
  { str: 'bar', value: 7 },
];

tidy(
  data,
  distinct(['str', 'value']),
  filter((d) => d.value <= 3),
  summarize({ summedValue: sum('value') })
);
// output:
[{ summedValue: 8 }]
```


---

## addItems / addRows

Adds items to the end of a collection.

### Parameters

#### `itemsToAdd`
```ts
| object 
| object[] 
| (items: object[]) => (object | object[])
```

The items to add to the collection or a function that resolves to items to add given the input set.


### Usage

```js
const data = [{ a: 1 }, { a: 2 }];

tidy(data, addRows({ a: 3 }));
// output:
[{ a: 1 }, { a: 2 }, { a: 3 }]

tidy(data, addRows([{ a: 4 }]));
// output:
[{ a: 1 }, { a: 2 }, { a: 4 }]

tidy(data, addRows((items) => [{ a: items.length * 10 }]));
// output:
[{ a: 1 }, { a: 2 }, { a: 10 }]
```



---

## arrange / sort

Sorts items by the specified keys and comparators.

### Parameters

#### `comparators`

```ts
| string /* key of item */
| ((a: object, b: object) => number) 
| Array<string | ((a: object, b: object) => number)>
```

A key or set of keys of the item to sort by, or comparator functions that return -1, 0, or 1 if a < b, a == b, a > b respectively. You can mix and match keys and comparator functions when supplying an array.

For convenience, you can flip to descending order for keys by wrapping the key string with the `desc(key: string)` function. There is a corresponding `asc(key: string)` function for ascending data, but this is the default, so is unnecessary to use.

You can also sort the values for a key in a pre-specified order with the fixedOrder function:

```ts
fixedOrder(
  key: string | ((d) => any), 
  order: string[], 
  options: { position: 'start' | 'end' })
```

### Usage

```js
const data = [
  { str: 'foo', value: 3 },
  { str: 'foo', value: 4 },
  { str: 'bar', value: 2 },
  { str: 'bar', value: 1 },
  { str: 'bar', value: 5 },
];

tidy(data, arrange(['str', desc('value')])
// output:
[
  { str: 'bar', value: 5 },
  { str: 'bar', value: 2 },
  { str: 'bar', value: 1 },
  { str: 'foo', value: 4 },
  { str: 'foo', value: 3 },
] 

tidy(data, arrange((a, b) => a.value - b.value));
// output:
[
  { str: 'bar', value: 1 },
  { str: 'bar', value: 2 },
  { str: 'foo', value: 3 },
  { str: 'foo', value: 4 },
  { str: 'bar', value: 5 },
] 

tidy(data, arrange([fixedOrder('value', [5,4,1,3,2])]));
// output:
[
  { str: 'bar', value: 5 }, // <-- pinned to start
  { str: 'foo', value: 4 },
  { str: 'bar', value: 1 },
  { str: 'foo', value: 3 }, // <-- unsorted items
  { str: 'bar', value: 2 },
] 

tidy(data, 
  arrange([
    fixedOrder('value', [5,4,1], { position: 'end' })
  ]));
// output:
[
  { str: 'foo', value: 3 }, // <-- unsorted items
  { str: 'bar', value: 2 },
  { str: 'bar', value: 5 }, // <-- pinned to end
  { str: 'foo', value: 4 },
  { str: 'bar', value: 1 },
] 
```


---

## complete

Complete a collection with missing combinations of data, can be useful for zero filling data. This is a convenience function that combines [**expand**](#expand), [**leftJoin**](#leftjoin), and [**replaceNully**](#replacenully).

### Parameters

#### `expandKeys`

```ts
| string /* key of item */
| string[]
| { [key]: string | any[] | (items: object[]) => any[] }
```

The keys to expand the collection to have all combinations of. This can be specified as a single key string, an array of key strings or a key mapping object. The key mapping object maps from keys in the items to either:

- `{ a: 'a' }`: the key name itself. In this case, the values to use for the combinations will be derived from what is in the data currently. 
- `{ a: [1, 2, 3, 4] }` an array of values denoting all possible values for this key, even if they do not occur in the data.
- `{ a: fullSeq('a') }` a function mapping from the items in the collection to an array of all possible values. This is typically used in combination with sequence helper functions like [**fullSeq**](#fullseq). 

#### `replaceNullySpec`

```ts
{ [key]: any }
```

A map from key name to the value that nully values should be replaced with for that key. For example, given an objects of the shape `{a: number, b: string}`, the **replaceNullySpec** may look like `{ a: -1, b: 'n/a' }`. Note you are not required to fill in values for all keys– any unspecified keys will keep their nully value.


### Usage

```js
const data = [
  { a: 1, b: 'b1', c: 100 },
  { a: 2, b: 'b1', c: 200 },
  { a: 3, b: 'b1', c: 300 },
  { a: 1, b: 'b2', c: 101 },
  { a: 2, b: 'b2', c: 201 },
];

tidy(data, complete(['a', 'b'], { c: 0 }))
// output:
[
  { a: 1, b: 'b1', c: 100 },
  { a: 1, b: 'b2', c: 101 },
  { a: 2, b: 'b1', c: 200 },
  { a: 2, b: 'b2', c: 201 },
  { a: 3, b: 'b1', c: 300 },
  { a: 3, b: 'b2', c: 0 },
] 
```

---

## count

Tallies the number distinct values for the specified keys and adds the count as a new key (default `n`). Optionally sorts by the count. This is a convenience wrapper around [**groupBy**](./groupby.md), [**tally**](#tally), and optionally [**arrange**](#arrange).

### Parameters

#### `groupKeys`

```ts
| string /* key of item */
| (item: object) => any
| Array<string | (item: object) => any>
```

The group keys to pass to [**groupBy**](./groupby.md). Either a key in the item or an accessor function that returns the grouping value, or an array combining these two options.

#### `options`

```ts
{ 
  name: string = 'n', 
  sort: boolean = false,
}
```

* `name = 'n'`: The name of the count value in the resulting items.
* `sort = false`: Whether or not the resulting items should be sorted by the count key descending.

### Usage

```js
const data = [
  { a: 1, b: 10, c: 100 },
  { a: 1, b: 10, c: 101 },
  { a: 2, b: 20, c: 200 },
  { a: 3, b: 30, c: 300 },
];

tidy(data, count('a'));
// output:
[{ a: 1, n: 2 }, { a: 2, n: 1 }, { a: 3, n: 1 }];

tidy(data, count('a', { name: 'count' }))
// output:
[
  { a: 1, count: 2 },
  { a: 2, count: 1 },
  { a: 3, count: 1 },
] 
```


---

## debug

Logs to the console the current state of the data. For grouped data, each group will be output.

The data passes through unmodified.

### Parameters

#### `label?`

```ts
| string
```

A label to display along with the debugged output.


#### `options?`

```ts
{
  limit?: number | null,
  output?: 'log' | 'table'
}
```

- `limit = 10`: When non-null, the output is limited to the first n items.
- `output = 'table'`: Switches between console.log or console.table as the output mechanism.


### Usage

```js
const data = [
  { a: 1, b: 10, c: 100 },
  { a: 2, b: 20, c: 200 },
];

tidy(data, debug())
/*
[tidy.debug] ------------------------------------------------------------------
┌─────────┬───┬────┬─────┐
│ (index) │ a │ b  │  c  │
├─────────┼───┼────┼─────┤
│    0    │ 1 │ 10 │ 100 │
│    1    │ 2 │ 20 │ 200 │
└─────────┴───┴────┴─────┘
*/

tidy(data, debug('test label', { limit: 1 }))
/*
[tidy.debug] test label -------------------------------------------------------
┌─────────┬───┬────┬─────┐
│ (index) │ a │ b  │  c  │
├─────────┼───┼────┼─────┤
│    0    │ 1 │ 10 │ 100 │
└─────────┴───┴────┴─────┘
*/
```


---

## distinct

Removes items with duplicate values for the specified keys. If no keys provided, uses strict equality for comparison. You may also think of this as reducing a dataset to just unique values for the specified columns.

### Parameters

#### `keys`

```ts
| string /* key of item */ 
| (item: object) => any
| Array<string | (item: object) => any>
```

The set of keys or accessors to use to compare whether two items in a collection are equal.

### Usage

```js
const data = [
  { str: 'foo', value: 1 },
  { str: 'foo', value: 3 },
  { str: 'far', value: 3 },
  { str: 'bar', value: 1 },
  { str: 'foo', value: 3 },
];

tidy(data, distinct(['str', 'value']))
// output:
[
  { str: 'foo', value: 1 },
  { str: 'foo', value: 3 },
  { str: 'far', value: 3 },
  { str: 'bar', value: 1 },
]

tidy(data, distinct([(d) => d.str[0], 'value']))
// output:
[
  { str: 'foo', value: 1 },
  { str: 'foo', value: 3 },
  { str: 'bar', value: 1 },
]
```


---

## expand

Expands a collection of items to include all combinations of the specified keys. Non-specified keys will be dropped.

### Parameters

#### `expandKeys`

```ts
| string /* key of item */
| string[]
| { [key]: string | any[] | (items: object[]) => any[] }
```

The keys to expand the collection to have all combinations of. This can be specified as a single key string, an array of key strings or a key mapping object. The key mapping object maps from keys in the items to either:

- `{ a: 'a' }`: the key name itself. In this case, the values to use for the combinations will be derived from what is in the data currently. 
- `{ a: [1, 2, 3, 4] }` an array of values denoting all possible values for this key, even if they do not occur in the data.
- `{ a: fullSeq('a') }` a function mapping from the items in the collection to an array of all possible values. This is typically used in combination with sequence helper functions like [**fullSeq**](#fullseq). 


### Usage

```js
const data = [
  { a: 1, b: 'b1', c: 100 },
  { a: 2, b: 'b1', c: 200 },
  { a: 4, b: 'b1', c: 300 },
  { a: 1, b: 'b2', c: 101 },
  { a: 2, b: 'b2', c: 201 },
];

tidy(data, expand('a'));
// output:
[{ a: 1 }, { a: 2 }, { a: 4 }]

tidy(data, expand(['a', 'b']))
// output:
[
  { a: 1, b: 'b1' },
  { a: 1, b: 'b2' },
  { a: 2, b: 'b1' },
  { a: 2, b: 'b2' },
  { a: 4, b: 'b1' },
  { a: 4, b: 'b2' },
] 

tidy(data, expand({ a: [1, 2, 3, 4, 5], b: 'b' }))
// output:
[
  { a: 1, b: 'b1' },
  { a: 1, b: 'b2' },
  { a: 2, b: 'b1' },
  { a: 2, b: 'b2' },
  { a: 3, b: 'b1' },
  { a: 3, b: 'b2' },
  { a: 4, b: 'b1' },
  { a: 4, b: 'b2' },
  { a: 5, b: 'b1' },
  { a: 5, b: 'b2' },
] 

tidy(data, expand({ a: fullSeq('a') }));
// output:
[{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }]
```


---

## fill

Fills values for the specified keys to match the last seen value in the collection.

### Parameters

#### `keys`

```ts
| string /* key of item */
| string[]
```

The key or keys in the items to fill in. Only the specified keys will be affected.

### Usage

```js
const data = [
  { a: 1, b: null, c: undefined, d: 1 },
  { a: null, b: 2, c: undefined },
  { a: null, c: 3, d: 3 },
  { a: 4, b: 4, c: 4, d: 4 },
  {},
  { c: 6 },
  { c: 7, d: 7 },
];

tidy(data, fill(['a', 'b', 'c', 'd'])));
// output:
[
  { a: 1, b: null, c: undefined, d: 1 },
  { a: 1, b: 2, c: undefined, d: 1 },
  { a: 1, b: 2, c: 3, d: 3 },
  { a: 4, b: 4, c: 4, d: 4 },
  { a: 4, b: 4, c: 4, d: 4 },
  { a: 4, b: 4, c: 6, d: 4 },
  { a: 4, b: 4, c: 7, d: 7 }
] 
```


---

## filter

Filters out items from the collection based on the filter fn, similar to `Array.prototype.filter`.

### Parameters

#### `filterFn`

```ts
(item: object, index: number, array: object[]) => boolean
```

The predicate function to filter by: items are only kept if it returns true.

### Usage

```js
const data = [{ value: 1 }, { value: 2 }, { value: 3 }];

tidy(data, filter((d) => d.value % 2 === 1))
// output:
[{ value: 1 }, { value: 3 }]
```


---

## fullJoin 

Performs a full join on two collections of items.

### Parameters

#### `itemsToJoin`

```ts
object[] /* the join dataset */
```

The collection of items to join.

#### `options`

```ts
{
  by?:
  | string /* key in both datasets */
  | string[]
  | {
      [string /* key in join */]: string /* key in original */
    }
}
```

An options object specifying with the following options:

- **`by`** The key (`string`) or keys (`string[]`) to join the two collections on. This form only works if both sets of data have the same column names. If you need to map more specifically, provide an object mapping from key in the original data set to key in the join dataset. Note that if `by` is not provided, then overlapping columns will be autodetected and used.


### Usage

```js
tidy([{ a: 1, b: 2 }, { a: 2, b: 5 }],
  fullJoin(
    [{ a: 1, c: 3 }, { a: 4, c: 4 }],
    { by: 'a' }
  )
)
// output:
[
  { a: 1, b: 2, c: 3 },
  { a: 2, b: 5 },
  { a: 4, c: 4 },
];

const data = [
  { a: 1, J: 'j', b: 10, c: 100 },
  { a: 1, J: 'k', b: 60, c: 600 },
  { a: 1, J: 'J', b: 30, c: 300 },
  { a: 2, J: 'j', b: 20, c: 200 },
  { a: 3, J: 'x', b: 50, c: 500 },
];

const joinData = [
  { a: 1, J: 'j', altJ: 'j', x: 'x1', y: 'y1' },
  { a: 1, J: 'J', altJ: 'J', x: 'x9', y: 'y9' },
  { a: 2, J: 'j', altJ: 'j', x: 'x2', y: 'y2' },
  { a: 2, J: 'X', altJ: 'x', x: 'x5', y: 'y5' },
];

tidy(data, fullJoin(joinData, { by: ['a', 'J'] }));
// output:
[
  { a: 1, J: 'j', altJ: 'j', b: 10, c: 100, x: 'x1', y: 'y1' },
  { a: 1, J: 'k', b: 60, c: 600 },
  { a: 1, J: 'J', altJ: 'J', b: 30, c: 300, x: 'x9', y: 'y9' },
  { a: 2, J: 'j', altJ: 'j', b: 20, c: 200, x: 'x2', y: 'y2' },
  { a: 3, J: 'x', b: 50, c: 500 },
  { a: 2, J: 'X', altJ: 'x', x: 'x5', y: 'y5' },
] 

tidy(data, fullJoin(joinData, { by: { a: 'a', altJ: 'J' } }))
// output:
[
  { a: 1, J: 'j', altJ: 'j', b: 10, c: 100, x: 'x1', y: 'y1' },
  { a: 1, J: 'k', b: 60, c: 600 },
  { a: 1, J: 'J', altJ: 'J', b: 30, c: 300, x: 'x9', y: 'y9' },
  { a: 2, J: 'j', altJ: 'j', b: 20, c: 200, x: 'x2', y: 'y2' },
  { a: 3, J: 'x', b: 50, c: 500 },
  { a: 2, J: 'X', altJ: 'x', x: 'x5', y: 'y5' },
] 


```




---

## groupBy 

Restructures the data to be nested by the specified group keys then runs a tidy flow on each of the leaf sets. Grouped data can be exported into different shapes via [**group export helpers**](#groupexports), or if not specified, will be ungrouped back to a flat list of items. 

See the [**groupBy docs**](./groupby.md) for details.

### Usage

```js
const data = [
  { str: 'a', ing: 'x', foo: 'G', value: 1 },
  { str: 'b', ing: 'x', foo: 'H', value: 100 },
  { str: 'b', ing: 'x', foo: 'K', value: 200 },
  { str: 'a', ing: 'y', foo: 'G', value: 2 },
  { str: 'a', ing: 'y', foo: 'H', value: 3 },
  { str: 'a', ing: 'y', foo: 'K', value: 4 },
  { str: 'b', ing: 'y', foo: 'G', value: 300 },
  { str: 'b', ing: 'z', foo: 'H', value: 400 },
  { str: 'a', ing: 'z', foo: 'K', value: 5 },
  { str: 'a', ing: 'z', foo: 'G', value: 6 },
]

tidy(
  data,
  groupBy('str', [
    summarize({ total: sum('value') })
  ])
)
// output:
[
  { str: 'a', total: 21 },
  { str: 'b', total: 1000 },
]
*/

tidy(
  data,
  groupBy(['str', 'ing'], [
    summarize({ total: sum('value') })
  ])
)
// output:
[
  { str: 'a', ing: 'x', total: 1 },
  { str: 'a', ing: 'y', total: 9 },
  { str: 'a', ing: 'z', total: 11 },
  { str: 'b', ing: 'x', total: 300 },
  { str: 'b', ing: 'y', total: 300 },
  { str: 'b', ing: 'z', total: 400 },
]
*/
```

---

## innerJoin 

Performs an inner join on two collections of items.

### Parameters

#### `itemsToJoin`

```ts
object[] /* the join dataset */
```

The collection of items to join.

#### `options`

```ts
{
  by?:
  | string /* key in both datasets */
  | string[]
  | {
      [string /* key in join */]: string /* key in original */
    }
}
```

An options object specifying with the following options:

- **`by`** The key (`string`) or keys (`string[]`) to join the two collections on. This form only works if both sets of data have the same column names. If you need to map more specifically, provide an object mapping from key in the original data set to key in the join dataset. Note that if `by` is not provided, then overlapping columns will be autodetected and used.


### Usage

```js
const data = [
  { a: 1, J: 'j', b: 10, c: 100 },
  { a: 1, J: 'k', b: 60, c: 600 },
  { a: 1, J: 'J', b: 30, c: 300 },
  { a: 2, J: 'j', b: 20, c: 200 },
  { a: 3, J: 'x', b: 50, c: 500 },
];

const joinData = [
  { a: 1, J: 'j', altJ: 'j', x: 'x1', y: 'y1' },
  { a: 1, J: 'J', altJ: 'J', x: 'x9', y: 'y9' },
  { a: 2, J: 'j', altJ: 'j', x: 'x2', y: 'y2' },
];

tidy(data, innerJoin(joinData, { by: ['a', 'J'] }));
// output:
[
  { a: 1, J: 'j', altJ: 'j', b: 10, c: 100, x: 'x1', y: 'y1' },
  { a: 1, J: 'J', altJ: 'J', b: 30, c: 300, x: 'x9', y: 'y9' },
  { a: 2, J: 'j', altJ: 'j', b: 20, c: 200, x: 'x2', y: 'y2' },
] 

tidy(data, innerJoin(joinData, { by: { a: 'a', altJ: 'J' } }))
// output:
[
  { a: 1, J: 'j', altJ: 'j', b: 10, c: 100, x: 'x1', y: 'y1' },
  { a: 1, J: 'J', altJ: 'J', b: 30, c: 300, x: 'x9', y: 'y9' },
  { a: 2, J: 'j', altJ: 'j', b: 20, c: 200, x: 'x2', y: 'y2' },
] 
```


---

## leftJoin 

Performs a left join on two collections of items.

### Parameters

#### `itemsToJoin`

```ts
object[] /* the join dataset */
```

The collection of items to join.

#### `options`

```ts
{
  by?:
  | string /* key in both datasets */
  | string[]
  | {
      [string /* key in join */]: string /* key in original */
    }
}
```

An options object specifying with the following options:

- **`by`** The key (`string`) or keys (`string[]`) to join the two collections on. This form only works if both sets of data have the same column names. If you need to map more specifically, provide an object mapping from key in the original data set to key in the join dataset. Note that if `by` is not provided, then overlapping columns will be autodetected and used.


### Usage

```js
const data = [
  { a: 1, J: 'j', b: 10, c: 100 },
  { a: 1, J: 'k', b: 60, c: 600 },
  { a: 1, J: 'J', b: 30, c: 300 },
  { a: 2, J: 'j', b: 20, c: 200 },
  { a: 3, J: 'x', b: 50, c: 500 },
];

const joinData = [
  { a: 1, J: 'j', altJ: 'j', x: 'x1', y: 'y1' },
  { a: 1, J: 'J', altJ: 'J', x: 'x9', y: 'y9' },
  { a: 2, J: 'j', altJ: 'j', x: 'x2', y: 'y2' },
];

tidy(data, leftJoin(joinData, { by: ['a', 'J'] }));
// output:
[
  { a: 1, J: 'j', altJ: 'j', b: 10, c: 100, x: 'x1', y: 'y1' },
  { a: 1, J: 'k', b: 60, c: 600 },
  { a: 1, J: 'J', altJ: 'J', b: 30, c: 300, x: 'x9', y: 'y9' },
  { a: 2, J: 'j', altJ: 'j', b: 20, c: 200, x: 'x2', y: 'y2' },
  { a: 3, J: 'x', b: 50, c: 500 },
] 

tidy(data, leftJoin(joinData, { by: { a: 'a', altJ: 'J' } }))
// output:
[
  { a: 1, J: 'j', altJ: 'j', b: 10, c: 100, x: 'x1', y: 'y1' },
  { a: 1, J: 'k', b: 60, c: 600 },
  { a: 1, J: 'J', altJ: 'J', b: 30, c: 300, x: 'x9', y: 'y9' },
  { a: 2, J: 'j', altJ: 'j', b: 20, c: 200, x: 'x2', y: 'y2' },
  { a: 3, J: 'x', b: 50, c: 500 },
] 
```


---

## map 

Maps items from one form to another, similar to `Array.prototype.map`.

### Parameters

#### `mapFn`

```ts
(item: object, index: number, array: object[]) => object
```

Takes the current item and returns the new item.

### Usage

```js
const data = [
  { value: 1, nested: { a: 10, b: 100 } },
  { value: 2, nested: { a: 20, b: 200 } },
];

tidy(data, map((d) => ({ value: d.value, ...d.nested }));
)
// output:
[
  { value: 1, a: 10, b: 100 },
  { value: 2, a: 20, b: 200 },
] 
```


---

## mutate 

Modify items by adding new columns/keys, or changing existing ones. This operation goes item by item, if you need to mutate with values across multiple items, use [**mutateWithSummary**](#mutatewithsummary). 

See [**item helpers**](./item.md) for utility functions that help with common mutate operations. 

### Parameters

#### `mutateSpec`

```ts
{
  [string /* (possibly new) key in mutated objects */]: 
  | (item: object) => any
  | any 
}
```

A specification showing how to modify values on the items. 


If the mutate value is a function, it will be passed the an individual item at a time. All mutations specified happen on a single item before moving to the next item. For mutations that require computing across items, use [**mutateWithSummary**](#mutatewithsummary).  

```js
mutate({ isEven: d => d.foo % 2 })
// items where foo is even have isEven true
```

If the mutate value is a single value, it will be assigned directly to each item.

```js
mutate({ type: 'o' })
// all items have { type: 'o' }
```

If the mutate value is an array of values, it will be assigned directly to each item.

```js
mutate({ type: ['o', 'a', 't'] })
// all items have { type: ['o', 'a', 't'] }
```

Note that the order of keys matters. Later keys can reference values from previous keys, e.g.: 

```js
mutate({ 
  key: () => Math.random(), 
  key2: d => d.key * 5 
}))
```

### Usage

```js
const data = [
  { str: 'foo', value: 3 },
  { str: 'bar', value: 1 },
  { str: 'bar', value: 7 },
];

tidy(data, mutate({
  x2: (d) => d.value * 2,
  x4: (d) => d.x2 * 2,
  constant: 99  
}));

// output:
[
  { str: 'foo', value: 3, x2:  6, x4: 12, constant: 99 },
  { str: 'bar', value: 1, x2:  2, x4:  4, constant: 99 },
  { str: 'bar', value: 7, x2: 14, x4: 28, constant: 99 },
] 
```


---

## mutateWithSummary 

Modify items by adding new columns/keys, or changing existing ones. This operation can look across multiple items to produce values, which allows summarizations to be added (e.g. totals). If you only need to mutate individual items, use [**mutate**](#mutate).

See [**vector helpers**](./vector.md) and [**summarizers**](./summary.md) for utility functions that help with common mutateWithSummary operations. 

### Parameters

#### `mutateSummarySpec`

```ts
{
  [string /* (possibly new) key in mutated objects */]: 
  | (items: object[]) => any | any[] 
  | any 
  | any[]  
}
```

A specification showing how to modify values on the items. 

For each key specified in the `mutateSummarySpec`, a vector of mutated values is computed then merged (immutably) back into the items before moving to the next key. If you want to mutate on a per-item basis, use [**mutate**](#mutate) instead.

If the mutate value is a function, it will be passed the set of all items in the collection to run against, which allows efficient computing of things like means or totals across the entire dataset. 

```js
mutateWithSummary({ 
  total: sum('value'),
  rand: (items) => items.map(d => Math.random())
})
// all items have { 
//   total: <sum of value across all items>, 
//   rand: <different random number per item> 
// }
```


If the mutate value is a single value, it will be assigned directly to each item.


```js
mutateWithSummary({ type: 'o' })
// all items have { type: 'o' }
```

If the mutate value is an array of values, it will be assigned to the items using matching indices.

```js
mutateWithSummary({ type: ['o', 'a', 't'] })
// items[0] has { type: 'o' }, 
// items[1] has { type: 'a' },
// items[2] has { type: 't' },
```

Note that the order of keys matters. Later keys can reference values from previous keys, e.g.: 

```js
mutateWithSummary({ 
  total: sum('value'), 
  totalSquared: items => items[0].total * items[0].total
}))
```


### Usage

```js
const data = [
  { str: 'foo', value: 3 },
  { str: 'bar', value: 1 },
  { str: 'bar', value: 7 },
];

tidy(data, mutateWithSummary({
  total: sum('value'), // helper summary function 'sum'
}));

// output:
[
  { str: 'foo', value: 3, sum: 11 },
  { str: 'bar', value: 1, sum: 11 },
  { str: 'bar', value: 7, sum: 11 },
] 
```



---

## rename 

Rename keys in a collection.

### Parameters

#### `renameSpec`

```ts
{ [oldKey: string]: string /* new key */ }
```

A mapping from the old key name to the new, renamed key, similar style to destructuring an object.


### Usage

```js
const data = [
  { a: 1, b: 'b10', c: 100 },
  { a: 2, b: 'b20', c: 200 },
  { a: 3, b: 'b30', c: 300 },
];

tidy(data, rename({ b: 'newB', c: 'newC' }));
// output:
[
  { a: 1, newB: 'b10', newC: 100 },
  { a: 2, newB: 'b20', newC: 200 },
  { a: 3, newB: 'b30', newC: 300 },
] 
```


---

## replaceNully

Replaces nully values with what is specified in the spec on a per-key basis.

### Parameters

#### `replaceNullySpec`

```ts
object
```

A map from key name to the value that nully values should be replaced with for that key. For example, given an objects of the shape `{a: number, b: string}`, the **replaceNullySpec** may look like `{ a: -1, b: 'n/a' }`. Note you are not required to fill in values for all keys– any unspecified keys will keep their nully value.


### Usage

```js
const data = [
  { value: 1,         foo: null,      bar: '',   x: 1 },
  { value: null,      foo: undefined, bar: 'xx', x: 2 },
  { value: undefined, foo: 0,                    x: 3 },
];

tidy(data, replaceNully({ value: -1, foo: NaN, bar: 'N/A' }));
// output:
[
  { value: 1,  foo: NaN, bar: '',    x: 1 },
  { value: -1, foo: NaN, bar: 'xx',  x: 2 },
  { value: -1, foo: 0,   bar: 'N/A', x: 3 },
] 
```


---

## select / pick

Select subparts of items. This function can be used to re-order keys or for selecting subselections of keys (similar to pick and omit from lodash).

See [**selectors**](./selectors.md) for convenient ways specify keys to select.

### Parameters

#### `selectKeys`

```ts
| string /* key of item */
| (items: T[]) => string[] /* keys of items */
| Array<string | (items: T[]) => string[]>
```

The keys, or functions that resolve to keys to select from the object. If a key is prefixed with `-`, it will be removed from the object. If the first argument passed begins with `-`, an implicit [**everything**](./selectors.md#everything) selector will be called first.


### Usage

```js
const data = [
  { foo: 1, bar: 20, foobar: 300, FoObAR: 90, a: 'a1', b: 'b1' },
  { foo: 2, bar: 21, foobar: 301, FoObAR: 91, a: 'a2', b: 'b2' },
  { foo: 3, bar: 22, foobar: 302, FoObAR: 92, a: 'a3', b: 'b3' },
  { foo: 4, bar: 23, foobar: 303, FoObAR: 93, a: 'a4', b: 'b4' },
];

tidy(data, select(['a', startsWith('foo'), '-foobar']))
// output:
[
  { a: 'a1', foo: 1, FoObAR: 90 },
  { a: 'a2', foo: 2, FoObAR: 91 },
  { a: 'a3', foo: 3, FoObAR: 92 },
  { a: 'a4', foo: 4, FoObAR: 93 },
] 
```



---

## slice

Selects a subset of the data, similar to Array.prototype.slice.


### Parameters

#### `start`

```ts
number
```

The starting index to select from. The item at this index is included in the results.


#### `end`

```ts
number
```

The ending index before which to end selecting. The item at this index is *not* included in the results.


### Usage

```js
const data = [
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 },
];

tidy(data, slice(1, 3))
// output:
[{ value: 2 }, { value: 3 }]
```

---

## sliceHead

Selects the first N items in the collection.


### Parameters

#### `n`

```ts
number
```

The number of items to select.


### Usage

```js
const data = [
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 },
];

tidy(data, sliceHead(2))
// output:
[{ value: 1 }, { value: 2 }]
```


---

## sliceTail

Selects the last N items in the collection.


### Parameters

#### `n`

```ts
number
```

The number of items to select.


### Usage

```js
const data = [
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 },
];

tidy(data, sliceTail(2))
// output:
[{ value: 4 }, { value: 5 }]
```


---

## sliceMin

Selects the minimum N items in the collection ordered by some comparators, similar to [**arrange**](#arrange).


### Parameters

#### `n`

```ts
number
```

The number of items to select.


#### `orderBy`

```ts
| string /* key of item */
| ((a: object, b: object) => number) 
| Array<string | ((a: object, b: object) => number)>
```

A key or set of keys of the item to sort by, or comparator functions that return -1, 0, or 1 if a < b, a == b, a > b respectively. See [**arrange**](#arrange) for details.


### Usage

```js
const data = [
  { value: 3 },
  { value: 1 },
  { value: 4 },
  { value: 5 },
  { value: 2 },
];

tidy(data, sliceMin(2, 'value'))
// output:
[{ value: 1 }, { value: 2 }]
```



---

## sliceMax

Selects the maximum N items in the collection ordered by some comparators, similar to [**arrange**](#arrange).


### Parameters

#### `n`

```ts
number
```

The number of items to select.


#### `orderBy`

```ts
| string /* key of item */
| ((a: object, b: object) => number) 
| Array<string | ((a: object, b: object) => number)>
```

A key or set of keys of the item to sort by, or comparator functions that return -1, 0, or 1 if a < b, a == b, a > b respectively. See [**arrange**](#arrange) for details.


### Usage

```js
const data = [
  { value: 3 },
  { value: 1 },
  { value: 4 },
  { value: 5 },
  { value: 2 },
];

tidy(data, sliceMax(2, 'value'))
// output:
[{ value: 5 }, { value: 4 }]
```


---

## sliceSample

Selects the a random sample of N items in the collection.


### Parameters

#### `n`

```ts
number
```

The number of items to select.


#### `options?`

```ts
{ 
  replace?: boolean = false
}
```

- `replace = false`: If true, samples items with replacement, otherwise without. If using with replacement, you can sample more than the items that are available.

### Usage

```js
const data = [
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 },
];

tidy(data, sliceSample(2))
// output:
[{ value: 4 }, { value: 1 }]

tidy(data, sliceSample(4, { replace: true }))
// output:
[{ value: 3 }, { value: 3 }, { value: 2 }, { value: 5 }]
```


---

## summarize 

Takes a collection of items and reduces them to a single item, commonly used for computing averages or sums across a group or dataset.

### Parameters

#### `summarizeSpec`

```ts
{
  [string /* key in output */]: (items: object[]) => any
}
```

An object specifying how to compute the summarized values in the output. The output object matches the keys in this specification with their values set to the output of their respective functions in the spec. Typically the values make use of the provided [**summarizers**](./summary), but can be anything.

For example:

```js
tidy(
  [{ value: 2 }, { value: 4 }], 
  summarize({ 
    summed: sum('value'), 
    avg: mean('value') 
  }))
// output:
[{ summed: 6, avg: 3 }]
```

Note that keys not specified will be dropped from the output unless the `rest` option is provided.

#### `options`

```ts
{
  rest?: (key: string) => (items: object[]) => any
}
```

* `rest`: When provided, all keys in the source objects that are not in the `summarySpec` will be resolved via the function that is provided. This is equivalent to specifying all of them in the `summarySpec`. Typically this is combined with [**first**](./summary#first) or [**last**](./summary#last):

```js
tidy(
  [{ value: 2 }, { value: 4 }], 
  summarize(
    { summed: sum('value') }, 
    { rest: first }
  ))
// output:
[{ summed: 6, value: 2 }]
```

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
  summedValue: sum('value'),
  secondValue: (items) => items[1].value
}))
// output:
[{ summedValue: 15, secondValue: 1 }]
```


---

## summarizeAll

A simpler form of [**summarize**](#summarize) where all keys in the data are summarized via the specified function.


### Parameters

#### `summaryFn`

```ts
(key: string) => (items: any[]) => any /* typically number */
```

The function to apply to each key in the source data to create the summarized output.

### Usage

```js
const data = [
  { value2: 3, value: 3 },
  { value2: 4, value: 1 },
  { value2: 5, value: 3 },
  { value2: 1, value: 1 },
  { value2: 10, value: 7 },
];

tidy(data, summarizeAll(sum))
// output:
[{ value: 15, value2: 23 }]
```


---

##  summarizeAt

A simpler form of [**summarize**](#summarize) where the specified keys are summarized via the same specified function. All other keys are dropped.

### Parameters

#### `keys`

```ts
Array<
  | string /* keys in the object */  
  | (items: T[]) => string[]
>
```

The keys on which the summary function will be applied. You can either provide the keys directly as strings or you can use [**selectors**](./selectors.md), or a combination of the two.

#### `summaryFn`

```ts
(key: string) => (items: any[]) => any /* typically number */
```

The function to apply to each key in the source data to create the summarized output.

### Usage

```js
const data = [
  { str: 'foo1', value2: 3, value: 3 },
  { str: 'bar1', value2: 4, value: 1 },
  { str: 'baz1', value2: 5, value: 3 },
  { str: 'foo2', value2: 1, value: 1 },
  { str: 'bar2', value2: 10, value: 7 },
];

tidy(data, summarizeAt(['value', 'value2'], sum))
// output:
[{ value: 15, value2: 23 }]
```


---

## summarizeIf


A simpler form of [**summarize**](#summarize) where the summary function is called on keys whose values pass the specified predicate.

### Parameters

#### `predicateFn`

```ts
(vector: any[] /* array of single values */) => boolean
```

A function that given a vector of values for a key (e.g. `items.map(item => item.value)`), returns true if that key should be summarized.

#### `summaryFn`

```ts
(key: string) => (items: any[]) => any /* typically number */
```

The function to apply to each key in the source data to create the summarized output.

### Usage

```js
const data = [
  { str: 'foo1', value2: 3, value: 3 },
  { str: 'bar1', value2: 4, value: 1 },
  { str: 'baz1', value2: 5, value: 3 },
  { str: 'foo2', value2: 1, value: 1 },
  { str: 'bar2', value2: 10, value: 7 },
];

// if first value for a key is numeric, summarize that column
tidy(data, summarizeIf((vector) => Number.isFinite(vector[0]), sum)
// output:
[{ value: 15, value2: 23 }]
```

---




## tally 

Tally is a wrapper that summarizes the data with [**n**](./summary.md#n): counts the number of items (per group if grouped).

### Parameters

#### `options`

```ts
{ 
  name: string = 'n', 
}
```

* `name = 'n'`: The name of the count value in the resulting items.

### Usage

```js
const data = [
  { a: 1, b: 10, c: 100 },
  { a: 2, b: 20, c: 200 },
  { a: 3, b: 30, c: 300 },
];

tidy(data, tally());
// [{ n: 3 }]
```



---

## total 

Convenience wrapper around [**summarize**](#summarize) and [**mutate**](#mutate) that appends a new summarized row to the end of the data. Typically used for computing totals.

### Parameters

#### `summarizeSpec`


```ts
{
  [string /* key in output */]: (items: object[]) => any
}
```

The same as [**summarize**::summarizeSpec](#summarizespec) –  an object specifying how to compute the summarized values in the output. In this case, the expectation is the keys match the input data.

#### `mutateSpec`

```ts
{
  [string /* (possibly new) key in mutated objects */]: 
  | (item: object) => any
  | any 
}
```

A specification showing how to modify values on the items. See [**mutate**](#mutatespec) for details. Can be useful for setting a field that indicates this is a total row (e.g. `{ id: '__total' }`).

### Usage

```js
const data = [
  { str: 'foo', value: 3 },
  { str: 'foo', value: 1 },
  { str: 'bar', value: 3 },
  { str: 'bar', value: 1 },
  { str: 'bar', value: 7 },
];
tidy(data, total(
  { value: sum('value') },
  { str: 'total' }
))
// output:
[
  { str: 'foo', value: 3 },
  { str: 'foo', value: 1 },
  { str: 'bar', value: 3 },
  { str: 'bar', value: 1 },
  { str: 'bar', value: 7 },
  { str: 'total', value: 15 },
] 
```

---

## totalAll

A simpler form of [**total**](#total), but uses [**summarizeAll**](#summarizeall) instead of [**summarize**](#summarize).

### Parameters

#### `summaryFn`

```ts
(key: string) => (items: any[]) => any /* typically number */
```

The function to apply to each key in the source data to create the summarized output.


#### `mutateSpec`

```ts
{
  [string /* (possibly new) key in mutated objects */]: 
  | (item: object) => any
  | any 
}
```

A specification showing how to modify values on the items.  See [**mutate**](#mutatespec) for details. Can be useful for setting a field that indicates this is a total row (e.g. `{ id: '__total' }`).

### Usage

```js
const data = [
  { value2: 3, value: 3 },
  { value2: 4, value: 1 },
  { value2: 5, value: 3 },
  { value2: 1, value: 1 },
  { value2: 10, value: 7 },
];

tidy(data, totalAll(
  { value: sum('value') },
  { str: 'total' }
))
// output:
[
  { value2: 3, value: 3 },
  { value2: 4, value: 1 },
  { value2: 5, value: 3 },
  { value2: 1, value: 1 },
  { value2: 10, value: 7 },
  { value: 15, value2: 23, str: 'total' },
] 
```

---

## totalAt

A simpler form of [**total**](#total), but uses [**summarizeAt**](#summarizeat) instead of [**summarize**](#summarize).

### Parameters

#### `keys`

```ts
Array<
  | string /* keys in the object */  
  | (items: T[]) => string[]
>
```

The keys on which the summary function will be applied. You can either provide the keys directly as strings or you can use [**selectors**](./selectors.md), or a combination of the two.

#### `summaryFn`

```ts
(key: string) => (items: any[]) => any /* typically number */
```

The function to apply to each key in the source data to create the summarized output.

#### `mutateSpec`

```ts
{
  [string /* (possibly new) key in mutated objects */]: 
  | (item: object) => any
  | any 
}
```

A specification showing how to modify values on the items.  See [**mutate**](#mutatespec) for details. Can be useful for setting a field that indicates this is a total row (e.g. `{ id: '__total' }`).

### Usage

```js
const data = [
  { str: 'foo1', value2: 3, value: 3 },
  { str: 'bar1', value2: 4, value: 1 },
  { str: 'baz1', value2: 5, value: 3 },
  { str: 'foo2', value2: 1, value: 1 },
  { str: 'bar2', value2: 10, value: 7 },
];

tidy(data, totalAt(
  ['value', 'value2'], 
  sum,
  { str: 'total' }
))
// output:
[
  { str: 'foo1', value2: 3, value: 3 },
  { str: 'bar1', value2: 4, value: 1 },
  { str: 'baz1', value2: 5, value: 3 },
  { str: 'foo2', value2: 1, value: 1 },
  { str: 'bar2', value2: 10, value: 7 },
  { str: 'total', value: 15, value2: 23 },
] 
```


---

## totalIf


A simpler form of [**total**](#total), but uses [**summarizeIf**](#summarizeif) instead of [**summarize**](#summarize).

### Parameters


#### `predicateFn`

```ts
(vector: any[] /* array of single values */) => boolean
```

A function that given a vector of values for a key (e.g. `items.map(item => item.value)`), returns true if that key should be summarized.


#### `summaryFn`

```ts
(key: string) => (items: any[]) => any /* typically number */
```

The function to apply to each key in the source data to create the summarized output.

#### `mutateSpec`

```ts
{
  [string /* (possibly new) key in mutated objects */]: 
  | (item: object) => any
  | any 
}
```

A specification showing how to modify values on the items.  See [**mutate**](#mutatespec) for details. Can be useful for setting a field that indicates this is a total row (e.g. `{ id: '__total' }`).

### Usage

```js
const data = [
  { str: 'foo1', value2: 3, value: 3 },
  { str: 'bar1', value2: 4, value: 1 },
  { str: 'baz1', value2: 5, value: 3 },
  { str: 'foo2', value2: 1, value: 1 },
  { str: 'bar2', value2: 10, value: 7 },
];

tidy(data, totalIf(
  (vector) => Number.isFinite(vector[0]), 
  sum,
  { str: 'total' }
))
// output:
[
  { str: 'foo1', value2: 3, value: 3 },
  { str: 'bar1', value2: 4, value: 1 },
  { str: 'baz1', value2: 5, value: 3 },
  { str: 'foo2', value2: 1, value: 1 },
  { str: 'bar2', value2: 10, value: 7 },
  { str: 'total', value: 15, value2: 23 },
] 
```


---

## transmute 

The same as [**mutate**](#mutate), except all keys are dropped except those specified to be mutated.

### Parameters

#### `mutateSpec`

```ts
{
  [string /* (possibly new) key in mutated objects */]: 
  | (item: object) => any
  | any 
}
```

A specification showing how to modify values on the items. See [**mutate**](#mutatespec) for details.

### Usage

```js
const data = [
  { str: 'foo', value: 3 },
  { str: 'bar', value: 1 },
  { str: 'bar', value: 7 },
];

tidy(data, transmute({
  value_x2: (d) => d.value * 2,
  value_x4: (d) => d.value_x2 * 2,
}));
// output:
[
    { value_x2: 6, value_x4: 12 },
    { value_x2: 2, value_x4: 4 },
    { value_x2: 14, value_x4: 28 },
  ] 
```

---

## when

Conditionally runs a tidy subflow based on the result of a boolean or predicate function.

### Parameters

#### `predicate`

```ts
| boolean
| (items: object[]) => boolean
```

When true, or the function results in true, the subflow is run, otherwise the input items are passed through unmodified.

#### `fns`

```ts
Array<(items: object[]) => object[]>
```

Array of tidy functions to run on the input data when the predicate is true.

### Usage

```js
const data = [{ x: 1 }, { x: 2 }, { x: 3 }];
tidy(data, 
  when(true, [
    mutate({ y: 52 })
  ])
);
// output:
[{ x: 1, y: 52 }, { x: 2, y: 52 }, { x: 3, y: 52 }]

tidy(data,
  when((items) => items.length === 2, [
    mutate({ y: 52 })
  ])
);
// output:
[{ x: 1 }, { x: 2 }, { x: 3 }]
```

---
