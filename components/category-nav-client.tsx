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
  const [visibleCount, setVisibleCount] = useState(categories.length);

  // Convert the passed Server Component items into an array we can slice
  const childrenArray = React.Children.toArray(children);
  useEffect(() => {
    // 1. Grab the current element and check if it exists
    const currentContainer = containerRef.current;
    if (!currentContainer || !itemsRef.current) return;

    const updateLayout = () => {
      // (Your existing updateLayout logic stays exactly the same here)
      const containerWidth = currentContainer.clientWidth;
      const listItems = Array.from(itemsRef.current!.children) as HTMLElement[];

      if (listItems.length === 0) return;

      let currentWidth = listItems[0].offsetWidth;
      const MORE_BTN_WIDTH = 110;
      let newVisibleCount = childrenArray.length;

      for (let i = 1; i <= childrenArray.length; i++) {
        const itemWidth = listItems[i]?.offsetWidth || 0;
        if (currentWidth + itemWidth + MORE_BTN_WIDTH > containerWidth) {
          newVisibleCount = i - 1;
          break;
        }
        currentWidth += itemWidth + 2;
      }

      let totalWidth = listItems[0].offsetWidth;
      for (let i = 1; i <= childrenArray.length; i++) {
        totalWidth += (listItems[i]?.offsetWidth || 0) + 2;
      }
      if (totalWidth <= containerWidth) {
        newVisibleCount = childrenArray.length;
      }

      setVisibleCount(newVisibleCount);
    };

    const observer = new ResizeObserver(() => updateLayout());

    // 2. Safely observe the element since we verified it isn't null
    observer.observe(currentContainer);
    updateLayout();

    return () => observer.disconnect();
  }, [childrenArray.length]);

  const visibleChildren = childrenArray.slice(0, visibleCount);
  const hiddenChildren = childrenArray.slice(visibleCount);

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

        {/* {hiddenChildren.length > 0 && (
          <li className="relative group shrink-0">
            <button className="flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-1.5 hover:bg-muted">
              More <ChevronDown className="h-4 w-4" />
            </button>
            <ul className="absolute right-0 top-full z-50 hidden pt-2 group-hover:block">
              <div className="rounded-md border bg-background p-2 shadow-md flex flex-col gap-2 min-w-[200px]">
                {hiddenChildren}
              </div>
            </ul>
          </li>
        )} */}
      </ul>
    </div>
  );
}
