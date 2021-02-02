import { endsWith } from '../index';

describe('selectors', () => {
  describe('endsWith', () => {
    it('it works', () => {
      const data = [
        { foo: 1, bar: 20, foobar: 300, FoObAR: 90 },
        { foo: 2, bar: 21, foobar: 301, FoObAR: 91 },
        { foo: 3, bar: 22, foobar: 302, FoObAR: 92 },
        { foo: 4, bar: 23, foobar: 303, FoObAR: 93 },
      ];

      expect(endsWith('bAR')(data)).toEqual(['bar', 'foobar', 'FoObAR']);
      expect(endsWith('bAR', false)(data)).toEqual(['FoObAR']);
    });
  });
});
