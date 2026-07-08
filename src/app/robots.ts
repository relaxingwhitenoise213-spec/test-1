import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Personal, per-browser pages with no indexable content.
      disallow: ["/mistakes", "/progress"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
