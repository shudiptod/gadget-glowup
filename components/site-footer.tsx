import Link from "next/link";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { GajittoLogo } from "./gajitto-logo";
import apiClient from "@/lib/apiClient";
import { SettingsResponse } from "@/lib/types";

// Adding a more specific type based on your JSON response for type safety
interface SiteSettings {
  appName?: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
  [key: string]: any;
}

async function getPageSettings() {
  try {
    return await apiClient.get<SettingsResponse>("/settings");
  } catch {
    return null;
  }
}

export async function SiteFooter() {
  const response = await getPageSettings();
  // Cast the generic data to our more specific SiteSettings interface
  const settings = response?.data as SiteSettings | undefined;

  return (
    <footer className="mt-16 bg-surface text-surface-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-4">
          <div>
            <GajittoLogo />
            <p className="mt-4 text-sm text-white/60">
              {settings?.description ||
                "Bangladesh's home for smartphones, audio, wearables and everyday tech — backed by fastest home delivery and after-sales support."}
            </p>
            <div className="mt-5 flex gap-3">
              {settings?.socialLinks?.facebook && (
                <a
                  className="rounded-full bg-white/5 p-2 hover:bg-white/10"
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {settings?.socialLinks?.instagram && (
                <a
                  className="rounded-full bg-white/5 p-2 hover:bg-white/10"
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {settings?.socialLinks?.youtube && (
                <a
                  className="rounded-full bg-white/5 p-2 hover:bg-white/10"
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          <FooterCol title="Shop">
            <li>
              <Link href="/collection">All Products</Link>
            </li>
            <li>
              <Link href="/collection/smartphones">Smartphones</Link>
            </li>
            <li>
              <Link href="/collection/airbuds">Airbuds</Link>
            </li>
            <li>
              <Link href="/collection/watch">Watches</Link>
            </li>
          </FooterCol>

          <FooterCol title="Contact">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" /> {settings?.contactPhone || "09666-777-000"}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />{" "}
              {settings?.contactEmail || "hello@gajittobd.com"}
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5" />{" "}
              <span>{settings?.address || "Dhaka, Bangladesh"}</span>
            </li>
          </FooterCol>

          <FooterCol title="Company">
            <li>
              <Link href="/about">About us</Link>
            </li>
            <li>
              <Link href="/stores">Store locations</Link>
            </li>
          </FooterCol>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row">
          <p>
            © {new Date().getFullYear()} {settings?.appName || "Gajitto"}. All rights reserved.
          </p>
          <p>Visa · Mastercard · bKash · Nagad · Rocket</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-white">{title}</h4>
      <ul className="mt-4 space-y-2 text-sm text-white/60 [&_a:hover]:text-white [&_a]:transition">
        {children}
      </ul>
    </div>
  );
}
