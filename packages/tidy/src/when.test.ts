import { tidy, when, mutate } from './index';

describe('when', () => {
  it('when works', () => {
    const data = [{ x: 1 }, { x: 2 }, { x: 3 }];
    const results = tidy(data, when(true, [mutate({ y: 52 })]));
    expect(results).toEqual([
      { x: 1, y: 52 },
      { x: 2, y: 52 },
      { x: 3, y: 52 },
    ]);

    const results2 = tidy(data, when(false, [mutate({ y: 52 })]));
    expect(results2).toEqual([{ x: 1 }, { x: 2 }, { x: 3 }]);

    const results3 = tidy(
      data,
      when((items) => items.length === 3, [mutate({ y: 52 })])
    );
    expect(results3).toEqual([
      { x: 1, y: 52 },
      { x: 2, y: 52 },
      { x: 3, y: 52 },
    ]);

    const results4 = tidy(
      data,
      when((items) => items.length === 2, [mutate({ y: 52 })])
    );
    expect(results4).toEqual([{ x: 1 }, { x: 2 }, { x: 3 }]);
  });
});
