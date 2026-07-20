// "use client";

// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useMemo, useState } from "react";
// import {
//   MapPin,
//   Phone,
//   Minus,
//   Plus,
//   Trash2,
//   ShoppingBag,
//   CheckCircle2,
//   ShoppingCart,
//   Truck,
//   Repeat,
//   ShieldCheck,
//   CheckCircle2 as CheckCircle,
//   MessageCircle,
//   GitCompareArrows,
//   Share2,
//   Zap,
// } from "lucide-react";
// import { toast } from "sonner";
// import { products, byCategory, bySlug } from "../data/products";
// import { categories, categoryMap, type CategorySlug } from "../data/categories";
// import { SectionHeading } from "../components/section-heading";
// import { ProductCard } from "../components/product-card";
// import { useCartAction } from "@/hooks/useCartAction";

// export function AboutPage() {
//   return (
//     <div className="mx-auto max-w-3xl px-4 py-14">
//       <h1 className="font-display text-3xl font-extrabold md:text-5xl">About Gajitto</h1>
//       <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground md:text-base">
//         <p>
//           Gajitto is a Bangladeshi consumer-tech retailer bringing together the best of everyday
//           gadgets — smartphones, wireless audio, wearables, and smart accessories — under one roof.
//         </p>
//         <p>
//           We partner directly with brands like Oraimo, JBL, Xiaomi, Titan and Daniel Hechter so you
//           get authentic products, official warranty and after-sales support.
//         </p>
//         <p>
//           Whether you're upgrading your daily driver, gifting a smartwatch, or replacing a pair of
//           earbuds, our team is here to help — online and at our experience centers.
//         </p>
//       </div>
//     </div>
//   );
// }

// export function BlogPage() {
//   const posts = [
//     {
//       title: "Buying your first pair of TWS earbuds",
//       excerpt: "What to check before you swipe.",
//       tag: "Guide",
//     },
//     {
//       title: "Smartphone battery care in 2026",
//       excerpt: "Habits that keep your phone lasting longer.",
//       tag: "Tips",
//     },
//     {
//       title: "AMOLED vs LCD smartwatches",
//       excerpt: "Which display suits your daily use?",
//       tag: "Compare",
//     },
//   ];

//   return (
//     <div className="mx-auto max-w-5xl px-4 py-10">
//       <h1 className="font-display text-3xl font-extrabold md:text-4xl">Gajitto Blog</h1>
//       <p className="mt-2 text-sm text-muted-foreground">Guides, reviews and gadget news.</p>

//       <div className="mt-8 grid gap-4 md:grid-cols-3">
//         {posts.map((p) => (
//           <article
//             key={p.title}
//             className="rounded-2xl border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md"
//           >
//             <span className="inline-flex rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
//               {p.tag}
//             </span>
//             <h2 className="mt-3 font-display text-lg font-bold">{p.title}</h2>
//             <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
//           </article>
//         ))}
//       </div>
//     </div>
//   );
// }

// export function CartPage() {
//   // const items = useCart((s) => s.items);
//   // const setQty = useCart((s) => s.setQty);
//   // const remove = useCart((s) => s.remove);
//   // const subtotal = cartSubtotal(items);
//   // const shipping = items.length ? 80 : 0;

//   // if (items.length === 0) {
//   //   return (
//   //     <div className="mx-auto max-w-2xl px-4 py-20 text-center">
//   //       <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
//   //         <ShoppingBag className="h-8 w-8 text-muted-foreground" />
//   //       </div>
//   //       <h1 className="mt-6 font-display text-3xl font-extrabold">Your cart is empty</h1>
//   //       <p className="mt-2 text-sm text-muted-foreground">
//   //         Discover the latest gadgets and add your favorites.
//   //       </p>
//   //       <Link
//   //         href="/collection"
//   //         className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:brightness-110"
//   //       >
//   //         Start shopping
//   //       </Link>
//   //     </div>
//   //   );
//   // }

//   // return (
//   //   <div className="mx-auto max-w-7xl px-4 py-8">
//   //     <h1 className="font-display text-3xl font-extrabold">Your Cart</h1>

//   //     <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
//   //       <ul className="divide-y rounded-2xl border bg-card">
//   //         {items.map((i) => (
//   //           <li key={i.id} className="flex gap-4 p-4">
//   //             <Link
//   //               href={`/product/${i.slug}`}
//   //               className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted"
//   //             >
//   //               <img src={i.image} alt={i.name} className="h-full w-full object-contain p-2" />
//   //             </Link>
//   //             <div className="flex flex-1 flex-col">
//   //               <Link
//   //                 href={`/product/${i.slug}`}
//   //                 className="line-clamp-2 text-sm font-medium hover:text-accent"
//   //               >
//   //                 {i.name}
//   //               </Link>
//   //               <span className="mt-1 text-sm font-bold text-[color:var(--price)]">
//   //                 {formatBDT(i.price)}
//   //               </span>
//   //               <div className="mt-auto flex items-center justify-between pt-3">
//   //                 <div className="flex items-center rounded-full border">
//   //                   <button
//   //                     onClick={() => setQty(i.id, i.qty - 1)}
//   //                     className="p-1.5"
//   //                     aria-label="Decrease"
//   //                   >
//   //                     <Minus className="h-3.5 w-3.5" />
//   //                   </button>
//   //                   <span className="w-8 text-center text-sm font-semibold">{i.qty}</span>
//   //                   <button
//   //                     onClick={() => setQty(i.id, i.qty + 1)}
//   //                     className="p-1.5"
//   //                     aria-label="Increase"
//   //                   >
//   //                     <Plus className="h-3.5 w-3.5" />
//   //                   </button>
//   //                 </div>
//   //                 <button
//   //                   onClick={() => remove(i.id)}
//   //                   className="text-xs text-muted-foreground hover:text-destructive"
//   //                   aria-label="Remove"
//   //                 >
//   //                   <Trash2 className="h-4 w-4" />
//   //                 </button>
//   //               </div>
//   //             </div>
//   //           </li>
//   //         ))}
//   //       </ul>

//   //       <aside className="h-fit rounded-2xl border bg-card p-5 lg:sticky lg:top-24">
//   //         <h2 className="text-sm font-semibold">Order summary</h2>
//   //         <dl className="mt-4 space-y-2 text-sm">
//   //           <div className="flex justify-between">
//   //             <dt className="text-muted-foreground">Subtotal</dt>
//   //             <dd>{formatBDT(subtotal)}</dd>
//   //           </div>
//   //           <div className="flex justify-between">
//   //             <dt className="text-muted-foreground">Shipping</dt>
//   //             <dd>{formatBDT(shipping)}</dd>
//   //           </div>
//   //           <div className="mt-3 flex justify-between border-t pt-3 text-base font-bold">
//   //             <dt>Total</dt>
//   //             <dd className="text-[color:var(--price)]">{formatBDT(subtotal + shipping)}</dd>
//   //           </div>
//   //         </dl>
//   //         <Link
//   //           href="/checkout"
//   //           className="mt-5 flex w-full items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground hover:brightness-110"
//   //         >
//   //           Proceed to checkout →
//   //         </Link>
//   //       </aside>
//   //     </div>
//   //   </div>
//   // );
//   return <div></div>;
// }

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

// export function ProductPage({ slug }: { slug: string }) {
//   const product = bySlug.get(slug);
//   const router = useRouter();
//   const { handleAddToCart, isPending, isAddDisabled, isSuccess, isError } = useCartAction({
//     productId: product.productId,
//     variantId: product.variantId,
//     maxStock: product.stock,
//     isProductInStock: product.stock > 0,
//   });
//   const [qty, setQty] = useState(1);
//   const [tab, setTab] = useState<"spec" | "desc" | "warranty">("spec");
//   const [activeImg, setActiveImg] = useState(0);

//   if (!product) {
//     return (
//       <div className="mx-auto max-w-3xl px-4 py-16 text-center">
//         <h1 className="font-display text-3xl font-extrabold">Product not found</h1>
//         <Link href="/collection" className="mt-4 inline-block text-accent hover:underline">
//           Back to shop
//         </Link>
//       </div>
//     );
//   }

//   const catSlug = product.category as CategorySlug;
//   const cat = categoryMap[catSlug];
//   const related = byCategory(catSlug)
//     .filter((p) => p.id !== product.id)
//     .slice(0, 5);
//   const gallery = [product.image, product.image, product.image, product.image];
//   const code = `GJT-${product.id
//     .replace(/[^a-z0-9]/gi, "")
//     .toUpperCase()
//     .slice(-6)}`;

//   const handleAdd = () => {
//     add(product, qty);
//     toast.success("Added to cart", { description: `${qty} × ${product.name}` });
//   };

//   const handleBuyNow = () => {
//     add(product, qty);
//     router.push("/checkout");
//   };

//   return (
//     <div className="mx-auto max-w-7xl px-4 py-6">
//       <nav className="text-xs text-muted-foreground">
//         <Link href="/" className="hover:text-foreground">
//           Home
//         </Link>
//         <span className="mx-1.5">/</span>
//         <Link href={`/collection/${cat.slug}`} className="hover:text-foreground">
//           {cat.name}
//         </Link>
//         <span className="mx-1.5">/</span>
//         <span className="text-foreground">{product.brand}</span>
//       </nav>

//       <div className="mt-5 grid gap-8 lg:grid-cols-[1.05fr_1fr]">
//         <div>
//           <div className="overflow-hidden rounded-2xl border bg-card">
//             <div className="aspect-square">
//               <img
//                 src={gallery[activeImg]}
//                 alt={product.name}
//                 className="h-full w-full object-contain p-10"
//               />
//             </div>
//           </div>
//           <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar">
//             {gallery.map((src, i) => (
//               <button
//                 key={i}
//                 onClick={() => setActiveImg(i)}
//                 className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-card p-2 transition ${activeImg === i ? "border-accent ring-2 ring-accent/30" : "hover:border-foreground/30"}`}
//                 aria-label={`View image ${i + 1}`}
//               >
//                 <img src={src} alt="" className="h-full w-full object-contain" />
//               </button>
//             ))}
//           </div>
//         </div>

//         <div>
//           <div className="flex items-start justify-between gap-4">
//             <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
//               {product.brand}
//             </span>
//             <button
//               type="button"
//               className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
//               onClick={() => toast("Added to compare", { description: product.name })}
//             >
//               <GitCompareArrows className="h-4 w-4" /> Add to Compare
//             </button>
//           </div>

//           <h1 className="mt-3 font-display text-2xl font-extrabold leading-tight md:text-3xl">
//             {product.name}
//           </h1>

//           <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-2">
//             <div className="flex items-baseline gap-2">
//               <span className="text-3xl font-extrabold text-[color:var(--price)]">
//                 {formatBDT(product.price)}
//               </span>
//               <span className="text-sm text-muted-foreground">(Cash Price)</span>
//             </div>
//             {product.oldPrice && (
//               <span className="text-sm text-muted-foreground line-through">
//                 {formatBDT(product.oldPrice)}
//               </span>
//             )}
//           </div>

//           <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-b py-3 text-sm">
//             <div className="flex items-center gap-1.5">
//               <span className="font-semibold">Availability:</span>
//               <span className="inline-flex items-center gap-1 text-emerald-600">
//                 <CheckCircle className="h-4 w-4" />
//                 {product.inStock ? "In Stock" : "Out of Stock"}
//               </span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <span className="font-semibold">Code:</span>
//               <span className="text-muted-foreground">{code}</span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <span className="font-semibold">Category:</span>
//               <Link href={`/collection/${cat.slug}`} className="text-accent hover:underline">
//                 {cat.name}
//               </Link>
//             </div>
//           </div>

//           <div className="mt-5">
//             <div className="text-sm font-semibold">Select Quantity:</div>
//             <div className="mt-2 inline-flex items-center rounded-full border bg-card">
//               <button
//                 className="p-2.5"
//                 onClick={() => setQty((q) => Math.max(1, q - 1))}
//                 aria-label="Decrease"
//               >
//                 <Minus className="h-4 w-4" />
//               </button>
//               <span className="w-10 text-center text-sm font-semibold">{qty}</span>
//               <button className="p-2.5" onClick={() => setQty((q) => q + 1)} aria-label="Increase">
//                 <Plus className="h-4 w-4" />
//               </button>
//             </div>
//           </div>

//           <div className="mt-5 grid gap-3 sm:grid-cols-2">
//             <button
//               onClick={handleBuyNow}
//               className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition hover:brightness-110"
//             >
//               <Zap className="h-4 w-4" /> Shop Now
//             </button>
//             <button
//               onClick={handleAdd}
//               className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-foreground/15 bg-card px-6 py-3 text-sm font-semibold hover:border-accent hover:text-accent"
//             >
//               <ShoppingCart className="h-4 w-4" /> Add To Cart
//             </button>
//           </div>

//           <a
//             href={`https://wa.me/?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}`)}`}
//             target="_blank"
//             rel="noreferrer"
//             className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-50 px-6 py-3 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100"
//           >
//             <MessageCircle className="h-4 w-4" /> Chat on Whatsapp
//           </a>

//           <div className="mt-4 flex items-center gap-3 rounded-xl border bg-card px-4 py-3 text-sm">
//             <Truck className="h-5 w-5 text-accent" />
//             <span>
//               <span className="text-muted-foreground">Delivery Timescale: </span>
//               <span className="font-semibold">3-5 Days</span>
//             </span>
//           </div>

//           <ul className="mt-4 grid grid-cols-3 gap-2 text-xs">
//             <li className="flex items-center gap-2 rounded-lg border p-2.5">
//               <Repeat className="h-4 w-4 text-accent" /> Easy Exchange
//             </li>
//             <li className="flex items-center gap-2 rounded-lg border p-2.5">
//               <ShieldCheck className="h-4 w-4 text-accent" /> Warranty
//             </li>
//             <li className="flex items-center gap-2 rounded-lg border p-2.5">
//               <Share2 className="h-4 w-4 text-accent" /> Share
//             </li>
//           </ul>
//         </div>
//       </div>

//       <div className="mt-12">
//         <div className="flex flex-wrap gap-2 border-b">
//           {(
//             [
//               { k: "spec", label: "Specification" },
//               { k: "desc", label: "Description" },
//               { k: "warranty", label: "Warranty" },
//             ] as { k: "spec" | "desc" | "warranty"; label: string }[]
//           ).map((t) => (
//             <button
//               key={t.k}
//               onClick={() => setTab(t.k)}
//               className={`-mb-px rounded-t-lg px-4 py-2.5 text-sm font-semibold transition ${tab === t.k ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
//             >
//               {t.label}
//             </button>
//           ))}
//         </div>

//         <div className="rounded-b-2xl border border-t-0 bg-card p-5 md:p-6">
//           {tab === "spec" && (
//             <div>
//               <h2 className="font-display text-xl font-extrabold">Specification</h2>
//               <div className="mt-4 overflow-hidden rounded-xl border">
//                 <table className="w-full text-sm">
//                   <tbody>
//                     <tr className="border-b bg-muted/40">
//                       <th className="w-40 px-4 py-3 text-left font-semibold">Brand</th>
//                       <td className="px-4 py-3">{product.brand}</td>
//                     </tr>
//                     <tr className="border-b">
//                       <th className="px-4 py-3 text-left font-semibold">Category</th>
//                       <td className="px-4 py-3">{cat.name}</td>
//                     </tr>
//                     {product.specs &&
//                       Object.entries(product.specs).map(([k, v], i) => (
//                         <tr key={k} className={i % 2 === 0 ? "border-b bg-muted/40" : "border-b"}>
//                           <th className="px-4 py-3 text-left font-semibold">{k}</th>
//                           <td className="px-4 py-3">{v}</td>
//                         </tr>
//                       ))}
//                     <tr>
//                       <th className="px-4 py-3 text-left font-semibold">Code</th>
//                       <td className="px-4 py-3 text-muted-foreground">{code}</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {tab === "desc" && (
//             <div>
//               <h2 className="font-display text-xl font-extrabold">Description</h2>
//               <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
//                 {product.description}
//               </p>
//               <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
//                 Gajitto brings you authentic {product.brand} products with full manufacturer
//                 warranty, nationwide delivery, and hassle-free after-sales support.
//               </p>
//             </div>
//           )}

//           {tab === "warranty" && (
//             <div>
//               <h2 className="font-display text-xl font-extrabold">Warranty</h2>
//               <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
//                 <li>• 1 Year Official Brand Warranty on manufacturing defects.</li>
//                 <li>• 7-Day easy replacement on DOA units.</li>
//                 <li>• Physical damage, water damage and burn marks are not covered.</li>
//                 <li>• Warranty claims must be raised with the original invoice.</li>
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>

//       {related.length > 0 && (
//         <div className="mt-14">
//           <SectionHeading title="Related" accent="Products" />
//           <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
//             {related.map((p) => (
//               <ProductCard key={p.id} product={p} />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export function CheckoutPage() {
//   const items = useCart((s) => s.items);
//   const clear = useCart((s) => s.clear);
//   const subtotal = cartSubtotal(items);
//   const [step, setStep] = useState<1 | 2 | 3>(1);
//   const [address, setAddress] = useState({ name: "", phone: "", address: "", city: "Dhaka" });
//   const [shipping, setShipping] = useState<"standard" | "express">("standard");
//   const shippingCost = shipping === "express" ? 150 : 80;
//   const router = useRouter();

//   const placeOrder = () => {
//     clear();
//     toast.success("Order placed!", { description: "We'll contact you shortly to confirm." });
//     router.push("/checkout/success");
//   };

//   if (items.length === 0) {
//     return (
//       <div className="mx-auto max-w-2xl px-4 py-20 text-center">
//         <h1 className="font-display text-3xl font-extrabold">Your cart is empty</h1>
//         <p className="mt-2 text-sm text-muted-foreground">Add items before checking out.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto max-w-6xl px-4 py-8">
//       <h1 className="font-display text-3xl font-extrabold">Checkout</h1>
//       <ol className="mt-6 flex items-center gap-2 text-sm">
//         {(["Address", "Delivery", "Review"] as const).map((label, i) => {
//           const n = (i + 1) as 1 | 2 | 3;
//           const active = step === n;
//           const done = step > n;
//           return (
//             <li key={label} className="flex items-center gap-2">
//               <span
//                 className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${active ? "bg-accent text-accent-foreground" : done ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground"}`}
//               >
//                 {n}
//               </span>
//               <span className={active ? "font-semibold" : "text-muted-foreground"}>{label}</span>
//               {i < 2 && <span className="mx-2 h-px w-8 bg-border" />}
//             </li>
//           );
//         })}
//       </ol>

//       <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
//         <div className="rounded-2xl border bg-card p-5">
//           {step === 1 && (
//             <div className="space-y-3">
//               <h2 className="text-sm font-semibold">Shipping address</h2>
//               <Field
//                 label="Full name"
//                 value={address.name}
//                 onChange={(v) => setAddress({ ...address, name: v })}
//               />
//               <Field
//                 label="Phone number"
//                 value={address.phone}
//                 onChange={(v) => setAddress({ ...address, phone: v })}
//               />
//               <Field
//                 label="Address"
//                 value={address.address}
//                 onChange={(v) => setAddress({ ...address, address: v })}
//               />
//               <Field
//                 label="City"
//                 value={address.city}
//                 onChange={(v) => setAddress({ ...address, city: v })}
//               />
//               <button
//                 onClick={() => setStep(2)}
//                 disabled={!address.name || !address.phone || !address.address}
//                 className="mt-3 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-50"
//               >
//                 Continue to delivery
//               </button>
//             </div>
//           )}

//           {step === 2 && (
//             <div className="space-y-3">
//               <h2 className="text-sm font-semibold">Delivery method</h2>
//               {(["standard", "express"] as const).map((opt) => (
//                 <label
//                   key={opt}
//                   className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 ${shipping === opt ? "border-accent bg-accent/5" : ""}`}
//                 >
//                   <span className="flex items-center gap-3">
//                     <input
//                       type="radio"
//                       name="ship"
//                       checked={shipping === opt}
//                       onChange={() => setShipping(opt)}
//                     />
//                     <span>
//                       <span className="block text-sm font-semibold capitalize">{opt} delivery</span>
//                       <span className="block text-xs text-muted-foreground">
//                         {opt === "standard" ? "3–5 business days" : "1–2 business days"}
//                       </span>
//                     </span>
//                   </span>
//                   <span className="text-sm font-semibold">
//                     {formatBDT(opt === "standard" ? 80 : 150)}
//                   </span>
//                 </label>
//               ))}
//               <div className="flex gap-2 pt-2">
//                 <button
//                   onClick={() => setStep(1)}
//                   className="rounded-full border px-5 py-2.5 text-sm font-semibold"
//                 >
//                   Back
//                 </button>
//                 <button
//                   onClick={() => setStep(3)}
//                   className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
//                 >
//                   Review order
//                 </button>
//               </div>
//             </div>
//           )}

//           {step === 3 && (
//             <div className="space-y-4">
//               <h2 className="text-sm font-semibold">Review your order</h2>
//               <div className="rounded-xl bg-muted p-4 text-sm">
//                 <p className="font-semibold">{address.name}</p>
//                 <p className="text-muted-foreground">{address.phone}</p>
//                 <p className="text-muted-foreground">
//                   {address.address}, {address.city}
//                 </p>
//                 <p className="mt-2 text-xs uppercase text-accent">{shipping} delivery</p>
//               </div>
//               <ul className="divide-y rounded-xl border">
//                 {items.map((i) => (
//                   <li key={i.id} className="flex items-center gap-3 p-3">
//                     <img
//                       src={i.image}
//                       className="h-14 w-14 rounded-md bg-muted object-contain p-1"
//                       alt=""
//                     />
//                     <div className="flex-1">
//                       <p className="line-clamp-1 text-sm font-medium">{i.name}</p>
//                       <p className="text-xs text-muted-foreground">Qty {i.qty}</p>
//                     </div>
//                     <span className="text-sm font-semibold">{formatBDT(i.price * i.qty)}</span>
//                   </li>
//                 ))}
//               </ul>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setStep(2)}
//                   className="rounded-full border px-5 py-2.5 text-sm font-semibold"
//                 >
//                   Back
//                 </button>
//                 <button
//                   onClick={placeOrder}
//                   className="flex-1 rounded-full bg-brand px-5 py-3 text-sm font-bold text-brand-foreground hover:brightness-110"
//                 >
//                   Place order · {formatBDT(subtotal + shippingCost)}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         <aside className="h-fit rounded-2xl border bg-card p-5 lg:sticky lg:top-24">
//           <h2 className="text-sm font-semibold">Summary</h2>
//           <dl className="mt-3 space-y-2 text-sm">
//             <div className="flex justify-between">
//               <dt className="text-muted-foreground">Items ({items.length})</dt>
//               <dd>{formatBDT(subtotal)}</dd>
//             </div>
//             <div className="flex justify-between">
//               <dt className="text-muted-foreground">Shipping</dt>
//               <dd>{formatBDT(shippingCost)}</dd>
//             </div>
//             <div className="mt-3 flex justify-between border-t pt-3 text-base font-bold">
//               <dt>Total</dt>
//               <dd className="text-[color:var(--price)]">{formatBDT(subtotal + shippingCost)}</dd>
//             </div>
//           </dl>
//         </aside>
//       </div>
//     </div>
//   );
// }

// function Field({
//   label,
//   value,
//   onChange,
// }: {
//   label: string;
//   value: string;
//   onChange: (v: string) => void;
// }) {
//   return (
//     <label className="block">
//       <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
//       <input
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
//       />
//     </label>
//   );
// }

// export function SuccessPage() {
//   return (
//     <div className="mx-auto max-w-2xl px-4 py-20 text-center">
//       <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/20 text-brand-foreground">
//         <CheckCircle2 className="h-9 w-9 text-[color:var(--brand)]" />
//       </div>
//       <h1 className="mt-6 font-display text-3xl font-extrabold md:text-4xl">
//         Thanks for your order!
//       </h1>
//       <p className="mt-2 text-sm text-muted-foreground">
//         We've received your order. Our team will call you to confirm within the next few hours.
//       </p>
//       <Link
//         href="/collection"
//         className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:brightness-110"
//       >
//         Continue shopping
//       </Link>
//     </div>
//   );
// }

// export function StoresPage() {
//   const stores = [
//     { name: "Gajitto Gulshan", address: "Road 11, Gulshan 1, Dhaka", phone: "09666-777-001" },
//     {
//       name: "Gajitto Dhanmondi",
//       address: "Mirpur Road, Dhanmondi 27, Dhaka",
//       phone: "09666-777-002",
//     },
//     { name: "Gajitto Uttara", address: "Sector 3, Uttara, Dhaka", phone: "09666-777-003" },
//     { name: "Gajitto Chattogram", address: "GEC Circle, Chattogram", phone: "09666-777-004" },
//   ];

//   return (
//     <div className="mx-auto max-w-5xl px-4 py-10">
//       <h1 className="font-display text-3xl font-extrabold md:text-4xl">Our Stores</h1>
//       <p className="mt-2 text-sm text-muted-foreground">Visit us to try before you buy.</p>

//       <div className="mt-8 grid gap-4 md:grid-cols-2">
//         {stores.map((s) => (
//           <div key={s.name} className="rounded-2xl border bg-card p-5">
//             <h2 className="font-display text-lg font-bold">{s.name}</h2>
//             <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
//               <MapPin className="mt-0.5 h-4 w-4 text-accent" /> {s.address}
//             </p>
//             <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
//               <Phone className="h-4 w-4 text-accent" /> {s.phone}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
