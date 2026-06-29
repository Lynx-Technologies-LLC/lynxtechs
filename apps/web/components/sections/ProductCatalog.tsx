"use client";

import { useState } from "react";

import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import type { ProductSummary } from "@/lib/product-types";
import { cn } from "@/lib/utils";

type ProductType = ProductSummary["type"];

type ProductCatalogProps = {
  products: ProductSummary[];
};

const categories: ProductType[] = ["Software", "Hardware"];

export function ProductCatalog({ products }: ProductCatalogProps) {
  const [category, setCategory] = useState<ProductType | null>(null);

  const filtered = category
    ? products.filter((product) => product.type === category)
    : products;

  return (
    <div className="space-y-8">
      <div className="flex justify-center gap-4">
        {categories.map((item) => (
          <Button
            key={item}
            type="button"
            size="lg"
            variant={category === item ? "default" : "secondary"}
            onClick={() =>
              setCategory((current) => (current === item ? null : item))
            }
            className={cn(
              "min-w-[10rem] px-8 text-base",
              category !== item && "bg-muted",
            )}
          >
            {item}
          </Button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((product) => (
            <ProductCard
              key={product.handle}
              product={product}
              variant="grid"
            />
          ))}
        </div>
      ) : category ? (
        <p className="text-muted-foreground">
          No {category.toLowerCase()} products listed yet.
        </p>
      ) : (
        <p className="text-muted-foreground">No products listed yet.</p>
      )}
    </div>
  );
}
