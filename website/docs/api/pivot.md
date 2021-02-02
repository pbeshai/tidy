---
title: Pivot API
sidebar_label: Pivot
---
## pivotLonger 

Lengthens data by increasing the number of rows (items) and decreasing the number of columns (keys) in a collection. The inverse transformation is [**pivotWider**](#pivotwider).

### Parameters

#### `options`

```ts
{
  cols: string | string[] | Selector, /* keys in the items */
  namesTo: string | string[];
  namesSep: string = '_';
  valuesTo: string | string[];
}
```

- `cols`: The list of keys to pivot to the longer format. Takes the same style as in [**select::selectKeys**](./tidy.md#selectkeys)
- `namesTo`: Map the keys in the input to these output columns. If multiple values are provided via an array, the keys will be split per `namesSep`.
- `valuesTo`: Map the values in the input to these output columns. If multiple values are provided via an array, the keys will be split per `namesSep` expecting the name of the value output column as a prefix.

### Usage

```js
const data = [
  { type: 'one', canada: 1, usa: 10, campbell: 4, brampton: 8 },
  { type: 'two', brampton: 7, boston: 3, usa: 11 },
  { type: 'three', canada: 20 },
]

tidy(
  data,
  pivotLonger({
    cols: ['canada', 'usa', 'campbell', 'brampton', 'boston'],
    namesTo: 'place',
    valuesTo: 'val',
  })
)
// output:
[
  { type: 'one',   place: 'canada',   val: 1 },
  { type: 'one',   place: 'usa',      val: 10 },
  { type: 'one',   place: 'campbell', val: 4 },
  { type: 'one',   place: 'brampton', val: 8 },
  { type: 'one',   place: 'boston',   val: undefined },
  { type: 'two',   place: 'canada',   val: undefined },
  { type: 'two',   place: 'usa',      val: 11 },
  { type: 'two',   place: 'campbell', val: undefined },
  { type: 'two',   place: 'brampton', val: 7 },
  { type: 'two',   place: 'boston',   val: 3 },
  { type: 'three', place: 'canada',   val: 20 },
  { type: 'three', place: 'usa',      val: undefined },
  { type: 'three', place: 'campbell', val: undefined },
  { type: 'three', place: 'brampton', val: undefined },
  { type: 'three', place: 'boston',   val: undefined },
]

// the same as above using selectors:
tidy(
  data,
  pivotLonger({
    cols: ['-type'],
    // ^ the same as: cols: [everything(), '-type']
    namesTo: 'place',
    valuesTo: 'val',
  })
)
```

```js
const data = [
  {
    secval_boston_5: -1,
    secval_boston_6: -1,
    secval_brampton_5: -1,
    secval_brampton_6: 98,
    type: 'one',
    val_boston_5: 0,
    val_boston_6: 0,
    val_brampton_5: 0,
    val_brampton_6: 8,
  },
  {
    secval_boston_5: 93,
    secval_boston_6: -1,
    secval_brampton_5: 97,
    secval_brampton_6: -1,
    type: 'two',
    val_boston_5: 3,
    val_boston_6: 0,
    val_brampton_5: 7,
    val_brampton_6: 0,
  },
];

tidy(
  data,
  pivotLonger({
    cols: ['-type'], // negative selector
    namesTo: ['place', 'other'],
    valuesTo: ['val', 'secval'],
  })
);
// output:
[
  { type: 'one', place: 'boston',   val: 0, other: '5', secval: -1 },
  { type: 'one', place: 'boston',   val: 0, other: '6', secval: -1 },
  { type: 'one', place: 'brampton', val: 0, other: '5', secval: -1 },
  { type: 'one', place: 'brampton', val: 8, other: '6', secval: 98 },
  { type: 'two', place: 'boston',   val: 3, other: '5', secval: 93 },
  { type: 'two', place: 'boston',   val: 0, other: '6', secval: -1 },
  { type: 'two', place: 'brampton', val: 7, other: '5', secval: 97 },
  { type: 'two', place: 'brampton', val: 0, other: '6', secval: -1 },
]
```

---

##  pivotWider 

Widens data by increasing the number of columns (keys) and decreasing the number of rows (items) in a collection. The inverse transformation is [**pivotLonger**](#pivotlonger).

### Parameters

#### `options`

```ts
{
  namesFrom: string | string[], /* keys in the items */
  namesSep: string = '_';
  valuesFrom: string | string[]; /* keys in the items */
  valuesFill: any;
  valuesFillMap: { [string /* key in item */]: any }
}
```

- `namesFrom`: Used in combination with `valuesFrom` to get the name of the output key and the value respectively. If `valuesFrom` contains multiple values, the value key will be prefixed to the output keys, using `nameSep`. 
- `valuesFill`: any values missing after widening will be filled with this value if specified. Ignored is `valuesFillMap` is provided.
- `valuesFillMap`: a map from keys to their default value to be used when the value is not present in the widened item.


### Usage

```js
const data = [
  { type: 'one',   place: 'canada',   val: 1 },
  { type: 'one',   place: 'usa',      val: 10 },
  { type: 'one',   place: 'campbell', val: 4 },
  { type: 'one',   place: 'brampton', val: 8 },
  { type: 'two',   place: 'brampton', val: 7 },
  { type: 'two',   place: 'boston',   val: 3 },
  { type: 'two',   place: 'usa',      val: 11 },
  { type: 'three', place: 'canada',   val: 20 },
];

tidy(
  data,
  pivotWider({
    namesFrom: 'place',
    valuesFrom: 'val',
  })
);
// output:
[
  { type: 'one', canada: 1, usa: 10, campbell: 4, brampton: 8 },
  { type: 'two', brampton: 7, boston: 3, usa: 11 },
  { type: 'three', canada: 20 },
]
```

```js
const data = [
  { type: 'one', other: 5, place: 'canada', val: 1, secval: 91 },
  { type: 'one', other: 5, place: 'usa', val: 10, secval: 910 },
  { type: 'one', other: 6, place: 'campbell', val: 4, secval: 94 },
  { type: 'one', other: 6, place: 'brampton', val: 8, secval: 98 },
  { type: 'two', other: 5, place: 'brampton', val: 7, secval: 97 },
  { type: 'two', other: 5, place: 'boston', val: 3, secval: 93 },
  { type: 'two', other: 6, place: 'usa', val: 11, secval: 911 },
  { type: 'three', other: 5, place: 'canada', val: 20, secval: 920 },
];

const results = tidy(
  data,
  pivotWider({
    namesFrom: ['place', 'other'],
    valuesFrom: ['val', 'secval'],
    valuesFillMap: { val: 0, secval: -1 },
  })
);
// output:
[{
  secval_boston_5: -1,
  secval_boston_6: -1,
  secval_brampton_5: -1,
  secval_brampton_6: 98,
  secval_campbell_5: -1,
  secval_campbell_6: 94,
  secval_canada_5: 91,
  secval_canada_6: -1,
  secval_usa_5: 910,
  secval_usa_6: -1,
  type: 'one',
  val_boston_5: 0,
  val_boston_6: 0,
  val_brampton_5: 0,
  val_brampton_6: 8,
  val_campbell_5: 0,
  val_campbell_6: 4,
  val_canada_5: 1,
  val_canada_6: 0,
  val_usa_5: 10,
  val_usa_6: 0,
},
{
  secval_boston_5: 93,
  secval_boston_6: -1,
  secval_brampton_5: 97,
  secval_brampton_6: -1,
  secval_campbell_5: -1,
  secval_campbell_6: -1,
  secval_canada_5: -1,
  secval_canada_6: -1,
  secval_usa_5: -1,
  secval_usa_6: 911,
  type: 'two',
  val_boston_5: 3,
  val_boston_6: 0,
  val_brampton_5: 7,
  val_brampton_6: 0,
  val_campbell_5: 0,
  val_campbell_6: 0,
  val_canada_5: 0,
  val_canada_6: 0,
  val_usa_5: 0,
  val_usa_6: 11,
},
{
  secval_boston_5: -1,
  secval_boston_6: -1,
  secval_brampton_5: -1,
  secval_brampton_6: -1,
  secval_campbell_5: -1,
  secval_campbell_6: -1,
  secval_canada_5: 920,
  secval_canada_6: -1,
  secval_usa_5: -1,
  secval_usa_6: -1,
  type: 'three',
  val_boston_5: 0,
  val_boston_6: 0,
  val_brampton_5: 0,
  val_brampton_6: 0,
  val_campbell_5: 0,
  val_campbell_6: 0,
  val_canada_5: 20,
  val_canada_6: 0,
  val_usa_5: 0,
  val_usa_6: 0,
}]
```