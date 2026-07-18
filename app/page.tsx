import { HeroSection } from "@/components/hero-section";
import { TrustStrip } from "@/components/trust-strip";
import { FeaturedCategories } from "@/components/featured-categories";
import { ProductRail } from "@/components/product-rail";
import { ExperienceBand } from "@/components/experience-band";
import { BrandStrip } from "@/components/brand-strip";
import { byCategory, featured } from "@/data/products";
import apiClient from "@/lib/apiClient";
import type { SettingsResponse } from "@/lib/types";
import { IProduct } from "@/types/api";

async function getHomeSettings() {
  try {
    return await apiClient.get<SettingsResponse>("/settings");
  } catch {
    return null;
  }
}

async function getFeaturedProducts(limit: number) {
  try {
    return await apiClient.get<{ data: IProduct[] }>(`/products?limit=${limit}&isFeatured=true`);
  } catch {
    throw new Error("Failed to fetch products");
  }
}

export default async function HomePage() {
  const settings = await getHomeSettings();
  const siteName = typeof settings?.data?.appName === "string" ? settings.data.appName : "DHON";

  const { data: featuredProducts } = await getFeaturedProducts(5);

  return (
    <>
      <HeroSection />
      <TrustStrip />
      <FeaturedCategories />
      <ProductRail title="Featured" accent="Products" products={featuredProducts} viewAllTo="" />
      {/* <ProductRail
        title="Latest"
        accent="Airbuds"
        products={byCategory("airbuds")}
        viewAllTo="airbuds"
      /> */}
      <ExperienceBand />
      {/* <ProductRail
        title="Trendy"
        accent="Watches"
        products={byCategory("watch")}
        viewAllTo="watch"
      />
      <ProductRail
        title="Wired"
        accent="Earphones"
        products={byCategory("wired-earphones")}
        viewAllTo="wired-earphones"
      /> */}
      <BrandStrip />
    </>
  );
}
