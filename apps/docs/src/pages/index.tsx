import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

// ─── Data ────────────────────────────────────────────────────────────────────

const STATS = [
  {
    value: '1–2 years → weeks',
    label: 'Time to production EtherCAT hardware',
  },
  {
    value: 'Zero firmware',
    label: 'Hard real-time, no firmware design required',
  },
  {
    value: 'Drop-in PCB modules',
    label: 'No EtherCAT IP development required',
  },
  {
    value: 'Full system design services',
    label: 'From concept to deployment',
  },
];

const SOFTWARE_CARDS = [
  {
    title: 'LXMASTER',
    badge: 'Software',
    description:
      'Two powerful tools in one package: the lxmaster CLI for host setup, network management, and debugging — and liblxmaster, a C++ library that abstracts the entire EtherCAT stack so you write application logic, not fieldbus code.',
    links: [
      { label: 'Overview', to: '/lxmaster/overview' },
      { label: 'Getting Started', to: '/lxmaster/getting-started' },
      { label: 'API Reference', to: '/lxmaster/api' },
    ],
    accent: 'var(--ifm-color-primary)',
    comingSoon: false,
  },
];

const HARDWARE_CARDS = [
  {
    title: 'LXDIO33-16',
    badge: 'EtherCAT Module',
    description:
      '3.3 V 16-channel digital I/O PCB module. Drop-in EtherCAT connectivity for custom PCBs with minimal BOM.',
    links: [{ label: 'Learn More', to: '/hardware/lxdio33-16/overview' }],
    accent: '#0ea5a0',
    comingSoon: false,
  },
  {
    title: 'LXFIBER',
    badge: 'EtherCAT Module',
    description:
      'Fiber-optic EtherCAT media module. Extend your EtherCAT segment over long distances with full electrical isolation.',
    links: [{ label: 'Learn More', to: '/hardware/lxfiber/overview' }],
    accent: '#0ea5a0',
    comingSoon: false,
  },
  {
    title: 'LXRJ45',
    badge: 'EtherCAT Module',
    description:
      'RJ45 EtherCAT interface module. Standard copper connectivity for EtherCAT networks in industrial enclosures.',
    links: [{ label: 'Learn More', to: '/hardware/lxrj45/overview' }],
    accent: '#0ea5a0',
    comingSoon: false,
  },
  {
    title: 'EtherCAT Drive Module',
    badge: 'Coming Soon',
    description:
      'Compact servo-drive interface module for CiA 402 motion control over EtherCAT. Designed to integrate seamlessly into your motor drive PCB.',
    links: [],
    accent: '#8a9aaa',
    comingSoon: true,
  },
  {
    title: 'EtherCAT Encoder Module',
    badge: 'Coming Soon',
    description:
      'High-resolution absolute encoder interface over EtherCAT for precision motion feedback in robotics and automation systems.',
    links: [],
    accent: '#8a9aaa',
    comingSoon: true,
  },
  {
    title: 'Protocol Interface Module',
    badge: 'Coming Soon',
    description:
      'Gateway module bridging EtherCAT to industrial protocols such as CANopen and serial, enabling mixed-network machine architectures.',
    links: [],
    accent: '#8a9aaa',
    comingSoon: true,
  },
];

const SERVICE_CARDS = [
  {
    title: 'EtherCAT System Design',
    description:
      'End-to-end EtherCAT network design for robotics and automation — from topology planning and ENI generation to real-time tuning and commissioning. Reduce your system integration timeline from months to days.',
  },
  {
    title: 'PCB Design Services',
    description:
      'Custom EtherCAT-ready PCB design targeting robotics and automation hardware. We design around your mechanical and electrical constraints, integrating our proven EtherCAT module IP to cut development time dramatically.',
  },
];

const RESOURCES = [
  {
    title: 'EtherCAT Basics',
    description:
      'New to EtherCAT? Start here for an overview of the protocol, device types, and communication model.',
    to: '/ethercat-basics',
    icon: '📡',
  },
];

// ─── Components ──────────────────────────────────────────────────────────────

function ProductCard({
  title,
  badge,
  description,
  links,
  accent,
  comingSoon,
}: {
  title: string;
  badge: string;
  description: string;
  links: { label: string; to: string }[];
  accent: string;
  comingSoon: boolean;
}) {
  return (
    <div
      className={`${styles.card} ${comingSoon ? styles.cardComingSoon : ''}`}
      style={{ '--card-accent': accent } as React.CSSProperties}
    >
      <div className={comingSoon ? styles.cardBadgeComingSoon : styles.cardBadge}>{badge}</div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDesc}>{description}</p>
      {links.length > 0 && (
        <div className={styles.cardLinks}>
          {links.map((l) => (
            <Link key={l.label} className={styles.cardLink} to={l.to}>
              {l.label} →
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function ServiceCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className={styles.serviceCard}>
      <h3 className={styles.serviceCardTitle}>{title}</h3>
      <p className={styles.serviceCardDesc}>{description}</p>
      <Link className={styles.serviceContact} to="/services">
        Learn more →
      </Link>
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
    <Layout title="Documentation" description={siteConfig.tagline}>
      {/* Hero */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>Documentation</div>
          <h1 className={styles.heroTitle}>Lynx Technologies</h1>
          <p className={styles.heroSubtitle}>
            EtherCAT software and hardware that compress electronics design timelines
            from 1–2 years to just a few weeks. Systems built on our PCB modules are
            hard real-time with zero firmware design. LXMASTER for real-time Linux
            control. Expert EtherCAT and PCB design services.
          </p>
          <div className={styles.heroCtas}>
            <a className={styles.ctaPrimary} href="#products">
              Explore Products
            </a>
            <Link className={styles.ctaSecondary} to="/ethercat-basics">
              EtherCAT Basics
            </Link>
          </div>
        </div>
      </header>

      {/* Stats strip */}
      <div className={styles.statsStrip}>
        {STATS.map((s) => (
          <div key={s.value} className={styles.statItem}>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <main className={styles.main} id="products">
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
          <h2 className={styles.sectionHeading}>EtherCAT PCB Modules</h2>
          <p className={styles.sectionSubtitle}>
            Production-ready EtherCAT modules designed to drop directly into your own
            PCB hardware designs. Systems built on these modules are hard real-time
            with zero firmware design — no EtherCAT IP development, no microcontroller
            firmware, no protocol stack to maintain.
          </p>
          <div className={styles.grid3}>
            {HARDWARE_CARDS.map((c) => (
              <ProductCard key={c.title} {...c} />
            ))}
          </div>
          <p className={styles.sectionNote}>
            More modules in development.{' '}
            <a href="mailto:info@lynxtechs.com">Contact us</a> to discuss your
            application requirements.
          </p>
        </section>

        {/* Services */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Design Services</h2>
          <p className={styles.sectionSubtitle}>
            Lynx Technologies offers specialized design services for robotics and
            automation teams that need to move faster.
          </p>
          <div className={styles.servicesGrid}>
            {SERVICE_CARDS.map((s) => (
              <ServiceCard key={s.title} {...s} />
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
