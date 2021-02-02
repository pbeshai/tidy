---
title: Tidy Math API
sidebar_label: TMath
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