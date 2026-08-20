import { POSTS } from "./blog/posts";

const SITE_URL = "https://vectant.dev";

export default function sitemap() {
  const staticPages = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/docs`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const articles = POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    ...(post.publishedAt ? { lastModified: new Date(post.publishedAt) } : {}),
    changeFrequency: "monthly",
    priority: post.slug === "introducing-zilm" ? 0.9 : 0.7,
  }));

  return [...staticPages, ...articles];
}
