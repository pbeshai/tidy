module.exports = {
  title: 'tidy.js',
  tagline: 'Tidy up your data with JavaScript',
  url: 'https://pbeshai.github.io',
  baseUrl: '/tidy/',
  favicon: 'img/favicon.ico',
  organizationName: 'pbeshai', // Usually your GitHub org/user name.
  projectName: 'tidy', // Usually your repo name.
  plugins: [],
  themeConfig: {
    hideableSidebar: true,
    sidebarCollapsible: false,
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    image: 'img/tidy_social.png',
    navbar: {
      hideOnScroll: true,
      // title: 'tidy.js',
      logo: {
        alt: 'tidy.js Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          position: 'left',
          label: 'Docs',
          docId: 'getting_started',
          // activeBasePath: 'docs',
        },
        {
          position: 'left',
          label: 'Playground',
          to: '/playground',
          activeBasePath: '/playground',
        },
        {
          href: 'https://github.com/pbeshai/tidy',
          label: 'GitHub Repo',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Reach Out',
          items: [
            {
              label: '@pbesh',
              to: 'https://twitter.com/pbesh',
            },
            {
              label: 'GitHub Issues',
              to: 'https://github.com/pbeshai/tidy/issues',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub Code Repository',
              href: 'https://github.com/pbeshai/tidy',
            },
          ],
        },
      ],
      copyright: `Built with Docusaurus`,
    },

    algolia: {
      apiKey: '28ec6a5936dd807831d61e0f52ce2852',
      indexName: 'tidyjs',

      // Optional: see doc section bellow
      contextualSearch: false,

      // Optional: Algolia search parameters
      searchParameters: {},

      //... other Algolia params
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // homePageId: 'getting_started',
          path: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/pbeshai/tidy',

          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
