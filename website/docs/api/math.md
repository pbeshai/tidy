---
title: Tidy Math API
sidebar_label: TMath
---


## add 

Adds two numbers together, returning `undefined` if either are nully. Optionally replaces nully values with 0.

### Parameters

#### `a`

```ts
number | null | undefined
```

The first operand

#### `b`

```ts
number | null | undefined
```

The second operand

#### `nullyZero? = false`

```
boolean
```

If true, nully (`null` and `undefined`) values are replaced with 0 before performing the addition.

### Usage

```js
TMath.add(1, 2)             // 3
TMath.add(null, 1)          // undefined
TMath.add(1, null)          // undefined
TMath.add(null, null)       // undefined
TMath.add(null, 1, true)    // 1
TMath.add(1, null, true)    // 1
TMath.add(null, null, true) // 0
```

---


## rate 

Computes a rate (numerator / denominator), setting the value to 0 if denominator = 0 and numerator = 0. If denominator or numerator are nully, the result is undefined. 

See also [**item::rate**](./item.md#rate)

### Parameters

#### `numerator`

```ts
number | null | undefined
```

The value to use as numerator.

#### `denominator`

```ts
number | null | undefined
```

The value to use as denominator.

#### `allowDivideByZero?`

```
boolean | undefined
```

If true, evaluates division when denominator is 0 (typically resulting in Infinity), otherwise rates with 0 denominators are `undefined`.

### Usage

```js
TMath.rate(5, 10);         // 0.5
TMath.rate(5, null);       // undefined
TMath.rate(undefined, 15); // undefined
TMath.rate(0, 0);          // undefined
TMath.rate(5, 0);          // undefined
TMath.rate(5, 0, true);    // Infinity
```


---

## subtract 

Subtracts two numbers, returning `undefined` if either are nully. Optionally replaces nully values with 0.

### Parameters

#### `a`

```ts
number | null | undefined
```

The first operand

#### `b`

```ts
number | null | undefined
```

The second operand

#### `nullyZero? = false`

```
boolean
```

If true, nully (`null` and `undefined`) values are replaced with 0 before performing the subtraction.

### Usage

```js
TMath.subtract(1, 2)             // -1
TMath.subtract(null, 1)          // undefined
TMath.subtract(1, null)          // undefined
TMath.subtract(null, null)       // undefined
TMath.subtract(null, 1, true)    // -1
TMath.subtract(1, null, true)    // 1
TMath.subtract(null, null, true) // 0
```
