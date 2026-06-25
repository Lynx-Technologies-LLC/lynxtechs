import { CTA } from "@/components/sections/CTA";
import { CinematicHero } from "@/components/sections/CinematicHero";
import { FeatureShowcase } from "@/components/sections/FeatureShowcase";
import { IndustriesGrid } from "@/components/sections/IndustriesGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { StatsBar } from "@/components/sections/StatsBar";
import { Testimonials } from "@/components/sections/Testimonials";
import { getListedProductSummaries } from "@/lib/products";
import { getSiteConfig } from "@/lib/site";

export default function HomePage() {
  const site = getSiteConfig();
  const products = getListedProductSummaries();

  return (
    <>
      <CinematicHero
        headline="Real-time hardware design for robotics and industrial automation"
        subcopy="Lynx Technologies delivers EtherCAT-based control hardware, master software, and engineering services so your team can deploy deterministic automation faster."
        products={products}
        primaryCta={{ label: "Contact Sales", href: "/contact" }}
        secondaryCta={{ label: "View Products", href: "/products" }}
      />
      <StatsBar />
      <FeatureShowcase />
      <ProcessSteps />
      <IndustriesGrid />
      <Testimonials />
      <CTA
        headline="Ready to design your next real-time system?"
        subcopy={`Talk with our sales team at ${site.salesEmail} about EtherCAT hardware, LXMSTR, or custom engineering support.`}
      />
    </>
  );
}
