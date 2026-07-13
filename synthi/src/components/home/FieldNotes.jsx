import styles from "@/components/home/FieldNotes.module.css";

const NOTES = [
  {
    question: "Does Vectant replace our coding agents?",
    answer: "No. Vectant is the governed runtime around them. Keep Codex, Claude Code, terminal agents, or your own stack while Vectant manages workspace state, authority, and proof.",
  },
  {
    question: "What does a proof pilot include?",
    answer: "We connect a guarded repository or compiled system, define the mutation boundary, run real agent work, and hand back the evidence needed to review what happened.",
  },
  {
    question: "Is GPU HMR limited to ROCm and HIP?",
    answer: "The public visual proof is ROCm and HIP. CUDA and other native routes are validated in hardware-backed pilots against the same state, ABI, output, and promotion gates.",
  },
  {
    question: "Can humans and agents share one workspace?",
    answer: "Yes. Shared rooms keep presence, routes, claims, conflicts, runtime state, and handoff context in the same governed session.",
  },
];

export function FieldNotes() {
  return (
    <section id="faq" className={styles.fieldNotes}>
      <div className={styles.fieldNotesShell}>
        <header className={styles.fieldNotesHeader}>
          <div>
            <p>END NOTES / PILOT BRIEFING</p>
            <h2>What technical teams ask before a flight.</h2>
          </div>
          <span>Four practical answers</span>
        </header>

        <div className={styles.fieldNotesList}>
          {NOTES.map(({ question, answer }, index) => (
            <details key={question}>
              <summary>
                <b>0{index + 1}</b>
                <span>{question}</span>
                <i aria-hidden="true" />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
