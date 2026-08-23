"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";

interface SearchInputProps {
  query: string;
  setQuery: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onFocus: () => void;
  onClear: () => void;
  isFetching: boolean;
  isQueryValid: boolean;
}

export default function SearchInput({
  query,
  setQuery,
  onSubmit,
  onFocus,
  onClear,
  isFetching,
  isQueryValid,
}: SearchInputProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Manage tooltip delay
  useEffect(() => {
    // If query is exactly 1 character, start a timer to show the tooltip
    if (query.length === 1) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, 1000); // 1000ms = 1 second delay

      return () => clearTimeout(timer); // Cleanup timer if user keeps typing
    } else {
      // If query is 0 or >= 2, immediately hide the tooltip
      setShowTooltip(false);
    }
  }, [query]);

  return (
    <form
      onSubmit={onSubmit}
      className="group relative flex w-full items-center gap-2 rounded-full bg-white/5 px-4 py-2.5 transition ring-1 ring-white/10 focus-within:ring-accent/60"
    >
      <Search className="h-4 w-4 shrink-0 text-white/60" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value.trim())}
        onFocus={onFocus}
        placeholder="Search for smartphones, airbuds, watches..."
        className="w-full bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
      />

      <div className="absolute right-4 flex items-center justify-center">
        {isFetching && isQueryValid ? (
          <Loader2 className="h-4 w-4 animate-spin text-accent" />
        ) : query.length > 0 ? (
          <button type="button" onClick={onClear}>
            <X className="h-4 w-4 cursor-pointer text-white/60 transition-colors hover:text-white" />
          </button>
        ) : null}
      </div>

      {/* Tooltip with delayed appearance */}
      {showTooltip && (
        <div className="absolute left-6 top-full z-50 mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="absolute -top-1.5 left-4 h-3 w-3 rotate-45 border-l border-t border-white/10 bg-neutral-900" />
          <div className="relative rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-xs text-white/80 shadow-xl">
            Please enter at least 2 characters
          </div>
        </div>
      )}
    </form>
  );
}
