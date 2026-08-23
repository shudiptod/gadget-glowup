"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { IRootCategory } from "@/types/api";

interface CategoryNavClientProps {
  categories: IRootCategory[];
  children: React.ReactNode;
}

export function CategoryNavClient({ categories, children }: CategoryNavClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLUListElement>(null);
  const [visibleCount, setVisibleCount] = useState(9);

  // Convert the passed Server Component items into an array we can slice
  const childrenArray = React.Children.toArray(children);

  const visibleChildren = childrenArray.slice(0, visibleCount);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="absolute left-0 top-0 h-0 w-full overflow-hidden opacity-0 pointer-events-none">
        <ul ref={itemsRef} className="flex w-max whitespace-nowrap gap-1 py-2 text-sm font-medium">
          <li>
            <div className="whitespace-nowrap border border-transparent rounded-full px-3 py-1.5 text-muted-foreground hover:border-accent hover:text-accent">
              View All
            </div>
          </li>
          {categories.map((c: any) => (
            <li key={`measure-${c.slug}`}>
              {/* Ensure this dummy element matches the internal padding of CategoryNavItem */}
              <div className="whitespace-nowrap border border-transparent rounded-full px-3 py-1.5 text-muted-foreground hover:border-accent hover:text-accent">
                {c.name || c.title || "Category"}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ACTUAL VISIBLE NAV */}
      <ul className="flex items-center gap-0.5 py-2 text-sm font-medium justify-between">
        {visibleChildren}
      </ul>
    </div>
  );
}
