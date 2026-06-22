"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CircuitBoard, Code2 } from "lucide-react";
import { motion } from "framer-motion";

import { SectionHeader } from "@/components/sections/SectionHeader";

const products = [
  {
    name: "LXMSTR",
    type: "Software",
    description:
      "EtherCAT master stack for real-time control of distributed I/O and motion devices.",
    href: "/products/lxmstr",
    image: "/products/lxmstr.svg",
    icon: Code2,
  },
  {
    name: "LXDIO33-16",
    type: "Hardware",
    description:
      "3.3 V EtherCAT digital I/O PCB module with 16 channels for industrial and robotics applications.",
    href: "/products/lxdio33-16",
    image: "/products/lxdio33-16.svg",
    icon: CircuitBoard,
  },
];

export function ProductsTeaser() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            label="Products"
            title="Software and hardware for EtherCAT control"
            description="Deterministic building blocks you can deploy today or integrate into custom designs."
          />
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium hover:underline"
          >
            View all products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={product.href}
                  className="group block overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute left-4 top-4 rounded-full border border-border bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                      {product.type}
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold">{product.name}</h3>
                        <p className="mt-2 leading-relaxed text-muted-foreground">
                          {product.description}
                        </p>
                      </div>
                      <div className="hidden shrink-0 rounded-xl border border-border bg-muted p-3 sm:block">
                        <Icon className="h-6 w-6" strokeWidth={1.5} />
                      </div>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium">
                      Learn more
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
