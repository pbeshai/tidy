import {
  tidy,
  slice,
  sliceHead,
  sliceTail,
  sliceMin,
  sliceMax,
  sliceSample,
} from './index';

describe('slice', () => {
  it('slice works', () => {
    const data = [
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
    ];
    const results = tidy(data, slice(1, 3));
    expect(results).toEqual([{ value: 2 }, { value: 3 }]);
  });

  it('sliceHead works', () => {
    const data = [
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
    ];
    const results = tidy(data, sliceHead(2));

    expect(results).toEqual([{ value: 1 }, { value: 2 }]);
  });

  it('sliceTail works', () => {
    const data = [
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
    ];
    const results = tidy(data, sliceTail(2));
    expect(results).toEqual([{ value: 4 }, { value: 5 }]);
  });

  it('sliceMin works', () => {
    const data = [
      { value: 3 },
      { value: 1 },
      { value: 4 },
      { value: 5 },
      { value: 2 },
    ];
    const results = tidy(data, sliceMin(2, 'value'));
    expect(results).toEqual([{ value: 1 }, { value: 2 }]);
  });

  it('sliceMax works', () => {
    const data = [
      { value: 3 },
      { value: 1 },
      { value: 4 },
      { value: 5 },
      { value: 2 },
    ];
    const results = tidy(data, sliceMax(2, 'value'));
    expect(results).toEqual([{ value: 5 }, { value: 4 }]);
  });

  it('sliceSample works', () => {
    const data = [
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
    ];

    const results1 = tidy(data, sliceSample(10, { replace: true }));
    expect(results1.length).toEqual(10);
    const results2 = tidy(data, sliceSample(10, { replace: false }));
    expect(results2.length).toEqual(5);
  });
});
