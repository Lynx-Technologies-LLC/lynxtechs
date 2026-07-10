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

  onBrokenAnchors: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
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
        },
        {
          type: 'docSidebar',
          sidebarId: 'lxmasterSidebar',
          docsPluginId: 'lxmaster',
          position: 'left',
          label: 'LXMASTER',
        },
        {
          type: 'docsVersionDropdown',
          docsPluginId: 'lxmaster',
          position: 'right',
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
              label: 'Getting Started',
              to: '/lxmaster/getting-started',
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
          title: 'EtherCAT Modules',
          items: [
            {
              label: 'LXDIO33-16',
              to: '/hardware/lxdio33-16/overview',
            },
            {
              label: 'LXFIBER',
              to: '/hardware/lxfiber/overview',
            },
            {
              label: 'LXRJ45',
              to: '/hardware/lxrj45/overview',
            },
          ],
        },
        {
          title: 'Services',
          items: [
            {
              label: 'EtherCAT System Design',
              to: '/services',
            },
            {
              label: 'PCB Design Services',
              to: '/services',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'EtherCAT Basics',
              to: '/lxmaster/ethercat-basics',
            },
            {
              label: 'Main site',
              href: 'https://lynxtechs.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Lynx Technologies.`,
    },
    prism: {
      theme: prismThemes.vsLight,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['cpp', 'bash', 'cmake'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
