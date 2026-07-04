import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Lynx Technologies Docs',
  tagline:
    'LXMASTER software, API reference, tutorials, example projects, and hardware integration',
  favicon: 'img/favicon.svg',

  url: 'https://docs.lynxtechs.com',
  baseUrl: '/',

  organizationName: 'Lynx-Technologies-LLC',
  projectName: 'lynxtechs',
  trailingSlash: false,

  onBrokenLinks: 'warn',

  markdown: {
    // Treat .md as CommonMark and .mdx as MDX. Migrated prose docs contain
    // characters (`<`, `{`, comparison operators) that strict MDX would reject.
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  onBrokenAnchors: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        docsRouteBasePath: '/',
        searchBarPosition: 'right',
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          // Edit links point at the docs app inside the lynxtechs monorepo.
          // Generated sections (LXMASTER API reference, release notes) are
          // produced by automation and intentionally have edit links disabled
          // via the per-folder _category_.json / frontmatter where applicable.
          editUrl:
            'https://github.com/Lynx-Technologies-LLC/lynxtechs/tree/main/apps/docs/',
          // Hide the "Next" (unreleased) entry from the version dropdown.
          // The live docs/ directory is still built and served as the default,
          // but visitors only see labelled release versions in the picker.
          includeCurrentVersion: false,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.jpg',
    navbar: {
      title: 'Lynx Technologies',
      logo: {
        alt: 'Lynx Technologies Logo',
        src: 'img/logo.png',
        href: 'https://lynxtechs.com',
        target: '_self',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'LXMASTER',
          items: [
            {
              label: 'Overview',
              to: '/lxmaster/overview',
            },
            {
              label: 'Tutorials',
              to: '/lxmaster/tutorials',
            },
            {
              label: 'API Reference',
              to: '/lxmaster/api',
            },
            {
              label: 'Release Notes',
              to: '/lxmaster/release-notes',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'EtherCAT Basics',
              to: '/ethercat-basics',
            },
            {
              label: 'Hardware',
              to: '/hardware',
            },
            {
              label: 'Main site',
              href: 'https://lynxtechs.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Lynx Technologies. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['cpp', 'bash', 'cmake'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
