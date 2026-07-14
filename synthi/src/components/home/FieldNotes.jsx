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
    answer: "A typical pilot runs for 10 working days after access. We connect one guarded repository or difficult system, define one mutation boundary and workflow, run scoped agent work, and hand back the replayable proof bundle.",
  },
  {
    topic: "GPU HMR",
    question: "Is live patching limited to ROCm and HIP?",
    answer: "The public visual proof is ROCm and HIP. CUDA and other native routes are not presented as generally validated; each route must be scoped and verified in the pilot environment before it is included.",
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
