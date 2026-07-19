"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { IProduct, PaginatedResponse } from "@/types/api";
import { ProductCard } from "./product-card";
import apiClient from "@/lib/apiClient";
import { Loader2 } from "lucide-react";

interface CollectionUIProps {
  initialProducts: IProduct[];
  totalProducts: number;
  categories: { name: string; slug: string }[];
  totalPages: number;
}

export default function CollectionUI({
  initialProducts,
  totalProducts,
  categories,
  totalPages,
}: CollectionUIProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read current active filters from the URL
  const currentMaxPrice = Number(searchParams.get("maxPrice")) || 50000;
  const selectedCats = searchParams.get("categories")?.split("|") || [];

  // Local state for the slider to prevent lagging during drag
  const [localMaxPrice, setLocalMaxPrice] = useState(currentMaxPrice);

  // Infinite Scroll States
  const [products, setProducts] = useState<IProduct[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1 });

  // 1. Reset state when server data (filters) change
  useEffect(() => {
    setProducts(initialProducts);
    setPage(1);
    setLocalMaxPrice(currentMaxPrice);
  }, [initialProducts, currentMaxPrice, searchParams]);

  // 2. Load More Logic
  const loadMoreProducts = useCallback(async () => {
    if (isLoadingMore || page >= totalPages) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;

    try {
      // Build API params based on current URL + next page
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", nextPage.toString());
      params.set("limit", "12");
      if (params.has("categories")) {
        params.set("category", params.get("categories")!.replace(/\|/g, ","));
        params.delete("categories"); // Clean up frontend-only param before API call
      }

      const response = await apiClient.get<PaginatedResponse<IProduct>>(
        `/products?${params.toString()}`,
      );

      if (response?.data) {
        setProducts((prev) => [...prev, ...response.data]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, totalPages, isLoadingMore, searchParams]);

  // 3. Trigger load more when scroll reaches the bottom sentinel
  useEffect(() => {
    if (inView) {
      loadMoreProducts();
    }
  }, [inView, loadMoreProducts]);

  // URL Sync Helpers
  const updateURL = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);

    // Changing filters means we need to start over at page 1 from the server
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (slug: string, checked: boolean) => {
    let newCats = [...selectedCats];
    if (checked) newCats.push(slug);
    else newCats = newCats.filter((c) => c !== slug);
    updateURL("categories", newCats.length > 0 ? newCats.join("|") : null);
  };

  const handlePriceCommit = () => {
    if (localMaxPrice !== currentMaxPrice) {
      updateURL("maxPrice", localMaxPrice.toString());
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl font-extrabold">All Products</h1>
      <p className="mt-1 text-sm text-muted-foreground">{totalProducts} products</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr] items-start">
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {/* Category Filter */}
          <div className="rounded-xl border p-4">
            <h3 className="text-sm font-semibold">Category</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCats.includes(c.slug)}
                      onChange={(e) => handleCategoryChange(c.slug, e.target.checked)}
                    />
                    {c.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Max Price Filter */}
          <div className="rounded-xl border p-4">
            <h3 className="text-sm font-semibold">Max price</h3>
            <input
              type="range"
              min={500}
              max={50000}
              step={500}
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(Number(e.target.value))}
              onMouseUp={handlePriceCommit}
              onTouchEnd={handlePriceCommit}
              className="mt-3 w-full accent-[color:var(--accent)]"
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Up to ৳{localMaxPrice.toLocaleString()}
            </p>
          </div>

          {/* Reset Filters */}
          <Link
            href={pathname}
            className="block text-center text-xs text-muted-foreground hover:underline"
          >
            Reset filters
          </Link>
        </aside>

        {/* Product Grid */}
        <div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.variantId} product={p} />
            ))}
          </div>
          {page < totalPages && (
            <div ref={ref} className="mt-8 flex w-full justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
