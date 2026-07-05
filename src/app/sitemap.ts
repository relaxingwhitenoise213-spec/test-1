import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return siteConfig.nav.map((item) => ({
    url: `${siteConfig.url}${item.href === "/" ? "" : item.href}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: item.href === "/" ? 1 : 0.7,
  }));
}
