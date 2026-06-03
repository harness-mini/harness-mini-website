import type { MetadataRoute } from "next";
import { SITE_URL, DOCS_NAV } from "@/lib/site";

// Derived from DOCS_NAV so adding a docs route updates the sitemap automatically.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    ...DOCS_NAV.map((item) => ({
      url: `${SITE_URL}${item.href}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
