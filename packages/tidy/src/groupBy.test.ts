import { tidy, groupBy, summarize, sum, LevelSpec } from './index';
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

      const results = tidy(data, groupBy('str', [], { export: 'grouped' }));

      expect(results).toEqual(
        new Map([
          [
            ['str', 'a'],
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
            ['str', 'b'],
            [
              { str: 'b', ing: 'x', foo: 'H', value: 100 },
              { str: 'b', ing: 'x', foo: 'K', value: 200 },
              { str: 'b', ing: 'y', foo: 'G', value: 300 },
              { str: 'b', ing: 'z', foo: 'H', value: 400 },
            ],
          ],
        ])
      );

      const results2 = tidy(data, groupBy('str', [], groupBy.grouped()));
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
        groupBy((d) => d.str, [], { export: 'grouped' })
      );
      expect(results).toEqual(
        new Map([
          [
            ['group_0', 'a'],
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
            ['group_0', 'b'],
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
        groupBy(['str', 'ing'], [], { export: 'grouped' })
      );
      expect(results).toEqual(
        new Map([
          [
            ['str', 'a'],
            new Map([
              [['ing', 'x'], [{ str: 'a', ing: 'x', foo: 'G', value: 1 }]],
              [
                ['ing', 'y'],
                [
                  { str: 'a', ing: 'y', foo: 'G', value: 2 },
                  { str: 'a', ing: 'y', foo: 'H', value: 3 },
                  { str: 'a', ing: 'y', foo: 'K', value: 4 },
                ],
              ],
              [
                ['ing', 'z'],
                [
                  { str: 'a', ing: 'z', foo: 'K', value: 5 },
                  { str: 'a', ing: 'z', foo: 'G', value: 6 },
                ],
              ],
            ]),
          ],
          [
            ['str', 'b'],
            new Map([
              [
                ['ing', 'x'],
                [
                  { str: 'b', ing: 'x', foo: 'H', value: 100 },
                  { str: 'b', ing: 'x', foo: 'K', value: 200 },
                ],
              ],
              [['ing', 'y'], [{ str: 'b', ing: 'y', foo: 'G', value: 300 }]],
              [['ing', 'z'], [{ str: 'b', ing: 'z', foo: 'H', value: 400 }]],
            ]),
          ],
        ])
      );
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

      expect(
        tidy(
          data,
          groupBy((d) => d.str, [])
        )
      ).toEqual([
        { group_0: 'a', str: 'a', ing: 'x', foo: 'G', value: 1 },
        { group_0: 'a', str: 'a', ing: 'y', foo: 'G', value: 2 },
        { group_0: 'a', str: 'a', ing: 'z', foo: 'K', value: 5 },
        { group_0: 'a', str: 'a', ing: 'y', foo: 'H', value: 3 },
        { group_0: 'a', str: 'a', ing: 'y', foo: 'K', value: 4 },
        { group_0: 'a', str: 'a', ing: 'z', foo: 'G', value: 6 },
        { group_0: 'b', str: 'b', ing: 'x', foo: 'H', value: 100 },
        { group_0: 'b', str: 'b', ing: 'x', foo: 'K', value: 200 },
        { group_0: 'b', str: 'b', ing: 'y', foo: 'G', value: 300 },
        { group_0: 'b', str: 'b', ing: 'z', foo: 'H', value: 400 },
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
