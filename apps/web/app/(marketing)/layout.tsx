import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getListedProductSummaries } from "@/lib/products";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const products = getListedProductSummaries();

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer products={products} />
    </>
  );
}
