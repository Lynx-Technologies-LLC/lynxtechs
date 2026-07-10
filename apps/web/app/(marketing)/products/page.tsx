import type { Metadata } from "next";
import { Suspense } from "react";

import { MdxContent } from "@/components/mdx/MdxContent";
import { CTA } from "@/components/sections/CTA";
import { CinematicHero } from "@/components/sections/CinematicHero";
import { ProductCatalog } from "@/components/sections/ProductCatalog";
import { getPageBySlug } from "@/lib/mdx";
import { getListedProductSummaries } from "@/lib/products";
import { getSiteConfig } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageBySlug(["products"]);

  if (!page) {
    return {};
  }

  return {
    title: page.frontmatter.title,
    description: page.frontmatter.description,
  };
}

export default function ProductsPage() {
  const page = getPageBySlug(["products"]);
  const site = getSiteConfig();
  const products = getListedProductSummaries();

  if (!page) {
    return null;
  }

  return (
    <>
      <CinematicHero products={products} showOverlay={false} />
      <section id="products" className="py-12">
        <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6">
          {page.content.trim() ? (
            <div className="max-w-3xl text-muted-foreground">
              <MdxContent source={page.content} />
            </div>
          ) : null}
          <Suspense
            fallback={
              <p className="text-center text-muted-foreground">
                Loading products...
              </p>
            }
          >
            <ProductCatalog products={products} />
          </Suspense>
        </div>
      </section>

      <CTA
        buttonHref="/contact"
        subcopy={`Contact ${site.salesEmail} to discuss your project.`}
      />
    </>
  );
}
