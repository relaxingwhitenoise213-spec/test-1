import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { CHAPTER_IDS } from "@/lib/questions";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = [
    "",
    "/practice",
    "/mock-test",
    ...CHAPTER_IDS.map((chapter) => `/practice/${chapter}`),
  ];
  return pages.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path === "/mock-test" ? 0.9 : 0.7,
  }));
}
