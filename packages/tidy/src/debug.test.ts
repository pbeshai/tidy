import { tidy, debug, groupBy } from './index';

describe('debug', () => {
  beforeEach(() => {
    // prevent debug from spamming the output
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'table').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debug works', () => {
    const data = [
      { a: 1, b: 10, c: 100 },
      { a: 2, b: 20, c: 200 },
    ];
    const results = tidy(data, debug());
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.table).toHaveBeenCalledTimes(1);
    expect(results).toEqual(data);

    expect(tidy(data, debug('label'))).toEqual(data);
    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.table).toHaveBeenCalledTimes(2);
  });

  it('debug works on grouped data', () => {
    const data = [
      { str: 'a', ing: 'x', foo: 'G', value: 1 },
      { str: 'b', ing: 'x', foo: 'H', value: 100 },
      { str: 'b', ing: 'x', foo: 'K', value: 200 },
      { str: 'a', ing: 'y', foo: 'G', value: 2 },
      { str: 'a', ing: 'y', foo: 'H', value: 3 },
      { str: 'a', ing: 'y', foo: 'K', value: 4 },
      { str: 'b', ing: 'y', foo: 'G', value: 300 },
      { str: 'b', ing: 'z', foo: 'H', value: 400 },
      { str: 'a', ing: 'z', foo: 'K', value: 5 },
      { str: 'a', ing: 'z', foo: 'G', value: 6 },
    ];

    const results = tidy(data, groupBy(['str', 'ing'], [debug()]));
    expect(results.length).toEqual(data.length);
    // a-x, a-y, a-z, b-x, b-y, b-z
    expect(console.log).toHaveBeenCalledTimes(6);
    expect(console.table).toHaveBeenCalledTimes(6);
  });
});
