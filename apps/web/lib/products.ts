import fs from "fs";
import path from "path";
import matter from "gray-matter";

import type {
  Product,
  ProductFileFrontmatter,
  ProductFrontmatter,
  ProductSummary,
} from "@/lib/product-types";

export type { Product, ProductSummary } from "@/lib/product-types";

const productsDirectory = path.join(process.cwd(), "content/products");
const publicDirectory = path.join(process.cwd(), "public");

function getDefaultHeroImage(handle: string): string {
  return `/products/${handle}/hero.svg`;
}

function cacheBustLocalSrc(src: string): string {
  if (!src.startsWith("/")) {
    return src;
  }

  const [pathname] = src.split("?");
  const filePath = path.join(publicDirectory, pathname);

  if (!fs.existsSync(filePath)) {
    return src;
  }

  const { mtimeMs } = fs.statSync(filePath);
  return `${pathname}?v=${Math.floor(mtimeMs)}`;
}

function resolveImages(
  product: ProductFrontmatter,
  handle: string,
): { src: string; alt: string }[] {
  if (product.images && product.images.length > 0) {
    return product.images.map((image) => ({
      src: cacheBustLocalSrc(image.src),
      alt: image.alt ?? product.name,
    }));
  }

  return [
    {
      src: cacheBustLocalSrc(getDefaultHeroImage(handle)),
      alt: product.name,
    },
  ];
}

function handleFromFilename(filename: string): string {
  return filename.replace(/\.mdx$/, "");
}

function getProductFilePath(handle: string): string | null {
  const filePath = path.join(productsDirectory, `${handle}.mdx`);
  return fs.existsSync(filePath) ? filePath : null;
}

function fileToProduct(handle: string, filePath: string): Product | null {
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContents);
  const frontmatter = data as ProductFileFrontmatter;

  if (!frontmatter.name || !frontmatter.type || !frontmatter.summary) {
    return null;
  }

  return {
    handle,
    href: `/products/${handle}`,
    title: frontmatter.title ?? frontmatter.name,
    description: frontmatter.description ?? frontmatter.summary,
    name: frontmatter.name,
    type: frontmatter.type,
    summary: frontmatter.summary,
    sku: frontmatter.sku,
    images: resolveImages(frontmatter, handle),
    overview: frontmatter.overview,
    specs: frontmatter.specs,
    documentation: frontmatter.documentation,
    highlights: frontmatter.highlights,
    cta: frontmatter.cta,
    listed: frontmatter.listed ?? true,
    order: frontmatter.order ?? 0,
  };
}

function sortProducts(products: Product[]): Product[] {
  return [...products].sort(
    (a, b) => a.order - b.order || a.name.localeCompare(b.name),
  );
}

export function getAllProductHandles(): string[] {
  if (!fs.existsSync(productsDirectory)) {
    return [];
  }

  return fs
    .readdirSync(productsDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map(handleFromFilename);
}

export function getAllProducts(): Product[] {
  return sortProducts(
    getAllProductHandles()
      .map((handle) => {
        const filePath = getProductFilePath(handle);
        if (!filePath) {
          return null;
        }

        return fileToProduct(handle, filePath);
      })
      .filter((product): product is Product => product !== null),
  );
}

export function getProductByHandle(handle: string): Product | null {
  const filePath = getProductFilePath(handle);
  if (!filePath) {
    return null;
  }

  return fileToProduct(handle, filePath);
}

export function getListedProducts(): Product[] {
  return getAllProducts().filter((product) => product.listed);
}

export function toProductSummary(product: Product): ProductSummary {
  const primaryImage = product.images[0];

  return {
    handle: product.handle,
    href: product.href,
    name: product.name,
    type: product.type,
    summary: product.summary,
    image: primaryImage.src,
    alt: primaryImage.alt,
  };
}

export function getListedProductSummaries(): ProductSummary[] {
  return getListedProducts().map(toProductSummary);
}
