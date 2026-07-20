"use client";

import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import SearchResultItem from "./search-result-item";
import { ProductCard } from "./product-card";

interface SearchResultsDropdownProps {
  isOpen: boolean;
  isQueryValid: boolean;
  query: string;
  results: any[];
  isFetched: boolean;
  onClose: () => void;
}

export default function SearchResultsDropdown({
  isOpen,
  isQueryValid,
  query,
  results,
  isFetched,
  onClose,
}: SearchResultsDropdownProps) {
  if (!isOpen || !isQueryValid) return null;

  return (
    <div className="absolute top-full lg:mt-3 mt-4 lg:w-200 w-[calc(100vw-32px)] left-0 bg-background border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <h3 className="font-semibold text-lg text-foreground">Products</h3>
        {results.length > 0 && (
          <Link
            href={`/search?q=${encodeURIComponent(query)}`}
            onClick={onClose}
            className="text-sm text-accent hover:text-accent/80 flex items-center gap-1 transition-colors"
          >
            View all results <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Product Grid Area */}
      <div className="p-4 lg:max-h-[60vh] max-h-[70vh] overflow-y-auto custom-scrollbar">
        {results.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((product) => (
              <ProductCard key={product.variantId} product={product} />
            ))}
          </div>
        ) : isFetched ? (
          <div className="py-12 text-center text-white/50 flex flex-col items-center">
            <Search className="w-10 h-10 mb-3 opacity-20" />
            <p>No products found for &quot;{query}&quot;</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
