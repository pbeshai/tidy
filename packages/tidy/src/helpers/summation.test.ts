import { sum, cumsum, mean } from './summation';

const data = [1, 2, 3, 4, 5];
const badData = [NaN, null, undefined, ...data, NaN, null, undefined];

describe('sum', () => {
  it('it works with no accessor', () => {
    expect(sum(data)).toEqual(15);
  });
  it('it ignores nullish', () => {
    expect(sum(data)).toEqual(sum(badData));
  });
  it('it works with accessor', () => {
    expect(sum(data, (d) => d + 1)).toEqual(20);
    expect(sum(data, (d, i) => d + i)).toEqual(25);
  });
});

describe('cumsum', () => {
  it('it works with no accessor', () => {
    expect(cumsum(data)).toEqual(Float64Array.from([1, 3, 6, 10, 15]));
  });
  it('it ignores nullish', () => {
    expect(cumsum(badData)).toEqual(
      Float64Array.from([0, 0, 0, 1, 3, 6, 10, 15, 15, 15, 15])
    );
  });
  it('it works with accessor', () => {
    expect(cumsum(data, (d) => d + 1)).toEqual(
      Float64Array.from([2, 5, 9, 14, 20])
    );
    expect(cumsum(data, (d, i) => d + i)).toEqual(
      Float64Array.from([1, 4, 9, 16, 25])
    );
  });
});

describe('mean', () => {
  it('it works with no accessor', () => {
    expect(mean(data)).toEqual(3);
  });
  it('it ignores nullish', () => {
    expect(mean(badData)).toEqual(3);
  });
  it('it works with accessor', () => {
    expect(mean(data, (d) => d + 1)).toEqual(4);
    expect(mean(data, (d, i) => d + i)).toEqual(5);
  });
});
