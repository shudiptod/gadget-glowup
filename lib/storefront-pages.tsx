"use client";

import { formatBDT } from "./utils";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  MapPin,
  Phone,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  CheckCircle2,
  ShoppingCart,
  Truck,
  Repeat,
  ShieldCheck,
  CheckCircle2 as CheckCircle,
  MessageCircle,
  GitCompareArrows,
  Share2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { products, byCategory, bySlug } from "../data/products";
import { categories, categoryMap, type CategorySlug } from "../data/categories";
import { SectionHeading } from "../components/section-heading";
import { ProductCard } from "../components/product-card";
import { useCartAction } from "@/hooks/useCartAction";

export function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-3xl font-extrabold md:text-5xl">About Gajitto</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground md:text-base">
        <p>
          Gajitto is a Bangladeshi consumer-tech retailer bringing together the best of everyday
          gadgets — smartphones, wireless audio, wearables, and smart accessories — under one roof.
        </p>
        <p>
          We partner directly with brands like Oraimo, JBL, Xiaomi, Titan and Daniel Hechter so you
          get authentic products, official warranty and after-sales support.
        </p>
        <p>
          Whether you're upgrading your daily driver, gifting a smartwatch, or replacing a pair of
          earbuds, our team is here to help — online and at our experience centers.
        </p>
      </div>
    </div>
  );
}

export function BlogPage() {
  const posts = [
    {
      title: "Buying your first pair of TWS earbuds",
      excerpt: "What to check before you swipe.",
      tag: "Guide",
    },
    {
      title: "Smartphone battery care in 2026",
      excerpt: "Habits that keep your phone lasting longer.",
      tag: "Tips",
    },
    {
      title: "AMOLED vs LCD smartwatches",
      excerpt: "Which display suits your daily use?",
      tag: "Compare",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold md:text-4xl">Gajitto Blog</h1>
      <p className="mt-2 text-sm text-muted-foreground">Guides, reviews and gadget news.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {posts.map((p) => (
          <article
            key={p.title}
            className="rounded-2xl border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="inline-flex rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
              {p.tag}
            </span>
            <h2 className="mt-3 font-display text-lg font-bold">{p.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

// export function CollectionPage() {
//   const [maxPrice, setMaxPrice] = useState(50000);
//   const [selectedCats, setSelectedCats] = useState<string[]>([]);

//   const filtered = useMemo(() => {
//     return products.filter((p) => {
//       if (p.price > maxPrice) return false;
//       if (selectedCats.length && !selectedCats.includes(p.category)) return false;
//       return true;
//     });
//   }, [maxPrice, selectedCats]);

//   return (
//     <div className="mx-auto max-w-7xl px-4 py-8">
//       <h1 className="font-display text-3xl font-extrabold">All Products</h1>
//       <p className="mt-1 text-sm text-muted-foreground">{filtered.length} products</p>

//       <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
//         <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
//           <div className="rounded-xl border p-4">
//             <h3 className="text-sm font-semibold">Category</h3>
//             <ul className="mt-3 space-y-2 text-sm">
//               {categories.map((c) => (
//                 <li key={c.slug}>
//                   <label className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={selectedCats.includes(c.slug)}
//                       onChange={(e) =>
//                         setSelectedCats((prev) =>
//                           e.target.checked ? [...prev, c.slug] : prev.filter((s) => s !== c.slug),
//                         )
//                       }
//                     />
//                     {c.name}
//                   </label>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="rounded-xl border p-4">
//             <h3 className="text-sm font-semibold">Max price</h3>
//             <input
//               type="range"
//               min={500}
//               max={50000}
//               step={500}
//               value={maxPrice}
//               onChange={(e) => setMaxPrice(Number(e.target.value))}
//               className="mt-3 w-full accent-[color:var(--accent)]"
//             />
//             <p className="mt-2 text-sm text-muted-foreground">Up to ৳{maxPrice.toLocaleString()}</p>
//           </div>

//           <Link
//             href="/collection"
//             className="block text-center text-xs text-muted-foreground hover:underline"
//           >
//             Reset filters
//           </Link>
//         </aside>

//         <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
//           {filtered.map((p) => (
//             <ProductCard key={p.id} product={p} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export function CategoryPage({ slug }: { slug: string }) {
//   const cat = categoryMap[slug as CategorySlug];
//   const list = cat ? byCategory(cat.slug) : [];
//   const fallback = list.length === 0 ? products.slice(0, 8) : list;

//   if (!cat) {
//     return (
//       <div className="mx-auto max-w-3xl px-4 py-16 text-center">
//         <h1 className="font-display text-3xl font-extrabold">Category not found</h1>
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto max-w-7xl px-4 py-8">
//       <h1 className="font-display text-3xl font-extrabold md:text-4xl">{cat.name}</h1>
//       <p className="mt-1 text-sm text-muted-foreground">{fallback.length} products</p>

//       <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
//         {fallback.map((p) => (
//           <ProductCard key={p.id} product={p} />
//         ))}
//       </div>
//     </div>
//   );
// }

export function SuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/20 text-brand-foreground">
        <CheckCircle2 className="h-9 w-9 text-[color:var(--brand)]" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-extrabold md:text-4xl">
        Thanks for your order!
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We've received your order. Our team will call you to confirm within the next few hours.
      </p>
      <Link
        href="/collection"
        className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:brightness-110"
      >
        Continue shopping
      </Link>
    </div>
  );
}

export function StoresPage() {
  const stores = [
    { name: "Gajitto Gulshan", address: "Road 11, Gulshan 1, Dhaka", phone: "09666-777-001" },
    {
      name: "Gajitto Dhanmondi",
      address: "Mirpur Road, Dhanmondi 27, Dhaka",
      phone: "09666-777-002",
    },
    { name: "Gajitto Uttara", address: "Sector 3, Uttara, Dhaka", phone: "09666-777-003" },
    { name: "Gajitto Chattogram", address: "GEC Circle, Chattogram", phone: "09666-777-004" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold md:text-4xl">Our Stores</h1>
      <p className="mt-2 text-sm text-muted-foreground">Visit us to try before you buy.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {stores.map((s) => (
          <div key={s.name} className="rounded-2xl border bg-card p-5">
            <h2 className="font-display text-lg font-bold">{s.name}</h2>
            <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 text-accent" /> {s.address}
            </p>
            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 text-accent" /> {s.phone}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
