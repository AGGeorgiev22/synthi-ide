import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";

import { Logo } from "@/components/Logo";
import { PILOT_MAILTO } from "@/lib/pilot";

import { POSTS, getPost } from "../posts";
import styles from "./article.module.css";

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) return {};

  return {
    title: `${post.title} - Vectant`,
    description: post.summary,
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  return (
    <main className={styles.page} id="top">
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Vectant home">
          <Logo className={styles.logo} markClassName={styles.mark} />
        </Link>
        <Link href="/blog" className={styles.backLink}>
          <ArrowLeft size={15} weight="bold" />
          Back to blog
        </Link>
      </header>

      <article>
        <header className={styles.hero}>
          <p>{post.category}</p>
          <h1>{post.title}</h1>
          <span>{post.summary}</span>
        </header>

        <figure className={styles.figure}>
          <Image src={post.image} alt={post.alt} fill priority sizes="(max-width: 767px) 100vw, 90vw" />
        </figure>

        <div className={styles.body}>
          <aside>
            <span>{post.educational ? post.category : "Vectant"}</span>
            <p>
              {post.educational
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
                      <Image src={section.image} alt={section.alt} fill sizes="(max-width: 767px) 100vw, 62vw" />
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

      {post.educational ? (
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
  );
}
