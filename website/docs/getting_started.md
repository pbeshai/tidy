---
id: getting_started
title: Getting Started
sidebar_label: Getting Started
---

Install from npm:

```shell
npm install @tidyjs/tidy
# or
yarn add @tidyjs/tidy
```

You can import individual functions from tidy:

```js
import { tidy, mutate, arrange, desc } from '@tidyjs/tidy'
```

Then use them on an array of objects:

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

This produces the following results:

```json
[
  { "a": 3, "b": 12, "ab": 36 },
  { "a": 2, "b": 10, "ab": 20 },
  { "a": 1, "b": 10, "ab": 10 }
]
```

The real fun starts when you **group the data** and manipulate subgroups.

```js
import { tidy, summarize, sum, groupBy } from '@tidyjs/tidy'

const data = [
  { key: 'group1', value: 10 }, 
  { key: 'group2', value: 9 }, 
  { key: 'group1', value: 7 }
]

const results = tidy(
  data,
  groupBy('key', [
    summarize({ total: sum('value') })
  ])
)
```

This produces the following results:

```json
[
  { "key": "group1", "total": 17 },
  { "key": "group2", "total": 9 },
]
```

