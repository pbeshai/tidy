module.exports = {
  docs: [
    { type: 'doc', id: 'getting_started' },
    {
      type: 'category',
      label: 'Examples',
      items: ['examples/moving_average_example'],
    },
    {
      type: 'category',
      label: 'API',
      items: [
        'api/tidy',
        'api/groupby',
        'api/summary',
        'api/vector',
        'api/item',
        'api/sequences',
        'api/selectors',
        'api/pivot',
        'api/math',
      ],
    },
    {
      type: 'category',
      label: 'tidy-moment',
      items: ['tidy-moment/tidy_moment'],
    },
  ],
};
