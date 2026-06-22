"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

type HeroProps = {
  headline: string;
  subcopy: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export function Hero({
  headline,
  subcopy,
  primaryCta = { label: "Contact Sales", href: "/contact" },
  secondaryCta = { label: "View Products", href: "/products" },
}: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-muted/40 to-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.04),transparent_50%)]" />
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-primary">
            Lynx Technologies
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {headline}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
            {subcopy}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
