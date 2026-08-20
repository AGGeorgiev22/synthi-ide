import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";

import { AnimatedLogo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
import { PILOT_MAILTO } from "@/lib/pilot";

import { POSTS, getPost } from "../posts";
import styles from "./article.module.css";

const SITE_URL = "https://vectant.dev";

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) return {};

  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: `${post.title} | Vectant`,
    description: post.summary,
    keywords: post.theme === "announcement"
      ? ["GPU hot module replacement", "GPU HMR", "CUDA hot reload", "ROCm development", "ZILM", "Vectant"]
      : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: post.title,
      description: post.summary,
      siteName: "Vectant",
      images: [{ url: post.image, alt: post.alt }],
      publishedTime: post.publishedAt,
      authors: ["Vectant"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [post.image],
    },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    image: `${SITE_URL}${post.image}`,
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    ...(post.publishedAt ? { datePublished: post.publishedAt, dateModified: post.publishedAt } : {}),
    author: {
      "@type": "Organization",
      name: "Vectant",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Vectant",
      url: SITE_URL,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: `${SITE_URL}/blog`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: canonicalUrl,
        },
      ],
    },
  };

  return (
    <>
      <main className={`${styles.page} ${post.theme === "announcement" ? styles.announcementPage : ""}`} id="top">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }}
        />
        <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Vectant home">
          <AnimatedLogo expanded={false} className={styles.logo} markClassName={styles.mark} />
        </Link>
        <Link href="/blog" className={styles.backLink}>
          <ArrowLeft size={15} weight="bold" />
          Back to blog
        </Link>
        </header>

        <article>
        <header className={styles.hero}>
          <p>{post.category}{post.date ? ` / ${post.date}` : ""}</p>
          <h1>{post.title}</h1>
          <span>{post.summary}</span>
          {post.theme === "announcement" ? (
            <aside className={styles.heroMeta}>
              <span>Product</span>
              <strong>Vectant</strong>
              <span>Release</span>
              <strong>{post.date}</strong>
              <span>Read time</span>
              <strong>3 min</strong>
            </aside>
          ) : null}
        </header>

        <figure className={styles.figure}>
          <Image
            src={post.image}
            alt={post.alt}
            fill
            priority
            quality={95}
            sizes="(max-width: 767px) 100vw, 90vw"
          />
        </figure>

        <div className={styles.body}>
          <aside>
            <span>{post.educational ? post.category : "Vectant"}</span>
            <p>
              {post.theme === "announcement"
                ? "Change the code. Keep the run."
                : post.educational
                ? "A visual explanation of infrastructure that most people only notice when it fails."
                : "Runtime control, scoped authority, and reviewable proof."}
            </p>
          </aside>
          <div>
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.image ? (
                  <figure className={styles.inlineFigure}>
                    <span className={styles.inlineImage}>
                      <Image
                        src={section.image}
                        alt={section.alt}
                        fill
                        quality={95}
                        sizes="(max-width: 767px) 100vw, 62vw"
                      />
                    </span>
                    <figcaption>{section.caption}</figcaption>
                  </figure>
                ) : null}
              </section>
            ))}

            {post.sources ? (
              <section className={styles.sources}>
                <h2>Source material</h2>
                <div>
                  {post.sources.map((source) => (
                    <a key={source.href} href={source.href} target="_blank" rel="noreferrer">
                      {source.label}
                      <ArrowUpRight size={15} weight="bold" />
                    </a>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
        </article>

        {post.theme === "announcement" ? (
        <section className={styles.cta}>
          <div>
            <p>Now available on Vectant</p>
            <span>Bring your existing GPU project and start the live loop.</span>
          </div>
          <a href="https://vectant.dev" target="_blank" rel="noreferrer">
            Try ZILM
            <ArrowUpRight size={16} weight="bold" />
          </a>
        </section>
      ) : post.educational ? (
        <section className={styles.cta}>
          <div>
            <p>More explainers</p>
            <span>Return to the blog for systems, tools, and operating ideas worth understanding.</span>
          </div>
          <Link href="/blog">
            Browse the blog
            <ArrowUpRight size={16} weight="bold" />
          </Link>
        </section>
      ) : (
        <section className={styles.cta}>
          <div>
            <p>See the system in context</p>
            <span>Bring a guarded repository and inspect a proof pilot with the team.</span>
          </div>
          <a href={PILOT_MAILTO}>
            Request a pilot
            <ArrowUpRight size={16} weight="bold" />
          </a>
        </section>
        )}
      </main>
      <Footer />
    </>
  );
}
