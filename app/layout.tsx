import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "../styles.css";
import { SiteHeader } from "@/components/site-header";
import { CategoryNav } from "@/components/category-nav";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Gajitto — Smartphones, Airbuds, Watches & More in Bangladesh",
  description:
    "Shop the latest smartphones, airbuds, smartwatches, headphones and accessories at Gajitto — Bangladesh's home for everyday tech with fastest delivery and after-sales service.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body>
        <div className="flex min-h-screen flex-col bg-background text-foreground">
          <SiteHeader />
          <CategoryNav />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
