import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import styles from "@/components/home/NewsRegardingVectant.module.css";

const STORIES = [
  {
    slug: "introducing-zilm",
    category: "Product release",
    title: "Introducing ZILM",
    summary: "Project-agnostic GPU hot module replacement that preserves runtime state while GPU code changes.",
    image: "/zilm-cover.png",
    alt: "ZILM product artwork with spectral light and the ZILM wordmark",
    linkLabel: "Read the launch note",
    featured: true,
  },
  {
    slug: "live-state-is-a-control-surface",
    category: "Runtime",
    title: "Live state is a control surface",
    summary: "A running system tells the reviewer what a diff cannot.",
    image: "/product-proof/browser-workspace-loaded.png",
    alt: "Vectant workspace running a web application inside the browser",
    linkLabel: "Read the article",
  },
  {
    slug: "why-a-denied-write-matters",
    category: "CodeSite",
    title: "Why a denied write matters",
    summary: "A rejected action should leave a useful trail for the next decision.",
    image: "/product-proof/codesite-line-inspector-ui-desktop.png",
    alt: "CodeSite line inspector showing code change evidence",
    linkLabel: "Read the article",
  },
];

export function NewsRegardingVectant() {
  return (
    <section id="news" className={styles.news} aria-labelledby="news-regarding-vectant">
      <div className={styles.newsShell}>
        <header className={styles.newsHeader}>
          <h2 id="news-regarding-vectant">News regarding Vectant.</h2>
          <p>Product releases and engineering writing from the team building controlled runs for coding agents.</p>
          <Link href="/blog" className={styles.allNews}>
            Browse all writing
            <ArrowUpRight size={17} weight="light" aria-hidden="true" />
          </Link>
        </header>

        <div className={styles.newsGrid}>
          {STORIES.map((story) => (
            <article
              key={story.slug}
              className={`${styles.newsFrame} ${story.featured ? styles.featuredFrame : styles.supportingFrame}`}
            >
              <Link href={`/blog/${story.slug}`} className={styles.newsCard}>
                <figure className={styles.storyMedia}>
                  <Image
                    src={story.image}
                    alt={story.alt}
                    fill
                    quality={95}
                    sizes={story.featured ? "(max-width: 899px) calc(100vw - 2rem), (max-width: 1200px) 56vw, 50vw" : "(max-width: 899px) calc(100vw - 2rem), (max-width: 1200px) 42vw, 32vw"}
                  />
                </figure>
                <div className={styles.storyCopy}>
                  <p>{story.category}</p>
                  <h3>{story.title}</h3>
                  <span>{story.summary}</span>
                  <strong>
                    {story.linkLabel}
                    <ArrowUpRight size={16} weight="light" aria-hidden="true" />
                  </strong>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
