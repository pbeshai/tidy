import { TMath } from '../index';

describe('TMath', () => {
  it('rate works', () => {
    expect(TMath.rate(1, 2)).toBe(0.5);
    expect(TMath.rate(1, 0)).toBe(undefined);
    expect(TMath.rate(1, 0, true)).toBe(Infinity);
    expect(TMath.rate(null, 1)).toBe(undefined);
    expect(TMath.rate(1, null)).toBe(undefined);
    expect(TMath.rate(null, null)).toBe(undefined);
  });

  it('subtract works', () => {
    expect(TMath.subtract(1, 2)).toBe(-1);
    expect(TMath.subtract(null, 1)).toBe(undefined);
    expect(TMath.subtract(1, null)).toBe(undefined);
    expect(TMath.subtract(null, null)).toBe(undefined);
    expect(TMath.subtract(null, 1, true)).toBe(-1);
    expect(TMath.subtract(1, null, true)).toBe(1);
    expect(TMath.subtract(null, null, true)).toBe(0);
  });

  it('add works', () => {
    expect(TMath.add(1, 2)).toBe(3);
    expect(TMath.add(null, 1)).toBe(undefined);
    expect(TMath.add(1, null)).toBe(undefined);
    expect(TMath.add(null, null)).toBe(undefined);
    expect(TMath.add(null, 1, true)).toBe(1);
    expect(TMath.add(1, null, true)).toBe(1);
    expect(TMath.add(null, null, true)).toBe(0);
  });
});
