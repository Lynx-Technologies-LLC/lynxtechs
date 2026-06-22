"use client";

import { motion } from "framer-motion";

import { SectionHeader } from "@/components/sections/SectionHeader";

const testimonials = [
  {
    quote:
      "Lynx helped us integrate EtherCAT I/O into our robotics cell faster than we expected. The LXMSTR stack and module hardware worked together cleanly.",
    author: "Automation Engineering Lead",
    company: "Industrial Robotics OEM",
  },
  {
    quote:
      "We needed deterministic digital I/O at 3.3 V for a custom end-effector. LXDIO33-16 was the right fit for our EtherCAT network.",
    author: "Controls Engineer",
    company: "Factory Automation Integrator",
  },
  {
    quote:
      "From architecture review to PCB bring-up, Lynx's hardware design services kept our real-time control project on track.",
    author: "R&D Manager",
    company: "Industrial Equipment Manufacturer",
  },
];

export function Testimonials() {
  return (
    <section className="border-y border-border bg-muted/40 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Customer outcomes"
          title="Trusted by teams building real-time systems"
          align="center"
          className="mb-16"
        />

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.blockquote
              key={item.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex h-full flex-col rounded-2xl border border-border bg-background p-8 shadow-sm"
            >
              <p className="flex-1 text-base leading-relaxed text-foreground/90">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="mt-6 border-t border-border pt-6">
                <p className="font-semibold">{item.author}</p>
                <p className="text-sm text-muted-foreground">{item.company}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
