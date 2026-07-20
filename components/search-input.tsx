"use client";

import React from "react";
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
  return (
    <form
      onSubmit={onSubmit}
      className="group relative flex items-center gap-2 rounded-full bg-white/5 px-4 py-2.5 ring-1 ring-white/10 focus-within:ring-accent/60 transition w-full"
    >
      <Search className="h-4 w-4 text-white/60 shrink-0" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={onFocus}
        placeholder="Search for smartphones, airbuds, watches..."
        className="w-full bg-transparent text-sm placeholder:text-white/50 focus:outline-none text-white"
      />

      <div className="absolute right-4 flex items-center justify-center">
        {isFetching && isQueryValid ? (
          <Loader2 className="w-4 h-4 animate-spin text-accent" />
        ) : query.length > 0 ? (
          <button type="button" onClick={onClear}>
            <X className="w-4 h-4 text-white/60 hover:text-white transition-colors cursor-pointer" />
          </button>
        ) : null}
      </div>
    </form>
  );
}
