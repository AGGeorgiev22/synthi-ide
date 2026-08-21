import { POSTS } from "./blog/posts";
import { SITE_URL } from "@/lib/seo";

const LAST_SITE_UPDATE = "2026-08-21T00:00:00.000Z";

export default function sitemap() {
  const staticPages = [
    { url: SITE_URL, lastModified: new Date(LAST_SITE_UPDATE), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(LAST_SITE_UPDATE), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/docs`, lastModified: new Date("2026-07-14T00:00:00.000Z"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date("2026-07-14T00:00:00.000Z"), changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: new Date("2026-07-14T00:00:00.000Z"), changeFrequency: "yearly", priority: 0.3 },
  ];

  const articles = POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    ...(post.publishedAt ? { lastModified: new Date(post.publishedAt) } : {}),
    changeFrequency: "monthly",
    priority: post.slug === "introducing-zilm" ? 0.9 : 0.7,
  }));

  return [...staticPages, ...articles];
}
