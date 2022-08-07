import { tidy, mutateWithSummary, rowNumber, pick } from '../index';

describe('rowNumber', () => {
  it('it works', () => {
    const data = [{ value: 4 }, { value: 3 }, { value: 2 }, { value: 5 }];

    const results = tidy(
      data,
      mutateWithSummary({
        row: rowNumber(),
        rowFrom1: rowNumber({ startAt: 1 }),
      })
    );

    expect(results).toEqual([
      { value: 4, row: 0, rowFrom1: 1 },
      { value: 3, row: 1, rowFrom1: 2 },
      { value: 2, row: 2, rowFrom1: 3 },
      { value: 5, row: 3, rowFrom1: 4 },
    ]);
  });
});
