"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, Search } from "lucide-react";
import apiClient from "@/lib/apiClient";

export function TopSearchedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch top searched products on mount
    apiClient
      .get("/search/log")
      .then((res: any) => {
        // Adjust this if your API wraps the array in a 'data' object (e.g., res.data.data)
        setProducts(res.data?.data || res.data || []);
      })
      .catch((e) => {
        console.error("Failed to fetch trending products:", e);
        setProducts([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading || !products || products.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col pt-4">
      <div className="flex items-center gap-2 mb-2 px-4 pt-4 border-t border-white/5 lg:border-t-0 lg:pt-0">
        <TrendingUp className="w-4 h-4 text-accent" />
        <h3 className="font-medium text-sm text-foreground/80">Trending Searches</h3>
      </div>

      {/* Changed from grid to a vertical list for text links */}
      <div className="flex flex-col px-2 pb-4">
        {products.map((product: any) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`} // Adjust this route to match your app's structure
            className="flex items-center gap-3 px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-white/5 rounded-md transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 opacity-50" />
            <span className="truncate">{product.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
