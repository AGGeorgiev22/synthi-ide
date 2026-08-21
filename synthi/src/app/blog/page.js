import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import { AnimatedLogo, Logo } from "@/components/Logo";
import { PILOT_MAILTO } from "@/lib/pilot";
import { SITE_SOCIAL_IMAGE } from "@/lib/seo";

import { POSTS } from "./posts";
import styles from "./blog.module.css";

export const metadata = {
  title: "ZILM GPU hot module replacement & engineering blog | Vectant",
  description:
    "The Vectant engineering blog: ZILM GPU hot module replacement, production coding agents, runtime control, and reviewable proof.",
  keywords: [
    "ZILM",
    "GPU hot module replacement",
    "GPU HMR",
    "CUDA hot reload",
    "production coding agents",
    "developer infrastructure",
  ],
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": [{ url: "/blog/feed.xml", title: "Vectant engineering blog RSS" }],
    },
  },
  openGraph: {
    type: "website",
    url: "/blog",
    title: "ZILM GPU hot module replacement & engineering blog | Vectant",
    description:
      "The Vectant engineering blog: ZILM GPU hot module replacement, production coding agents, runtime control, and reviewable proof.",
    images: [SITE_SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZILM GPU hot module replacement & engineering blog | Vectant",
    description:
      "The Vectant engineering blog: ZILM GPU hot module replacement, production coding agents, runtime control, and reviewable proof.",
    images: [SITE_SOCIAL_IMAGE.url],
  },
};

const [featured, ...posts] = POSTS;

export default function BlogPage() {
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": "https://vectant.dev/blog/#blog",
        name: "Vectant engineering blog",
        description:
          "Technical writing about ZILM GPU hot module replacement, production coding agents, runtime control, and reviewable proof.",
        url: "https://vectant.dev/blog",
        inLanguage: "en-US",
        publisher: { "@id": "https://vectant.dev/#organization" },
      },
      {
        "@type": "ItemList",
        itemListElement: POSTS.map((post, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `https://vectant.dev/blog/${post.slug}`,
          name: post.title,
        })),
      },
    ],
  };

  return (
    <main className={styles.page} id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd).replace(/</g, "\\u003c") }}
      />
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Vectant home">
          <AnimatedLogo expanded={false} className={styles.logo} markClassName={styles.mark} />
        </Link>
        <nav aria-label="Journal navigation">
          <Link href="/">Product</Link>
          <Link href="/terms">Company</Link>
          <a href={PILOT_MAILTO}>Request a pilot</a>
        </nav>
      </header>

      <section className={styles.hero} aria-labelledby="journal-title">
        <p>The Vectant engineering blog</p>
        <h1 id="journal-title">ZILM, GPU hot module replacement, and production-agent systems.</h1>
        <span>
          Technical writing on ZILM GPU HMR, runtime control, agent authority, and reviewable proof.
        </span>
      </section>

      <section className={styles.featured} aria-labelledby="featured-title">
        <Link
          href={`/blog/${featured.slug}`}
          className={styles.featuredImage}
          aria-label={`Read ${featured.title}`}
        >
          <Image
            src={featured.image}
            alt={featured.alt}
            fill
            priority
            quality={95}
            sizes="(max-width: 767px) 100vw, 62vw"
          />
        </Link>
        <div className={styles.featuredCopy}>
          <p>Featured</p>
          <span>{featured.category}</span>
          <h2 id="featured-title">{featured.title}</h2>
          <p>{featured.summary}</p>
          <Link href={`/blog/${featured.slug}`}>
            Read article
            <ArrowUpRight size={17} weight="bold" />
          </Link>
        </div>
      </section>

      <section className={styles.latest} aria-labelledby="latest-title">
        <h2 id="latest-title">Latest writing</h2>
        <div className={styles.posts}>
          {posts.map((post) => (
            <article key={post.slug} className={styles.post}>
              <Link href={`/blog/${post.slug}`} className={styles.postImage}>
                <Image
                  src={post.image}
                  alt={post.alt}
                  fill
                  quality={95}
                  sizes="(max-width: 767px) 100vw, 50vw"
                />
              </Link>
              <div>
                <span>{post.category}</span>
                <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
                <p>{post.summary}</p>
                <Link className={styles.readLink} href={`/blog/${post.slug}`}>
                  Read article
                  <ArrowUpRight size={15} weight="bold" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <Link href="/" aria-label="Vectant home">
          <Logo className={styles.footerLogo} markClassName={styles.footerMark} />
        </Link>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/">Product</Link>
        </div>
      </footer>
    </main>
  );
}
