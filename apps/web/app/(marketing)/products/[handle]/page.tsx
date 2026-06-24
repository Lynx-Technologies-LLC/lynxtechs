import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductPage } from "@/components/sections/ProductPage";
import { getAllProducts, getProductByHandle } from "@/lib/products";

type ProductDetailPageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateStaticParams() {
  return getAllProducts().map((product) => ({
    handle: product.handle,
  }));
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = getProductByHandle(handle);

  if (!product) {
    return {};
  }

  return {
    title: product.title,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { handle } = await params;
  const product = getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ProductPage product={product} />
      </div>
    </section>
  );
}
