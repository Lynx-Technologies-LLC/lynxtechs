import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/sections/PageHero";
import { getSiteConfig } from "@/lib/site";

export default function ShopPlaceholderPage() {
  const site = getSiteConfig();

  return (
    <>
      <PageHero
        headline="Shop coming soon"
        subcopy="The Lynx Technologies online shop will launch with Medusa headless commerce — customer accounts, checkout, and order tracking."
      />
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-muted-foreground">
            For now, contact our sales team to order LXMASTER or LXDIO33-16.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/products">View Products</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href={`mailto:${site.salesEmail}`}>Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
