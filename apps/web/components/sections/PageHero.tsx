"use client";

import { motion } from "framer-motion";

type PageHeroProps = {
  headline: string;
  subcopy?: string;
};

export function PageHero({ headline, subcopy }: PageHeroProps) {
  return (
    <section className="border-b border-border bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl"
        >
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {headline}
          </h1>
          {subcopy ? (
            <p className="mt-4 text-lg text-muted-foreground">{subcopy}</p>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
