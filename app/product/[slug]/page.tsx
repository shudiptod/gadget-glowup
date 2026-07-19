// app/product/[slug]/page.tsx
import ProductClient from "@/components/product-client";
import { categoryMap, CategorySlug } from "@/data/categories";
import { byCategory, bySlug } from "@/data/products";
import Link from "next/link";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = bySlug.get(slug);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-extrabold">Product not found</h1>
        <Link href="/collection" className="mt-4 inline-block text-accent hover:underline">
          Back to shop
        </Link>
      </div>
    );
  }

  const catSlug = product.category as CategorySlug;
  const cat = categoryMap[catSlug];
  const related = byCategory(catSlug)
    .filter((p) => p.id !== product.id)
    .slice(0, 5);

  return <ProductClient product={product} cat={cat} related={related} />;
}
