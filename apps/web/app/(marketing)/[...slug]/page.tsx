import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { MdxContent } from "@/components/mdx/MdxContent";
import { ContactForm } from "@/components/sections/ContactForm";
import { CTA } from "@/components/sections/CTA";
import { PageHero } from "@/components/sections/PageHero";
import { getAllPageSlugs, getPageBySlug } from "@/lib/mdx";
import { getSiteConfig } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

const DEDICATED_PAGE_SLUGS = new Set(["products"]);

export async function generateStaticParams() {
  return getAllPageSlugs()
    .filter((slug) => !DEDICATED_PAGE_SLUGS.has(slug))
    .map((slug) => ({
      slug: slug.split("/"),
    }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    return {};
  }

  return {
    title: page.frontmatter.title,
    description: page.frontmatter.description,
  };
}

export default async function ContentPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const site = getSiteConfig();
  const isContact = page.slug === "contact";

  return (
    <>
      <PageHero
        headline={page.frontmatter.hero?.headline ?? page.frontmatter.title}
        subcopy={page.frontmatter.hero?.subcopy}
      />

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {isContact ? (
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="space-y-8">
                <MdxContent source={page.content} />
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
                  <Image
                    src="/office-building.png"
                    alt="Lynx Technologies office"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
              <ContactForm />
            </div>
          ) : (
            <div className="max-w-3xl">
              <MdxContent source={page.content} />
            </div>
          )}
        </div>
      </section>

      {!isContact ? (
        <CTA
          buttonHref="/contact"
          subcopy={`Contact ${site.salesEmail} to discuss your project.`}
        />
      ) : null}
    </>
  );
}
