import styles from "@/components/home/FieldNotes.module.css";

const QUESTIONS = [
  {
    topic: "Agents",
    question: "Does Vectant replace our coding agents?",
    answer: "No. Vectant is the governed runtime around them. Keep Codex, Claude Code, terminal agents, or your own stack while Vectant manages workspace state, authority, and proof.",
  },
  {
    topic: "Pilot",
    question: "What happens in a proof pilot?",
    answer: "We connect a guarded repository or compiled system, define its mutation boundary, run real agent work, and return the evidence needed to review what happened.",
  },
  {
    topic: "GPU HMR",
    question: "Is live patching limited to ROCm and HIP?",
    answer: "The public visual proof is ROCm and HIP. CUDA and other native routes are validated in hardware-backed pilots against the same state, ABI, output, and promotion gates.",
  },
  {
    topic: "Workspace",
    question: "Can humans and agents share one runtime?",
    answer: "Yes. Shared rooms keep presence, routes, claims, conflicts, runtime state, and handoff context in the same governed session.",
  },
];

export function FieldNotes() {
  return (
    <section id="faq" className={styles.fieldNotes}>
      <div className={styles.fieldNotesShell}>
        <header className={styles.fieldNotesHeader}>
          <h2>Questions for the first run.</h2>
          <div>
            <p>
              The practical constraints teams ask about before Vectant touches a guarded system.
            </p>
            <span>Bring your agent. Keep the boundary.</span>
          </div>
        </header>

        <div className={styles.fieldNotesList}>
          {QUESTIONS.map(({ topic, question, answer }, index) => (
            <details key={question} name="technical-questions" open={index === 0 ? true : undefined}>
              <summary>
                <span className={styles.fieldNotesTopic}>{topic}</span>
                <span className={styles.fieldNotesQuestion}>{question}</span>
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
