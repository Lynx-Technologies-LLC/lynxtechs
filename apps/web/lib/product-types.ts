export type ProductFrontmatter = {
  name: string;
  type: "Software" | "Hardware";
  summary: string;
  sku?: string;
  images?: { src: string; alt?: string }[];
  overview?: string;
  specs?: { label: string; value: string }[];
  documentation?: { label: string; href: string }[];
  highlights?: string[];
  cta?: string;
  listed?: boolean;
  order?: number;
};

export type ProductFileFrontmatter = {
  title: string;
  description: string;
} & ProductFrontmatter;

export type Product = {
  handle: string;
  href: string;
  title: string;
  description: string;
  name: string;
  type: "Software" | "Hardware";
  summary: string;
  sku?: string;
  images: { src: string; alt: string }[];
  overview?: string;
  specs?: { label: string; value: string }[];
  documentation?: { label: string; href: string }[];
  highlights?: string[];
  cta?: string;
  listed: boolean;
  order: number;
};

export type ProductSummary = Pick<
  Product,
  "handle" | "href" | "name" | "type" | "summary"
> & {
  image: string;
  alt: string;
};
