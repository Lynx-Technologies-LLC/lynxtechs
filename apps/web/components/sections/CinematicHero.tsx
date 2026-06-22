"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const slides = [
  {
    name: "LXMSTR",
    type: "Software",
    description: "EtherCAT master software for real-time control.",
    href: "/products/lxmstr",
    image: "/products/lxmstr.svg",
    alt: "LXMSTR EtherCAT master software",
  },
  {
    name: "LXDIO33-16",
    type: "Hardware",
    description: "3.3 V EtherCAT digital I/O PCB module.",
    href: "/products/lxdio33-16",
    image: "/products/lxdio33-16.svg",
    alt: "LXDIO33-16 EtherCAT digital I/O module",
  },
];

const INTERVAL_MS = 10000;

type CinematicHeroProps = {
  headline: string;
  subcopy: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export function CinematicHero({
  headline,
  subcopy,
  primaryCta = { label: "Contact Sales", href: "/contact" },
  secondaryCta = { label: "View Products", href: "/products" },
}: CinematicHeroProps) {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((index: number) => {
    setCurrent((index + slides.length) % slides.length);
  }, []);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section
      className="relative min-h-[88vh] overflow-hidden border-b border-border bg-black"
      aria-label="Product slideshow"
      aria-roledescription="carousel"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.name}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority
            className="object-cover object-center opacity-90"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-32 sm:px-6 lg:px-8 lg:pb-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
              Lynx Technologies
            </p>
            <h1 className="max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {headline}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
              {subcopy}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              >
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="lg:text-right"
          >
            <Link
              href={slide.href}
              className="group inline-block rounded-xl border border-white/20 bg-white/5 p-6 backdrop-blur-md transition-colors hover:bg-white/10"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-white/60">
                Featured product
              </span>
              <p className="mt-2 text-2xl font-bold text-white">{slide.name}</p>
              <p className="mt-1 text-sm text-white/70">{slide.description}</p>
              <span className="mt-4 inline-block text-sm font-medium text-white group-hover:underline">
                Explore {slide.name} →
              </span>
            </Link>
          </motion.div>
        </div>

        <div className="mt-12 flex items-center justify-between">
          <div className="flex gap-2">
            {slides.map((item, index) => (
              <button
                key={item.name}
                type="button"
                onClick={() => goTo(index)}
                className={cn(
                  "h-1 rounded-full transition-all",
                  index === current
                    ? "w-10 bg-white"
                    : "w-4 bg-white/40 hover:bg-white/70",
                )}
                aria-label={`Go to ${item.name}`}
                aria-current={index === current ? "true" : undefined}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={prev}
              className="rounded-full border border-white/20 bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="rounded-full border border-white/20 bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
