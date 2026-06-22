import siteConfig from "@/content/site.json";

export type NavItem = {
  label: string;
  href: string;
};

export type SiteConfig = {
  companyName: string;
  tagline: string;
  description: string;
  salesEmail: string;
  url: string;
  nav: NavItem[];
  footer: {
    products: NavItem[];
    services: NavItem[];
    company: NavItem[];
  };
};

export function getSiteConfig(): SiteConfig {
  return siteConfig as SiteConfig;
}
