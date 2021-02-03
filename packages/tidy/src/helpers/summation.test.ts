import { fcumsum, mean } from './summation';

const data = [1, 2, 3, 4, 5];
const badData = [NaN, null, undefined, ...data, NaN, null, undefined];

describe('cumsum', () => {
  it('it works', () => {
    expect(fcumsum(data, (d) => d + 1)).toEqual(
      Float64Array.from([2, 5, 9, 14, 20])
    );
    expect(fcumsum(data, (d, i) => d + i)).toEqual(
      Float64Array.from([1, 4, 9, 16, 25])
    );
  });
  it('it ignores nullish', () => {
    expect(fcumsum(badData, (d) => d)).toEqual(
      Float64Array.from([0, 0, 0, 1, 3, 6, 10, 15, 15, 15, 15])
    );
  });
});

describe('mean', () => {
  it('it works with accessor', () => {
    expect(mean(data, (d) => d + 1)).toEqual(4);
    expect(mean(data, (d, i) => d + i)).toEqual(5);
  });
  it('it ignores nullish', () => {
    expect(mean(badData, (d) => d)).toEqual(3);
  });
  it('it returns undefined for an empty array', () => {
    expect(mean([], (d) => d)).toEqual(undefined);
    expect(mean([null], (d) => d)).toEqual(undefined);
  });
});
