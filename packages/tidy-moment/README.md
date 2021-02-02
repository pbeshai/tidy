# @tidyjs/tidy-moment

**Dependency: moment >= 2.0.0**

## summarizeMomentGranularity

Summarizes input data into bins set by a granularity (day, week, month, year) of UTC moment dates. Assumes input data is by day. By default uses `date` and `timestamp` as the keys to track the date, but can be configured via options.

Typically used as a precursor to a moving average computed by a subsequence `mutate({ value: roll(...) })` command.


### Parameters

#### `granularity`

```ts
  | 'd'
  | 'days'
  | 'w'
  | 'weeks'
  | 'm'
  | 'months'
  | 'q'
  | 'quarters'
  | 'y'
  | 'years'
```

#### `summarizeSpec`

```ts
{
  [string /* key in output */]: (items: object[]) => any
}
```

Mapping from key to summary functions, the same as used in [**summarize**](#summarize).

#### `options?`

```ts
{
  dateKey?: string = 'date',
  timestampKey?: string = 'timestamp',
  rest?: (key: string) => (items: object[]) => any
}
```

* `dateKey = 'date'`: The key in the input objects where the UTC moment dates are stored. Will be modified to be at the specified granularity.
* `timestampKey = 'timestamp'`: An ISO string of the rolled up date will be saved on this key.
* `rest = first`: The same as used in [**summarize**](#summarize), defaults to first value encountered.


### Usage

```js
const data = [
  { str: 'foo', date: moment.utc('2020-01-01'), value: 3 },
  { str: 'foo', date: moment.utc('2020-01-03'), value: 1 },
  { str: 'bar', date: moment.utc('2020-01-10'), value: 3 },
  { str: 'bar', date: moment.utc('2020-01-21'), value: 1 },
  { str: 'bar', date: moment.utc('2020-01-29'), value: 2 },
  { str: 'bar', date: moment.utc('2020-02-01'), value: 5 },
];

tidy(
  data,
  summarizeMomentGranularity('weeks', { value: sum('value') })
);
/* => [
  {
    value: 4,
    str: 'foo',
    date: moment.utc('2019-12-30'),
    timestamp: '2019-12-30T00:00:00.000Z',
  },
  {
    value: 3,
    str: 'bar',
    date: moment.utc('2020-01-06'),
    timestamp: '2020-01-06T00:00:00.000Z',
  },
  {
    value: 1,
    str: 'bar',
    date: moment.utc('2020-01-20'),
    timestamp: '2020-01-20T00:00:00.000Z',
  },
  {
    value: 7,
    str: 'bar',
    date: moment.utc('2020-01-27'),
    timestamp: '2020-01-27T00:00:00.000Z',
  },
] */
```


