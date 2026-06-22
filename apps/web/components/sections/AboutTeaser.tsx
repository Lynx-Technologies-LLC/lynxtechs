"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/sections/SectionHeader";

export function AboutTeaser() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-3xl border border-border bg-foreground text-background"
        >
          <div className="grid lg:grid-cols-2">
            <div className="p-10 sm:p-12 lg:p-16">
              <SectionHeader
                label="About Lynx"
                title="Real-time expertise, practical product development"
                description="We combine deep EtherCAT knowledge with off-the-shelf software and hardware modules — helping teams ship deterministic control systems on schedule."
                className="[&_h2]:text-background [&_p]:text-white/70"
              />
              <ul className="mt-8 space-y-3 text-sm text-white/80">
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  Real-time performance
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  EtherCAT expertise
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  Robotics &amp; industrial automation
                </li>
              </ul>
              <Button
                asChild
                className="mt-10 bg-white text-black hover:bg-white/90"
              >
                <Link href="/about">About Lynx Technologies</Link>
              </Button>
            </div>
            <div className="relative min-h-[280px] bg-white/5 lg:min-h-0">
              <div className="absolute inset-0 grid-pattern opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center p-12">
                <div className="text-center">
                  <p className="text-6xl font-bold tracking-tighter text-white/10">
                    LX
                  </p>
                  <p className="mt-4 text-sm uppercase tracking-[0.3em] text-white/40">
                    Lynx Technologies
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
