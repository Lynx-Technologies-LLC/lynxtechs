import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

// ─── Data ────────────────────────────────────────────────────────────────────

const SOFTWARE_CARDS = [
  {
    title: 'LXMASTER',
    badge: 'Software',
    description:
      'A real-time Linux EtherCAT master stack. Drive axes, read I/O, and integrate custom devices through a clean C++ API — no kernel module required.',
    links: [
      { label: 'Overview', to: '/lxmaster/overview' },
      { label: 'Getting Started', to: '/lxmaster/getting-started' },
      { label: 'API Reference', to: '/lxmaster/api' },
    ],
    accent: 'var(--ifm-color-primary)',
  },
];

const HARDWARE_CARDS = [
  {
    title: 'LXDIO33-16',
    badge: 'EtherCAT Module',
    description:
      '3.3 V 16-channel digital I/O PCB module. Drop-in EtherCAT connectivity for custom PCBs with minimal BOM.',
    links: [
      { label: 'Overview', to: '/hardware/lxdio33-16' },
      { label: 'Getting Started', to: '/hardware/lxdio33-16/tutorials/getting-started' },
    ],
    accent: '#0ea5a0',
  },
  {
    title: 'LXFIBER',
    badge: 'EtherCAT Module',
    description:
      'Fiber-optic EtherCAT media module. Extend your EtherCAT segment over long distances with full electrical isolation.',
    links: [
      { label: 'Overview', to: '/hardware/lxfiber' },
      { label: 'Getting Started', to: '/hardware/lxfiber/tutorials/getting-started' },
    ],
    accent: '#0ea5a0',
  },
  {
    title: 'LXRJ45',
    badge: 'EtherCAT Module',
    description:
      'RJ45 EtherCAT interface module. Standard copper connectivity for EtherCAT networks in industrial enclosures.',
    links: [
      { label: 'Overview', to: '/hardware/lxrj45' },
      { label: 'Getting Started', to: '/hardware/lxrj45/tutorials/getting-started' },
    ],
    accent: '#0ea5a0',
  },
];

const RESOURCES = [
  {
    title: 'EtherCAT Basics',
    description: 'New to EtherCAT? Start here for an overview of the protocol, device types, and communication model.',
    to: '/ethercat-basics',
    icon: '📡',
  },
  {
    title: 'PCB Integration',
    description: 'Design guidelines and footprint references for integrating Lynx EtherCAT modules into your PCB.',
    to: '/hardware/pcb-integration',
    icon: '🔌',
  },
];

// ─── Components ──────────────────────────────────────────────────────────────

function ProductCard({
  title,
  badge,
  description,
  links,
  accent,
}: {
  title: string;
  badge: string;
  description: string;
  links: { label: string; to: string }[];
  accent: string;
}) {
  return (
    <div className={styles.card} style={{ '--card-accent': accent } as React.CSSProperties}>
      <div className={styles.cardBadge}>{badge}</div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDesc}>{description}</p>
      <div className={styles.cardLinks}>
        {links.map((l) => (
          <Link key={l.label} className={styles.cardLink} to={l.to}>
            {l.label} →
          </Link>
        ))}
      </div>
    </div>
  );
}

function ResourceCard({
  title,
  description,
  to,
  icon,
}: {
  title: string;
  description: string;
  to: string;
  icon: string;
}) {
  return (
    <Link to={to} className={styles.resourceCard}>
      <span className={styles.resourceIcon}>{icon}</span>
      <div>
        <div className={styles.resourceTitle}>{title}</div>
        <div className={styles.resourceDesc}>{description}</div>
      </div>
    </Link>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Documentation"
      description={siteConfig.tagline}
    >
      {/* Hero */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>Documentation</div>
          <h1 className={styles.heroTitle}>Lynx Technologies</h1>
          <p className={styles.heroSubtitle}>
            Software, hardware, and integration guides for the Lynx EtherCAT ecosystem.
          </p>
        </div>
      </header>

      <main className={styles.main}>
        {/* Software */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Software</h2>
          <div className={styles.grid1}>
            {SOFTWARE_CARDS.map((c) => (
              <ProductCard key={c.title} {...c} />
            ))}
          </div>
        </section>

        {/* Hardware */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>EtherCAT Modules</h2>
          <p className={styles.sectionSubtitle}>
            PCB-mount EtherCAT modules designed to drop into your own hardware designs.
          </p>
          <div className={styles.grid3}>
            {HARDWARE_CARDS.map((c) => (
              <ProductCard key={c.title} {...c} />
            ))}
          </div>
        </section>

        {/* Resources */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Resources</h2>
          <div className={styles.resourceGrid}>
            {RESOURCES.map((r) => (
              <ResourceCard key={r.title} {...r} />
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
