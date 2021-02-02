import { negate, startsWith, matches } from '../index';

describe('selectors', () => {
  describe('negate', () => {
    it('it works', () => {
      const data = [
        { foo: 1, bar: 20, foobar: 300, FoObAR: 90 },
        { foo: 2, bar: 21, foobar: 301, FoObAR: 91 },
        { foo: 3, bar: 22, foobar: 302, FoObAR: 92 },
        { foo: 4, bar: 23, foobar: 303, FoObAR: 93 },
      ];

      expect(negate(matches(/oba/i))(data)).toEqual(['-foobar', '-FoObAR']);
      expect(negate(matches(/oba/))(data)).toEqual(['-foobar']);
    });

    it('it works with multiple', () => {
      const data = [
        { foo: 1, bar: 20, foobar: 300, FoObAR: 90, blue: 'blue', bl: 1 },
        { foo: 2, bar: 21, foobar: 301, FoObAR: 91, blue: 'blue', bl: 1 },
        { foo: 3, bar: 22, foobar: 302, FoObAR: 92, blue: 'blue', bl: 1 },
        { foo: 4, bar: 23, foobar: 303, FoObAR: 93, blue: 'blue', bl: 1 },
      ];

      expect(negate([matches(/oba/), 'foo', startsWith('bl')])(data)).toEqual([
        '-foobar',
        '-foo',
        '-blue',
        '-bl',
      ]);
    });
  });
});
