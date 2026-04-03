# Patterns and Recipes

Multi-verb recipes for common data transformation tasks.

---

## 1. Group and Summarize

The most common tidyjs pattern — split data into groups, then aggregate each group.

```js
const data = [
  { category: 'A', region: 'east', value: 10 },
  { category: 'A', region: 'west', value: 20 },
  { category: 'B', region: 'east', value: 30 },
  { category: 'B', region: 'west', value: 40 },
];

tidy(data,
  groupBy('category', [
    summarize({
      total: sum('value'),
      avg: mean('value'),
      count: n(),
    })
  ])
)
// => [
//   { category: 'A', total: 30, avg: 15, count: 2 },
//   { category: 'B', total: 70, avg: 35, count: 2 },
// ]
```

**With multiple group keys:**

```js
tidy(data,
  groupBy(['category', 'region'], [
    summarize({ total: sum('value') })
  ])
)
// => [
//   { category: 'A', region: 'east', total: 10 },
//   { category: 'A', region: 'west', total: 20 },
//   { category: 'B', region: 'east', total: 30 },
//   { category: 'B', region: 'west', total: 40 },
// ]
```

**Export as a keyed object:**

```js
tidy(data,
  groupBy('category', [
    summarize({ total: sum('value') })
  ], groupBy.object({ single: true }))
)
// => { A: { category: 'A', total: 30 }, B: { category: 'B', total: 70 } }
```

---

## 2. Pivot Wider and Longer

### Long to wide

```js
const data = [
  { name: 'Alice', metric: 'score', value: 90 },
  { name: 'Alice', metric: 'rank', value: 1 },
  { name: 'Bob', metric: 'score', value: 80 },
  { name: 'Bob', metric: 'rank', value: 2 },
];

tidy(data,
  pivotWider({
    namesFrom: 'metric',
    valuesFrom: 'value',
  })
)
// => [
//   { name: 'Alice', score: 90, rank: 1 },
//   { name: 'Bob', score: 80, rank: 2 },
// ]
```

### Wide to long

```js
const data = [
  { name: 'Alice', score: 90, rank: 1 },
  { name: 'Bob', score: 80, rank: 2 },
];

tidy(data,
  pivotLonger({
    cols: ['score', 'rank'],
    namesTo: 'metric',
    valuesTo: 'value',
  })
)
// => [
//   { name: 'Alice', metric: 'score', value: 90 },
//   { name: 'Alice', metric: 'rank', value: 1 },
//   { name: 'Bob', metric: 'score', value: 80 },
//   { name: 'Bob', metric: 'rank', value: 2 },
// ]
```

**Pivot longer with selectors:**

```js
tidy(data,
  pivotLonger({
    cols: [startsWith('q')],  // columns like q1, q2, q3, q4
    namesTo: 'quarter',
    valuesTo: 'revenue',
  })
)
```

---

## 3. Fill Missing Time Series (expand + complete + fill)

Generate missing time periods and fill forward.

```js
const data = [
  { date: '2024-01', category: 'A', value: 10 },
  { date: '2024-03', category: 'A', value: 30 },  // 2024-02 missing
  { date: '2024-01', category: 'B', value: 20 },
  { date: '2024-02', category: 'B', value: 25 },
];

tidy(data,
  complete({
    date: ['2024-01', '2024-02', '2024-03'],
    category: ['A', 'B'],
  }),
  fill('value')
)
// => all date/category combinations exist, nulls filled forward
```

**With numeric sequences:**

```js
tidy(data,
  complete({
    year: fullSeq('year', { period: 1 }),  // fills gaps in year column
    category: ['A', 'B'],
  }),
  replaceNully({ value: 0 })  // fill missing with 0 instead of forward-fill
)
```

---

## 4. Rolling Aggregation

Compute a moving average or other rolling window calculation.

```js
const data = [
  { date: '2024-01', value: 10 },
  { date: '2024-02', value: 20 },
  { date: '2024-03', value: 15 },
  { date: '2024-04', value: 25 },
  { date: '2024-05', value: 30 },
];

tidy(data,
  mutateWithSummary({
    movingAvg3: roll(3, mean('value'), { partial: true }),
  })
)
// => each row gets a 3-period moving average of 'value'
// partial: true means first 2 rows use windows smaller than 3
```

**Rolling sum:**

```js
tidy(data,
  mutateWithSummary({
    rollingSum: roll(3, sum('value')),
  })
)
```

---

## 5. Cumulative Calculations

Add a running total, cumulative count, or percentage of total.

```js
const data = [
  { month: 'Jan', revenue: 100 },
  { month: 'Feb', revenue: 150 },
  { month: 'Mar', revenue: 200 },
];

tidy(data,
  mutateWithSummary({
    cumulativeRevenue: cumsum('revenue'),
    rowNum: rowNumber(),
    totalRevenue: sum('revenue'),  // broadcast single value to all rows
  }),
  mutate({
    pctOfTotal: (d) => d.revenue / d.totalRevenue,
  })
)
// => [
//   { month: 'Jan', revenue: 100, cumulativeRevenue: 100, rowNum: 0, totalRevenue: 450, pctOfTotal: 0.222 },
//   { month: 'Feb', revenue: 150, cumulativeRevenue: 250, rowNum: 1, totalRevenue: 450, pctOfTotal: 0.333 },
//   { month: 'Mar', revenue: 200, cumulativeRevenue: 450, rowNum: 2, totalRevenue: 450, pctOfTotal: 0.444 },
// ]
```

---

## 6. Conditional Pipeline Branching

Apply transformations only when a condition is met.

```js
const includeInactive = false;

tidy(data,
  when(includeInactive, []),  // no-op when false
  when(!includeInactive, [filter((d) => d.active)]),  // filter when true
  arrange(desc('value'))
)
```

**With a predicate function:**

```js
tidy(data,
  when(
    (items) => items.length > 100,  // only filter if dataset is large
    [sliceHead(100)]
  ),
  summarize({ avg: mean('score') })
)
```

---

## 7. Multi-Level Grouping with Export

Nested grouping with per-level export control.

```js
const data = [
  { dept: 'Eng', team: 'Frontend', name: 'Alice', salary: 100 },
  { dept: 'Eng', team: 'Frontend', name: 'Bob', salary: 110 },
  { dept: 'Eng', team: 'Backend', name: 'Carol', salary: 120 },
  { dept: 'Sales', team: 'Enterprise', name: 'Dave', salary: 90 },
];

// Nested object: { dept: { team: [items] } }
tidy(data,
  groupBy(['dept', 'team'], [],
    groupBy.levels({ levels: ['object', 'object'] })
  )
)
// => {
//   Eng: { Frontend: [Alice, Bob], Backend: [Carol] },
//   Sales: { Enterprise: [Dave] }
// }
```

**Flat export with composite keys:**

```js
tidy(data,
  groupBy(['dept', 'team'], [summarize({ total: sum('salary') })],
    groupBy.object({ flat: true, compositeKey: (keys) => keys.join(' > ') })
  )
)
// => { 'Eng > Frontend': [...], 'Eng > Backend': [...], 'Sales > Enterprise': [...] }
```

---

## 8. Join and Enrich

Add columns from a lookup table.

```js
const orders = [
  { orderId: 1, productId: 'A', qty: 5 },
  { orderId: 2, productId: 'B', qty: 3 },
  { orderId: 3, productId: 'A', qty: 2 },
];

const products = [
  { productId: 'A', name: 'Widget', price: 10 },
  { productId: 'B', name: 'Gadget', price: 25 },
];

tidy(orders,
  leftJoin(products, { by: 'productId' }),
  mutate({ total: (d) => d.qty * d.price }),
  arrange(desc('total'))
)
// => [
//   { orderId: 2, productId: 'B', qty: 3, name: 'Gadget', price: 25, total: 75 },
//   { orderId: 1, productId: 'A', qty: 5, name: 'Widget', price: 10, total: 50 },
//   { orderId: 3, productId: 'A', qty: 2, name: 'Widget', price: 10, total: 20 },
// ]
```

---

## 9. Top-N Per Group

Get the highest/lowest items within each group.

```js
const data = [
  { category: 'A', name: 'a1', score: 90 },
  { category: 'A', name: 'a2', score: 85 },
  { category: 'A', name: 'a3', score: 70 },
  { category: 'B', name: 'b1', score: 95 },
  { category: 'B', name: 'b2', score: 60 },
];

// Top 2 per category
tidy(data,
  groupBy('category', [
    arrange(desc('score')),
    sliceHead(2),
  ])
)
// => [
//   { category: 'A', name: 'a1', score: 90 },
//   { category: 'A', name: 'a2', score: 85 },
//   { category: 'B', name: 'b1', score: 95 },
//   { category: 'B', name: 'b2', score: 60 },
// ]
```

**Alternative using sliceMax:**

```js
tidy(data,
  groupBy('category', [
    sliceMax(2, 'score'),
  ])
)
```

---

## 10. Lag/Lead for Period-Over-Period Comparison

Calculate change from previous period.

```js
const data = [
  { month: 'Jan', revenue: 100 },
  { month: 'Feb', revenue: 120 },
  { month: 'Mar', revenue: 110 },
];

tidy(data,
  mutateWithSummary({
    prevRevenue: lag('revenue', { default: 0 }),
  }),
  mutate({
    change: (d) => d.revenue - d.prevRevenue,
    pctChange: (d) => d.prevRevenue ? (d.revenue - d.prevRevenue) / d.prevRevenue : null,
  })
)
// => [
//   { month: 'Jan', revenue: 100, prevRevenue: 0, change: 100, pctChange: null },
//   { month: 'Feb', revenue: 120, prevRevenue: 100, change: 20, pctChange: 0.2 },
//   { month: 'Mar', revenue: 110, prevRevenue: 120, change: -10, pctChange: -0.083 },
// ]
```
