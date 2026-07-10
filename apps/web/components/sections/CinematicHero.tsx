"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import type { ProductSummary } from "@/lib/product-types";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 5000;

type CinematicHeroProps = {
  headline?: string;
  subcopy?: string;
  products?: ProductSummary[];
  videoSrc?: string;
  showOverlay?: boolean;
  compact?: boolean;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export function CinematicHero({
  headline,
  subcopy,
  products = [],
  videoSrc,
  showOverlay = true,
  compact = false,
  primaryCta = { label: "Contact Sales", href: "/contact" },
  secondaryCta = { label: "View Products", href: "/products" },
}: CinematicHeroProps) {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      if (products.length === 0) {
        return;
      }

      setCurrent((index + products.length) % products.length);
    },
    [products.length],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (videoSrc || products.length <= 1) {
      return;
    }

    const timer = setInterval(next, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [next, products.length, videoSrc]);

  const slide = products[current];
  const isSlideshow = !videoSrc && products.length > 0;
  const sectionHeight = compact ? "min-h-[45vh]" : "min-h-[88vh]";

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border bg-black",
        sectionHeight,
      )}
      aria-label={isSlideshow ? "Product slideshow" : "Hero"}
      aria-roledescription={isSlideshow ? "carousel" : undefined}
    >
      {videoSrc ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : slide ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.handle}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 bg-white"
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority
              className={cn(
                "object-contain object-center",
                compact ? "p-4 sm:p-8" : "p-8 sm:p-16 lg:p-24",
              )}
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
      ) : null}

      {showOverlay ? (
        <>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </>
      ) : null}

      <div
        className={cn(
          "relative mx-auto flex max-w-7xl flex-col px-4 sm:px-6 lg:px-8",
          sectionHeight,
          showOverlay ? "justify-end pb-16 pt-32 lg:pb-20" : compact ? "justify-end pb-4 pt-4" : "justify-end pb-8 pt-8",
        )}
      >
        <div
          className={cn(
            "grid gap-12",
            showOverlay ? "lg:grid-cols-2 lg:items-end" : "lg:grid-cols-1 lg:justify-items-end",
          )}
        >
          {showOverlay ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                Lynx Technologies
              </p>
              {headline ? (
                <h1 className="max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {headline}
                </h1>
              ) : null}
              {subcopy ? (
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">{subcopy}</p>
              ) : null}
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
          ) : null}

          {isSlideshow && slide ? (
            <motion.div
              key={slide.handle}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: showOverlay ? 0.25 : 0.1 }}
              className="lg:justify-self-end lg:text-right"
            >
              <Link
                href={slide.href}
                className={cn(
                  "group inline-block rounded-xl border backdrop-blur-md transition-colors",
                  compact ? "max-w-sm p-4" : "p-6",
                  showOverlay
                    ? "border-white/20 bg-white/5 hover:bg-white/10"
                    : "border-border bg-background/90 shadow-sm hover:bg-background",
                )}
              >
                <span
                  className={cn(
                    "text-xs font-medium uppercase tracking-wider",
                    showOverlay ? "text-white/60" : "text-muted-foreground",
                  )}
                >
                  Featured product
                </span>
                <p
                  className={cn(
                    "mt-2 font-bold",
                    compact ? "text-xl" : "text-2xl",
                    showOverlay ? "text-white" : "text-foreground",
                  )}
                >
                  {slide.name}
                </p>
                <p
                  className={cn(
                    "mt-1 text-sm",
                    showOverlay ? "text-white/70" : "text-muted-foreground",
                  )}
                >
                  {slide.summary}
                </p>
                <span
                  className={cn(
                    "mt-4 inline-block text-sm font-medium group-hover:underline",
                    showOverlay ? "text-white" : "text-foreground",
                  )}
                >
                  Explore {slide.name} →
                </span>
              </Link>
            </motion.div>
          ) : null}
        </div>

        {isSlideshow && products.length > 1 ? (
          <div className={cn("flex items-center justify-between", compact ? "mt-4" : "mt-12")}>
            <div className="flex gap-2">
              {products.map((item, index) => (
                <button
                  key={item.handle}
                  type="button"
                  onClick={() => goTo(index)}
                  className={cn(
                    "h-1 rounded-full transition-all",
                    index === current
                      ? cn("w-10", showOverlay ? "bg-white" : "bg-foreground")
                      : cn(
                          "w-4",
                          showOverlay
                            ? "bg-white/40 hover:bg-white/70"
                            : "bg-foreground/30 hover:bg-foreground/50",
                        ),
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
                className={cn(
                  "rounded-full border p-2 backdrop-blur-sm transition-colors",
                  showOverlay
                    ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                    : "border-border bg-background/80 text-foreground hover:bg-background",
                )}
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={next}
                className={cn(
                  "rounded-full border p-2 backdrop-blur-sm transition-colors",
                  showOverlay
                    ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                    : "border-border bg-background/80 text-foreground hover:bg-background",
                )}
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
