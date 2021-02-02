import { tidy, pivotWider } from './index';

describe('pivotWider', () => {
  it('it works', () => {
    const data = [
      { type: 'one', place: 'canada', val: 1 },
      { type: 'one', place: 'usa', val: 10 },
      { type: 'one', place: 'campbell', val: 4 },
      { type: 'one', place: 'brampton', val: 8 },
      { type: 'two', place: 'brampton', val: 7 },
      { type: 'two', place: 'boston', val: 3 },
      { type: 'two', place: 'usa', val: 11 },
      { type: 'three', place: 'canada', val: 20 },
    ];

    const results = tidy(
      data,
      pivotWider({
        namesFrom: 'place',
        valuesFrom: 'val',
      })
    );
    expect(results).toEqual([
      { type: 'one', canada: 1, usa: 10, campbell: 4, brampton: 8 },
      { type: 'two', brampton: 7, boston: 3, usa: 11 },
      { type: 'three', canada: 20 },
    ]);
  });

  it('it works with multiple non from columns', () => {
    const data = [
      { type: 'one', other: 5, place: 'canada', val: 1 },
      { type: 'one', other: 5, place: 'usa', val: 10 },
      { type: 'one', other: 6, place: 'campbell', val: 4 },
      { type: 'one', other: 6, place: 'brampton', val: 8 },
      { type: 'two', other: 5, place: 'brampton', val: 7 },
      { type: 'two', other: 5, place: 'boston', val: 3 },
      { type: 'two', other: 6, place: 'usa', val: 11 },
      { type: 'three', other: 5, place: 'canada', val: 20 },
    ];

    const results = tidy(
      data,
      pivotWider({
        namesFrom: 'place',
        valuesFrom: 'val',
      })
    );
    expect(results).toEqual([
      { type: 'one', other: 5, canada: 1, usa: 10 },
      { type: 'one', other: 6, campbell: 4, brampton: 8 },
      { type: 'two', other: 5, brampton: 7, boston: 3 },
      { type: 'two', other: 6, usa: 11 },
      { type: 'three', other: 5, canada: 20 },
    ]);
  });

  it('it works with value fill', () => {
    const data = [
      { type: 'one', place: 'canada', val: 1 },
      { type: 'one', place: 'usa', val: 10 },
      { type: 'one', place: 'campbell', val: 4 },
      { type: 'one', place: 'brampton', val: 8 },
      { type: 'two', place: 'brampton', val: 7 },
      { type: 'two', place: 'boston', val: 3 },
      { type: 'two', place: 'usa', val: 11 },
      { type: 'three', place: 'canada', val: 20 },
    ];

    const results = tidy(
      data,
      pivotWider({
        namesFrom: 'place',
        valuesFrom: 'val',
        valuesFill: 0,
      })
    );
    expect(results).toEqual([
      {
        type: 'one',
        canada: 1,
        usa: 10,
        campbell: 4,
        brampton: 8,
        boston: 0,
      },
      {
        type: 'two',
        canada: 0,
        usa: 11,
        campbell: 0,
        brampton: 7,
        boston: 3,
      },
      {
        type: 'three',
        canada: 20,
        usa: 0,
        campbell: 0,
        brampton: 0,
        boston: 0,
      },
    ]);
  });

  it('it works with value fill varying, multiple values from, multiple names from', () => {
    const data = [
      { type: 'one', other: 5, place: 'canada', val: 1, secval: 91 },
      { type: 'one', other: 5, place: 'usa', val: 10, secval: 910 },
      { type: 'one', other: 6, place: 'campbell', val: 4, secval: 94 },
      { type: 'one', other: 6, place: 'brampton', val: 8, secval: 98 },
      { type: 'two', other: 5, place: 'brampton', val: 7, secval: 97 },
      { type: 'two', other: 5, place: 'boston', val: 3, secval: 93 },
      { type: 'two', other: 6, place: 'usa', val: 11, secval: 911 },
      { type: 'three', other: 5, place: 'canada', val: 20, secval: 920 },
    ];

    const results = tidy(
      data,
      pivotWider({
        namesFrom: ['place', 'other'],
        valuesFrom: ['val', 'secval'],
        valuesFillMap: { val: 0, secval: -1 },
      })
    );
    expect(results).toEqual([
      {
        secval_boston_5: -1,
        secval_boston_6: -1,
        secval_brampton_5: -1,
        secval_brampton_6: 98,
        secval_campbell_5: -1,
        secval_campbell_6: 94,
        secval_canada_5: 91,
        secval_canada_6: -1,
        secval_usa_5: 910,
        secval_usa_6: -1,
        type: 'one',
        val_boston_5: 0,
        val_boston_6: 0,
        val_brampton_5: 0,
        val_brampton_6: 8,
        val_campbell_5: 0,
        val_campbell_6: 4,
        val_canada_5: 1,
        val_canada_6: 0,
        val_usa_5: 10,
        val_usa_6: 0,
      },
      {
        secval_boston_5: 93,
        secval_boston_6: -1,
        secval_brampton_5: 97,
        secval_brampton_6: -1,
        secval_campbell_5: -1,
        secval_campbell_6: -1,
        secval_canada_5: -1,
        secval_canada_6: -1,
        secval_usa_5: -1,
        secval_usa_6: 911,
        type: 'two',
        val_boston_5: 3,
        val_boston_6: 0,
        val_brampton_5: 7,
        val_brampton_6: 0,
        val_campbell_5: 0,
        val_campbell_6: 0,
        val_canada_5: 0,
        val_canada_6: 0,
        val_usa_5: 0,
        val_usa_6: 11,
      },
      {
        secval_boston_5: -1,
        secval_boston_6: -1,
        secval_brampton_5: -1,
        secval_brampton_6: -1,
        secval_campbell_5: -1,
        secval_campbell_6: -1,
        secval_canada_5: 920,
        secval_canada_6: -1,
        secval_usa_5: -1,
        secval_usa_6: -1,
        type: 'three',
        val_boston_5: 0,
        val_boston_6: 0,
        val_brampton_5: 0,
        val_brampton_6: 0,
        val_campbell_5: 0,
        val_campbell_6: 0,
        val_canada_5: 20,
        val_canada_6: 0,
        val_usa_5: 0,
        val_usa_6: 0,
      },
    ]);
  });

  it('it works with no extra values', () => {
    const data = [
      { place: 'canada', val: 1 },
      { place: 'usa', val: 10 },
      { place: 'campbell', val: 4 },
      { place: 'brampton', val: 8 },
      { place: 'brampton', val: 7 },
      { place: 'boston', val: 3 },
      { place: 'usa', val: 11 },
      { place: 'canada', val: 20 },
    ];

    const results = tidy(
      data,
      pivotWider({
        namesFrom: 'place',
        valuesFrom: 'val',
      })
    );
    expect(results).toEqual([
      { canada: 20, usa: 11, campbell: 4, brampton: 7, boston: 3 },
    ]);
  });
});
