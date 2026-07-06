import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './services.module.css';

// ─── Data ────────────────────────────────────────────────────────────────────

const CLIENTS = [
  'NASA',
  'FANUC',
  'Toyota',
  'Scythe Robotics',
  'Picknik Robotics',
];

const ETHERCAT_DESIGN = [
  {
    heading: 'Network architecture',
    body: 'Topology design, device selection, and segment planning for complex multi-axis EtherCAT networks — single ring, daisy-chain, and redundant configurations.',
  },
  {
    heading: 'ENI generation and validation',
    body: 'We generate and validate EtherCAT Network Information (ENI) files for your exact hardware, including ESI file integration, PDO mapping, and sync manager configuration.',
  },
  {
    heading: 'Real-time host setup',
    body: 'Full PREEMPT_RT kernel configuration, CPU isolation, IRQ affinity tuning, and DC-sync qualification so your host machine meets hard real-time requirements.',
  },
  {
    heading: 'Commissioning and tuning',
    body: 'On-site or remote commissioning of motion systems — drive tuning, distributed clock alignment, jitter analysis, and system-level validation.',
  },
  {
    heading: 'Integration with LXMASTER',
    body: 'We can deliver a complete, running LXMASTER-based application integrated with your hardware — axes, I/O, encoders, and custom device profiles all wired up.',
  },
];

const PCB_DESIGN = [
  {
    heading: 'EtherCAT-ready board design',
    body: 'Custom PCBs built around Lynx EtherCAT modules — zero firmware required. Your system is hard real-time from day one without any microcontroller firmware or EtherCAT stack development.',
  },
  {
    heading: 'Robotics and automation focus',
    body: 'We design for the mechanical and electrical constraints of robotics — compact form factors, high connector density, EMI management, and robust power delivery.',
  },
  {
    heading: 'Full schematic and layout',
    body: 'End-to-end PCB design from schematic capture through layout, DRC, and Gerber delivery. Designs are manufacture-ready and test-ready on first spin.',
  },
  {
    heading: 'Bring-up and validation support',
    body: 'Hardware bring-up support including signal integrity analysis, power-on sequencing validation, and functional testing alongside our EtherCAT software stack.',
  },
  {
    heading: 'Accelerated timelines',
    body: 'By combining our EtherCAT module IP with a deep robotics PCB design background, we compress electronics development from 1–2 years to just a few weeks.',
  },
];

// ─── Components ──────────────────────────────────────────────────────────────

function FeatureItem({ heading, body }: { heading: string; body: string }) {
  return (
    <div className={styles.featureItem}>
      <div className={styles.featureHeading}>{heading}</div>
      <p className={styles.featureBody}>{body}</p>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Services() {
  return (
    <Layout
      title="Design Services"
      description="EtherCAT system design and PCB design services for robotics and automation — from concept to production."
    >
      {/* Hero */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>Design Services</div>
          <h1 className={styles.heroTitle}>
            From concept to production&#8202;—&#8202;faster
          </h1>
          <p className={styles.heroSubtitle}>
            Lynx Technologies provides specialized EtherCAT system design and PCB
            design services for robotics and automation teams. We have worked with
            leading organizations across research, industrial automation, and
            commercial robotics to compress electronics development timelines from
            1–2 years to just a few weeks.
          </p>
          <a className={styles.ctaPrimary} href="mailto:info@lynxtechs.com">
            Get in touch
          </a>
        </div>
      </header>

      {/* Trusted by */}
      <div className={styles.clientsStrip}>
        <span className={styles.clientsLabel}>Trusted by</span>
        <div className={styles.clientsList}>
          {CLIENTS.map((c) => (
            <span key={c} className={styles.clientName}>{c}</span>
          ))}
        </div>
      </div>

      <main className={styles.main}>

        {/* EtherCAT System Design */}
        <section className={styles.serviceSection}>
          <div className={styles.serviceSectionHeader}>
            <div className={styles.serviceTag}>EtherCAT System Design</div>
            <h2 className={styles.serviceSectionTitle}>
              End-to-end EtherCAT integration for robotics and automation
            </h2>
            <p className={styles.serviceSectionDesc}>
              Whether you are starting a new machine architecture or integrating
              EtherCAT into an existing system, we handle every layer — from network
              topology and device configuration through real-time host setup,
              commissioning, and software integration. We bring our own proven
              toolchain (LXMASTER) so you are not starting from scratch.
            </p>
          </div>
          <div className={styles.featureGrid}>
            {ETHERCAT_DESIGN.map((f) => (
              <FeatureItem key={f.heading} {...f} />
            ))}
          </div>
        </section>

        {/* PCB Design Services */}
        <section className={styles.serviceSection}>
          <div className={styles.serviceSectionHeader}>
            <div className={styles.serviceTag}>PCB Design Services</div>
            <h2 className={styles.serviceSectionTitle}>
              EtherCAT-ready hardware with zero firmware design
            </h2>
            <p className={styles.serviceSectionDesc}>
              We design custom PCBs built around our EtherCAT module IP. Because the
              EtherCAT protocol is handled entirely in hardware, your boards are hard
              real-time from day one — no firmware stack to develop, validate, or
              maintain. The result is a dramatically shorter path from schematic to a
              fully operational machine.
            </p>
          </div>
          <div className={styles.featureGrid}>
            {PCB_DESIGN.map((f) => (
              <FeatureItem key={f.heading} {...f} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Ready to accelerate your project?</h2>
          <p className={styles.ctaDesc}>
            Tell us about your application — timeline, constraints, and where you are
            in the design process. We will respond with a concrete proposal.
          </p>
          <a className={styles.ctaButton} href="mailto:info@lynxtechs.com">
            Contact us →
          </a>
        </section>

      </main>
    </Layout>
  );
}
