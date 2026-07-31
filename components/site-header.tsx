// components/site-header.tsx
import Link from "next/link";
import { User } from "lucide-react";
import { GajittoLogo } from "./gajitto-logo";
import ClientSearchBox from "./client-search-box";
import { CartButton } from "./cart-button"; // <-- Import new cart button
import { MobileDrawer } from "./mobile-drawer"; // <-- Import new drawer
import { MobileNavItem } from "./mobile-nav-item"; // <-- Import new mobile item
import apiClient from "@/lib/apiClient";
import { IRootCollectionListResponse, IRootCategory } from "@/types/api";

async function getRootCategories() {
  try {
    return await apiClient.get<IRootCollectionListResponse>(`/products/roots`);
  } catch (error) {
    console.error("Failed to fetch roots:", error);
    return { success: false, data: [] as IRootCategory[] };
  }
}

export async function SiteHeader() {
  // Fetch roots server-side for the mobile drawer
  const { data: categories } = await getRootCategories();

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
          {/* Extracted Cart Logic */}
          <CartButton />

          {/* <button
            className="rounded-full bg-white/5 p-2.5 hover:bg-white/10 transition-colors hover:text-accent cursor-pointer"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </button> */}

          {/* The New Mobile Drawer */}
          <MobileDrawer>
            {/* Standard Links */}
            <div className="mb-2 flex flex-col border-b border-border/50 pb-2">
              <Link
                href="/blog"
                className="block py-3 text-sm text-foreground hover:text-accent font-medium"
              >
                Blog
              </Link>
              <Link
                href="/service"
                className="block py-3 text-sm text-foreground hover:text-accent font-medium"
              >
                Service
              </Link>
            </div>

            {/* Dynamic Categories */}
            <h3 className="mb-1 mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Categories
            </h3>

            <Link
              href="/collection"
              className="block py-3 text-sm border-b border-border/50 text-muted-foreground hover:text-accent"
            >
              View All
            </Link>

            {/* Render the nested Server Components inside the Client Drawer */}
            {categories.map((c) => (
              <MobileNavItem key={c.slug} category={c} />
            ))}
          </MobileDrawer>
        </div>
      </div>
    </header>
  );
}
