import { tidy, distinct } from './index';

describe('distinct', () => {
  it('distinct with no keys', () => {
    const datum1 = { value: 1 };
    const datum2 = { value: 2 };
    const datum3 = { value: 3 };
    expect(
      tidy([datum1, datum2, datum1, datum3, datum1, datum2, datum3], distinct())
    ).toEqual([datum1, datum2, datum3]);
  });

  it('distinct with single key', () => {
    expect(
      tidy([{ value: 1 }, { value: 3 }, { value: 1 }], distinct('value'))
    ).toEqual([{ value: 1 }, { value: 3 }]);
  });

  it('distinct with multiple key', () => {
    expect(
      tidy(
        [
          { str: 'foo', value: 1 },
          { str: 'foo', value: 3 },
          { str: 'bar', value: 1 },
          { str: 'foo', value: 3 },
        ],
        distinct(['str', 'value'])
      )
    ).toEqual([
      { str: 'foo', value: 1 },
      { str: 'foo', value: 3 },
      { str: 'bar', value: 1 },
    ]);
  });

  it('distinct with multiple key functions and strings', () => {
    expect(
      tidy(
        [
          { str: 'foo', value: 1 },
          { str: 'foo', value: 3 },
          { str: 'far', value: 3 },
          { str: 'bar', value: 1 },
          { str: 'foo', value: 3 },
        ],
        distinct([(d) => d.str[0], 'value'])
      )
    ).toEqual([
      { str: 'foo', value: 1 },
      { str: 'foo', value: 3 },
      { str: 'bar', value: 1 },
    ]);
  });
});
