"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Cpu,
  FileCode,
  Layers,
  Network,
  Server,
  Settings,
  Zap,
} from "lucide-react";

import { CTA } from "@/components/sections/CTA";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Button } from "@/components/ui/button";

// ─── Data ────────────────────────────────────────────────────────────────────

const CLIENTS = [
  "NASA",
  "FANUC",
  "Toyota",
  "Scythe Robotics",
  "Picknik Robotics",
];

const CATEGORIES = [
  {
    id: "software-consulting",
    label: "Software Consulting",
    description:
      "EtherCAT architecture, integration, and system design for real-time robotics and automation.",
    icon: Layers,
  },
  {
    id: "pcb-design",
    label: "PCB Design",
    description:
      "EtherCAT-ready hardware for robotics — zero firmware required. Hard real-time from day one.",
    icon: Cpu,
  },
];

const SOFTWARE_SERVICES = [
  {
    icon: Network,
    title: "EtherCAT Network Architecture",
    description:
      "Topology design, slave selection, cycle-time budgeting, and control stack planning for deterministic real-time systems.",
  },
  {
    icon: FileCode,
    title: "ENI Generation & Validation",
    description:
      "EtherCAT Network Information (ENI) file generation from live bus scans, ESI file integration, PDO mapping, and sync manager validation.",
  },
  {
    icon: Server,
    title: "Real-time Host Setup",
    description:
      "PREEMPT_RT kernel configuration, CPU isolation, IRQ affinity tuning, and DC-sync qualification on your Linux host machine.",
  },
  {
    icon: Layers,
    title: "System Integration with LXMASTER",
    description:
      "Full working application code integrated with your hardware using LXMASTER — axes, I/O modules, encoders, and custom device profiles.",
  },
  {
    icon: Settings,
    title: "Commissioning & Performance Tuning",
    description:
      "On-site or remote drive tuning, distributed clock alignment, jitter measurement, and validation against your real-time performance requirements.",
  },
];

const PCB_SERVICES = [
  {
    icon: Zap,
    title: "Zero Firmware, Hard Real-time",
    description:
      "PCBs built on Lynx EtherCAT modules require no firmware. The EtherCAT protocol is handled entirely in hardware — no stack to write, certify, or maintain.",
  },
  {
    icon: Cpu,
    title: "Robotics-Focused Board Design",
    description:
      "Compact form factors, high connector density, multi-rail power delivery, and EMI management designed around the mechanical realities of robotics hardware.",
  },
  {
    icon: FileCode,
    title: "Full Schematic & Layout",
    description:
      "End-to-end PCB design from schematic capture through layout, DRC, and Gerber delivery. Manufacture-ready and test-ready on the first spin.",
  },
  {
    icon: CheckCircle,
    title: "Bring-up & Validation",
    description:
      "Hardware bring-up including signal integrity review, power-on sequencing validation, and functional testing alongside LXMASTER and your application.",
  },
  {
    icon: Clock,
    title: "Accelerated Timelines",
    description:
      "By combining our proven EtherCAT module IP with deep robotics PCB expertise, we consistently compress hardware programs from 1–2 years to just a few weeks.",
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function ServiceCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="group rounded-2xl border border-border bg-background p-7 transition-colors hover:border-foreground/20"
    >
      <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-muted">
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  return (
    <>
      <PageHero
        headline="EtherCAT system design for robotics and automation"
        subcopy="Lynx Technologies provides software consulting and PCB design services that compress electronics development from 1–2 years to just a few weeks. Trusted by NASA, FANUC, Toyota, Scythe Robotics, and Picknik Robotics."
      />

      {/* Trusted-by strip */}
      <div className="border-b border-border bg-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-5 sm:px-6">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
            Trusted by
          </span>
          {CLIENTS.map((c) => (
            <span
              key={c}
              className="text-sm font-semibold tracking-wide text-white/65"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Category overview cards */}
      <section className="border-b border-border bg-muted/20 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="mb-8 text-center text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Two service categories
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <motion.a
                  key={cat.id}
                  href={`#${cat.id}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="group flex flex-col gap-4 rounded-2xl border border-border bg-background p-8 no-underline transition-colors hover:border-foreground/25"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{cat.label}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {cat.description}
                    </p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-foreground">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Software Consulting ─────────────────────────────────────── */}
      <section id="software-consulting" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Software Consulting"
            title="EtherCAT architecture, integration, and system design"
            description="From network topology planning and ENI generation through real-time host commissioning and full software integration — we handle the entire EtherCAT stack so your team can focus on the application."
            className="mb-14"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SOFTWARE_SERVICES.map((s, i) => (
              <ServiceCard key={s.title} {...s} icon={s.icon} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <hr className="border-border" />
      </div>

      {/* ── PCB Design ─────────────────────────────────────────────── */}
      <section id="pcb-design" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="PCB Design"
            title="EtherCAT-ready hardware — zero firmware required"
            description="Custom PCBs built on Lynx EtherCAT module IP are hard real-time from day one. No firmware stack to develop, certify, or maintain. We compress hardware programs from 1–2 years to just a few weeks."
            className="mb-14"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PCB_SERVICES.map((s, i) => (
              <ServiceCard key={s.title} {...s} icon={s.icon} index={i} />
            ))}
          </div>
        </div>
      </section>

      <CTA
        headline="Ready to accelerate your project?"
        subcopy="Tell us about your application — timeline, constraints, and where you are in the design process. We respond with a concrete proposal."
        buttonLabel="Contact Sales"
        buttonHref="/contact"
      />
    </>
  );
}
