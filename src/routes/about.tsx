import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Gajitto" },
      { name: "description", content: "Gajitto is Bangladesh's home for smartphones, audio and everyday tech." },
      { property: "og:title", content: "About — Gajitto" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-3xl font-extrabold md:text-5xl">About Gajitto</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground md:text-base">
        <p>
          Gajitto is a Bangladeshi consumer-tech retailer bringing together the best of everyday gadgets —
          smartphones, wireless audio, wearables, and smart accessories — under one roof.
        </p>
        <p>
          We partner directly with brands like Oraimo, JBL, Xiaomi, Titan and Daniel Hechter so you get
          authentic products, official warranty and after-sales support.
        </p>
        <p>
          Whether you're upgrading your daily driver, gifting a smartwatch, or replacing a pair of earbuds,
          our team is here to help — online and at our experience centers.
        </p>
      </div>
    </div>
  );
}
