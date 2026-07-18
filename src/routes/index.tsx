import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/hero-section";
import { TrustStrip } from "@/components/trust-strip";
import { FeaturedCategories } from "@/components/featured-categories";
import { ProductRail } from "@/components/product-rail";
import { ExperienceBand } from "@/components/experience-band";
import { BrandStrip } from "@/components/brand-strip";
import { byCategory, featured } from "@/data/products";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <FeaturedCategories />
      <ProductRail title="Featured" accent="Products" products={featured} />
      <ProductRail title="Latest" accent="Airbuds" products={byCategory("airbuds")} viewAllTo="airbuds" />
      <ExperienceBand />
      <ProductRail title="Trendy" accent="Watches" products={byCategory("watch")} viewAllTo="watch" />
      <ProductRail title="Wired" accent="Earphones" products={byCategory("wired-earphones")} viewAllTo="wired-earphones" />
      <BrandStrip />
    </>
  );
}
