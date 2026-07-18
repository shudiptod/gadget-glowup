import type { CategorySlug } from "./categories";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  brand: string;
  price: number;
  oldPrice?: number;
  image: string;
  description: string;
  specs?: Record<string, string>;
  inStock: boolean;
};

const IMG = "https://wwsygxbdccehktouuodc.supabase.co/storage/v1/object/public/store-assets/products/images";

export const products: Product[] = [
  // Smartphones
  {
    id: "p-redmi-note-15",
    slug: "redmi-note-15-4g-smartphone",
    name: "Redmi Note 15 4G Smartphone - Official 8/256GB",
    category: "smartphones",
    brand: "Xiaomi",
    price: 28990,
    oldPrice: 30990,
    image: `${IMG}/Redmi%20Note%2015%204G.png`,
    description: "The Redmi Note 15 4G packs a 108MP AI camera, 5160mAh battery, and a vivid 6.7\" AMOLED display in a premium slim body.",
    specs: { Display: "6.7\" AMOLED", RAM: "8GB", Storage: "256GB", Battery: "5160 mAh", Camera: "108MP AI" },
    inStock: true,
  },
  {
    id: "p-redmi-a5",
    slug: "redmi-a5-smartphone",
    name: "Redmi A5 4G Smartphone 4/64GB",
    category: "smartphones",
    brand: "Xiaomi",
    price: 11990,
    image: `${IMG}/Redmi%20Note%2015%204G.png`,
    description: "Everyday performance with a bright 6.88\" display and long-lasting 5200mAh battery.",
    specs: { Display: "6.88\" HD+", RAM: "4GB", Storage: "64GB", Battery: "5200 mAh" },
    inStock: true,
  },

  // Airbuds
  {
    id: "p-spacebuds-2",
    slug: "oraimo-spacebuds-2-ai-smart",
    name: "oraimo SpaceBuds 2 AI Smart 45hrs Playtime True Wireless Earbuds",
    category: "airbuds",
    brand: "Oraimo",
    price: 5490,
    oldPrice: 5990,
    image: `${IMG}/oraimo-True-Wireless-Earbuds-SpaceBuds2-OTW-631-1-Main-A%20(1).webp`,
    description: "45 hours total playtime, AI-tuned drivers, ENC calling and smart touch controls.",
    specs: { Playtime: "45 hrs", ANC: "AI ENC", Bluetooth: "5.3", Case: "USB-C" },
    inStock: true,
  },
  {
    id: "p-spacebuds-air-freefire",
    slug: "oraimo-spacebuds-air-freefire-otw-325",
    name: "oraimo SpaceBuds Air Freefire 38 Hours Smart Finder True Wireless Earbuds",
    category: "airbuds",
    brand: "Oraimo",
    price: 2400,
    image: `${IMG}/OTW-324S-FREEFIRE-SPEEDBLACK-New-Rope.webp`,
    description: "Gaming-tuned earbuds with 38h battery, smart finder and low-latency mode.",
    specs: { Playtime: "38 hrs", Latency: "45 ms", Bluetooth: "5.3" },
    inStock: true,
  },
  {
    id: "p-truke-f1-ultra",
    slug: "truke-buds-f1-ultra",
    name: "truke Buds F1 Ultra True Wireless Earbuds",
    category: "airbuds",
    brand: "truke",
    price: 1100,
    image: `${IMG}/61kSrNXQpNL._SY450_%20(1).jpg`,
    description: "Ultra-lightweight buds with punchy bass and 40h combined playtime.",
    inStock: true,
  },
  {
    id: "p-truke-aura-pro",
    slug: "truke-new-launch-aura-pro",
    name: "truke New Launch Aura Pro TWS Earbuds",
    category: "airbuds",
    brand: "truke",
    price: 1590,
    oldPrice: 1890,
    image: `${IMG}/41+Yl8wHOML._SY300_SX300_QL70_FMwebp_.webp`,
    description: "Balanced sound signature, ENC mic and comfortable in-ear fit for all day.",
    inStock: true,
  },

  // Watches
  {
    id: "p-oraimo-814l",
    slug: "oraimo-osw-814l-watch-nova-2-lite",
    name: "Oraimo OSW-814L Watch Nova 2 Lite AMOLED BT Calling Smart Watch",
    category: "watch",
    brand: "Oraimo",
    price: 3800,
    image: `${IMG}/oraimo%20814L.png`,
    description: "1.43\" AMOLED display, Bluetooth calling, 100+ sports modes and 7-day battery.",
    specs: { Display: "1.43\" AMOLED", Battery: "7 days", Water: "IP68" },
    inStock: true,
  },
  {
    id: "p-muse-2-lite",
    slug: "oraimo-watch-muse-2-lite-osw-827n",
    name: "Oraimo Watch Muse 2 Lite (OSW-827N)",
    category: "watch",
    brand: "Oraimo",
    price: 2750,
    image: `${IMG}/watch_muse_2_lite.webp`,
    description: "Sleek smartwatch with health tracking, BT calling and long battery life.",
    inStock: true,
  },
  {
    id: "p-daniel-hechter",
    slug: "daniel-hechter-paris-rivoli-collection",
    name: "Daniel Hechter Paris Rivoli Collection",
    category: "watch",
    brand: "Daniel Hechter",
    price: 3000,
    image: `${IMG}/daniel%20watch.png`,
    description: "French heritage design with a minimalist dial and leather strap.",
    inStock: true,
  },
  {
    id: "p-v2a-1299",
    slug: "v2a-1299",
    name: "V2A-1299 Classic Analog Watch",
    category: "watch",
    brand: "V2A",
    price: 1590,
    image: `${IMG}/v2a%20watch.png`,
    description: "Everyday analog watch with stainless case and refined finish.",
    inStock: true,
  },
  {
    id: "p-titan-workwear",
    slug: "titan-workwear-green-dial-ns1802nl02",
    name: "Titan Workwear Green Dial Analog Leather Strap Watch – NS1802NL02",
    category: "watch",
    brand: "Titan",
    price: 4250,
    image: `${IMG}/7FF9PSQqYTZIp2bREGwvHA9rj0V21vtCbuxIzs4o.webp`,
    description: "Deep green sunray dial with genuine leather strap. Made for the modern professional.",
    inStock: true,
  },

  // Headphones
  {
    id: "p-jbl-tune-205",
    slug: "jbl-tune-205-in-ear-earphone",
    name: "JBL Tune 205 3.5mm In-ear Earphone",
    category: "headphones",
    brand: "JBL",
    price: 1350,
    image: `${IMG}/4395-44995.webp`,
    description: "Signature JBL Pure Bass, tangle-free flat cable and one-button remote.",
    inStock: true,
  },

  // Wired earphones
  {
    id: "p-jbl-c50hi",
    slug: "jbl-c50hi-wired-earphones-black",
    name: "JBL C50HI Wired In-Ear Earphones (Black)",
    category: "wired-earphones",
    brand: "JBL",
    price: 650,
    image: `${IMG}/51ijOG7u83L._AC_SY450_.jpg`,
    description: "Comfortable in-ear fit with JBL Pure Bass and hands-free mic.",
    inStock: true,
  },
  {
    id: "p-oep-650",
    slug: "oraimo-oep-650-type-c-earphone",
    name: "Oraimo OEP-650 Type-C Earphone",
    category: "wired-earphones",
    brand: "Oraimo",
    price: 520,
    image: `${IMG}/e650.png`,
    description: "Digital Type-C earphones with HiFi sound and tangle-free cable.",
    inStock: true,
  },
  {
    id: "p-oep-e21p",
    slug: "oraimo-oep-e21p-halo-2s",
    name: "Oraimo OEP-E21P In-ear Earphone Halo 2S",
    category: "wired-earphones",
    brand: "Oraimo",
    price: 320,
    image: `${IMG}/e21p.png`,
    description: "Balanced sound with a durable Kevlar-reinforced cable.",
    inStock: true,
  },
  {
    id: "p-oep-320s",
    slug: "oraimo-oep-320s-in-ear-wired-earphone",
    name: "Oraimo OEP-320S In-Ear Wired Earphone",
    category: "wired-earphones",
    brand: "Oraimo",
    price: 380,
    image: `${IMG}/oep-320s-001-500x500.webp`,
    description: "Everyday in-ear earphones tuned for balanced sound and clear calls.",
    inStock: true,
  },

  // Chargers
  {
    id: "p-oraimo-t01",
    slug: "oraimo-t01-poweromni-251",
    name: "oraimo T01 PowerOmni 251 2500W Multi-Plug Travel Converter",
    category: "chargers",
    brand: "Oraimo",
    price: 1350,
    image: `${IMG}/oraimo%20t01.png`,
    description: "All-in-one 2500W multi-plug travel adapter that works in 150+ countries.",
    inStock: true,
  },
];

export const bySlug = new Map(products.map((p) => [p.slug, p]));
export const byCategory = (slug: CategorySlug) => products.filter((p) => p.category === slug);
export const featured = products.slice(0, 8);
