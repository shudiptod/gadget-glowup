// app/product/[slug]/page.tsx
import ProductClient from "@/components/product-client";
import { categoryMap, CategorySlug } from "@/data/categories";
import { byCategory, bySlug } from "@/data/products";
import apiClient from "@/lib/apiClient";
import { IProduct, IProductDetail } from "@/types/api";
import Link from "next/link";

async function getProductDetail(slug: string): Promise<IProductDetail | null> {
  try {
    return await apiClient.get<IProductDetail>(`/products/slug/${slug}`);
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
}
async function getRelatedProducts(id: string, limit = 8): Promise<{ data: IProduct[] }> {
  try {
    return await apiClient.get<{ data: IProduct[] }>(`/products/related/${id}?limit=${limit}`);
  } catch (error) {
    console.error("Error fetching related product details:", error);
    return { data: [] };
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const response = await getProductDetail(slug);

  if (!response || !response.success || !response.data) {
    // notFound();

    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-extrabold">Product not found</h1>
        <Link href="/collection" className="mt-4 inline-block text-accent hover:underline">
          Back to shop
        </Link>
      </div>
    );
  }

  const product = response.data;
  const cat = {
    name: product.categoryName,
    slug: product.categorySlug,
    id: product.categoryId,
  };
  const { data: relatedProducts } = await getRelatedProducts(product.id, 8);

  return <ProductClient productData={response} cat={cat} related={relatedProducts} />;
}
