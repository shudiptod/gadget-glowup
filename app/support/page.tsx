import React from "react";
import { ShieldCheck, RefreshCcw, Undo2, HelpCircle, ChevronDown, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { getPageSettings, SiteSettings } from "@/components/site-footer";

const TABS = [
  { id: "warranty", label: "Warranty Policy", icon: ShieldCheck },
  { id: "exchange", label: "Exchange Policy", icon: RefreshCcw },
  { id: "return", label: "Return & Refund", icon: Undo2 },
  { id: "faq", label: "FAQs", icon: HelpCircle },
];

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function SupportPage(props: { searchParams: SearchParams }) {
  const response = await getPageSettings();
  const settings = response?.data as SiteSettings | undefined;
  const searchParams = await props.searchParams;
  // Read the active tab from the URL query string (default to "warranty")
  const activeTab = searchParams?.tab || "warranty";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:py-20">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Help & Support
        </h1>
        <p className="mt-3 text-muted-foreground">
          Everything you need to know about our policies, returns, and product support.
        </p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        {/* Sidebar / Tabs Navigation */}
        <div className="no-scrollbar flex w-full shrink-0 flex-row overflow-x-auto border-b border-border/50 pb-px md:w-64 md:flex-col md:border-b-0 md:border-r md:pb-0 md:pr-6">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={`?tab=${tab.id}`}
                scroll={false} // Prevents the page from jumping to the top when clicking a tab
                className={`flex items-center gap-3 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors md:rounded-r-md md:border-b-0 md:border-l-2 ${
                  isActive
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="min-w-0 flex-1">
          <div className="rounded-xl border border-accent bg-white p-6 md:p-8">
            {activeTab === "warranty" && <WarrantyPolicy />}
            {activeTab === "exchange" && <ExchangePolicy />}
            {activeTab === "return" && <ReturnRefundPolicy />}
            {activeTab === "faq" && <FAQSection />}
          </div>

          {/* Contact Banner below content */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-border/50 bg-muted/20 p-6 text-center sm:flex-row sm:text-left">
            <div>
              <h3 className="font-semibold text-foreground">Still need help?</h3>
              <p className="text-sm text-muted-foreground">
                Our support team is just a call or email away.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href={`tel:${settings?.contactPhone}`}
                className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-white/20"
              >
                <Phone className="h-4 w-4" /> Call Us
              </a>
              <a
                href={`mailto:${settings?.contactEmail}`}
                className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent/90"
              >
                <Mail className="h-4 w-4" /> Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Content Components
// ----------------------------------------------------------------------

function WarrantyPolicy() {
  return (
    <div className="space-y-6 text-sm text-muted-foreground">
      <h2 className="text-xl font-semibold text-foreground">Warranty Policy</h2>
      <p>
        At Gajitto, we are committed to providing the best after-sales service. We offer different
        types of warranties depending on the product and manufacturer.
      </p>

      <div className="space-y-4">
        <h3 className="font-medium text-foreground">1. Official Warranty</h3>
        <p>
          Products with an official warranty will be serviced by the respective brand's authorized
          service centers in Bangladesh. You can claim the warranty directly from the brand or drop
          the product at our store, and we will process it for you.
        </p>

        <h3 className="font-medium text-foreground">2. Unofficial / Service Warranty</h3>
        <p>
          For products with a store warranty, Gajitto covers the service charges for the specified
          period. However, if any parts need to be replaced (e.g., display, battery, motherboard),
          the cost of the parts must be borne by the customer.
        </p>

        <h3 className="font-medium text-foreground">3. Warranty Void Conditions</h3>
        <ul className="ml-2 list-inside list-disc space-y-2">
          <li>Physical damage, dents, or scratches.</li>
          <li>Liquid damage or water inside the device.</li>
          <li>Damage caused by third-party repairs or unauthorized modifications.</li>
          <li>Burn issues due to voltage fluctuations or using unauthorized chargers.</li>
          <li>Loss of the original warranty card or invoice.</li>
        </ul>
      </div>
    </div>
  );
}

function ExchangePolicy() {
  return (
    <div className="space-y-6 text-sm text-muted-foreground">
      <h2 className="text-xl font-semibold text-foreground">
        Exchange Policy (7 Days Replacement)
      </h2>
      <p>
        We offer a 7-Days Replacement Guarantee for devices that have internal manufacturing defects
        out of the box.
      </p>

      <div className="space-y-4">
        <h3 className="font-medium text-foreground">Conditions for Exchange:</h3>
        <ul className="ml-2 list-inside list-disc space-y-2">
          <li>The product must be returned within exactly 7 days from the invoice date.</li>
          <li>
            The issue must be a hardware or manufacturing defect. Software glitches that can be
            fixed via updates are not covered under replacement.
          </li>
          <li>
            The product must be entirely scratch-free and in its original, brand-new condition.
          </li>
          <li>
            <strong>The Box & Accessories:</strong> The original box, packaging, manuals, and
            included accessories must be fully intact. If the box is lost or damaged, the
            replacement guarantee is void.
          </li>
        </ul>

        <div className="rounded-md border border-accent/20 bg-accent/5 p-4 text-accent">
          <strong>Note:</strong> We highly recommend recording an unboxing video when you receive
          your delivery. This makes it significantly easier to claim an exchange if the product is
          damaged during transit.
        </div>
      </div>
    </div>
  );
}

function ReturnRefundPolicy() {
  return (
    <div className="space-y-6 text-sm text-muted-foreground">
      <h2 className="text-xl font-semibold text-foreground">Return & Refund Policy</h2>
      <p>
        Customer satisfaction is our priority. If you encounter an issue that warrants a refund,
        please review our guidelines below.
      </p>

      <div className="space-y-4">
        <h3 className="font-medium text-foreground">When are refunds applicable?</h3>
        <ul className="ml-2 list-inside list-disc space-y-2">
          <li>If you pre-paid for an order but the item goes completely out of stock.</li>
          <li>
            If the product arrives physically damaged (must be reported within 24 hours with an
            unboxing video).
          </li>
          <li>
            If we fail to provide a replacement for a defective item within a reasonable timeframe.
          </li>
        </ul>

        <h3 className="font-medium text-foreground">Refund Processing Time</h3>
        <p>
          Refunds are typically processed within <strong>7 to 10 working days</strong> from the date
          of approval. The amount will be sent back to the original payment method (bKash, Nagad, or
          Bank Account).
        </p>

        <h3 className="font-medium text-foreground">Deductions</h3>
        <p>
          If a refund is requested by the customer for personal reasons (e.g., changed mind) before
          the product is dispatched, online payment gateway charges (if any) will be deducted from
          the refunded amount. Once a product is successfully delivered in intact condition, it
          cannot be returned for a refund.
        </p>
      </div>
    </div>
  );
}

function FAQSection() {
  const faqs = [
    {
      q: "How much are the delivery charges?",
      a: "Our standard delivery charge is 60 BDT inside Dhaka city, and 120 BDT for outside Dhaka via Pathao/Steadfast couriers.",
    },
    {
      q: "How long does delivery take?",
      a: "Inside Dhaka, we usually deliver within 24 hours. For outside Dhaka, it takes 2 to 3 working days depending on the courier service.",
    },
    {
      q: "Do you offer EMI facilities?",
      a: "Yes, we offer EMI up to 36 months via major credit cards. We also support paperless EMI for selected bank cards. Please note that regular prices apply for EMI (discounted cash prices are not applicable).",
    },
    {
      q: "Can I check the product before paying?",
      a: "Yes, we offer a 'Conditioned Home Delivery' service. You can open the courier package and verify the product before paying the delivery agent. However, sealed gadget boxes cannot be opened before payment.",
    },
  ];

  return (
    <div className="space-y-6 text-sm">
      <h2 className="mb-6 text-xl font-semibold text-foreground">Frequently Asked Questions</h2>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group rounded-lg border border-border/50 bg-background/50"
          >
            <summary className="flex cursor-pointer items-center justify-between px-5 py-4 font-medium text-foreground list-none [&::-webkit-details-marker]:hidden">
              {faq.q}
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-4 text-muted-foreground">{faq.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}
