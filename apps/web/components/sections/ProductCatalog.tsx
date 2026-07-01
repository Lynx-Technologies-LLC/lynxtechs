"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ProductCard } from "@/components/product/ProductCard";
import type { ProductSummary } from "@/lib/product-types";
import { cn } from "@/lib/utils";

type ProductType = ProductSummary["type"];

type ProductCatalogProps = {
  products: ProductSummary[];
};

const categories: ProductType[] = ["Software", "Hardware"];

function parseSelectedTypes(searchParams: URLSearchParams): Set<ProductType> {
  if (searchParams.get("filter") === "none") {
    return new Set();
  }

  const types = searchParams
    .getAll("type")
    .filter(
      (value): value is ProductType =>
        value === "Software" || value === "Hardware",
    );

  if (types.length === 0) {
    return new Set(categories);
  }

  return new Set(types);
}

function buildFilterQuery(selectedTypes: Set<ProductType>): string {
  const params = new URLSearchParams();

  if (selectedTypes.size === 0) {
    params.set("filter", "none");
  } else if (selectedTypes.size < categories.length) {
    for (const item of categories) {
      if (selectedTypes.has(item)) {
        params.append("type", item);
      }
    }
  }

  return params.toString();
}

function ProductTypeFilter({
  selectedTypes,
  onToggle,
}: {
  selectedTypes: Set<ProductType>;
  onToggle: (type: ProductType) => void;
}) {
  return (
    <aside className="w-full shrink-0 lg:w-52">
      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-semibold tracking-tight">Type</h2>
        <ul className="mt-4 space-y-3">
          {categories.map((item) => (
            <li key={item}>
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={selectedTypes.has(item)}
                  onChange={() => onToggle(item)}
                  className={cn(
                    "h-4 w-4 shrink-0 rounded border border-border",
                    "accent-foreground",
                  )}
                />
                <span className="text-sm text-foreground">{item}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export function ProductCatalog({ products }: ProductCatalogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const [selectedTypes, setSelectedTypes] = useState<Set<ProductType>>(() =>
    parseSelectedTypes(searchParams),
  );

  useEffect(() => {
    setSelectedTypes(parseSelectedTypes(new URLSearchParams(searchParamsString)));
  }, [searchParamsString]);

  const toggleType = useCallback(
    (type: ProductType) => {
      const next = new Set(selectedTypes);

      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }

      setSelectedTypes(next);

      const query = buildFilterQuery(next);
      router.replace(query ? `/products?${query}` : "/products", {
        scroll: false,
      });
    },
    [router, selectedTypes],
  );

  const filtered = products.filter((product) => selectedTypes.has(product.type));

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      <ProductTypeFilter
        selectedTypes={selectedTypes}
        onToggle={toggleType}
      />

      <div className="min-w-0 flex-1">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard
                key={product.handle}
                product={product}
                variant="grid"
              />
            ))}
          </div>
        ) : selectedTypes.size === 0 ? (
          <p className="text-muted-foreground">
            Select at least one type to view products.
          </p>
        ) : (
          <p className="text-muted-foreground">
            No products match the selected filters.
          </p>
        )}
      </div>
    </div>
  );
}
