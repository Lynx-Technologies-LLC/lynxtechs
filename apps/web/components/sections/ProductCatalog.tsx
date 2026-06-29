"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import type { ProductSummary } from "@/lib/product-types";
import { cn } from "@/lib/utils";

type ProductType = ProductSummary["type"];

type ProductCatalogProps = {
  products: ProductSummary[];
};

const categories: ProductType[] = ["Software", "Hardware"];

function parseCategory(value: string | null): ProductType | null {
  if (value === "Software" || value === "Hardware") {
    return value;
  }

  return null;
}

export function ProductCatalog({ products }: ProductCatalogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = useMemo(
    () => parseCategory(searchParams.get("type")),
    [searchParams],
  );

  const setCategory = useCallback(
    (next: ProductType | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (next) {
        params.set("type", next);
      } else {
        params.delete("type");
      }

      const query = params.toString();
      router.replace(query ? `/products?${query}` : "/products", {
        scroll: false,
      });
    },
    [router, searchParams],
  );

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
              setCategory(category === item ? null : item)
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
