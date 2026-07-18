import { Suspense } from "react";
import { SearchPage } from "@/lib/storefront-pages";

export default function Page() {
  return (
    <Suspense
      fallback={<div className="px-4 py-10 text-sm text-muted-foreground">Loading search…</div>}
    >
      <SearchPage />
    </Suspense>
  );
}
