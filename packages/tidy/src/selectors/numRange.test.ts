import { numRange } from '../index';

describe('selectors', () => {
  describe('numRange', () => {
    it('it works', () => {
      // prettier-ignore
      const data = [
        { foo07: 1, foo08: 20, foo10: 300, foo11: 90, foo12: 12, bar08: 8, foo: 1 },
        { foo07: 2, foo08: 21, foo10: 301, foo11: 91, foo12: 12, bar08: 8, foo: 1 },
        { foo07: 3, foo08: 22, foo10: 302, foo11: 92, foo12: 12, bar08: 8, foo: 1 },
        { foo07: 4, foo08: 23, foo10: 303, foo11: 93, foo12: 12, bar08: 8, foo: 1 },
      ];

      expect(numRange('foo', [8, 11], 2)(data)).toEqual([
        'foo08',
        'foo10',
        'foo11',
      ]);
    });
  });
});
