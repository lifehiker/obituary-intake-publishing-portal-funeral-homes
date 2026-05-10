import type { MetadataRoute } from "next";
import { marketingPages } from "@/lib/seo-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return [
    "",
    "/pricing",
    "/demo",
    ...Object.keys(marketingPages).map((slug) => `/${slug}`),
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
