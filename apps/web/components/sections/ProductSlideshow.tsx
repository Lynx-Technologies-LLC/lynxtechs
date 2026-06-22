"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

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

export function ProductSlideshow() {
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
      className="relative border-b border-border bg-muted"
      aria-label="Product slideshow"
      aria-roledescription="carousel"
    >
      <div className="relative mx-auto aspect-[21/9] max-h-[420px] w-full max-w-6xl overflow-hidden sm:aspect-[2.5/1]">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Link href={slide.href} className="group block h-full">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1152px) 100vw, 1152px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <span className="mb-2 inline-block rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {slide.type}
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {slide.name}
                </h2>
                <p className="mt-1 max-w-lg text-sm text-white/80 sm:text-base">
                  {slide.description}
                </p>
                <span className="mt-3 inline-block text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  View product →
                </span>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={prev}
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60 sm:left-4"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60 sm:right-4"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((item, index) => (
            <button
              key={item.name}
              type="button"
              onClick={() => goTo(index)}
              className={cn(
                "h-2 rounded-full transition-all",
                index === current
                  ? "w-6 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/80",
              )}
              aria-label={`Go to ${item.name}`}
              aria-current={index === current ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
