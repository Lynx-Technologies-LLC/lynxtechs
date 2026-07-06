"use client";

import Link from "next/link";
import { ArrowRight, Cpu, Network, Settings2, Wrench } from "lucide-react";
import { motion } from "framer-motion";

import { SectionHeader } from "@/components/sections/SectionHeader";

const icons = [Cpu, Network, Settings2, Wrench];

const services = [
  {
    title: "EtherCAT System Design",
    description:
      "End-to-end EtherCAT network design — topology planning, ENI generation, real-time host setup, and full commissioning.",
  },
  {
    title: "PCB Design Services",
    description:
      "EtherCAT-ready PCBs built on our module IP. Hard real-time, zero firmware. Compress your hardware timeline from 1–2 years to weeks.",
  },
  {
    title: "Real-time commissioning",
    description:
      "DC-sync tuning, jitter analysis, drive bring-up, and system-level validation against your motion and I/O requirements.",
  },
  {
    title: "LXMASTER integration",
    description:
      "Working application code delivered with your hardware — axes, I/O, and custom device profiles fully wired up and validated.",
  },
];

export function ServicesTeaser() {
  return (
    <section className="border-y border-border bg-muted/20 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            label="Services"
            title="EtherCAT real-time hardware design"
            description="Engineering support from first prototype through production — built around your automation requirements."
          />
          <Link
            href="/services"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium hover:underline"
          >
            View all services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {services.map((service, index) => {
            const Icon = icons[index] ?? Cpu;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group rounded-2xl border border-border bg-background p-8 transition-colors hover:border-foreground/20"
              >
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-muted">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold">{service.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
