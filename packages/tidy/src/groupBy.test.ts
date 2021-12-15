import { tidy, map, groupBy, summarize, sum, LevelSpec } from './index';
describe('groupBy / ungroup', () => {
  describe('groupBy', () => {
    it('groupBy works single keys', () => {
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

      const results = tidy(data, groupBy('str', [], { export: 'map' }));

      expect(results).toEqual(
        new Map([
          [
            'a',
            [
              { str: 'a', ing: 'x', foo: 'G', value: 1 },
              { str: 'a', ing: 'y', foo: 'G', value: 2 },
              { str: 'a', ing: 'y', foo: 'H', value: 3 },
              { str: 'a', ing: 'y', foo: 'K', value: 4 },
              { str: 'a', ing: 'z', foo: 'K', value: 5 },
              { str: 'a', ing: 'z', foo: 'G', value: 6 },
            ],
          ],
          [
            'b',
            [
              { str: 'b', ing: 'x', foo: 'H', value: 100 },
              { str: 'b', ing: 'x', foo: 'K', value: 200 },
              { str: 'b', ing: 'y', foo: 'G', value: 300 },
              { str: 'b', ing: 'z', foo: 'H', value: 400 },
            ],
          ],
        ])
      );

      const results2 = tidy(data, groupBy('str', [], groupBy.map()));
      expect(results2).toEqual(results);
    });

    it('groupBy works function keys', () => {
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

      const results = tidy(
        data,
        groupBy((d) => d.str, [], { export: 'map', addGroupKeys: true })
      );
      expect(results).toEqual(
        new Map([
          [
            'a',
            [
              { str: 'a', ing: 'x', foo: 'G', value: 1 },
              { str: 'a', ing: 'y', foo: 'G', value: 2 },
              { str: 'a', ing: 'y', foo: 'H', value: 3 },
              { str: 'a', ing: 'y', foo: 'K', value: 4 },
              { str: 'a', ing: 'z', foo: 'K', value: 5 },
              { str: 'a', ing: 'z', foo: 'G', value: 6 },
            ],
          ],
          [
            'b',
            [
              { str: 'b', ing: 'x', foo: 'H', value: 100 },
              { str: 'b', ing: 'x', foo: 'K', value: 200 },
              { str: 'b', ing: 'y', foo: 'G', value: 300 },
              { str: 'b', ing: 'z', foo: 'H', value: 400 },
            ],
          ],
        ])
      );
    });

    it('groupBy works multiple keys', () => {
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

      const results = tidy(
        data,
        groupBy(['str', 'ing'], [], { export: 'map' })
      );
      expect(results).toEqual(
        new Map([
          [
            'a',
            new Map([
              ['x', [{ str: 'a', ing: 'x', foo: 'G', value: 1 }]],
              [
                'y',
                [
                  { str: 'a', ing: 'y', foo: 'G', value: 2 },
                  { str: 'a', ing: 'y', foo: 'H', value: 3 },
                  { str: 'a', ing: 'y', foo: 'K', value: 4 },
                ],
              ],
              [
                'z',
                [
                  { str: 'a', ing: 'z', foo: 'K', value: 5 },
                  { str: 'a', ing: 'z', foo: 'G', value: 6 },
                ],
              ],
            ]),
          ],
          [
            'b',
            new Map([
              [
                'x',
                [
                  { str: 'b', ing: 'x', foo: 'H', value: 100 },
                  { str: 'b', ing: 'x', foo: 'K', value: 200 },
                ],
              ],
              ['y', [{ str: 'b', ing: 'y', foo: 'G', value: 300 }]],
              ['z', [{ str: 'b', ing: 'z', foo: 'H', value: 400 }]],
            ]),
          ],
        ])
      );
    });

    it('groupBy works with null values', () => {
      const data = [
        { str: 'a', ing: 'x', foo: 'G', value: 1 },
        { str: null, ing: 'x', foo: 'H', value: 100 },
        { str: 'b', ing: 'x', foo: 'K', value: 200 },
        { str: null, ing: 'y', foo: 'G', value: 2 },
        { str: 'a', ing: 'y', foo: 'H', value: 3 },
        { str: 'a', ing: 'y', foo: 'K', value: 4 },
        { str: 'b', ing: 'y', foo: 'G', value: 300 },
        { str: 'b', ing: 'z', foo: 'H', value: 400 },
        { str: null, ing: 'z', foo: 'K', value: 5 },
        { str: null, ing: 'z', foo: 'G', value: 6 },
      ];

      const results = tidy(data, groupBy('str', [], { export: 'map' }));

      expect(results).toEqual(
        new Map([
          [
            null,
            [
              { str: null, ing: 'x', foo: 'H', value: 100 },
              { str: null, ing: 'y', foo: 'G', value: 2 },
              { str: null, ing: 'z', foo: 'K', value: 5 },
              { str: null, ing: 'z', foo: 'G', value: 6 },
            ],
          ],
          [
            'a',
            [
              { str: 'a', ing: 'x', foo: 'G', value: 1 },
              { str: 'a', ing: 'y', foo: 'H', value: 3 },
              { str: 'a', ing: 'y', foo: 'K', value: 4 },
            ],
          ],
          [
            'b',
            [
              { str: 'b', ing: 'x', foo: 'K', value: 200 },
              { str: 'b', ing: 'y', foo: 'G', value: 300 },
              { str: 'b', ing: 'z', foo: 'H', value: 400 },
            ],
          ],
        ])
      );
    });

    it('groupBy works with Dates / valueOf()', () => {
      const data = [
        { date: new Date(2021, 0, 1), value: 10 },
        { date: new Date(2021, 1, 1), value: 20 },
        { date: new Date(2021, 2, 1), value: 30 },
        { date: new Date(2021, 0, 1), value: 100 },
        { date: new Date(2021, 1, 1), value: 200 },
        { date: new Date(2021, 2, 1), value: 300 },
      ];

      const results = tidy(
        data,
        groupBy('date', [summarize({ value: sum('value') })])
      );

      expect(results).toEqual([
        { date: new Date(2021, 0, 1), value: 110 },
        { date: new Date(2021, 1, 1), value: 220 },
        { date: new Date(2021, 2, 1), value: 330 },
      ]);
    });
  });

  describe('ungroup', () => {
    it('ungroup works single keys', () => {
      const data = [
        { str: 'a', ing: 'x', foo: 'G', value: 1 },
        { str: 'b', ing: 'x', foo: 'H', value: 100 },
        { str: 'b', ing: 'x', foo: 'K', value: 200 },
        { str: 'a', ing: 'y', foo: 'G', value: 2 },
        { str: 'a', ing: 'z', foo: 'K', value: 5 },
        { str: 'a', ing: 'y', foo: 'H', value: 3 },
        { str: 'a', ing: 'y', foo: 'K', value: 4 },
        { str: 'b', ing: 'y', foo: 'G', value: 300 },
        { str: 'b', ing: 'z', foo: 'H', value: 400 },
        { str: 'a', ing: 'z', foo: 'G', value: 6 },
      ];

      const results = tidy(data, groupBy('str', []));

      expect(results).toEqual([
        { str: 'a', ing: 'x', foo: 'G', value: 1 },
        { str: 'a', ing: 'y', foo: 'G', value: 2 },
        { str: 'a', ing: 'z', foo: 'K', value: 5 },
        { str: 'a', ing: 'y', foo: 'H', value: 3 },
        { str: 'a', ing: 'y', foo: 'K', value: 4 },
        { str: 'a', ing: 'z', foo: 'G', value: 6 },
        { str: 'b', ing: 'x', foo: 'H', value: 100 },
        { str: 'b', ing: 'x', foo: 'K', value: 200 },
        { str: 'b', ing: 'y', foo: 'G', value: 300 },
        { str: 'b', ing: 'z', foo: 'H', value: 400 },
      ]);
    });

    it('ungroup works multiple keys', () => {
      const data = [
        { str: 'a', ing: 'x', foo: 'G', value: 1 },
        { str: 'b', ing: 'x', foo: 'H', value: 100 },
        { str: 'b', ing: 'x', foo: 'K', value: 200 },
        { str: 'a', ing: 'y', foo: 'G', value: 2 },
        { str: 'a', ing: 'z', foo: 'K', value: 5 },
        { str: 'a', ing: 'y', foo: 'H', value: 3 },
        { str: 'a', ing: 'y', foo: 'K', value: 4 },
        { str: 'b', ing: 'y', foo: 'G', value: 300 },
        { str: 'b', ing: 'z', foo: 'H', value: 400 },
        { str: 'a', ing: 'z', foo: 'G', value: 6 },
      ];
      const results = tidy(data, groupBy(['str', 'ing'], []));
      expect(results).toEqual([
        { str: 'a', ing: 'x', foo: 'G', value: 1 },
        { str: 'a', ing: 'y', foo: 'G', value: 2 },
        { str: 'a', ing: 'y', foo: 'H', value: 3 },
        { str: 'a', ing: 'y', foo: 'K', value: 4 },
        { str: 'a', ing: 'z', foo: 'K', value: 5 },
        { str: 'a', ing: 'z', foo: 'G', value: 6 },
        { str: 'b', ing: 'x', foo: 'H', value: 100 },
        { str: 'b', ing: 'x', foo: 'K', value: 200 },
        { str: 'b', ing: 'y', foo: 'G', value: 300 },
        { str: 'b', ing: 'z', foo: 'H', value: 400 },
      ]);
    });

    it('ungroup works function keys', () => {
      const data = [
        { str: 'a', ing: 'x', foo: 'G', value: 1 },
        { str: 'b', ing: 'x', foo: 'H', value: 100 },
        { str: 'b', ing: 'x', foo: 'K', value: 200 },
        { str: 'a', ing: 'y', foo: 'G', value: 2 },
        { str: 'a', ing: 'z', foo: 'K', value: 5 },
        { str: 'a', ing: 'y', foo: 'H', value: 3 },
        { str: 'a', ing: 'y', foo: 'K', value: 4 },
        { str: 'b', ing: 'y', foo: 'G', value: 300 },
        { str: 'b', ing: 'z', foo: 'H', value: 400 },
        { str: 'a', ing: 'z', foo: 'G', value: 6 },
      ];

      expect(tidy(data, groupBy([(d) => d.str], []))).toEqual([
        { str: 'a', ing: 'x', foo: 'G', value: 1 },
        { str: 'a', ing: 'y', foo: 'G', value: 2 },
        { str: 'a', ing: 'z', foo: 'K', value: 5 },
        { str: 'a', ing: 'y', foo: 'H', value: 3 },
        { str: 'a', ing: 'y', foo: 'K', value: 4 },
        { str: 'a', ing: 'z', foo: 'G', value: 6 },
        { str: 'b', ing: 'x', foo: 'H', value: 100 },
        { str: 'b', ing: 'x', foo: 'K', value: 200 },
        { str: 'b', ing: 'y', foo: 'G', value: 300 },
        { str: 'b', ing: 'z', foo: 'H', value: 400 },
      ]);

      expect(
        tidy(data, groupBy([(d) => d.str, 'ing', (d) => d.foo], []))
      ).toEqual([
        { str: 'a', ing: 'x', foo: 'G', value: 1 },
        { str: 'a', ing: 'y', foo: 'G', value: 2 },
        { str: 'a', ing: 'y', foo: 'H', value: 3 },
        { str: 'a', ing: 'y', foo: 'K', value: 4 },
        { str: 'a', ing: 'z', foo: 'K', value: 5 },
        { str: 'a', ing: 'z', foo: 'G', value: 6 },
        { str: 'b', ing: 'x', foo: 'H', value: 100 },
        { str: 'b', ing: 'x', foo: 'K', value: 200 },
        { str: 'b', ing: 'y', foo: 'G', value: 300 },
        { str: 'b', ing: 'z', foo: 'H', value: 400 },
      ]);
    });
  });

  describe('integration', () => {
    it('group compute ungroup works with single keys', () => {
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

      const partial = tidy(
        data,
        groupBy('str', [summarize({ summedValue: sum('value') })], {
          export: 'grouped',
        })
      );
      expect(partial).toEqual(
        new Map([
          [['str', 'a'], [{ str: 'a', summedValue: 21 }]],
          [['str', 'b'], [{ str: 'b', summedValue: 1000 }]],
        ])
      );

      const results = tidy(
        data,
        groupBy('str', [summarize({ summedValue: sum('value') })])
      );

      expect(results).toEqual([
        { str: 'a', summedValue: 21 },
        { str: 'b', summedValue: 1000 },
      ]);

      const results2 = tidy(
        data,
        groupBy('ing', [summarize({ summedValue: sum('value') })])
      );
      expect(results2).toEqual([
        { ing: 'x', summedValue: 301 },
        { ing: 'y', summedValue: 309 },
        { ing: 'z', summedValue: 411 },
      ]);
    });

    it('group compute ungroup works with multiple keys', () => {
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

      const results = tidy(
        data,
        groupBy(['str', 'ing'], [summarize({ summedValue: sum('value') })])
      );
      expect(results).toEqual([
        { str: 'a', ing: 'x', summedValue: 1 },
        { str: 'a', ing: 'y', summedValue: 9 },
        { str: 'a', ing: 'z', summedValue: 11 },
        { str: 'b', ing: 'x', summedValue: 300 },
        { str: 'b', ing: 'y', summedValue: 300 },
        { str: 'b', ing: 'z', summedValue: 400 },
      ]);

      const results2 = tidy(
        data,
        groupBy(['str', 'ing'], [summarize({ summedValue: sum('value') })], {
          addGroupKeys: false,
        })
      );
      expect(results2).toEqual([
        { summedValue: 1 },
        { summedValue: 9 },
        { summedValue: 11 },
        { summedValue: 300 },
        { summedValue: 300 },
        { summedValue: 400 },
      ]);
    });

    it('works as expected on non-object inputs (issue 34)', () => {
      const states = {
        '01': { name: 'Alabama', count: 0 },
        '02': { name: 'Alaska', count: 1 },
        '04': { name: 'Arizona', count: 2 },
        '05': { name: 'Arkansas', count: 20 },
      } as any;

      // explicitly say no group keys
      const results = tidy(
        Object.keys(states) as any, // ['01', '02', '04', '05']
        groupBy(
          (d: any) => states[d].count === 0,
          [],
          groupBy.entries({ addGroupKeys: false })
        )
      );
      expect(results).toEqual([
        [true, ['01']],
        [false, ['02', '04', '05']],
      ]);

      // group keys shoud do nothing since input is an array of strings
      const results2 = tidy(
        ['01', '02', '04', '05'] as any,
        groupBy(
          (d: any) => states[d].count === 0,
          [],
          groupBy.entries({ addGroupKeys: true })
        )
      );
      expect(results2).toEqual(results);

      // default should be the same as any of the above
      const results3 = tidy(
        Object.keys(states) as any,
        groupBy((d: any) => states[d].count === 0, [], groupBy.entries())
      );
      expect(results3).toEqual(results2);
    });

    it('works with flexible arguments', () => {
      const data = [
        { str: 'a', ing: 'x', foo: 'G', value: 1 },
        { str: 'b', ing: 'x', foo: 'H', value: 100 },
        { str: 'b', ing: 'x', foo: 'K', value: 200 },
        { str: 'a', ing: 'y', foo: 'G', value: 2 },
        { str: 'a', ing: 'z', foo: 'K', value: 5 },
        { str: 'a', ing: 'y', foo: 'H', value: 3 },
        { str: 'a', ing: 'y', foo: 'K', value: 4 },
        { str: 'b', ing: 'y', foo: 'G', value: 300 },
        { str: 'b', ing: 'z', foo: 'H', value: 400 },
        { str: 'a', ing: 'z', foo: 'G', value: 6 },
      ];

      const results = tidy(data, groupBy('str'));

      expect(results).toEqual([
        { str: 'a', ing: 'x', foo: 'G', value: 1 },
        { str: 'a', ing: 'y', foo: 'G', value: 2 },
        { str: 'a', ing: 'z', foo: 'K', value: 5 },
        { str: 'a', ing: 'y', foo: 'H', value: 3 },
        { str: 'a', ing: 'y', foo: 'K', value: 4 },
        { str: 'a', ing: 'z', foo: 'G', value: 6 },
        { str: 'b', ing: 'x', foo: 'H', value: 100 },
        { str: 'b', ing: 'x', foo: 'K', value: 200 },
        { str: 'b', ing: 'y', foo: 'G', value: 300 },
        { str: 'b', ing: 'z', foo: 'H', value: 400 },
      ]);

      const results2 = tidy(data, groupBy('str', groupBy.entries()));
      expect(results2).toEqual([
        [
          'a',
          [
            { str: 'a', ing: 'x', foo: 'G', value: 1 },
            { str: 'a', ing: 'y', foo: 'G', value: 2 },
            { str: 'a', ing: 'z', foo: 'K', value: 5 },
            { str: 'a', ing: 'y', foo: 'H', value: 3 },
            { str: 'a', ing: 'y', foo: 'K', value: 4 },
            { str: 'a', ing: 'z', foo: 'G', value: 6 },
          ],
        ],
        [
          'b',
          [
            { str: 'b', ing: 'x', foo: 'H', value: 100 },
            { str: 'b', ing: 'x', foo: 'K', value: 200 },
            { str: 'b', ing: 'y', foo: 'G', value: 300 },
            { str: 'b', ing: 'z', foo: 'H', value: 400 },
          ],
        ],
      ]);

      const results3 = tidy(
        data,
        groupBy('str', summarize({ total: sum('value') }), groupBy.entries())
      );
      expect(results3).toEqual([
        ['a', [{ str: 'a', total: 21 }]],
        ['b', [{ str: 'b', total: 1000 }]],
      ]);

      const results4 = tidy(
        data,
        groupBy('str', summarize({ total: sum('value') }))
      );
      expect(results4).toEqual([
        { str: 'a', total: 21 },
        { str: 'b', total: 1000 },
      ]);
    });
  });

  describe('exports', () => {
    describe('entries', () => {
      it('entries - works', () => {
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
        const results = tidy(data, groupBy('str', [], groupBy.entries()));
        expect(results).toEqual([
          [
            'a',
            [
              { str: 'a', ing: 'x', foo: 'G', value: 1 },
              { str: 'a', ing: 'y', foo: 'G', value: 2 },
              { str: 'a', ing: 'y', foo: 'H', value: 3 },
              { str: 'a', ing: 'y', foo: 'K', value: 4 },
              { str: 'a', ing: 'z', foo: 'K', value: 5 },
              { str: 'a', ing: 'z', foo: 'G', value: 6 },
            ],
          ],
          [
            'b',
            [
              { str: 'b', ing: 'x', foo: 'H', value: 100 },
              { str: 'b', ing: 'x', foo: 'K', value: 200 },
              { str: 'b', ing: 'y', foo: 'G', value: 300 },
              { str: 'b', ing: 'z', foo: 'H', value: 400 },
            ],
          ],
        ]);
      });

      // for generating output in docs
      // it('docs test', () => {
      //   const data = [
      //     { str: 'a', ing: 'x', foo: 'G', value: 1 },
      //     { str: 'b', ing: 'x', foo: 'H', value: 100 },
      //     { str: 'b', ing: 'x', foo: 'K', value: 200 },
      //     { str: 'a', ing: 'y', foo: 'G', value: 2 },
      //     { str: 'a', ing: 'y', foo: 'H', value: 3 },
      //     { str: 'a', ing: 'y', foo: 'K', value: 4 },
      //     { str: 'b', ing: 'y', foo: 'G', value: 300 },
      //     { str: 'b', ing: 'z', foo: 'H', value: 400 },
      //     { str: 'a', ing: 'z', foo: 'K', value: 5 },
      //     { str: 'a', ing: 'z', foo: 'G', value: 6 },
      //   ];

      //   const results = tidy(
      //     data,
      //     groupBy(
      //       'str',
      //       [summarize({ total: sum('value') })],
      //       groupBy.levels({ levels: ['entries-object', 'object'] })
      //     )
      //   );

      //   console.log('results =\n', JSON.stringify(results));

      //   const results2 = tidy(
      //     data,
      //     groupBy(
      //       ['str', 'ing'],
      //       [summarize({ total: sum('value') })],
      //       groupBy.levels({
      //         levels: ['object', 'values'],
      //         single: true,
      //       })
      //     )
      //   );

      //   console.log('\n\nresults2 =\n', JSON.stringify(results2));
      // });

      it('entries - flat works', () => {
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

        const results = tidy(
          data,
          groupBy(
            ['str', 'ing'],
            [],
            groupBy.entries({
              flat: true,
              compositeKey: (keys) => keys.join('->'),
            })
          )
        );

        expect(results).toEqual([
          ['a->x', [{ str: 'a', ing: 'x', foo: 'G', value: 1 }]],
          [
            'a->y',
            [
              { str: 'a', ing: 'y', foo: 'G', value: 2 },
              { str: 'a', ing: 'y', foo: 'H', value: 3 },
              { str: 'a', ing: 'y', foo: 'K', value: 4 },
            ],
          ],
          [
            'a->z',
            [
              { str: 'a', ing: 'z', foo: 'K', value: 5 },
              { str: 'a', ing: 'z', foo: 'G', value: 6 },
            ],
          ],
          [
            'b->x',
            [
              { str: 'b', ing: 'x', foo: 'H', value: 100 },
              { str: 'b', ing: 'x', foo: 'K', value: 200 },
            ],
          ],
          ['b->y', [{ str: 'b', ing: 'y', foo: 'G', value: 300 }]],
          ['b->z', [{ str: 'b', ing: 'z', foo: 'H', value: 400 }]],
        ]);
      });

      it('entries - single works', () => {
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

        const results = tidy(
          data,
          groupBy(
            'str',
            [summarize({ summedValue: sum('value') })],
            groupBy.entries({ single: true })
          )
        );
        expect(results).toEqual([
          ['a', { str: 'a', summedValue: 21 }],
          ['b', { str: 'b', summedValue: 1000 }],
        ]);
      });

      it('entries - mapEntry works', () => {
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

        const results = tidy(
          data,
          groupBy(
            'str',
            [summarize({ summedValue: sum('value') })],
            groupBy.entries({
              single: true,
              mapEntry: (entry) => ({ key: entry[0], values: entry[1] }),
            })
          )
        );

        expect(results).toEqual([
          { key: 'a', values: { str: 'a', summedValue: 21 } },
          { key: 'b', values: { str: 'b', summedValue: 1000 } },
        ]);
      });

      it('entries - mapLeaf works', () => {
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

        const results = tidy(
          data,
          groupBy(
            'str',
            [summarize({ summedValue: sum('value') })],
            groupBy.entries({ single: true, mapLeaf: (d) => d.summedValue })
          )
        );
        expect(results).toEqual([
          ['a', 21],
          ['b', 1000],
        ]);
      });

      it('entries - mapLeaves works', () => {
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

        const results = tidy(
          data,
          groupBy(
            'str',
            [summarize({ summedValue: sum('value') })],
            groupBy.entries({
              mapLeaves: (items) => items[0],
              mapLeaf: (d) => d.summedValue,
            })
          )
        );
        expect(results).toEqual([
          ['a', 21],
          ['b', 1000],
        ]);
      });
    });

    describe('entries-obj', () => {
      it('entries-obj - works', () => {
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

        const results = tidy(
          data,
          groupBy(
            'str',
            [summarize({ summedValue: sum('value') })],
            groupBy.entriesObject()
          )
        );

        expect(results).toEqual([
          { key: 'a', values: [{ str: 'a', summedValue: 21 }] },
          { key: 'b', values: [{ str: 'b', summedValue: 1000 }] },
        ]);
      });

      it('entries-obj - works with mapEntry', () => {
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

        const results = tidy(
          data,
          groupBy(
            'str',
            [summarize({ summedValue: sum('value') })],
            groupBy.entriesObject({
              mapEntry: ([key, values]) => ({ name: key, items: values }),
            })
          )
        );

        expect(results).toEqual([
          { name: 'a', items: [{ str: 'a', summedValue: 21 }] },
          { name: 'b', items: [{ str: 'b', summedValue: 1000 }] },
        ]);
      });
    });

    describe('object', () => {
      it('object - works', () => {
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
        const results = tidy(data, groupBy('str', [], groupBy.object()));
        expect(results).toEqual({
          a: [
            { str: 'a', ing: 'x', foo: 'G', value: 1 },
            { str: 'a', ing: 'y', foo: 'G', value: 2 },
            { str: 'a', ing: 'y', foo: 'H', value: 3 },
            { str: 'a', ing: 'y', foo: 'K', value: 4 },
            { str: 'a', ing: 'z', foo: 'K', value: 5 },
            { str: 'a', ing: 'z', foo: 'G', value: 6 },
          ],
          b: [
            { str: 'b', ing: 'x', foo: 'H', value: 100 },
            { str: 'b', ing: 'x', foo: 'K', value: 200 },
            { str: 'b', ing: 'y', foo: 'G', value: 300 },
            { str: 'b', ing: 'z', foo: 'H', value: 400 },
          ],
        });
      });

      it('object - addGroupKeys false works', () => {
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

        const results = tidy(
          data,
          groupBy(
            ['str', 'ing'],
            [summarize({ summedValue: sum('value') })],
            groupBy.object({
              addGroupKeys: false,
              single: true,
            })
          )
        );
        expect(results).toEqual({
          a: {
            x: { summedValue: 1 },
            y: { summedValue: 9 },
            z: { summedValue: 11 },
          },
          b: {
            x: { summedValue: 300 },
            y: { summedValue: 300 },
            z: { summedValue: 400 },
          },
        });

        const results2 = tidy(
          data,
          groupBy(
            ['str', 'ing'],
            [
              summarize({ summedValue: sum('value') }),
              map((d: any) => d.summedValue),
            ],
            groupBy.object({
              addGroupKeys: false,
              single: true,
            })
          )
        );
        expect(results2).toEqual({
          a: {
            x: 1,
            y: 9,
            z: 11,
          },
          b: {
            x: 300,
            y: 300,
            z: 400,
          },
        });

        const results3 = tidy(
          data,
          groupBy(['str', 'ing'], [summarize({ summedValue: sum('value') })]),
          groupBy(
            ['str'],
            [map((d: any) => d.summedValue)],

            groupBy.object({
              addGroupKeys: false,
            })
          )
        );
        expect(results3).toEqual({
          a: [1, 9, 11],
          b: [300, 300, 400],
        });
      });

      it('object - flat works', () => {
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

        const results = tidy(
          data,
          groupBy(
            ['str', 'ing'],
            [],
            groupBy.object({
              flat: true,
              compositeKey: (keys) => keys.join('->'),
            })
          )
        );

        expect(results).toEqual({
          'a->x': [{ str: 'a', ing: 'x', foo: 'G', value: 1 }],

          'a->y': [
            { str: 'a', ing: 'y', foo: 'G', value: 2 },
            { str: 'a', ing: 'y', foo: 'H', value: 3 },
            { str: 'a', ing: 'y', foo: 'K', value: 4 },
          ],
          'a->z': [
            { str: 'a', ing: 'z', foo: 'K', value: 5 },
            { str: 'a', ing: 'z', foo: 'G', value: 6 },
          ],
          'b->x': [
            { str: 'b', ing: 'x', foo: 'H', value: 100 },
            { str: 'b', ing: 'x', foo: 'K', value: 200 },
          ],
          'b->y': [{ str: 'b', ing: 'y', foo: 'G', value: 300 }],
          'b->z': [{ str: 'b', ing: 'z', foo: 'H', value: 400 }],
        });
      });

      it('object - single works', () => {
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

        const results = tidy(
          data,
          groupBy(
            'str',
            [summarize({ summedValue: sum('value') })],
            groupBy.object({ single: true })
          )
        );
        expect(results).toEqual({
          a: { str: 'a', summedValue: 21 },
          b: { str: 'b', summedValue: 1000 },
        });
      });

      it('object - works with mapLeaf', () => {
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

        const results = tidy(
          data,
          groupBy(
            'str',
            [],
            groupBy.object({
              mapLeaf: (d) => ({ ing: d.ing, foo: d.foo, value: d.value }),
            })
          )
        );
        expect(results).toEqual({
          a: [
            { ing: 'x', foo: 'G', value: 1 },
            { ing: 'y', foo: 'G', value: 2 },
            { ing: 'y', foo: 'H', value: 3 },
            { ing: 'y', foo: 'K', value: 4 },
            { ing: 'z', foo: 'K', value: 5 },
            { ing: 'z', foo: 'G', value: 6 },
          ],
          b: [
            { ing: 'x', foo: 'H', value: 100 },
            { ing: 'x', foo: 'K', value: 200 },
            { ing: 'y', foo: 'G', value: 300 },
            { ing: 'z', foo: 'H', value: 400 },
          ],
        });
      });
    });

    describe('keys', () => {
      it('keys - works', () => {
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
        const results = tidy(data, groupBy('str', [], groupBy.keys()));
        expect(results).toEqual(['a', 'b']);
      });

      it('keys - works with multiple', () => {
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
        const results = tidy(data, groupBy(['str', 'ing'], [], groupBy.keys()));
        expect(results).toEqual([
          ['a', ['x', 'y', 'z']],
          ['b', ['x', 'y', 'z']],
        ]);
      });

      it('keys - flat works', () => {
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

        const results = tidy(
          data,
          groupBy(
            ['str', 'ing'],
            [],
            groupBy.keys({
              flat: true,
              compositeKey: (keys) => keys.join('->'),
            })
          )
        );

        expect(results).toEqual([
          'a->x',
          'a->y',
          'a->z',
          'b->x',
          'b->y',
          'b->z',
        ]);
      });

      it('keys - single works', () => {
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

        const results = tidy(
          data,
          groupBy(
            'str',
            [summarize({ summedValue: sum('value') })],
            groupBy.keys({ single: true })
          )
        );
        expect(results).toEqual(['a', 'b']);
      });
    });

    describe('values', () => {
      it('values - works', () => {
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
        const results = tidy(data, groupBy('str', [], groupBy.values()));
        expect(results).toEqual([
          [
            { str: 'a', ing: 'x', foo: 'G', value: 1 },
            { str: 'a', ing: 'y', foo: 'G', value: 2 },
            { str: 'a', ing: 'y', foo: 'H', value: 3 },
            { str: 'a', ing: 'y', foo: 'K', value: 4 },
            { str: 'a', ing: 'z', foo: 'K', value: 5 },
            { str: 'a', ing: 'z', foo: 'G', value: 6 },
          ],
          [
            { str: 'b', ing: 'x', foo: 'H', value: 100 },
            { str: 'b', ing: 'x', foo: 'K', value: 200 },
            { str: 'b', ing: 'y', foo: 'G', value: 300 },
            { str: 'b', ing: 'z', foo: 'H', value: 400 },
          ],
        ]);
      });

      it('values - flat works', () => {
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

        const results = tidy(
          data,
          groupBy(
            ['str', 'ing'],
            [],
            groupBy.values({
              flat: true,
              compositeKey: (keys) => keys.join('->'),
            })
          )
        );

        expect(results).toEqual([
          [{ str: 'a', ing: 'x', foo: 'G', value: 1 }],
          [
            { str: 'a', ing: 'y', foo: 'G', value: 2 },
            { str: 'a', ing: 'y', foo: 'H', value: 3 },
            { str: 'a', ing: 'y', foo: 'K', value: 4 },
          ],
          [
            { str: 'a', ing: 'z', foo: 'K', value: 5 },
            { str: 'a', ing: 'z', foo: 'G', value: 6 },
          ],
          [
            { str: 'b', ing: 'x', foo: 'H', value: 100 },
            { str: 'b', ing: 'x', foo: 'K', value: 200 },
          ],
          [{ str: 'b', ing: 'y', foo: 'G', value: 300 }],
          [{ str: 'b', ing: 'z', foo: 'H', value: 400 }],
        ]);
      });

      it('values - single works', () => {
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

        const results = tidy(
          data,
          groupBy(
            'str',
            [summarize({ summedValue: sum('value') })],
            groupBy.values({ single: true })
          )
        );
        // note this is basically the same as doing ungroup() / no export in this case.
        expect(results).toEqual([
          { str: 'a', summedValue: 21 },
          { str: 'b', summedValue: 1000 },
        ]);
      });
    });

    describe('levels', () => {
      it('levels - works', () => {
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
        const results = tidy(
          data,
          groupBy(
            ['str', 'ing'],
            [],
            groupBy.levels({
              single: true,
              levels: ['entries', 'object'],
            })
          )
        );

        expect(results).toEqual([
          [
            'a',
            {
              x: { str: 'a', ing: 'x', foo: 'G', value: 1 },
              y: { str: 'a', ing: 'y', foo: 'G', value: 2 },
              z: { str: 'a', ing: 'z', foo: 'K', value: 5 },
            },
          ],
          [
            'b',
            {
              x: { str: 'b', ing: 'x', foo: 'H', value: 100 },
              y: { str: 'b', ing: 'y', foo: 'G', value: 300 },
              z: { str: 'b', ing: 'z', foo: 'H', value: 400 },
            },
          ],
        ]);
      });

      it('levels - work with custom level', () => {
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

        const customLevel: LevelSpec = {
          createEmptySubgroup: () => ({}),
          addSubgroup(parentGrouped, newSubgroup, key, level) {
            parentGrouped['something-' + key] = newSubgroup;
          },
          addLeaf(parentGrouped, key, values, level) {
            parentGrouped['LEAF-' + key] = { isLeaf: true, level, values };
          },
        };

        const results = tidy(
          data,
          groupBy(
            ['str', 'ing', 'foo'],
            [],
            groupBy.levels({
              single: true,
              levels: ['entries-object', customLevel],
            })
          )
        );
        expect(results).toEqual([
          {
            key: 'a',
            values: {
              'something-x': {
                'LEAF-G': {
                  isLeaf: true,
                  level: 2,
                  values: { str: 'a', ing: 'x', foo: 'G', value: 1 },
                },
              },
              'something-y': {
                'LEAF-G': {
                  isLeaf: true,
                  level: 2,
                  values: { str: 'a', ing: 'y', foo: 'G', value: 2 },
                },
                'LEAF-H': {
                  isLeaf: true,
                  level: 2,
                  values: { str: 'a', ing: 'y', foo: 'H', value: 3 },
                },
                'LEAF-K': {
                  isLeaf: true,
                  level: 2,
                  values: { str: 'a', ing: 'y', foo: 'K', value: 4 },
                },
              },
              'something-z': {
                'LEAF-K': {
                  isLeaf: true,
                  level: 2,
                  values: { str: 'a', ing: 'z', foo: 'K', value: 5 },
                },
                'LEAF-G': {
                  isLeaf: true,
                  level: 2,
                  values: { str: 'a', ing: 'z', foo: 'G', value: 6 },
                },
              },
            },
          },
          {
            key: 'b',
            values: {
              'something-x': {
                'LEAF-H': {
                  isLeaf: true,
                  level: 2,
                  values: { str: 'b', ing: 'x', foo: 'H', value: 100 },
                },
                'LEAF-K': {
                  isLeaf: true,
                  level: 2,
                  values: { str: 'b', ing: 'x', foo: 'K', value: 200 },
                },
              },
              'something-y': {
                'LEAF-G': {
                  isLeaf: true,
                  level: 2,
                  values: { str: 'b', ing: 'y', foo: 'G', value: 300 },
                },
              },
              'something-z': {
                'LEAF-H': {
                  isLeaf: true,
                  level: 2,
                  values: { str: 'b', ing: 'z', foo: 'H', value: 400 },
                },
              },
            },
          },
        ]);
      });

      it('levels - keys, values works', () => {
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
        const results = tidy(
          data,
          groupBy(
            ['str', 'ing'],
            [],
            groupBy.levels({
              levels: ['keys', 'values'],
            })
          )
        );

        expect(results).toEqual([
          [
            'a',
            [
              [{ str: 'a', ing: 'x', foo: 'G', value: 1 }],
              [
                { str: 'a', ing: 'y', foo: 'G', value: 2 },
                { str: 'a', ing: 'y', foo: 'H', value: 3 },
                { str: 'a', ing: 'y', foo: 'K', value: 4 },
              ],
              [
                { str: 'a', ing: 'z', foo: 'K', value: 5 },
                { str: 'a', ing: 'z', foo: 'G', value: 6 },
              ],
            ],
          ],
          [
            'b',
            [
              [
                { str: 'b', ing: 'x', foo: 'H', value: 100 },
                { str: 'b', ing: 'x', foo: 'K', value: 200 },
              ],
              [{ str: 'b', ing: 'y', foo: 'G', value: 300 }],
              [{ str: 'b', ing: 'z', foo: 'H', value: 400 }],
            ],
          ],
        ]);
      });

      it('levels - map, values works', () => {
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
        const results = tidy(
          data,
          groupBy(
            ['str', 'ing'],
            [],
            groupBy.levels({
              levels: ['map', 'values'],
            })
          )
        );

        expect(results).toEqual(
          new Map([
            [
              'a',
              [
                [{ str: 'a', ing: 'x', foo: 'G', value: 1 }],
                [
                  { str: 'a', ing: 'y', foo: 'G', value: 2 },
                  { str: 'a', ing: 'y', foo: 'H', value: 3 },
                  { str: 'a', ing: 'y', foo: 'K', value: 4 },
                ],
                [
                  { str: 'a', ing: 'z', foo: 'K', value: 5 },
                  { str: 'a', ing: 'z', foo: 'G', value: 6 },
                ],
              ],
            ],
            [
              'b',
              [
                [
                  { str: 'b', ing: 'x', foo: 'H', value: 100 },
                  { str: 'b', ing: 'x', foo: 'K', value: 200 },
                ],
                [{ str: 'b', ing: 'y', foo: 'G', value: 300 }],
                [{ str: 'b', ing: 'z', foo: 'H', value: 400 }],
              ],
            ],
          ])
        );
      });
    });

    describe('map', () => {
      it('map - works', () => {
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

        const results = tidy(data, groupBy('str', [], groupBy.map()));
        expect(results).toEqual(
          new Map([
            [
              'a',
              [
                { str: 'a', ing: 'x', foo: 'G', value: 1 },
                { str: 'a', ing: 'y', foo: 'G', value: 2 },
                { str: 'a', ing: 'y', foo: 'H', value: 3 },
                { str: 'a', ing: 'y', foo: 'K', value: 4 },
                { str: 'a', ing: 'z', foo: 'K', value: 5 },
                { str: 'a', ing: 'z', foo: 'G', value: 6 },
              ],
            ],
            [
              'b',
              [
                { str: 'b', ing: 'x', foo: 'H', value: 100 },
                { str: 'b', ing: 'x', foo: 'K', value: 200 },
                { str: 'b', ing: 'y', foo: 'G', value: 300 },
                { str: 'b', ing: 'z', foo: 'H', value: 400 },
              ],
            ],
          ])
        );
      });

      it('map - flat works', () => {
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

        const results = tidy(
          data,
          groupBy(
            ['str', 'ing'],
            [],
            groupBy.map({
              flat: true,
              compositeKey: (keys) => keys.join('->'),
            })
          )
        );
        expect(results).toEqual(
          new Map([
            ['a->x', [{ str: 'a', ing: 'x', foo: 'G', value: 1 }]],
            [
              'a->y',
              [
                { str: 'a', ing: 'y', foo: 'G', value: 2 },
                { str: 'a', ing: 'y', foo: 'H', value: 3 },
                { str: 'a', ing: 'y', foo: 'K', value: 4 },
              ],
            ],
            [
              'a->z',
              [
                { str: 'a', ing: 'z', foo: 'K', value: 5 },
                { str: 'a', ing: 'z', foo: 'G', value: 6 },
              ],
            ],
            [
              'b->x',
              [
                { str: 'b', ing: 'x', foo: 'H', value: 100 },
                { str: 'b', ing: 'x', foo: 'K', value: 200 },
              ],
            ],
            ['b->y', [{ str: 'b', ing: 'y', foo: 'G', value: 300 }]],
            ['b->z', [{ str: 'b', ing: 'z', foo: 'H', value: 400 }]],
          ])
        );
      });

      it('map - single works', () => {
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

        const results = tidy(
          data,
          groupBy(
            'str',
            [summarize({ summedValue: sum('value') })],
            groupBy.map({ single: true })
          )
        );
        expect(results).toEqual(
          new Map([
            ['a', { str: 'a', summedValue: 21 }],
            ['b', { str: 'b', summedValue: 1000 }],
          ])
        );

        const x = results.get('a');
      });
    });
  });
});
