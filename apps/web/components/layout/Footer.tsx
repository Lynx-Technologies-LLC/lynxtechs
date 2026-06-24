import Link from "next/link";

import { Logo } from "@/components/layout/Logo";
import type { ProductSummary } from "@/lib/product-types";
import { getSiteConfig } from "@/lib/site";

type FooterProps = {
  products: ProductSummary[];
};

export function Footer({ products }: FooterProps) {
  const site = getSiteConfig();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:px-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo showName={false} imageClassName="h-12 w-12" />
          <p className="mt-3 font-semibold">{site.companyName}</p>
          <p className="mt-2 text-sm text-muted-foreground">{site.tagline}</p>
          <a
            href={`mailto:${site.salesEmail}`}
            className="mt-4 inline-block text-sm text-primary hover:underline"
          >
            {site.salesEmail}
          </a>
        </div>

        <div>
          <p className="text-sm font-semibold">Products</p>
          <ul className="mt-3 space-y-2">
            {products.map((product) => (
              <li key={product.href}>
                <Link
                  href={product.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {product.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Services</p>
          <ul className="mt-3 space-y-2">
            {site.footer.services.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Company</p>
          <ul className="mt-3 space-y-2">
            {site.footer.company.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:px-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>Copyright © {new Date().getFullYear()} {site.companyName}. All rights reserved.</p>
          <p>EtherCAT is a registered trademark of Beckhoff Automation GmbH.</p>
        </div>
      </div>
    </footer>
  );
}
