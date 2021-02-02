import { everything, tidy, pivotLonger } from './index';

describe('pivotLonger', () => {
  it('it works with multiple columns', () => {
    const data = [
      { type: 'one', canada: 1, usa: 10, campbell: 4, brampton: 8 },
      { type: 'two', brampton: 7, boston: 3, usa: 11 },
      { type: 'three', canada: 20 },
    ];

    const results = tidy(
      data,
      pivotLonger({
        cols: ['canada', 'usa', 'campbell', 'brampton', 'boston'],
        namesTo: 'place',
        valuesTo: 'val',
      })
    );
    expect(results).toEqual([
      { type: 'one', place: 'canada', val: 1 },
      { type: 'one', place: 'usa', val: 10 },
      { type: 'one', place: 'campbell', val: 4 },
      { type: 'one', place: 'brampton', val: 8 },
      { type: 'one', place: 'boston', val: undefined },
      { type: 'two', place: 'canada', val: undefined },
      { type: 'two', place: 'usa', val: 11 },
      { type: 'two', place: 'campbell', val: undefined },
      { type: 'two', place: 'brampton', val: 7 },
      { type: 'two', place: 'boston', val: 3 },
      { type: 'three', place: 'canada', val: 20 },
      { type: 'three', place: 'usa', val: undefined },
      { type: 'three', place: 'campbell', val: undefined },
      { type: 'three', place: 'brampton', val: undefined },
      { type: 'three', place: 'boston', val: undefined },
    ]);
  });

  it('it works with a single column', () => {
    const data = [
      { type: 'one', canada: 1 },
      { type: 'two' },
      { type: 'three', canada: 20 },
    ];

    const results = tidy(
      data,
      pivotLonger({
        cols: 'canada',
        namesTo: 'place',
        valuesTo: 'val',
      })
    );
    expect(results).toEqual([
      { type: 'one', place: 'canada', val: 1 },
      { type: 'two', place: 'canada', val: undefined },
      { type: 'three', place: 'canada', val: 20 },
    ]);
  });

  it('it works with selectors', () => {
    const data = [
      {
        type: 'one',
        canada: 1,
        usa: 10,
        campbell: 4,
        brampton: 8,
        boston: undefined,
      },
      { type: 'two', brampton: 7, boston: 3, usa: 11 },
      { type: 'three', canada: 20 },
    ];

    const results = tidy(
      data,
      pivotLonger({
        cols: '-type',
        namesTo: 'place',
        valuesTo: 'val',
      })
    );
    expect(results).toEqual([
      { type: 'one', place: 'canada', val: 1 },
      { type: 'one', place: 'usa', val: 10 },
      { type: 'one', place: 'campbell', val: 4 },
      { type: 'one', place: 'brampton', val: 8 },
      { type: 'one', place: 'boston', val: undefined },
      { type: 'two', place: 'canada', val: undefined },
      { type: 'two', place: 'usa', val: 11 },
      { type: 'two', place: 'campbell', val: undefined },
      { type: 'two', place: 'brampton', val: 7 },
      { type: 'two', place: 'boston', val: 3 },
      { type: 'three', place: 'canada', val: 20 },
      { type: 'three', place: 'usa', val: undefined },
      { type: 'three', place: 'campbell', val: undefined },
      { type: 'three', place: 'brampton', val: undefined },
      { type: 'three', place: 'boston', val: undefined },
    ]);

    const results2 = tidy(
      data,
      pivotLonger({
        cols: [everything(), '-type'],
        namesTo: 'place',
        valuesTo: 'val',
      })
    );
    expect(results2).toEqual(results);
  });

  it('it works with multiple columns', () => {
    const data = [
      { type: 'one', other: 5, canada: 1, usa: 10 },
      { type: 'one', other: 6, canada: 5 },
      { type: 'two', other: 5, usa: 3 },
      { type: 'two', other: 6, canada: 3, usa: 11 },
      { type: 'three', other: 5, canada: 20 },
    ];

    const results = tidy(
      data,
      pivotLonger({
        cols: ['-type', '-other'],
        namesTo: 'place',
        valuesTo: 'val',
      })
    );
    expect(results).toEqual([
      { type: 'one', other: 5, place: 'canada', val: 1 },
      { type: 'one', other: 5, place: 'usa', val: 10 },
      { type: 'one', other: 6, place: 'canada', val: 5 },
      { type: 'one', other: 6, place: 'usa', val: undefined },
      { type: 'two', other: 5, place: 'canada', val: undefined },
      { type: 'two', other: 5, place: 'usa', val: 3 },
      { type: 'two', other: 6, place: 'canada', val: 3 },
      { type: 'two', other: 6, place: 'usa', val: 11 },
      { type: 'three', other: 5, place: 'canada', val: 20 },
      { type: 'three', other: 5, place: 'usa', val: undefined },
    ]);
  });

  it('it works with multiple values to, multiple names to', () => {
    const data = [
      {
        secval_boston_5: -1,
        secval_boston_6: -1,
        secval_brampton_5: -1,
        secval_brampton_6: 98,
        type: 'one',
        val_boston_5: 0,
        val_boston_6: 0,
        val_brampton_5: 0,
        val_brampton_6: 8,
      },
      {
        secval_boston_5: 93,
        secval_boston_6: -1,
        secval_brampton_5: 97,
        secval_brampton_6: -1,
        type: 'two',
        val_boston_5: 3,
        val_boston_6: 0,
        val_brampton_5: 7,
        val_brampton_6: 0,
      },
    ];

    const results = tidy(
      data,
      pivotLonger({
        cols: ['-type'],
        namesTo: ['place', 'other'],
        valuesTo: ['val', 'secval'],
      })
    );
    expect(results).toEqual([
      { type: 'one', place: 'boston', val: 0, other: '5', secval: -1 },
      { type: 'one', place: 'boston', val: 0, other: '6', secval: -1 },
      { type: 'one', place: 'brampton', val: 0, other: '5', secval: -1 },
      { type: 'one', place: 'brampton', val: 8, other: '6', secval: 98 },
      { type: 'two', place: 'boston', val: 3, other: '5', secval: 93 },
      { type: 'two', place: 'boston', val: 0, other: '6', secval: -1 },
      { type: 'two', place: 'brampton', val: 7, other: '5', secval: 97 },
      { type: 'two', place: 'brampton', val: 0, other: '6', secval: -1 },
    ]);
  });

  it('it works with no extra values', () => {
    const data = [{ canada: 1, usa: 10, campbell: 4, brampton: 8, boston: 3 }];

    const results = tidy(
      data,
      pivotLonger({
        cols: everything(),
        namesTo: 'place',
        valuesTo: 'val',
      })
    );
    expect(results).toEqual([
      { place: 'canada', val: 1 },
      { place: 'usa', val: 10 },
      { place: 'campbell', val: 4 },
      { place: 'brampton', val: 8 },
      { place: 'boston', val: 3 },
    ]);
  });

  it('tidy data chapter test', () => {
    const table4a = [
      { '1999': 745, '2000': 2666, country: 'Afghanistan' },
      { '1999': 37737, '2000': 80488, country: 'Brazil' },
      { '1999': 212258, '2000': 213766, country: 'China' },
    ];
    const results = tidy(
      table4a,
      pivotLonger({
        cols: ['1999', '2000'],
        namesTo: 'year',
        valuesTo: 'cases',
      })
    );
    expect(results).toEqual([
      { country: 'Afghanistan', year: '1999', cases: 745 },
      { country: 'Afghanistan', year: '2000', cases: 2666 },
      { country: 'Brazil', year: '1999', cases: 37737 },
      { country: 'Brazil', year: '2000', cases: 80488 },
      { country: 'China', year: '1999', cases: 212258 },
      { country: 'China', year: '2000', cases: 213766 },
    ]);
  });
});
