"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation"; // 1. Import usePathname
import { useProducts } from "@/hooks/useProducts";
import { useDebounce } from "@/hooks/useDebounce";
import SearchInput from "./search-input";
import SearchResultsDropdown from "./search-results-dropdown";

export default function ClientSearchBox() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname(); // 2. Initialize usePathname

  const debouncedQuery = useDebounce(query, 400);
  const isQueryValid = debouncedQuery.length > 1;

  const { data, isFetching, isFetched } = useProducts(
    { search: debouncedQuery },
    { enabled: isQueryValid },
  );

  const results = isQueryValid ? data?.data || [] : [];

  // Handlers
  const handleFocus = () => {
    if (query.length > 1) setIsOpen(true);
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  // 3. Add this effect to close the dropdown on route change
  useEffect(() => {
    setIsOpen(false);
    // setQuery(""); // Optional: Uncomment if you also want to clear the typed text
  }, [pathname]);

  // Side Effects
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsOpen(query.length > 1);
  }, [query]);

  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div ref={searchRef} className="relative w-full z-50">
      <SearchInput
        query={query}
        setQuery={setQuery}
        onSubmit={handleSubmit}
        onFocus={handleFocus}
        onClear={handleClear}
        isFetching={isFetching}
        isQueryValid={isQueryValid}
      />

      <SearchResultsDropdown
        isOpen={isOpen}
        isQueryValid={isQueryValid}
        query={query}
        results={results}
        isFetched={isFetched}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
