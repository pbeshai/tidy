import { tidy, mutateWithSummary, mutate, lag } from '../index';

describe('lag', () => {
  it('it works', () => {
    const data = [
      { str: 'foo', value: 1 },
      { str: 'foo', value: 2 },
      { str: 'bar', value: 4 },
    ];

    const results = tidy(
      data,
      mutateWithSummary({
        prev1: lag('value'),
        prev1_0: lag('value', { default: 0 }),
        prev2: lag('value', { n: 2 }),
        prev3: lag('value', { n: 3 }),
        other: lag('other' as any),
      }),
      mutate({
        delta1_0: (d) => d.value - d.prev1_0,
      })
    );

    // prettier-ignore
    expect(results).toEqual([
      { str: 'foo', value: 1, prev1: undefined, prev1_0: 0, delta1_0: 1 },
      { str: 'foo', value: 2, prev1: 1, prev1_0: 1, delta1_0: 1 },
      { str: 'bar', value: 4, prev1: 2, prev1_0: 2, prev2: 1 , delta1_0: 2 },
    ]);
  });
});
