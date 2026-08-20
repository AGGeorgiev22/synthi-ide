import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import { AnimatedLogo, Logo } from "@/components/Logo";
import { PILOT_MAILTO } from "@/lib/pilot";

import { POSTS } from "./posts";
import styles from "./blog.module.css";

export const metadata = {
  title: "Blog - Vectant",
  description: "Writing about runtime control, agent authority, and reviewable proof.",
};

const [featured, ...posts] = POSTS;

export default function BlogPage() {
  return (
    <main className={styles.page} id="top">
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
        <p>The Vectant blog</p>
        <h1 id="journal-title">Operating notes for systems that let agents act.</h1>
        <span>
          Arguments, product evidence, and design direction for agent systems that need a real runtime boundary.
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
