import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { CTA } from "@/components/sections/CTA";
import { CinematicHero } from "@/components/sections/CinematicHero";
import { FeatureShowcase } from "@/components/sections/FeatureShowcase";
import { IndustriesGrid } from "@/components/sections/IndustriesGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ProductsTeaser } from "@/components/sections/ProductsTeaser";
import { ServicesTeaser } from "@/components/sections/ServicesTeaser";
import { StatsBar } from "@/components/sections/StatsBar";
import { Testimonials } from "@/components/sections/Testimonials";
import { getSiteConfig } from "@/lib/site";

export default function HomePage() {
  const site = getSiteConfig();

  return (
    <>
      <CinematicHero
        headline="Real-time hardware design for robotics and industrial automation"
        subcopy="Lynx Technologies delivers EtherCAT-based control hardware, master software, and engineering services so your team can deploy deterministic automation faster."
        primaryCta={{ label: "Contact Sales", href: "/contact" }}
        secondaryCta={{ label: "View Products", href: "/products" }}
      />
      <StatsBar />
      <FeatureShowcase />
      <ServicesTeaser />
      <ProductsTeaser />
      <ProcessSteps />
      <IndustriesGrid />
      <Testimonials />
      <AboutTeaser />
      <CTA
        headline="Ready to design your next real-time system?"
        subcopy={`Talk with our sales team at ${site.salesEmail} about EtherCAT hardware, LXMSTR, or custom engineering support.`}
      />
    </>
  );
}
