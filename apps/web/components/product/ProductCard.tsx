import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProductTypeIcon } from "@/lib/product-icons";
import type { ProductSummary } from "@/lib/product-types";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: ProductSummary;
  variant: "grid" | "featured";
  className?: string;
};

export function ProductCard({ product, variant, className }: ProductCardProps) {
  const Icon = getProductTypeIcon(product.type);

  if (variant === "grid") {
    return (
      <Link href={product.href} className={className}>
        <Card className="h-full overflow-hidden transition-colors hover:border-primary/40">
          <div className="relative aspect-square bg-white">
            <Image
              src={product.image}
              alt={product.alt}
              fill
              className="object-contain p-3"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          </div>
          <CardHeader className="space-y-2 p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
                {product.type}
              </span>
            </div>
            <CardTitle className="text-base">{product.name}</CardTitle>
            <CardDescription className="line-clamp-2 text-xs leading-relaxed">
              {product.summary}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
              View product
              <ArrowRight className="h-3 w-3" />
            </span>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link
      href={product.href}
      className={cn(
        "group block overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        <Image
          src={product.image}
          alt={product.alt}
          fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.02]"
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
              {product.summary}
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
  );
}
