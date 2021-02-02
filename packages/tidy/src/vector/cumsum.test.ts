import { tidy, mutateWithSummary, cumsum } from '../index';

describe('cumsum', () => {
  it('it works', () => {
    const data = [
      { str: 'foo', value: 3, value2: 1 },
      { str: 'bar', value: 1, value2: 3 },
      { str: 'bar', value: null, value2: undefined },
      { str: 'bar', value: 5, value2: 4 },
    ];

    const results = tidy(
      data,
      mutateWithSummary({
        cumsum1: cumsum('value'),
        cumsum2: cumsum((d) => (d.value == null ? d.value : d.value2 * 2)),
      })
    );

    expect(results).toEqual([
      { str: 'foo', value: 3, value2: 1, cumsum1: 3, cumsum2: 2 },
      { str: 'bar', value: 1, value2: 3, cumsum1: 4, cumsum2: 8 },
      { str: 'bar', value: null, value2: undefined, cumsum1: 4, cumsum2: 8 },
      { str: 'bar', value: 5, value2: 4, cumsum1: 9, cumsum2: 16 },
    ]);
  });
});
