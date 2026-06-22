"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { getSiteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const site = getSiteConfig();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-foreground text-background backdrop-blur-lg">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo className="text-background" />

        <nav className="hidden items-center gap-2 md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md border border-transparent px-3 py-2 text-sm font-medium text-background/80 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-background"
            >
              {item.label}
            </Link>
          ))}
          <Button
            asChild
            size="sm"
            className="ml-2 bg-background text-foreground hover:bg-background/90"
          >
            <Link href="/contact">Contact Sales</Link>
          </Button>
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-transparent p-2 text-background transition-colors hover:border-white/30 hover:bg-white/10 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-white/10 bg-foreground md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6 lg:px-8">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md border border-transparent px-3 py-2.5 text-sm font-medium text-background/80 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-background"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Button
            asChild
            className="mt-2 bg-background text-foreground hover:bg-background/90"
          >
            <Link href="/contact" onClick={() => setOpen(false)}>
              Contact Sales
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
