import { TMath, tidy, mutateWithSummary, mutate, lead } from '../index';

describe('lead', () => {
  it('it works', () => {
    const data = [
      { str: 'foo', value: 1 },
      { str: 'foo', value: 2 },
      { str: 'bar', value: 4 },
    ];

    const results = tidy(
      data,
      mutateWithSummary({
        next1: lead('value'),
        next1_0: lead('value', { default: 0 }),
        next2: lead('value', { n: 2 }),
        next3: lead('value', { n: 3 }),
        other: lead('other' as any),
      }),
      mutate({
        delta1: (d) => TMath.subtract(d.value, d.next1),
      })
    );

    // prettier-ignore
    expect(results).toEqual([
      { str: 'foo', value: 1, next1: 2, next1_0: 2, next2: 4, delta1: -1 },
      { str: 'foo', value: 2, next1: 4, next1_0: 4, delta1: -2 },
      { str: 'bar', value: 4, next1: undefined, next1_0: 0, delta1: undefined },
    ]);
  });
});
