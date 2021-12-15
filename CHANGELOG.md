# Change Log

Tidy follows semver.
All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 2.4.5 (2021-12-15)
* Fix: groupBy works now with nullish keys #53


# 2.4.4 (2021-09-23)
* Feat: arrange now works with accessors: `arrange([d => d.foo.bar])` instead of requiring comparators or wrapping with asc or desc

# 2.4.3 (2021-08-17)

* Fix: groupBy now works on columns containing objects with valueOf() e.g. Dates #46

# 2.4.2 (2021-05-19)

* Fixes bug where leftJoin and fullJoin didn't include all columns on all objects, which may have resulted in weird behavior using select or arrange. #41

# 2.4.1 (2021-05-12)

* Allows type guards on filter (only affeects typescript) #39

# 2.4.0 (2021-05-07)

* groupBy now allows you to not pass any functions or array of functions. e.g. `groupBy(['str'])` or `groupBy(['str'], groupBy.entries())`. Note you could also do `groupBy('str')` (the first argument doesn't need to be an array) #37
* groupBy now allows you to pass a single function instead of an array if only one: `groupBy(['str'], summarize({ ... }))` #37 
* groupBy prepends group keys instead of appends when assigning them #34 #35
* groupBy doesn't assign group keys to non objects #34 #35
* groupBy doesn't ever assign function group keys #34 #35
* groupBy ignores falsy values  passed to a groupby flow #35

* makes it so you can pass an accessor to `asc()` or `desc()` when using arrange. Previously you would have to use your own comparator and would miss out on the cool empty aware comparator we use. #36

* internal update typescript to 4.2.4 #37

# 2.3.1 (2021-05-04)

* fixes a bug where sliceMax would return nulls instead of max values #33
* ignores falsy values passed to `tidy()` so you can more easily opt out of things (or you can use `when()`). #33

# 2.3.0 (2021-04-28)

* adds vector functions: lead, lag (use with mutateWithSummary typically) #32 
* adds TMath.add, TMath.subtract for convenience in handling nully values #32


# 2.2.0 (2021-04-26)

* adds fullJoin for completing a full join (now in addition to innerJoin and leftJoin) #31
* adds the summarizer nDistinct for counting the number of distinct values for a key #30

# 2.1.0 (2021-04-13)

* adds minute and second granularity to sequences and tidy-moment #29

# 2.0.8 (2021-03-05)

* fixes #23 by having arrange/sort move NaN, null, undefined values to the bottom

# 2.0.7 (2021-02-24)

* fixes #21 by having mapEntry be interpreted on entriesObject if provided

# 2.0.6 (2021-02-23)

* fixes #19 by interpreting the addGroupKeys flag in groupBy exports

# 2.0.5 (2021-02-18)

* fixes #16 by checking if we have items before indexing in first() and last()

# 2.0.4 (2021-02-12)

* #11 fixes bug where select() failed if given no keys to select.

# 2.0.3 (2021-02-03)

## Fixes 

- **sum**, **cumsum**, **mean**, **meanRate** updated to use the "improved Kahan-Babuška" algorithm for reduced floating point errors #2
- improves typing on **mutateWithSummary** to handle Float64Arrays #2

# 2.0.1, 2.0.2 (2021-02-02)

* patch releases to get npm published correctly, sorry!!


# 2.0.0 (2021-02-01)

## BREAKING CHANGES
* **pivotLonger** `cols` now requires you to specify the columns with values to pivot on, matching tidyr's behavior. (This is the inverse of what it did previously, accidentally)

## Features
* **count** now takes a `wt` option
* **tally** now takes a `wt` option
* **pivotLonger** `cols` now works with selectors, similar to **select**
 
# 2.0.0-alpha.2 (2021-01-05)

## BREAKING CHANGES
* Long-form calling of functions is no longer supported. i.e. `mutate(items, { value: 123 })` no longer works. This was done to simplify the code and types with aim of improving type inference. It is now recommended you either do `tidy(items, mutate({ value: 123 }))` or `mutate({ value: 123 })(items)`.
* **groupBy** has been reworked to improve types and to better clarify what is grouped. It now receives a tidy subflow (an array of tidy functions) as its second parameter. Additionally, the **fromGroups** methods have disappeared and are now activated by specifying a third option to **groupBy**. Examples:

```js
// before
tidy(
  data,
  groupBy('str')
  summarize({ summedValue: sum('value') })
  ungroup()
);

// after
tidy(
  data,
  groupBy('str', [
    summarize({ summedValue: sum('value') })
  ])
);
```

Example that would previously use objectFromGroups:

```js
// before
tidy(
  data,
  groupBy('str')
  summarize({ summedValue: sum('value') })
  objectFromGroups()
);

// after
tidy(
  data,
  groupBy('str', 
    [summarize({ summedValue: sum('value') })], 
    groupBy.object())
);
```

* groupBy exports renamed options from **transformLeaf** and **transformEntry** to **mapLeaf** and **mapEntry**.


* **mutate** has been renamed **mutateWithSummary** and a new **mutate** has been added. The new **mutate** works on single items at a time, while mutateWithSummary can look across the entire dataset. Example:

```js
// before
tidy(
  data,
  mutate({ val: byItem(d => d.x * 4) })
)

// after
tidy(
  data,
  mutate({ val: d => d.x * 4 })
)
```

```js
// before
tidy(
  data,
  mutate({ total: sum('value') })
)

// after
tidy(
  data,
  mutateWithSummary({ total: sum('value') })
)
```

Note that if you are using vector functions like **roll** or **cumsum**, you must now use **mutateWithSummary**.

* **byItem** and **byRow** have been removed, use **mutate** instead.
* **transmute** and **total** now mutate by item via **mutate**, no longer with **mutateWithSummary**.
* **rate** and **TMath.rate** now by default convert divisions by zero to `undefined` instead of `Infinity`. This can be configured by an options parameter.
* **rate** now operates on single items, not vectors (i.e., it is no longer usable with **mutateWithSummary**, but is designed to work with **mutate**).
* **summarizeMomentGranularity** has been moved to its own package called **tidy-moment**.
* **innerJoin** and **leftJoin** now have reversed their join mapping to `{ JoinTKey: Tkey }` (previously was `{ by: { TKey: JoinTKey }}`) to get better type inference.
* If using TypeScript, requires version 4.1 to handle template literal types.


## Features
* Added **when** for conditionally running tidy subflows
* Improved types and type inference
* **groupBy** now has an option `assignGroupKeys` (default: true) that allows you to disable assigning group keys back into objects.
* Added **negate**, a modifier for selectors that negates the output of a given selector. e.g. `negate(startsWith('foo'))` might give you `['-foo', '-foobar']`.

## Chores

* Switched to a mono-repo design with lerna + yarn workspaces
* Switched to using conventional commits



# 1.1.1
- Expanded granularity values allowed for fullSeqDateISOString, fullSeqDate, and summarizeMomentGranularity to make them consistent. 

# 1.1.0

## Convert From Groups Functions
- *new* **levelsFromGroups** was added to allow exporting grouped data where the format varies for each level in the grouped structure. For example, export the first key as entries then the rest as an object.
- **entriesFromGroups** transformEntry now receives the current level as a second argument.

# 1.0.2

## Tidy Functions
- **mutate** Fixes a bug where mutate broke if the mutated value was null or undefined.

# 1.0.1

## Tidy Functions
- **summarizeMomentGranularity** fixes bug where the operation didn't work when passed daily granularity.


# 1.0.0

- New documentation site now up.

## Tidy Functions
- Types for many functions have been modified to reduce incorrect type inference. In some cases this results in more loose types returned, as opposed to incorrect ones. 
- *new* **slice**, **sliceHead**, **sliceTail**, **sliceMin**, **sliceMax**, **sliceSample** Select subsets of the data
- *new* **summarizeMomentGranularity** New function to rollup data using Moments, requires a peer dependency of moment 2.0.0 or greater to work.
- *new* **debug** Added a helper to see intermediate output in the console.
- **summarizeAt**, **totalAt** now accept selectors as input in addition to key strings.
- **sort** now is an alias for **arrange**.

## Vector Functions
- *new* **cumsum** Compute a cumulative sum
- **rate** Now accepts a predicate option to only compute the rate if it passes.


# 0.0.5

## Tidy Functions
- **summarize** Added options argument that currently only takes `rest`. Specify a summary function that will be called on all the keys that were not specified in the summary spec. Commonly combined with **first** or **last** (see below).
  - **BREAKING** This new option argument means that full calls to summarize must now pass a third argument. e.g. `summarize(items, { foo: sum('foo') })` will no longer work. You must call `summarize(items, { foo: sum('foo') }, null)` or `{}` or `undefined` as the last argument. This does not affect calls to **summarize** within a `tidy(...)` flow.

## Summary Functions
- *new* **meanRate** Convenience function for summarizing rates / percents. Sums up numerator and sums up denominator then divides at the end. 
- *new* **first** Use the first value seen in the dataset.
- *new* **last** Use the last value seen in the dataset.

## Vector Functions
- *new* **roll** Use with mutate to compute rolling aggregations (e.g. moving averages).

## Helper Functions
- *new* **TMath.rate** Computes a rate, handling null numerators or denominators and the case when both numerator and denominator are zero. NOTE: export name may change in future.
