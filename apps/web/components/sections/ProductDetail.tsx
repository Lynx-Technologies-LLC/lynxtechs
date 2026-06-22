import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getSiteConfig } from "@/lib/site";
import type { PageFrontmatter } from "@/lib/mdx";

type ProductDetailProps = {
  product: NonNullable<PageFrontmatter["product"]>;
};

export function ProductDetail({ product }: ProductDetailProps) {
  const site = getSiteConfig();

  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-semibold">{product.name}</h2>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
          {product.type}
        </span>
      </div>
      <p className="mt-4 text-muted-foreground">{product.summary}</p>
      {product.highlights ? (
        <ul className="mt-6 list-disc space-y-2 pl-6 text-muted-foreground">
          {product.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      ) : null}
      <div className="mt-8">
        <Button asChild>
          <Link href={`mailto:${site.salesEmail}`}>
            {product.cta ?? "Contact Sales"}
          </Link>
        </Button>
      </div>
    </div>
  );
}
