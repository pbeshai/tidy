import { tidy, summarize, first } from '../index';

describe('first', () => {
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
          val: first('value'),
        })
      )
    ).toEqual([{ val: 9 }]);

    expect(
      tidy(
        [],
        summarize({
          val: first('value'),
        })
      )
    ).toEqual([{ val: undefined }]);
  });
});
