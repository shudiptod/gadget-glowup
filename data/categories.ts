export type CategorySlug =
  | "smartphones"
  | "airbuds"
  | "watch"
  | "headphones"
  | "wired-earphones"
  | "speakers"
  | "chargers"
  | "power-banks"
  | "accessories";

export type Category = {
  slug: CategorySlug;
  name: string;
  image: string;
};

export const categories: Category[] = [
  {
    slug: "smartphones",
    name: "Smartphones",
    image:
      "https://wwsygxbdccehktouuodc.supabase.co/storage/v1/object/public/store-assets/products/images/Redmi%20Note%2015%204G.png",
  },
  {
    slug: "airbuds",
    name: "Airbuds",
    image:
      "https://wwsygxbdccehktouuodc.supabase.co/storage/v1/object/public/store-assets/products/images/oraimo-True-Wireless-Earbuds-SpaceBuds2-OTW-631-1-Main-A%20(1).webp",
  },
  {
    slug: "watch",
    name: "Watches",
    image:
      "https://wwsygxbdccehktouuodc.supabase.co/storage/v1/object/public/store-assets/products/images/watch_muse_2_lite.webp",
  },
  {
    slug: "headphones",
    name: "Headphones",
    image:
      "https://wwsygxbdccehktouuodc.supabase.co/storage/v1/object/public/store-assets/products/images/4395-44995.webp",
  },
  {
    slug: "wired-earphones",
    name: "Wired Earphones",
    image:
      "https://wwsygxbdccehktouuodc.supabase.co/storage/v1/object/public/store-assets/products/images/e21p.png",
  },
  {
    slug: "speakers",
    name: "Speakers",
    image:
      "https://wwsygxbdccehktouuodc.supabase.co/storage/v1/object/public/store-assets/products/images/oep-320s-001-500x500.webp",
  },
  {
    slug: "chargers",
    name: "Chargers & Adapters",
    image:
      "https://wwsygxbdccehktouuodc.supabase.co/storage/v1/object/public/store-assets/products/images/oraimo%20t01.png",
  },
  {
    slug: "power-banks",
    name: "Power Banks",
    image:
      "https://wwsygxbdccehktouuodc.supabase.co/storage/v1/object/public/store-assets/products/images/e650.png",
  },
  {
    slug: "accessories",
    name: "Accessories",
    image:
      "https://wwsygxbdccehktouuodc.supabase.co/storage/v1/object/public/store-assets/products/images/daniel%20watch.png",
  },
];

export const categoryMap: Record<CategorySlug, Category> = Object.fromEntries(
  categories.map((c) => [c.slug, c]),
) as Record<CategorySlug, Category>;
