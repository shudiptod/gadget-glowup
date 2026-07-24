"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { IProduct, PaginatedResponse } from "@/types/api";
import { ProductCard } from "./product-card";
import { Loader2 } from "lucide-react";
import apiClient from "@/lib/apiClient";

interface SearchUIProps {
  initialProducts: IProduct[];
  query: string;
  total: number;
  totalPages: number;
}

export default function SearchUI({ initialProducts, query, total, totalPages }: SearchUIProps) {
  const [products, setProducts] = useState<IProduct[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Sync state if the URL query changes
  useEffect(() => {
    setProducts(initialProducts);
    setPage(1);
  }, [initialProducts, query]);

  const loadMore = useCallback(async () => {
    if (page >= totalPages || isLoading) return;

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const res = await apiClient.get<PaginatedResponse<IProduct>>(
        `/products?search=${encodeURIComponent(query)}&page=${nextPage}&limit=12`,
      );

      // Append new products to the existing list
      setProducts((prev) => [...prev, ...(res.data || [])]);
      setPage(nextPage);
    } catch (error) {
      console.error("Failed to load more products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, totalPages, isLoading, query]);

  // Set up the Intersection Observer for Infinite Scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }, // Trigger slightly before they hit the absolute bottom
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-2xl font-extrabold md:text-3xl">
        {query ? (
          <>
            Results for "<span className="text-accent">{query}</span>"
          </>
        ) : (
          "Search"
        )}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{total} products found</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((p, index) => (
          // Using index as fallback key in case variantId repeats during pagination overlap
          <ProductCard isSearchResult={true} key={`${p.variantId}-${index}`} product={p} />
        ))}
      </div>

      {query && products.length === 0 && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          No matches. Try a different search term.
        </p>
      )}

      {/* Invisible target element for the intersection observer */}
      <div ref={observerTarget} className="h-10 w-full mt-4 flex items-center justify-center">
        {isLoading && <Loader2 className="w-6 h-6 animate-spin text-accent" />}
      </div>
    </div>
  );
}
