import type { MetadataRoute } from "next";

import { getAllPageSlugs } from "@/lib/mdx";
import { getAllProducts } from "@/lib/products";
import { getSiteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteConfig();
  const pageSlugs = getAllPageSlugs();
  const products = getAllProducts();

  const pageEntries = pageSlugs.map((slug) => ({
    url: `${site.url}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const productEntries = products.map((product) => ({
    url: `${site.url}${product.href}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const urls = new Set<string>();

  const entries: MetadataRoute.Sitemap = [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...pageEntries,
    ...productEntries,
  ];

  return entries.filter((entry) => {
    if (urls.has(entry.url)) {
      return false;
    }

    urls.add(entry.url);
    return true;
  });
}
