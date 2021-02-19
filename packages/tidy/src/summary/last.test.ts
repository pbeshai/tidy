import { tidy, summarize, last } from '../index';

describe('last', () => {
  it('it works', () => {
    const data = [
      { str: 'foo', value: 9 },
      { str: 'foo', value: 1 },
      { str: 'bar', value: 3 },
      { str: 'bar', value: 1 },
      { str: 'bar', value: 7 },
    ];

    expect(
      tidy(
        data,
        summarize({
          val: last('value'),
        })
      )
    ).toEqual([{ val: 7 }]);

    expect(
      tidy(
        [],
        summarize({
          val: last('value'),
        })
      )
    ).toEqual([{ val: undefined }]);
  });
});
