import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Gajitto" },
      { name: "description", content: "Gadget guides, reviews and tips from the Gajitto team." },
      { property: "og:title", content: "Blog — Gajitto" },
    ],
  }),
  component: Blog,
});

const posts = [
  { title: "Buying your first pair of TWS earbuds", excerpt: "What to check before you swipe.", tag: "Guide" },
  { title: "Smartphone battery care in 2026", excerpt: "Habits that keep your phone lasting longer.", tag: "Tips" },
  { title: "AMOLED vs LCD smartwatches", excerpt: "Which display suits your daily use?", tag: "Compare" },
];

function Blog() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold md:text-4xl">Gajitto Blog</h1>
      <p className="mt-2 text-sm text-muted-foreground">Guides, reviews and gadget news.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {posts.map((p) => (
          <article key={p.title} className="rounded-2xl border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
            <span className="inline-flex rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">{p.tag}</span>
            <h2 className="mt-3 font-display text-lg font-bold">{p.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
