// components/mobile-drawer.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function MobileDrawer({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-full bg-white/5 p-2.5 hover:bg-white/10 transition-colors min-[1280px]:hidden"
        aria-label="Menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Dark Overlay Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Slide-in Drawer */}
          <div className="relative z-50 flex h-full w-4/5 max-w-sm flex-col bg-background shadow-xl animate-in slide-in-from-right overflow-y-auto">
            <div className="flex items-center justify-between border-b p-4 text-foreground">
              <span className="font-semibold">Menu</span>
              <button onClick={() => setIsOpen(false)} className="rounded-full p-2 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Click interceptor to auto-close drawer when a link is clicked */}
            <div
              className="flex flex-col p-4"
              onClick={(e) => {
                if ((e.target as HTMLElement).tagName === "A") setIsOpen(false);
              }}
            >
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
