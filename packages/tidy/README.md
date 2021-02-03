# tidy.js

**Tidy up your data with JavaScript!** Inspired by [dplyr](https://dplyr.tidyverse.org/) and the [tidyverse](https://www.tidyverse.org/), tidy.js attempts to bring the ergonomics of data manipulation from R to javascript (and typescript). The primary goals of the project are:

* **Readable code**. Tidy.js prioritizes making your data transformations readable, so future you and your teammates can get up and running quickly.

* **Standard transformation verbs**. Tidy.js is built using battle-tested verbs from the R community that can handle any data wrangling need.

* **Work with plain JS objects**. No wrapper classes needed — all tidy.js needs is an array of plain old-fashioned JS objects to get started. Simple in, simple out.

Secondarily, this project aims to provide acceptable types for the functions provided.


#### Quick Links

* [GitHub repo](https://github.com/pbeshai/tidy)
* [Project homepage](https://pbeshai.github.io/tidy)
* [API reference documentation](https://pbeshai.github.io/tidy/docs/api/tidy)
* [Playground](https://pbeshai.github.io/tidy/playground)
* [Observable Notebook](https://observablehq.com/@pbeshai/tidy-js-intro-demo)
* [CodeSandbox showing basic HTML usage (UMD)](https://codesandbox.io/s/tidyjs-umd-example-n1g4r?file=/index.html)

#### Related work

Be sure to check out a very similar project, [Arquero](https://github.com/uwdata/arquero), from [UW Data](https://idl.cs.washington.edu/). 


## Getting started

To start using tidy, your best bet is to install from npm:

```shell
npm install @tidyjs/tidy
# or
yarn add @tidyjs/tidy
```

Then import the functions you need:

```js
import { tidy, mutate, arrange, desc } from '@tidyjs/tidy'
```

**Note** if you're just trying tidy in a browser, you can use the UMD version hosted on unpkg ([codesandbox example](https://codesandbox.io/s/tidyjs-umd-example-n1g4r?file=/index.html)):

```html
<script src="https://d3js.org/d3-array.v2.min.js"></script>
<script src="https://www.unpkg.com/@tidyjs/tidy/dist/umd/tidy.min.js"></script>
<script>
  const { tidy, mutate, arrange, desc } = Tidy;
  // ...
</script>  
```

And use them on an array of objects:

```js
const data = [
  { a: 1, b: 10 }, 
  { a: 3, b: 12 }, 
  { a: 2, b: 10 }
]

const results = tidy(
  data, 
  mutate({ ab: d => d.a * d.b }),
  arrange(desc('ab'))
)
```

The output is:

```js
[
  { a: 3, b: 12, ab: 36},
  { a: 2, b: 10, ab: 20},
  { a: 1, b: 10, ab: 10}
]
```

All tidy.js code is wrapped in a **tidy flow** via the `tidy()` function. The first argument is the array of data, followed by the transformation verbs to run on the data. The actual functions passed to `tidy()` can be anything so long as they fit the form:

```
(items: object[]) => object[]
```

For example, the following is valid:

```js
tidy(
  data, 
  items => items.filter((d, i) => i % 2 === 0),
  arrange(desc('value'))
)
```

All tidy verbs fit this style, with the exception of exports from groupBy, discussed below.

### Grouping data with groupBy

Besides manipulating flat lists of data, tidy provides facilities for wrangling grouped data via the `groupBy()` function.

```js
import { tidy, summarize, sum, groupBy } from '@tidyjs/tidy'

const data = [
  { key: 'group1', value: 10 }, 
  { key: 'group2', value: 9 }, 
  { key: 'group1', value: 7 }
]

tidy(
  data,
  groupBy('key', [
    summarize({ total: sum('value') })
  ])
)

```

The output is:
```js
[
  { "key": "group1", "total": 17 },
  { "key": "group2", "total": 9 },
]
```

The `groupBy()` function works similarly to `tidy()` in that it takes a flow of functions as its second argument (wrapped in an array). Things get really fun when you use groupBy's *third* argument for exporting the grouped data into different shapes. 

For example, exporting data as a nested object, we can use `groupBy.object()` as the third argument to `groupBy()`.
 
```js
const data = [
  { g: 'a', h: 'x', value: 5 },
  { g: 'a', h: 'y', value: 15 },
  { g: 'b', h: 'x', value: 10 },
  { g: 'b', h: 'x', value: 20 },
  { g: 'b', h: 'y', value: 30 },
]

tidy(
  data,
  groupBy(
    ['g', 'h'], 
    [
      mutate({ key: d => `\${d.g}\${d.h}`})
    ], 
    groupBy.object() // <-- specify the export
  )
);

```

The output is:

```js
{
  "a": {
    "x": [{"g": "a", "h": "x", "value": 5, "key": "ax"}],
    "y": [{"g": "a", "h": "y", "value": 15, "key": "ay"}]
  },
  "b": {
    "x": [
      {"g": "b", "h": "x", "value": 10, "key": "bx"},
      {"g": "b", "h": "x", "value": 20, "key": "bx"}
    ],
    "y": [{"g": "b", "h": "y", "value": 30, "key": "by"}]
  }
}
```

Or alternatively as `{ key, values }` entries-objects  via `groupBy.entriesObject()`:

```js
tidy(data,
  groupBy(
    ['g', 'h'], 
    [
      mutate({ key: d => `\${d.g}\${d.h}`})
    ], 
    groupBy.entriesObject() // <-- specify the export
  )
);
```

The output is:

```js
[
  {
    "key": "a",
    "values": [
      {"key": "x", "values": [{"g": "a", "h": "x", "value": 5, "key": "ax"}]},
      {"key": "y", "values": [{"g": "a", "h": "y", "value": 15, "key": "ay"}]}
    ]
  },
  {
    "key": "b",
    "values": [
      {
        "key": "x",
        "values": [
          {"g": "b", "h": "x", "value": 10, "key": "bx"},
          {"g": "b", "h": "x", "value": 20, "key": "bx"}
        ]
      },
      {"key": "y", "values": [{"g": "b", "h": "y", "value": 30, "key": "by"}]}
    ]
  }
]
```

It's common to be left with a single leaf in a groupBy set, especially after running summarize(). To prevent your exported data having its values wrapped in an array, you can pass the `single` option to it.

```js
tidy(input,
  groupBy(['g', 'h'], [
    summarize({ total: sum('value') })
  ], groupBy.object({ single: true }))
);
```

The output is:

```js
{
  "a": {
    "x": {"total": 5, "g": "a", "h": "x"},
    "y": {"total": 15, "g": "a", "h": "y"}
  },
  "b": {
    "x": {"total": 30, "g": "b", "h": "x"},
    "y": {"total": 30, "g": "b", "h": "y"}
  }
}
```

Visit the [API reference docs](https://pbeshai.github.io/tidy/docs/api/tidy) to learn more about how each function works and all the options they take. Be sure to check out the `levels` export, which can let you mix-and-match different export types based on the depth of the data. For quick reference, other available groupBy exports include: 

* groupBy.entries()
* groupBy.entriesObject()
* groupBy.grouped()
* groupBy.levels()
* groupBy.object()
* groupBy.keys()
* groupBy.map()
* groupBy.values()


---


#### Shout out to Netflix

I want to give a big shout out to [Netflix](https://research.netflix.com/), my current employer, for giving me the opportunity to work on this project and to open source it. It's a great place to work and if you enjoy tinkering with data-related things, I'd strongly recommend checking out [our analytics department](https://research.netflix.com/research-area/analytics).
– [Peter Beshai](https://peterbeshai.com/)