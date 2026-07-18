import { Link } from "@tanstack/react-router";
import { Search, ShoppingCart, User, Heart, Menu } from "lucide-react";
import { useCart, cartCount } from "@/stores/cart";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { GajittoLogo } from "./gajitto-logo";

export function SiteHeader() {
  const items = useCart((s) => s.items);
  const count = cartCount(items);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/search", search: { q } });
  };

  return (
    <header className="sticky top-0 z-40 bg-surface text-surface-foreground">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:gap-6 lg:py-4">
        <Link to="/" className="shrink-0">
          <GajittoLogo className="h-9 w-auto" />
        </Link>

        <form onSubmit={submit} className="flex-1 max-w-2xl">
          <div className="group flex items-center gap-2 rounded-full bg-white/5 px-4 py-2.5 ring-1 ring-white/10 focus-within:ring-accent/60 transition">
            <Search className="h-4 w-4 text-white/60" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for smartphones, airbuds, watches..."
              className="w-full bg-transparent text-sm placeholder:text-white/50 focus:outline-none"
            />
          </div>
        </form>

        <nav className="hidden items-center gap-6 text-sm lg:flex">
          <Link to="/blog" className="hover:text-brand">Blog</Link>
          <Link to="/collection" className="hover:text-brand">Pre-order</Link>
          <Link
            to="/collection"
            className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1 text-accent hover:bg-accent/25"
          >
            🎁 Offers
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative rounded-full bg-white/5 p-2.5 hover:bg-white/10">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-accent-foreground">
                {count}
              </span>
            )}
          </Link>
          <button className="rounded-full bg-white/5 p-2.5 hover:bg-white/10" aria-label="Account">
            <User className="h-5 w-5" />
          </button>
          <button className="rounded-full bg-white/5 p-2.5 hover:bg-white/10 lg:hidden" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
