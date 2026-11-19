import type { MetadataRoute } from "next";
import { absoluteUrl, getIndexableResortPaths } from "@/lib/seo";
import { seasonResearchRecords } from "@/data/season-research";

const latestCheckedAt = seasonResearchRecords.reduce((latest, record) => (record.lastCheckedAt > latest ? record.lastCheckedAt : latest), "");

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = latestCheckedAt ? new Date(latestCheckedAt) : undefined;
  return [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/resorts"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    ...getIndexableResortPaths().map((path) => ({ url: absoluteUrl(path), lastModified, changeFrequency: "weekly" as const, priority: 0.8 })),
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.2 }
  ];
}
