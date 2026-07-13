import { AuthorityStory } from "@/components/home/AuthorityStory";
import { CinematicHero } from "@/components/home/CinematicHero";
import { FinalApproach } from "@/components/home/FinalApproach";
import { GpuProofChapter } from "@/components/home/GpuProofChapter";
import { RunBoundary } from "@/components/home/RunBoundary";
import { RuntimeFeedback } from "@/components/home/RuntimeFeedback";
import styles from "@/components/home/VectantHome.module.css";

const FAQ = [
  {
    question: "Does Vectant replace our coding agents?",
    answer: "No. Vectant is the governed runtime around them. Keep Codex, Claude Code, terminal agents, or your own stack while Vectant manages workspace state, authority, and proof.",
  },
  {
    question: "What does a proof pilot include?",
    answer: "We connect a guarded repository or compiled system, define the mutation boundary, run real agent work, and hand back the evidence needed to review what happened.",
  },
  {
    question: "Is GPU HMR limited to ROCm/HIP?",
    answer: "The public visual proof is ROCm/HIP. CUDA and other native routes are validated in hardware-backed pilots against the same state, ABI, output, and promotion gates.",
  },
  {
    question: "Can humans and agents share one workspace?",
    answer: "Yes. Shared rooms keep presence, routes, claims, conflicts, runtime state, and handoff context in the same governed session.",
  },
];

function FaqSection() {
  return (
    <section id="faq" className={styles.faqCinema}>
      <div className={styles.faqCinemaShell}>
        <div className={styles.faqCinemaIntro}>
          <h2>What serious teams ask first.</h2>
          <p>Concrete answers for the people responsible for what reaches production.</p>
        </div>
        <div className={styles.faqCinemaList}>
          {FAQ.map(({ question, answer }) => (
            <details key={question}>
              <summary>{question}<span aria-hidden="true" /></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function VectantLanding() {
  return (
    <main id="main-content" className={styles.page}>
      <CinematicHero />
      <RunBoundary />
      <AuthorityStory />
      <GpuProofChapter />
      <RuntimeFeedback />
      <FinalApproach />
      <FaqSection />
    </main>
  );
}
