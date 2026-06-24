"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeader } from "@/components/sections/SectionHeader";
import type { ProductSummary } from "@/lib/product-types";

type ProductsTeaserProps = {
  products: ProductSummary[];
};

export function ProductsTeaser({ products }: ProductsTeaserProps) {
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
          {products.map((product, index) => (
            <motion.div
              key={product.handle}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} variant="featured" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
