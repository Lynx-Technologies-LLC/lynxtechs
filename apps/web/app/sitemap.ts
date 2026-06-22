import type { MetadataRoute } from "next";

import { getAllPageSlugs } from "@/lib/mdx";
import { getSiteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteConfig();
  const slugs = getAllPageSlugs();

  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...slugs.map((slug) => ({
      url: `${site.url}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
