import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import { Logo } from "@/components/Logo";
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
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Vectant home">
          <Logo className={styles.logo} />
        </Link>
      </header>

      <section className={styles.content} aria-labelledby="not-found-heading">
        <div className={styles.message}>
          <p className={styles.status}>Route status: 404</p>
          <h1 id="not-found-heading">This route does not resolve.</h1>
          <p className={styles.intro}>
            The page may have moved, or the address is incomplete. Start from the control plane or inspect the technical reference.
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

        <aside className={styles.statusPanel} aria-label="Not found status">
          <span>404</span>
          <p>Not found</p>
        </aside>
      </section>
    </main>
  );
}
