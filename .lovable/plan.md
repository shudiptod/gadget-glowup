
# Gajitto storefront redesign

Rebuild the Gajitto site with the layout and UX of applegadgetsbd.com, keep Gajitto branding (name + green/black logo), and seed products by scraping gajittobd.com. Frontend-only in this pass — cart and checkout are UI + localStorage, no real payments or accounts.

## Visual direction (borrowed from Apple Gadgets)

- Light theme: near-white background (`oklch(0.99 0 0)`), dark near-black surfaces for header/footer, orange accent for prices, deals and "Offers" pill.
- Palette: `background` off-white, `foreground` near-black, `primary` Gajitto green `#B7F441` (from current logo) reserved for CTAs / brand marks, `accent` orange `#F26722` for prices, sale badges, "Offers", section headings gradient. Muted grays for borders.
- Typography: Inter for body, a slightly heavier display face (Manrope) for section titles like "Featured **Categories**" with the second word rendered in the orange→pink→purple gradient (matches reference).
- Radius: 12–14px on cards, 999px on pills.
- Loaded via `<link>` tags in `__root.tsx` (no CSS @import).

Keep the existing Gajitto logo/name in the header — only the layout, spacing and component vocabulary come from the reference.

## Information architecture

Top bar (dark, sticky):
- Gajitto logo (left)
- Wide rounded search input (center)
- Right cluster: Blog · Offers pill · Compare · Cart (with badge) · Account

Category strip (light row below top bar, horizontally scrollable on mobile), tailored to Gajitto's actual inventory:
Smartphones · Airbuds · Watches · Headphones · Wired Earphones · Speakers · Chargers & Adapters · Power Banks · Accessories

Home page sections (mirroring reference):
1. Hero: large carousel (3 slides) + two stacked promo cards on the right at ≥lg.
2. Trust strip: EMI · Fastest Delivery · Exchange · Best Price · After-Sales.
3. Featured Categories: 8-icon grid with circular product-photo tiles + label.
4. Product rails per category (Featured Products, Airbuds, Watches, Wired Earphones, Headphones), each: heading with gradient accent word, "VIEW ALL" link, 4–5 product cards.
5. Full-width "Experience it live" band with dark background image + CTA (kept from Gajitto's own site).
6. Brand logos strip (JBL, Oraimo, Redmi, Titan, Daniel Hechter…).
7. Footer: 4 columns (Shop, Support, Company, Contact) + payment/social row on a dark surface.

Product card: image on light gray tile, small category label, product name (2-line clamp), price in orange, quick "Add to cart" on hover.

## Routes (TanStack Start, file-based under `src/routes/`)

- `index.tsx` — home (replaces the placeholder)
- `collection.tsx` — all products, with sidebar filters (category, price, brand) and grid
- `collection.$slug.tsx` — category listing
- `product.$slug.tsx` — product detail (gallery, price, qty, add to cart, description, specs, related)
- `cart.tsx` — cart with line items, qty controls, subtotal
- `checkout.tsx` — 3-step UI: address → delivery → review; "Place order" shows success toast + clears cart
- `checkout.success.tsx` — thank-you page
- `stores.tsx`, `about.tsx`, `blog.tsx` — simple static pages so the header links resolve
- `search.tsx` — results page for the header search

Shared layout in `__root.tsx`: `<SiteHeader />`, `<CategoryNav />`, `<Outlet />`, `<SiteFooter />`. Head metadata updated to real Gajitto title/description/og.

## Data

Scrape gajittobd.com once at build time (offline, via `code--fetch_website`) and save a curated seed at `src/data/products.ts` with ~40 products covering all categories, using the real images already hosted on Supabase Storage (URLs from the scrape are public and hotlink-safe). Shape:

```ts
type Product = {
  id: string; slug: string; name: string; category: CategorySlug;
  brand: string; price: number; oldPrice?: number; image: string;
  images?: string[]; description: string; specs?: Record<string,string>;
  inStock: boolean;
}
```

Categories, brands, hero slides, and trust items live in sibling `src/data/*.ts` files. No backend, no Cloud in this pass.

## Cart

Zustand store persisted to `localStorage` (`src/stores/cart.ts`) with `items`, `add`, `remove`, `setQty`, `clear`, derived `subtotal`, `count`. Header badge subscribes to `count`. Cart page and checkout read/write via the store.

## Components (new, under `src/components/`)

`site-header.tsx`, `category-nav.tsx`, `site-footer.tsx`, `hero-carousel.tsx` (embla), `promo-card.tsx`, `trust-strip.tsx`, `featured-categories.tsx`, `product-card.tsx`, `product-rail.tsx`, `brand-strip.tsx`, `experience-band.tsx`, `filter-sidebar.tsx`, `cart-drawer.tsx`, `quantity-stepper.tsx`, `price.tsx`, `section-heading.tsx` (renders "Featured **Categories**" with gradient on the second word).

Uses existing shadcn primitives (button, input, sheet for cart drawer, dialog, badge, separator). Install `embla-carousel-react` and `zustand`.

## Technical notes

- Tailwind v4 tokens defined in `src/styles.css` under `@theme` — add `--color-brand`, `--color-price`, `--color-price-foreground`, gradient variables.
- Fonts loaded through `<link>` in `__root.tsx` head (Inter + Manrope from Google Fonts).
- All routes ship real `head()` metadata (title, description, og:title, og:description, og:type, twitter:card). Product route derives `og:image` from the product image.
- Home replaces `src/routes/index.tsx` in place (don't create a sibling).
- Every card/link uses `<Link>` from `@tanstack/react-router` with typed routes.
- Search input on the header navigates to `/search?q=...` (validated with `validateSearch`).
- Placeholder images: use scraped product URLs directly; no image generation needed for products. Hero slides get 3 generated banner images (green/orange/dark themes) via `imagegen`.

## Out of scope (this pass)

Real auth, payments, order persistence, admin, reviews, wishlist backend, blog CMS. Everything ships as polished frontend so we can wire Lovable Cloud in a follow-up if wanted.
