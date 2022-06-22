---
title: groupBy API
sidebar_label: Grouping with groupBy
---

To work with nested data in tidy, you use the **groupBy**, which runs a subflow of tidy functions on nested groups of the data and can be exported into different forms.

## groupBy

Restructures the data to be nested by the specified group keys then runs a tidy flow on each of the leaf sets. Grouped data can be exported into different shapes via [**group export helpers**](#group-exports), or if not specified, will be ungrouped back to a flat list of items. 

### Parameters

#### `groupKeys`

```ts
| string /* key of item */
| (item: object) => any
| Array<string | (item: object) => any>
```

Either a key in the item or an accessor function that returns the grouping value, or an array combining these two options.

Note that the grouping logic uses strict equality `===` to see if keys are the same, so if you're using non-primitive values that are equal, but not identical (e.g. `["foo", "bar"] !== ["foo", "bar"]`), they won't be grouped together. In those cases, the current recommendation is specifying `groupKeys` as a function that returns a primitive value (e.g. `(item) => item.arrKey.join('---')`).

#### `fns`

```ts
Array<(item: object[]) => object[]>
```

A tidy subflow: an array of tidy functions to run on the leaf sets of the grouped data.

#### `options?`

```ts
| {
    addGroupKeys?: boolean;
  }
// or export functions (see below)
| groupBy.grouped()
| groupBy.entries()
| groupBy.entriesObject()
| groupBy.object()
| groupBy.map()
| groupBy.keys()
| groupBy.values()
| groupBy.levels()
```

Options to configure how groupBy operates:

- `addGroupKeys = true`: Whether to merge group keys back into the objects.


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
[{ str: 'a', total: 21 },
 { str: 'b', total: 1000 }]

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
```

## Group Exports

The final argument to groupBy can also be an export function:

* groupBy.entries(options?)
* groupBy.entriesObject(options?)
* groupBy.grouped(options?)
* groupBy.keys(options?)
* groupBy.map(options?)
* groupBy.object(options?)
* groupBy.values(options?)

The levels export allows combining any of the above at different depths of the tree:

* groupBy.levels(options?)


### Group Export Options

These functions take options as their argument, which includes the options mentioned above plus some extras specific to exporting:

```ts
{
  addGroupKeys?: boolean; // from groupBy options

  flat?: boolean;
  compositeKey?: (keys: any[]) => string;
  single?: boolean;
  mapLeaf?: (value: any) => any;
  mapLeaves?: (values: any[]) => any;
  mapEntry?: (entry: [any, any], level: number) => any;
  levels?: (
    | 'entries'
    | 'entries-object'
    | 'object'
    | 'map'
    | 'keys'
    | 'values'
    | LevelSpec
  )[];
}
```

  - `export = 'ungrouped'`: Specifies how the data should be exported from the groupBy function. If anything besides nully or "ungrouped", the remaining options will be interpreted to inform the output.
  - `flat?`: if all nested levels should be brought to a single top level
  - `compositeKey?`: when *flat* is true, how to flatten nested keys (default joins with `"."`)
  - `single?`: whether the leaf sets consist of just one item (typical after summarize). if true, uses the first element in the leaf set instead of an array
  - `mapLeaf?`: operation called on each leaf during export to map it to a different value (default: identity)
  - `mapLeaves?`: operation called on each leaf set to map the array of values to a different value. Similar to `rollup` from d3-collection nest or d3-array (default: identity)
  - `mapEntry?`: *when export = "entries" only* operation called on entries to map from [key, values] to whatever the output of this is (e.g. `{ key, values }`) (default: identity)
  - `levels?`: *required when export = "levels" only* specifies the export operation for each level of the grouping



## groupBy.entries()

Exports the data as entries arrays where the keys are the value of the key for that group level and the values are either nested entries or a flat list of items if it is a leaf set.

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
  ], groupBy.entries())
)
// output:
[
  ["a", [{"str": "a", "total": 21}]], 
  ["b", [{"str": "b", "total": 1000}]]
]

tidy(
  data,
  groupBy(['str', 'ing'], [
    summarize({ total: sum('value') })
  ], groupBy.entries({ single: true }))
)
// output:
[
  [
    "a",
    [
      ["x", {"str": "a", "ing": "x", "total": 1}],
      ["y", {"str": "a", "ing": "y", "total": 9}],
      ["z", {"str": "a", "ing": "z", "total": 11}]
    ]
  ],
  [
    "b",
    [
      ["x", {"str": "b", "ing": "x", "total": 300}],
      ["y", {"str": "b", "ing": "y", "total": 300}],
      ["z", {"str": "b", "ing": "z", "total": 400}]
    ]
  ]
]
```

---

## groupBy.entriesObject()

Exports the data as entries objects `{ key: string, values: any[] }`  where the keys are the value of the key for that group level and the values are either nested entries or a flat list of items if it is a leaf set.

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
  ], groupBy.entriesObject())
)
// output:
[
  {"key": "a", "values": [{"str": "a", "total": 21}]},
  {"key": "b", "values": [{"str": "b", "total": 1000}]}
]

tidy(
  data,
  groupBy(['str', 'ing'], [
    summarize({ total: sum('value') })
  ], groupBy.entriesObject({ single: true }))
)
// output:
[
  {
    "key": "a",
    "values": [
      {"key": "x", "values": {"str": "a", "ing": "x", "total": 1}},
      {"key": "y", "values": {"str": "a", "ing": "y", "total": 9}},
      {"key": "z", "values": {"str": "a", "ing": "z", "total": 11}}
    ]
  },
  {
    "key": "b",
    "values": [
      {"key": "x", "values": {"str": "b", "ing": "x", "total": 300}},
      {"key": "y", "values": {"str": "b", "ing": "y", "total": 300}},
      {"key": "z", "values": {"str": "b", "ing": "z", "total": 400}}
    ]
  }
] 
```

---

## groupBy.grouped()

Exports the data as a Grouped Map where the keys are tuples `[keyName, keyValue]` and the values are either nested Grouped Maps or a flat list of items if it is a leaf set. Note this is similar to [**groupBy.map**](#groupbymap), but it uses a tuple for the keys.

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
  ], groupBy.grouped())
)
// output:
new Map([
  [['str', 'a'], [{ str: 'a', total: 21 }]],
  [['str', 'b'], [{ str: 'b', total: 1000 }]],
]) 

tidy(
  data,
  groupBy(['str', 'ing'], [
    summarize({ total: sum('value') })
  ], groupBy.grouped({ single: true }))
)
// output:
new Map([
  [['str', 'a'], 
   [new Map([
     [['ing', 'x'], { str: 'a', ing: 'x', total: 1 }],
     [['ing', 'y'], { str: 'a', ing: 'y', total: 9 }],
     [['ing', 'z'], { str: 'a', ing: 'z', total: 11 }],
   ])]],

  [['str', 'b'],
   [new Map([
     [['ing', 'x'], { str: 'b', ing: 'x', total: 300 }],
     [['ing', 'y'], { str: 'b', ing: 'y', total: 300 }],
     [['ing', 'z'], { str: 'b', ing: 'z', total: 400 }],
   ])]]
])
```

---

## groupBy.keys()

Exports the data as keys arrays, which are similar to entries except they do not include any of the values. Is this useful? Hard to know.

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
  ], groupBy.keys())
)
// output:
["a", "b"]

tidy(
  data,
  groupBy(['str', 'ing'], [
    summarize({ total: sum('value') })
  ], groupBy.keys({ single: true }))
)
// output:
[["a", ["x", "y", "z"]], 
 ["b", ["x", "y", "z"]]]
```

---

## groupBy.map()

Exports the data as Map objects where the keys are the value of the key for that group level and the values are either nested Map objects or a flat list of items if it is a leaf set. Note this is similar to [**groupBy.grouped**](#groupbygrouped), but it doesn't use a tuple for keys.

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
  ], groupBy.grouped())
)
// output:
new Map([
  ['a', [{ str: 'a', total: 21 }]],
  ['b', [{ str: 'b', total: 1000 }]],
]) 

tidy(
  data,
  groupBy(['str', 'ing'], [
    summarize({ total: sum('value') })
  ], groupBy.grouped({ single: true }))
)
// output:
new Map([
  ['a', 
   [new Map([
     ['x', { str: 'a', ing: 'x', total: 1 }],
     ['y', { str: 'a', ing: 'y', total: 9 }],
     ['z', { str: 'a', ing: 'z', total: 11 }],
   ])]],

  ['b',
   [new Map([
     ['x', { str: 'b', ing: 'x', total: 300 }],
     ['y', { str: 'b', ing: 'y', total: 300 }],
     ['z', { str: 'b', ing: 'z', total: 400 }],
   ])]]
])
```


## groupBy.object()

Exports the data as objects where the keys are the value of the key for that group level and the values are either nested objects or a flat list of items if it is a leaf set.

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
  ], groupBy.object())
)
// output:
{
  "a": [{"str": "a", "total": 21}], 
  "b": [{"str": "b", "total": 1000}]
}

tidy(
  data,
  groupBy(['str', 'ing'], [
    summarize({ total: sum('value') })
  ], groupBy.object({ single: true }))
)
// output:
{
  "a": {
    "x": {"str": "a", "ing": "x", "total": 1},
    "y": {"str": "a", "ing": "y", "total": 9},
    "z": {"str": "a", "ing": "z", "total": 11}
  },
  "b": {
    "x": {"str": "b", "ing": "x", "total": 300},
    "y": {"str": "b", "ing": "y", "total": 300},
    "z": {"str": "b", "ing": "z", "total": 400}
  }
}
```

---

## groupBy.values()

Exports the data as values arrays which are similar to entries arrays except they contain no keys. Note if you are just trying to get the values back as a single flat list, you do no need to use any export method as that is the default behavior ("ungrouped").

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
  ], groupBy.values())
)
// output:
[[{"str": "a", "total": 21}], 
 [{"str": "b", "total": 1000}]]

tidy(
  data,
  groupBy(['str', 'ing'], [
    summarize({ total: sum('value') })
  ], groupBy.values({ single: true }))
)
// output:
[
  [
    {"str": "a", "ing": "x", "total": 1},
    {"str": "a", "ing": "y", "total": 9},
    {"str": "a", "ing": "z", "total": 11}
  ],
  [
    {"str": "b", "ing": "x", "total": 300},
    {"str": "b", "ing": "y", "total": 300},
    {"str": "b", "ing": "z", "total": 400}
  ]
]
```

---

## groupBy.levels()

Exports the data in a different way for each level. The last level specified is used for all remaining levels. You must supply a value for **levels** in the options argument.

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
  groupBy(['str', 'ing'], [
    summarize({ total: sum('value') })
  ], groupBy.levels({ 
    levels: ['entries-object', 'object'], 
    single: true 
  }))
)
// output:
[
  { // <-- this level is an "entries object"
    "key": "a",
    "values": { // <-- this level is an "object"
      "x": {"str": "a", "ing": "x", "total": 1},
      "y": {"str": "a", "ing": "y", "total": 9},
      "z": {"str": "a", "ing": "z", "total": 11}
    }
  },
  {
    "key": "b",
    "values": {
      "x": {"str": "b", "ing": "x", "total": 300},
      "y": {"str": "b", "ing": "y", "total": 300},
      "z": {"str": "b", "ing": "z", "total": 400}
    }
  }
]

tidy(
  data,
  groupBy(['str', 'ing'], [
    summarize({ total: sum('value') })
  ], groupBy.levels({ 
    levels: ['object', 'entries-object'], // swapped order
    single: true 
  }))
)
// output:
{ // <-- this level is an "object"
  "a": [ // <-- this level is "entries object"s
    {"key": "x", "values": {"str": "a", "ing": "x", "total": 1}},
    {"key": "y", "values": {"str": "a", "ing": "y", "total": 9}},
    {"key": "z", "values": {"str": "a", "ing": "z", "total": 11}}
  ],
  "b": [
    {"key": "x", "values": {"str": "b", "ing": "x", "total": 300}},
    {"key": "y", "values": {"str": "b", "ing": "y", "total": 300}},
    {"key": "z", "values": {"str": "b", "ing": "z", "total": 400}}
  ]
}
```


#### Custom Levels Export

For a more advanced export, a custom levels export can be specified by providing a **LevelSpec** for the value of **levels**:

```ts
// LevelSpec:
{
  createEmptySubgroup: () => any;
  addSubgroup: (
    parentGrouped: any,
    newSubgroup: any,
    key: any,
    level: number
  ) => void;
  addLeaf: (
    parentGrouped: any, 
    key: any, 
    values: any[], 
    level: number
  ) => void;
}
```

Probably best to just look at the source code of the existing groupBy methods to get an idea of how to use this.

