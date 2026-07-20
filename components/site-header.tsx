import Link from "next/link";
import { ShoppingCart, User, Menu } from "lucide-react";
import { GajittoLogo } from "./gajitto-logo";
import apiClient from "@/lib/apiClient";
import { ICartResponse } from "@/hooks/useCart";
import ClientSearchBox from "./client-search-box";

async function getCart() {
  try {
    return await apiClient.get<ICartResponse>("/cart");
  } catch {
    return { totalQuantity: 0 };
  }
}

export async function SiteHeader() {
  const { totalQuantity } = await getCart();
  console.log(totalQuantity);

  return (
    <header className="sticky top-0 z-40 bg-surface text-surface-foreground border-b border-white/5">
      <div className="mx-auto flex flex-wrap items-center justify-between gap-y-3 gap-x-4 px-4 py-3 max-w-7xl lg:flex-nowrap lg:gap-6 lg:py-4">
        <Link href="/" className="shrink-0 order-1">
          <GajittoLogo className="h-9 w-auto" />
        </Link>
        <div className="w-full order-3 lg:order-2 lg:flex-1 lg:max-w-2xl">
          <ClientSearchBox />
        </div>
        <nav className="hidden items-center gap-6 text-sm lg:flex lg:order-3">
          <Link href="/blog" className="hover:text-accent transition-colors">
            Blog
          </Link>
          <Link href="/service" className="hover:text-accent transition-colors">
            Service
          </Link>
        </nav>

        <div className="flex items-center gap-2 order-2 lg:order-4 shrink-0">
          <Link
            href="/cart"
            className="relative rounded-full bg-white/5 p-2.5 hover:bg-white/10 transition-colors hover:text-accent"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalQuantity > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-accent-foreground shadow-sm">
                {totalQuantity}
              </span>
            )}
          </Link>
          <button
            className="rounded-full bg-white/5 p-2.5 hover:bg-white/10 transition-colors hover:text-accent cursor-pointer"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </button>
          <button
            className="rounded-full bg-white/5 p-2.5 hover:bg-white/10 transition-colors lg:hidden"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
