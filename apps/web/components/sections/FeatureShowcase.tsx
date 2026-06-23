"use client";

import { motion } from "framer-motion";
import { Clock, Layers, Zap } from "lucide-react";

import { SectionHeader } from "@/components/sections/SectionHeader";

const features = [
  {
    icon: Zap,
    label: "Real-time control",
    title: "Deterministic hardware for industrial workloads",
    description:
      "EtherCAT-based I/O and master software engineered for predictable cycle times — from robotics cells to factory automation lines.",
  },
  {
    icon: Layers,
    label: "Open platform",
    title: "One stack — software, modules, and custom design",
    description:
      "Combine LXMSTR master software, LXDIO33-16 I/O modules, and Lynx engineering services to build complete real-time control systems.",
  },
  {
    icon: Clock,
    label: "Faster deployment",
    title: "From prototype to production-ready hardware",
    description:
      "Proven building blocks and hands-on integration support help your team ship reliable automation hardware on schedule.",
  },
];

export function FeatureShowcase() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Why Lynx Technologies"
          title="Built for real-time robotics and industrial automation"
          description="Products and engineering services designed around EtherCAT — the fieldbus chosen when timing matters."
          align="center"
          className="mb-20"
        />

        <div className="space-y-24 lg:space-y-32">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const reversed = index % 2 === 1;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ${
                  reversed ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {feature.label}
                  </p>
                  <h3 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>

                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted">
                  <div className="absolute inset-0 grid-pattern opacity-40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-border bg-background shadow-lg">
                      <Icon className="h-10 w-10 text-foreground" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
