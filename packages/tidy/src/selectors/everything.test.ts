import { tidy, select, everything } from '../index';

describe('selectors', () => {
  describe('everything', () => {
    it('it works', () => {
      const data = [
        { foo: 1, bar: 20, foobar: 300 },
        { foo: 2, bar: 21, foobar: 301 },
        { foo: 3, bar: 22, foobar: 302 },
        { foo: 4, bar: 23, foobar: 303 },
      ];

      expect(everything()(data)).toEqual(['foo', 'bar', 'foobar']);
    });
  });
});
