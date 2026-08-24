import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatBDT = (n: number) => `৳ ${n}`;

export type SupabaseImageOptions = {
  /** The width of the image in pixels. */
  width?: number;

  /** The height of the image in pixels. */
  height?: number;

  /** The resizing mode. */
  resize?: "cover" | "contain" | "fill";

  /** The format to convert the image to. */
  format?: "origin" | "webp" | "avif";

  /** The quality of the image, from 20 to 100. */
  quality?: number;
};

export function getOptimizedSupabaseUrl(
  rawUrl: string,
  options: SupabaseImageOptions = {
    width: 1000,
    height: 1000,
    resize: "cover",
    format: "webp",
    quality: 100,
  },
): string {
  try {
    if (!rawUrl) return "";
    const url = new URL(rawUrl);

    if (url.pathname.includes("/object/public/")) {
      url.pathname = url.pathname.replace("/object/public/", "/render/image/public/");
    }

    if (options.width) url.searchParams.set("width", options.width.toString());
    if (options.height) url.searchParams.set("height", options.height.toString());
    if (options.resize) url.searchParams.set("resize", options.resize);
    if (options.format) url.searchParams.set("format", options.format);
    if (options.quality) url.searchParams.set("quality", options.quality.toString());

    return url.toString();
  } catch (error) {
    console.error("Invalid URL provided:", error);
    return rawUrl;
  }
}
