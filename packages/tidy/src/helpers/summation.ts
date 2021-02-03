/**
 * These functions compute the sum, cumsum, and mean of an array with the same API as d3-array
 * instead of using a plain sum, they use the "improved Kahan-Babuška summation algorithm" to
 * correct some of the floating point error:
 * https://en.wikipedia.org/wiki/Kahan_summation_algorithm#Further_enhancements
 * originally from page 40 of https://www.mat.univie.ac.at/~neum/scan/01.pdf
 */
export function sum<T>(
  items: T[],
  accessor?: (element: T, i: number, array: Iterable<T>) => any
): number {
  let sum: number = 0,
    correction: number = 0,
    temp: number = 0;

  for (let i = 0; i < items.length; i++) {
    let value: number =
      accessor === undefined ? items[i] : accessor(items[i], i, items);

    if (+value !== value) {
      value = 0;
    }

    if (i === 0) {
      sum = value;
    } else {
      temp = sum + value;

      if (Math.abs(sum) >= Math.abs(value)) {
        correction += sum - temp + value;
      } else {
        correction += value - temp + sum;
      }

      sum = temp;
    }
  }
  return sum + correction;
}

export function cumsum<T>(
  items: T[],
  accessor?: (element: T, i: number, array: Iterable<T>) => any
): Float64Array {
  let sum: number = 0,
    correction: number = 0,
    temp: number = 0,
    cumsums: Float64Array = new Float64Array(items.length);
  for (let i = 0; i < items.length; i++) {
    let value: number =
      accessor === undefined ? items[i] : accessor(items[i], i, items);

    if (+value !== value) {
      value = 0;
    }

    if (i === 0) {
      sum = value;
    } else {
      temp = sum + value;

      if (Math.abs(sum) >= Math.abs(value)) {
        correction += sum - temp + value;
      } else {
        correction += value - temp + sum;
      }

      sum = temp;
    }

    cumsums[i] = sum + correction;
  }

  return cumsums;
}

export function mean<T>(
  items: T[],
  accessor?: (element: T, i: number, array: Iterable<T>) => any
): number | undefined {
  let n: number = 0,
    sum: number = 0,
    correction: number = 0,
    temp: number = 0;

  for (let i = 0; i < items.length; i++) {
    let value: number =
      accessor === undefined ? items[i] : accessor(items[i], i, items);

    if (+value !== value) {
      value = 0;
    } else {
      n++;
    }

    if (i === 0) {
      sum = value;
    } else {
      temp = sum + value;

      if (Math.abs(sum) >= Math.abs(value)) {
        correction += sum - temp + value;
      } else {
        correction += value - temp + sum;
      }

      sum = temp;
    }
  }

  return n ? (sum + correction) / n : undefined;
}
