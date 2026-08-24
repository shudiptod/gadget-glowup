import Link from "next/link";

type SEOContentLinks = {
  smartphones?: string;
  audio?: string;
  watches?: string;
  charging?: string;
  technology?: string;
  gadgets?: string;
};

type SEOContentSectionProps = {
  links?: SEOContentLinks;
};

type IconName = "phone" | "audio" | "watch" | "charging" | "tablet" | "camera";

const defaultLinks: Required<SEOContentLinks> = {
  smartphones: "/collection/phone",
  audio: "/collection/airbuds",
  watches: "/collection/watches",
  charging: "/collection/charging",
  technology: "/collection",
  gadgets: "/collection/camera-networking",
};

const icons: Record<IconName, React.ReactNode> = {
  phone: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-7 w-7"
      aria-hidden="true"
    >
      {" "}
      <rect x="6" y="2.5" width="12" height="19" rx="2" /> <path d="M10 18.5h4" />{" "}
    </svg>
  ),

  audio: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-7 w-7"
      aria-hidden="true"
    >
      {" "}
      <path d="M7 4a3 3 0 0 0-3 3v5a3 3 0 0 0 3 3h1V8a4 4 0 0 1 8 0v7h1a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3" />{" "}
      <path d="M8 8v7a3 3 0 0 1-3 3" /> <path d="M16 8v7a3 3 0 0 0 3 3" />{" "}
    </svg>
  ),

  watch: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-7 w-7"
      aria-hidden="true"
    >
      {" "}
      <rect x="6" y="6" width="12" height="12" rx="3" /> <path d="M9 6V3h6v3M9 18v3h6v-3" />{" "}
    </svg>
  ),

  charging: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-7 w-7"
      aria-hidden="true"
    >
      {" "}
      <path d="M8 7v10M16 7v10" /> <path d="M6 9h12M6 15h12" /> <path d="M10 3h4M10 21h4" />{" "}
    </svg>
  ),

  tablet: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-7 w-7"
      aria-hidden="true"
    >
      {" "}
      <rect x="5" y="2.5" width="14" height="19" rx="2" /> <path d="M10.5 18.5h3" />{" "}
    </svg>
  ),

  camera: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-7 w-7"
      aria-hidden="true"
    >
      {" "}
      <path d="M4 7h4l1.5-2h5L16 7h4v12H4V7Z" /> <circle cx="12" cy="13" r="3.5" />{" "}
    </svg>
  ),
};

const categories = [
  {
    icon: "phone" as IconName,
    title: "Buy Smartphones & Mobile Phones Online",
    description:
      "Explore the latest smartphones from popular brands and find the right device for your needs, whether you care about performance, camera quality, gaming or everyday use.",
    linkKey: "smartphones" as keyof SEOContentLinks,
    linkLabel: "Explore smartphones",
  },
  {
    icon: "audio" as IconName,
    title: "Airbuds, Earbuds & Wireless Audio",
    description:
      "Enjoy music, calls and entertainment with TWS earbuds, airbuds, wired earphones and headphones. Find audio options for work, travel, gaming and everyday listening.",
    linkKey: "audio" as keyof SEOContentLinks,
    linkLabel: "Shop airbuds & audio",
  },
  {
    icon: "watch" as IconName,
    title: "Smartwatches & Wearables",
    description:
      "Stay connected and track your daily activities with stylish smartwatches and wearable devices featuring fitness tracking, notifications, calling and more.",
    linkKey: "watches" as keyof SEOContentLinks,
    linkLabel: "Explore smartwatches",
  },
  {
    icon: "charging" as IconName,
    title: "Mobile Accessories, Chargers & Power Banks",
    description:
      "Find fast chargers, cables, adapters, wireless chargers and power banks for your everyday devices. Keep your technology powered wherever you go.",
    linkKey: "charging" as keyof SEOContentLinks,
    linkLabel: "Shop charging accessories",
  },
  {
    icon: "tablet" as IconName,
    title: "Tablets, IT Products & Everyday Technology",
    description:
      "Discover tablets, IT accessories, storage solutions, networking devices and other technology essentials for study, work, entertainment and productivity.",
    linkKey: "technology" as keyof SEOContentLinks,
    linkLabel: "Explore all technology",
  },
  {
    icon: "camera" as IconName,
    title: "Cameras, Networking & Smart Gadgets",
    description:
      "Explore useful technology beyond smartphones and wearables, including cameras, networking equipment, innovative gadgets and lifestyle electronics.",
    linkKey: "gadgets" as keyof SEOContentLinks,
    linkLabel: "Explore gadgets & electronics",
  },
];

const benefits = [
  {
    title: "Fast Home Delivery",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-6 w-6"
        aria-hidden="true"
      >
        {" "}
        <path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" /> <circle cx="7" cy="19" r="2" />{" "}
        <circle cx="18" cy="19" r="2" />{" "}
      </svg>
    ),
  },
  {
    title: "Fast Delivery",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-6 w-6"
        aria-hidden="true"
      >
        {" "}
        <path d="M20 7h-5V2M4 17h5v5" />{" "}
        <path d="M19 7a8 8 0 0 0-13-2L4 7M5 17a8 8 0 0 0 13 2l2-2" />{" "}
      </svg>
    ),
  },
  {
    title: "EMI & Flexible Payment",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-6 w-6"
        aria-hidden="true"
      >
        {" "}
        <rect x="3" y="5" width="18" height="14" rx="2" /> <path d="M3 10h18M7 15h4" />{" "}
      </svg>
    ),
  },
  {
    title: "Authentic Products",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-6 w-6"
        aria-hidden="true"
      >
        {" "}
        <path d="m12 3 2.2 1.2 2.5-.1 1.1 2.2 2.1 1.3-.5 2.5.5 2.5-2.1 1.3-1.1 2.2-2.5-.1L12 21l-2.2-1.2-2.5.1-1.1-2.2-2.1-1.3.5-2.5-.5-2.5 2.1-1.3 1.1-2.2 2.5.1L12 3Z" />{" "}
        <path d="m8.5 12 2.2 2.2 4.8-5" />{" "}
      </svg>
    ),
  },
  {
    title: "After-sales Support",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-6 w-6"
        aria-hidden="true"
      >
        {" "}
        <path d="M4 13v-1a8 8 0 0 1 16 0v1" />{" "}
        <path d="M4 13h3v6H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 1-1ZM20 13h-3v6h2a2 2 0 0 0 2-2v-3a2 2 0 0 0-1-1Z" />{" "}
        <path d="M17 19c-.8 1.2-2.1 2-4 2" />{" "}
      </svg>
    ),
  },
];

export default function SEOContentSection({ links = {} }: SEOContentSectionProps) {
  const resolvedLinks = {
    ...defaultLinks,
    ...links,
  };

  return (
    <section
      className="mx-auto max-w-7xl px-4 pt-12 border-t border-gray-100"
      aria-labelledby="gajitto-seo-heading"
    >
      {" "}
      <div className="space-y-5">
        {/* Intro */}
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-8 text-center md:px-10 md:py-16">
          <div className="mb-10 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-orange-500">
            <span aria-hidden="true">◇</span>
            <span>Your Trusted Tech Partner</span>
          </div>

          <h2
            id="gajitto-seo-heading"
            className="mx-auto max-w-5xl text-2xl font-bold tracking-tight text-gray-900 md:text-3xl"
          >
            Gajitto – Your Trusted Online Gadget &amp; Electronics Store in Bangladesh
          </h2>

          <p className="mx-auto mt-4 max-w-5xl text-sm leading-7 text-gray-600 md:text-base">
            Gajitto is a trusted online destination for smartphones, smartwatches, airbuds,
            headphones, mobile accessories and everyday technology in Bangladesh. We bring together
            popular brands and practical gadgets in one place, making it easier to find the right
            technology for your lifestyle and budget. From the latest smartphones and tablets to
            wireless audio, smartwatches, charging accessories and essential electronics, Gajitto
            offers a wide range of products with competitive prices, fast home delivery and reliable
            after-sales support.
          </p>
        </div>
        {/* Category cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => {
            const href = resolvedLinks[category.linkKey];

            return (
              <article
                key={category.title}
                className="group rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-200 hover:border-orange-100 hover:shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                    {icons[category.icon]}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-lg font-bold leading-snug tracking-tight text-gray-900">
                      {category.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-gray-600">{category.description}</p>

                    <Link
                      href={href}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-500 transition-colors hover:text-orange-600"
                    >
                      {category.linkLabel}

                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        {/* Why Gajitto / Benefits */}
        <div className="overflow-hidden rounded-2xl border border-orange-100 bg-orange-50/40">
          <div className="flex flex-col">
            {/* Copy */}
            <div className="p-6 md:p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-orange-100 bg-white text-orange-500 shadow-sm">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path d="M12 3 4.5 6v5.5c0 4.5 3 7.7 7.5 9.5 4.5-1.8 7.5-5 7.5-9.5V6L12 3Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>

              <h3 className="text-xl font-bold tracking-tight text-gray-900">
                Why Shop from Gajitto?
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                We focus on making online technology shopping simple, convenient and dependable.
                Gajitto offers competitive deals, fast home delivery, exchange facilities, flexible
                payment options including EMI and after-sales support. Our goal is to help customers
                find the right products at the right price while providing a reliable shopping
                experience from product selection to post-purchase support.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 border-t border-orange-100 bg-white/60 sm:grid-cols-3 lg:grid-cols-5 lg:border-0">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.title}
                  className={`flex min-h-32.5 flex-col items-center justify-center px-4 py-6 text-center ${
                    index !== 0 ? "border-t border-orange-100 sm:border-l lg:border-t-0" : ""
                  } ${index === 2 ? "sm:border-t-0" : ""}`}
                >
                  <div className="text-orange-500">{benefit.icon}</div>

                  <span className="mt-3 text-xs font-semibold leading-5 text-gray-800">
                    {benefit.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
