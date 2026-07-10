import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Lynx Technologies Docs',
  tagline:
    'LXMASTER software, API reference, tutorials, example projects, and hardware integration',
  favicon: 'img/logo.png',

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
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  onBrokenAnchors: 'ignore',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    './plugins/ask-ai-dev-plugin.mjs',
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'lxmaster',
        path: 'docs/lxmaster',
        routeBasePath: '/lxmaster',
        sidebarPath: './sidebars-lxmaster.ts',
        // Never show an unversioned "Next" entry — docs/lxmaster/ is a
        // placeholder; real content lives in lxmaster_versioned_docs/.
        includeCurrentVersion: false,
        // Docusaurus auto-discovers lxmaster_versioned_docs/,
        // lxmaster_versioned_sidebars/, and lxmaster_versions.json
        // from the plugin id — no extra path config needed.
      },
    ],
  ],

  themes: [
    '@docusaurus/theme-mermaid',
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
          // Exclude lxmaster (separate plugin) and the old intro root page.
          exclude: ['lxmaster/**', 'intro.md', 'master-software/**'],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    image: 'img/social-card.jpg',
    navbar: {
      title: 'Lynx Technologies',
      logo: {
        alt: 'Lynx Technologies Logo',
        src: 'img/logo.png',
        href: '/',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'hardwareSidebar',
          position: 'left',
          label: 'EtherCAT PCB Modules',
          className: 'navbar-tab navbar-tab--hardware',
        },
        {
          type: 'docSidebar',
          sidebarId: 'lxmasterSidebar',
          docsPluginId: 'lxmaster',
          position: 'left',
          label: 'LXMASTER',
          className: 'navbar-tab navbar-tab--lxmaster',
        },
        {
          type: 'custom-askAi',
          position: 'right',
          label: 'Ask AI',
        },
        {
          type: 'docsVersionDropdown',
          docsPluginId: 'lxmaster',
          position: 'right',
        },
      ],
    },
    prism: {
      theme: prismThemes.vsLight,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['cpp', 'bash', 'cmake'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
