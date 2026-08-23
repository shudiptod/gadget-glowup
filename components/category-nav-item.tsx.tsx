"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { ICollection, ICollectionListResponse, IRootCategory } from "@/types/api";

// Helper function to fetch data client-side
async function fetchSubcategories(slug: string) {
  try {
    const res = await apiClient.get<ICollectionListResponse>(`/products/categories/${slug}`);
    return Array.isArray(res.data) ? res.data : (res.data as any)?.children || [];
  } catch (error) {
    return [];
  }
}

export function CategoryNavItem({ category }: { category: IRootCategory }) {
  const [children, setChildren] = useState<ICollection[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [openLeft, setOpenLeft] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fetch children on mount
  useEffect(() => {
    fetchSubcategories(category.slug).then((data) => {
      setChildren(data);
      setIsLoaded(true);
    });
  }, [category.slug]);

  // Detect viewport overflow on hover
  const handleMouseEnter = () => {
    requestAnimationFrame(() => {
      if (!menuRef.current) return;
      const rect = menuRef.current.getBoundingClientRect();
      // If right edge of the menu exceeds window width (with 15px buffer)
      if (!openLeft && rect.right > window.innerWidth - 15) {
        setOpenLeft(true);
      }
    });
  };

  const hasChildren = children.length > 0;

  if (!isLoaded) {
    // Render a non-interactive skeleton/fallback while checking for children
    return <li className="px-3 py-1.5 text-transparent">...</li>;
  }

  if (!hasChildren || category.id === "all-collection") {
    return (
      <li>
        <Link
          href={`/collection/${category.slug}`}
          className="whitespace-nowrap rounded-full border border-transparent px-3 py-1.5 text-muted-foreground hover:border-accent hover:text-accent"
        >
          {category.name}
        </Link>
      </li>
    );
  }

  return (
    <li className="group relative" onMouseEnter={handleMouseEnter}>
      <Link
        href={`/collection/${category.slug}`}
        className="flex items-center gap-1 whitespace-nowrap rounded-full border border-transparent px-3 py-1.5 text-muted-foreground transition-colors hover:border-accent hover:text-accent group-hover:text-accent"
      >
        {category.name}
        <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
      </Link>

      {/* Root Dropdown Menu */}
      <div
        ref={menuRef}
        className={`absolute top-full z-50 hidden w-48 pt-2 group-hover:block ${
          openLeft ? "right-0" : "left-0"
        }`}
      >
        <ul className="flex flex-col gap-1 rounded-md border bg-background p-2 shadow-md">
          {children.map((child: ICollection) => (
            <SubCategoryItem key={child.slug} item={child} parentOpenLeft={openLeft} />
          ))}
        </ul>
      </div>
    </li>
  );
}

// Recursive Client Component for deep nesting
function SubCategoryItem({ item, parentOpenLeft }: { item: ICollection; parentOpenLeft: boolean }) {
  const [nestedChildren, setNestedChildren] = useState<ICollection[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [openLeft, setOpenLeft] = useState(parentOpenLeft);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync state if the parent gets forced to flip after this child already mounted
  useEffect(() => {
    setOpenLeft(parentOpenLeft);
  }, [parentOpenLeft]);

  useEffect(() => {
    fetchSubcategories(item.slug).then((data) => {
      setNestedChildren(data);
      setIsLoaded(true);
    });
  }, [item.slug]);

  const handleMouseEnter = () => {
    requestAnimationFrame(() => {
      if (!menuRef.current) return;
      const rect = menuRef.current.getBoundingClientRect();
      if (!openLeft && rect.right > window.innerWidth - 15) {
        setOpenLeft(true);
      }
    });
  };

  const hasNestedChildren = nestedChildren.length > 0;

  if (!isLoaded) {
    return <li className="px-3 py-1.5 text-sm text-muted-foreground/50">{item.name}</li>;
  }

  if (!hasNestedChildren) {
    return (
      <li>
        <Link
          href={`/collection/${item.slug}`}
          className="block w-full rounded-sm px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/5 hover:text-accent"
        >
          {item.name}
        </Link>
      </li>
    );
  }

  return (
    <li className="group/sub relative" onMouseEnter={handleMouseEnter}>
      <Link
        href={`/collection/${item.slug}`}
        className="flex w-full items-center justify-between rounded-sm px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/5 hover:text-accent group-hover/sub:text-accent"
      >
        <span>{item.name}</span>
        {/* Icon always stays on the right side */}
        <ChevronRight className="h-3 w-3" />
      </Link>

      {/* Nested Flyout Menu */}
      <div
        ref={menuRef}
        className={`absolute top-0 z-50 hidden w-48 group-hover/sub:block ${
          openLeft ? "right-full pr-2" : "left-full pl-2"
        }`}
      >
        <ul className="flex flex-col gap-1 rounded-md border bg-background p-2 shadow-md">
          {nestedChildren.map((child: ICollection) => (
            <SubCategoryItem key={child.slug} item={child} parentOpenLeft={openLeft} />
          ))}
        </ul>
      </div>
    </li>
  );
}
