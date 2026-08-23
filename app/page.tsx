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
import SEOContentSection from "@/components/SEOContentSection";

async function getFeaturedProducts(limit: number) {
  try {
    return await apiClient.get<{ data: IProduct[] }>(`/products?limit=${limit}&isFeatured=true`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
  } catch (e) {
    throw new Error("Failed to fetch products");
  }
}

async function getCategorizedProducts(limit: number, categorySlug: string) {
  try {
    return await apiClient.get<{ data: IProduct[] }>(
      `/products?limit=${limit}&category=${categorySlug}`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      },
    );
  } catch {
    throw new Error("Failed to fetch categorized products");
  }
}

export default async function HomePage() {
  const { data: featuredProducts } = await getFeaturedProducts(5);
  const { data: airbudsProducts } = await getCategorizedProducts(5, "earbuds");
  const { data: watchesProducts } = await getCategorizedProducts(5, "watches");
  const { data: wiredEarphonesProducts } = await getCategorizedProducts(5, "earphones");

  return (
    <>
      <HeroSection />
      <TrustStrip />
      <FeaturedCategories />
      <ProductRail title="Featured" accent="Products" products={featuredProducts} viewAllTo="" />
      <ProductRail title="Latest" accent="Airbuds" products={airbudsProducts} viewAllTo="earbuds" />
      <ExperienceBand />
      <ProductRail title="Trendy" accent="Watches" products={watchesProducts} viewAllTo="watch" />
      <ProductRail
        title="Wired"
        accent="Earphones"
        products={wiredEarphonesProducts}
        viewAllTo="earphones"
      />
      <SEOContentSection
        links={{
          smartphones: "/collection/phone",
          audio: "/collection/airbuds",
          watches: "/collection/watches",
          charging: "/collection/charging",
          technology: "/collection",
          gadgets: "/collection/camera-networking",
        }}
      />
      {/* <BrandStrip /> */}
    </>
  );
}
