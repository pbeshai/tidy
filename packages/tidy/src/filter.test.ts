import { tidy, filter } from './index';

describe('filter', () => {
  it('filter works', () => {
    const data = [{ value: 1 }, { value: 2 }, { value: 3 }];
    expect(
      tidy(
        data,
        filter((d) => d.value % 2 === 1),
        filter((d) => d.value > 2)
      )
    ).toEqual([{ value: 3 }]);
  });
});
