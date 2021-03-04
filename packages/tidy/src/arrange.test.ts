import { tidy, arrange, asc, desc, fixedOrder } from './index';
import { ascending } from 'd3-array';

type MixedDatum = { str: string; value: number };

describe('arrange', () => {
  it('arranges with multiple keys asc', () => {
    const results = tidy(
      [
        { str: 'foo', value: 3 },
        { str: 'foo', value: 1 },
        { str: 'bar', value: 3 },
        { str: 'bar', value: 1 },
        { str: 'bar', value: 7 },
      ],
      arrange(['str', 'value'])
    );

    expect(results).toEqual([
      { str: 'bar', value: 1 },
      { str: 'bar', value: 3 },
      { str: 'bar', value: 7 },
      { str: 'foo', value: 1 },
      { str: 'foo', value: 3 },
    ]);

    expect(
      tidy(
        [
          { str: 'foo', value: 3 },
          { str: 'foo', value: 1 },
          { str: 'bar', value: 3 },
          { str: 'bar', value: 1 },
          { str: 'bar', value: 7 },
        ],
        arrange([asc('str'), asc('value')])
      )
    ).toEqual([
      { str: 'bar', value: 1 },
      { str: 'bar', value: 3 },
      { str: 'bar', value: 7 },
      { str: 'foo', value: 1 },
      { str: 'foo', value: 3 },
    ]);
  });

  it('treats NaN comparisons as 0', () => {
    const results = tidy(
      [
        { str: 'foo', value: 3 },
        { str: 'foo', value: 1 },
        { str: 'bar', value: 3 },
        { str: 'bar', value: 1 },
        { str: 'bar', value: 7 },
      ],
      arrange(['doesntexist', 'str', 'value'])
    );

    expect(results).toEqual([
      { str: 'bar', value: 1 },
      { str: 'bar', value: 3 },
      { str: 'bar', value: 7 },
      { str: 'foo', value: 1 },
      { str: 'foo', value: 3 },
    ]);

    expect(
      tidy(
        [
          { str: 'foo', value: 3 },
          { str: 'foo', value: 1 },
          { str: 'bar', value: 3 },
          { str: 'bar', value: 1 },
          { str: 'bar', value: 7 },
        ],
        arrange(['str', desc('doesntexist'), asc('value')])
      )
    ).toEqual([
      { str: 'bar', value: 1 },
      { str: 'bar', value: 3 },
      { str: 'bar', value: 7 },
      { str: 'foo', value: 1 },
      { str: 'foo', value: 3 },
    ]);
  });

  it('arranges with multiple keys desc', () => {
    expect(
      tidy(
        [
          { str: 'foo', value: 3 },
          { str: 'foo', value: 1 },
          { str: 'bar', value: 3 },
          { str: 'bar', value: 1 },
          { str: 'bar', value: 7 },
        ],
        arrange(['str', desc('value')])
      )
    ).toEqual([
      { str: 'bar', value: 7 },
      { str: 'bar', value: 3 },
      { str: 'bar', value: 1 },
      { str: 'foo', value: 3 },
      { str: 'foo', value: 1 },
    ]);

    expect(
      tidy(
        [
          { str: 'foo', value: 3 },
          { str: 'foo', value: 1 },
          { str: 'bar', value: 3 },
          { str: 'bar', value: 1 },
          { str: 'bar', value: 7 },
        ],
        arrange([desc('str'), 'value'])
      )
    ).toEqual([
      { str: 'foo', value: 1 },
      { str: 'foo', value: 3 },
      { str: 'bar', value: 1 },
      { str: 'bar', value: 3 },
      { str: 'bar', value: 7 },
    ]);
  });

  it('arranges with comparator functions', () => {
    expect(
      tidy(
        [
          { str: 'foo', value: 3 },
          { str: 'foo', value: 1 },
          { str: 'bar', value: 3 },
          { str: 'bar', value: 1 },
          { str: 'bar', value: 7 },
        ],
        arrange(
          (a, b) => ascending(a.str, b.str) || ascending(a.value, b.value)
        )
      )
    ).toEqual([
      { str: 'bar', value: 1 },
      { str: 'bar', value: 3 },
      { str: 'bar', value: 7 },
      { str: 'foo', value: 1 },
      { str: 'foo', value: 3 },
    ]);
  });

  it('arranges with fixedOrder', () => {
    expect(
      tidy(
        [
          { str: 'baz', value: 1 },
          { str: 'foo', value: 3 },
          { str: 'bar', value: 2 },
        ],
        arrange([fixedOrder('value', [3, 2, 1])])
      )
    ).toEqual([
      { str: 'foo', value: 3 },
      { str: 'bar', value: 2 },
      { str: 'baz', value: 1 },
    ]);

    expect(
      tidy(
        [
          { str: 'typescript', value: 2 },
          { str: 'even', value: 1 },
          { str: 'what', value: 1 },
          { str: 'is', value: 2 },
        ],
        arrange([
          'value',
          fixedOrder('str', ['what', 'even', 'is', 'typescript']),
        ])
      )
    ).toEqual([
      { str: 'what', value: 1 },
      { str: 'even', value: 1 },
      { str: 'is', value: 2 },
      { str: 'typescript', value: 2 },
    ]);

    expect(
      tidy(
        [
          { str: 'typescript', value: 2 },
          { str: 'even', value: 1 },
          { str: 'what', value: 1 },
          { str: 'is', value: 2 },
        ],
        arrange([
          'value',
          fixedOrder('str', ['what', 'even', 'is', 'typescript'], {
            position: 'end',
          }),
        ])
      )
    ).toEqual([
      { str: 'what', value: 1 },
      { str: 'even', value: 1 },
      { str: 'is', value: 2 },
      { str: 'typescript', value: 2 },
    ]);
  });

  it('arranges un-matched items last with fixedOrder', () => {
    expect(
      tidy(
        [
          { str: 'typescript', value: 2 },
          { str: 'even', value: 1 },
          { str: 'bro', value: 2 },
          { str: 'what', value: 1 },
          { str: 'is', value: 2 },
        ],
        arrange([fixedOrder('str', ['what', 'even', 'is'])])
      )
    ).toEqual([
      { str: 'what', value: 1 },
      { str: 'even', value: 1 },
      { str: 'is', value: 2 },
      { str: 'typescript', value: 2 },
      { str: 'bro', value: 2 },
    ]);

    expect(
      tidy(
        [
          { str: 'typescript' },
          { str: 'even' },
          { str: 'b' },
          { str: 'what' },
          { str: 'a' },
          { str: 'is' },
          { str: 'c' },
        ],
        arrange([
          fixedOrder('str', ['what', 'even', 'is', 'typescript']),
          asc('str'),
        ])
      )
    ).toEqual([
      { str: 'what' },
      { str: 'even' },
      { str: 'is' },
      { str: 'typescript' },
      { str: 'a' },
      { str: 'b' },
      { str: 'c' },
    ]);

    expect(
      tidy(
        [
          { str: 'typescript' },
          { str: 'even' },
          { str: 'b' },
          { str: 'what' },
          { str: 'a' },
          { str: 'is' },
          { str: 'c' },
        ],
        arrange([
          fixedOrder('str', ['what', 'even', 'is', 'typescript'], {
            position: 'end',
          }),
          asc('str'),
        ])
      )
    ).toEqual([
      { str: 'a' },
      { str: 'b' },
      { str: 'c' },
      { str: 'what' },
      { str: 'even' },
      { str: 'is' },
      { str: 'typescript' },
    ]);

    expect(
      tidy(
        ['A', 'B', 'C'] as any,
        arrange(fixedOrder((d: any) => d, ['C', 'A', 'B']))
      )
    ).toEqual(['C', 'A', 'B']);

    expect(
      ['A', 'B', 'C'].sort(fixedOrder((d) => d, ['C', 'A', 'B']))
    ).toEqual(['C', 'A', 'B']);
  });
});
