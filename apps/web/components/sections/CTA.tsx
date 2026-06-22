"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

type CTAProps = {
  headline?: string;
  subcopy?: string;
  buttonLabel?: string;
  buttonHref?: string;
};

export function CTA({
  headline = "Ready to design your next real-time system?",
  subcopy = "Talk with our sales team about EtherCAT hardware, LXMSTR, or custom engineering support.",
  buttonLabel = "Contact Sales",
  buttonHref = "/contact",
}: CTAProps) {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-foreground px-8 py-16 text-center sm:px-16 sm:py-20"
        >
          <div className="absolute inset-0 grid-pattern opacity-10" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-background sm:text-4xl lg:text-5xl">
              {headline}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">
              {subcopy}
            </p>
            <div className="mt-10">
              <Button
                asChild
                size="lg"
                className="bg-white text-black hover:bg-white/90"
              >
                <Link href={buttonHref}>{buttonLabel}</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
