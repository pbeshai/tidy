import { tidy, summarize, nWhere } from '../index';

describe('nWhere', () => {
  it('it works', () => {
    const data = [
      { str: 'foo', value: 3 },
      { str: 'foo', value: 1 },
      { str: 'bar', value: 3 },
      { str: 'bar', value: 1 },
      { str: 'bar', value: 7 },
    ];

    expect(
      tidy(
        data,
        summarize({
          nfoo: nWhere((d) => d.str === 'foo'),
          nbar: nWhere((d) => d.str === 'bar'),
        })
      )
    ).toEqual([{ nfoo: 2, nbar: 3 }]);
  });
});
