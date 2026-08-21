import { POSTS } from "../posts";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

const escapeXml = (value) => value
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/\"/g, "&quot;")
  .replace(/'/g, "&apos;");

export const dynamic = "force-static";

export function GET() {
  const newestPost = POSTS.find((post) => post.publishedAt)?.publishedAt || "2026-08-21T00:00:00.000Z";
  const items = POSTS.map((post) => {
    const url = `${SITE_URL}/blog/${post.slug}`;
    const pubDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : "";

    return `
      <item>
        <title>${escapeXml(post.title)}</title>
        <link>${url}</link>
        <guid isPermaLink="true">${url}</guid>
        <description>${escapeXml(post.summary)}</description>
        ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ""}
        <category>${escapeXml(post.category)}</category>
      </item>`;
  }).join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>${SITE_NAME} engineering blog</title>
        <link>${SITE_URL}/blog</link>
        <description>${escapeXml(SITE_DESCRIPTION)}</description>
        <language>en-us</language>
        <lastBuildDate>${new Date(newestPost).toUTCString()}</lastBuildDate>
        <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom"/>
        ${items}
      </channel>
    </rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
