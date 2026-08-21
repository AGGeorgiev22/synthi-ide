import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import { Logo } from "@/components/Logo";
import { NotFoundBackgroundLoader } from "@/app/NotFoundBackgroundLoader";
import styles from "@/app/not-found.module.css";

export const metadata = {
  title: "Page not found | Vectant",
  description: "The requested Vectant page could not be found.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className={styles.notFound}>
      <NotFoundBackgroundLoader />
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Vectant home">
          <Logo className={styles.logo} />
        </Link>
      </header>

      <section className={styles.content} aria-labelledby="not-found-heading">
        <div className={styles.message}>
          <p className={styles.status}>Route status: 404</p>
          <h1 id="not-found-heading">No route lives here.</h1>
          <p className={styles.intro}>
            The address may be stale, private, or incomplete. Return to Vectant or continue from the technical reference.
          </p>
          <div className={styles.actions}>
            <Link href="/" className={styles.primaryAction}>
              <ArrowLeft size={17} weight="bold" aria-hidden="true" />
              Back to Vectant
            </Link>
            <Link href="/docs" className={styles.secondaryAction}>
              Read the docs
              <ArrowUpRight size={17} weight="bold" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <aside className={styles.routeArtifact} aria-label="Route resolution failed: page not found">
          <div className={styles.routeFrame}>
            <p>There is no endpoint at this address.</p>
            <div className={styles.errorCode} aria-hidden="true">
              <span>4</span>
              <span>0</span>
              <span>4</span>
            </div>
          </div>
          <p className={styles.routeCaption}>A path needs a destination.</p>
        </aside>
      </section>
    </main>
  );
}
