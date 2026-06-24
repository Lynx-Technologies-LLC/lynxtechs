"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Product } from "@/lib/product-types";
import { getSiteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type ProductPageProps = {
  product: Product;
};

function ProductImageGallery({
  images,
}: {
  images: Product["images"];
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex] ?? images[0];

  if (!selectedImage) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-card">
        <Image
          src={selectedImage.src}
          alt={selectedImage.alt}
          fill
          className="object-contain p-6"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
      {images.length > 1 ? (
        <div className="flex gap-3">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative h-16 w-16 overflow-hidden rounded-md border bg-card transition-colors",
                selectedIndex === index
                  ? "border-foreground"
                  : "border-border hover:border-foreground/40",
              )}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-contain p-1"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ProductPurchasePanel({ product }: { product: Product }) {
  const site = getSiteConfig();

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {product.name}
        </h1>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
          {product.type}
        </span>
      </div>

      {product.sku ? (
        <p className="mt-2 text-sm text-muted-foreground">SKU: {product.sku}</p>
      ) : null}

      <p className="mt-4 text-lg text-muted-foreground">{product.summary}</p>

      <p className="mt-8 text-2xl font-semibold">Contact for quote</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="sm:flex-1">
          <Link href={`mailto:${site.salesEmail}`}>
            {product.cta ?? "Request quote"}
          </Link>
        </Button>
        <Button asChild size="lg" variant="secondary" className="sm:flex-1">
          <Link href="/contact">Contact sales</Link>
        </Button>
      </div>
    </div>
  );
}

function ProductTabs({ product }: { product: Product }) {
  const site = getSiteConfig();
  const docsUrl =
    site.nav.find((item) => item.label === "Docs")?.href ??
    "https://docs.lynxtechs.com";

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="specs">Specs</TabsTrigger>
        <TabsTrigger value="documentation">Documentation</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        {product.overview ? (
          <div className="max-w-3xl space-y-6 text-muted-foreground">
            {product.overview.split("\n\n").map((paragraph) => (
              <p key={paragraph} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        ) : null}
        {product.highlights && product.highlights.length > 0 ? (
          <ul className="mt-6 max-w-3xl list-disc space-y-2 pl-6 text-muted-foreground">
            {product.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        ) : null}
        {!product.overview &&
        (!product.highlights || product.highlights.length === 0) ? (
          <p className="text-muted-foreground">Overview coming soon.</p>
        ) : null}
      </TabsContent>

      <TabsContent value="specs">
        {product.specs && product.specs.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <tbody>
                {product.specs.map((spec, index) => (
                  <tr
                    key={spec.label}
                    className={cn(
                      index % 2 === 0 ? "bg-muted/30" : "bg-card",
                    )}
                  >
                    <th className="w-1/3 px-4 py-3 text-left font-medium text-foreground">
                      {spec.label}
                    </th>
                    <td className="px-4 py-3 text-muted-foreground">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted-foreground">Specifications coming soon.</p>
        )}
      </TabsContent>

      <TabsContent value="documentation">
        {product.documentation && product.documentation.length > 0 ? (
          <ul className="space-y-3">
            {product.documentation.map((doc) => (
              <li key={doc.label}>
                <a
                  href={doc.href}
                  className="inline-flex items-center gap-2 text-foreground underline-offset-4 hover:underline"
                  {...(doc.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {doc.label}
                  {doc.href.startsWith("http") ? (
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            Documentation is available on{" "}
            <a
              href={docsUrl}
              className="text-foreground underline-offset-4 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              docs.lynxtechs.com
            </a>{" "}
            or by contacting{" "}
            <a
              href={`mailto:${site.salesEmail}`}
              className="text-foreground underline-offset-4 hover:underline"
            >
              {site.salesEmail}
            </a>
            .
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
}

export function ProductPage({ product }: ProductPageProps) {
  return (
    <div className="space-y-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductImageGallery images={product.images} />
        <ProductPurchasePanel product={product} />
      </div>

      <ProductTabs product={product} />
    </div>
  );
}
