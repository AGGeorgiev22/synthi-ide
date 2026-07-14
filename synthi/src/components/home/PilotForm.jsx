"use client";

import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";

import styles from "@/components/home/PilotForm.module.css";
import { PILOT_EMAIL } from "@/lib/pilot";

function fallbackMailto({ email, company, workflow }) {
  const subject = encodeURIComponent(`Vectant proof pilot: ${company}`);
  const body = encodeURIComponent(
    `Work email: ${email}\nCompany or team: ${company}\n\nDifficult system and guarded workflow:\n${workflow}`,
  );
  return `mailto:${PILOT_EMAIL}?subject=${subject}&body=${body}`;
}

export function PilotForm() {
  const [state, setState] = useState({ status: "idle", message: "" });
  const [fallback, setFallback] = useState(`mailto:${PILOT_EMAIL}`);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    setFallback(fallbackMailto(values));
    setState({ status: "loading", message: "Sending the pilot request." });

    try {
      const response = await fetch("/api/pilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "The request could not be sent.");

      form.reset();
      setState({
        status: "success",
        message: "Request received. We will reply with scope questions before asking for access.",
      });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "The request could not be sent.",
      });
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-describedby="pilot-form-status">
      <div className={styles.shortFields}>
        <label>
          <span>Work email</span>
          <input name="email" type="email" autoComplete="email" maxLength={160} required />
        </label>
        <label>
          <span>Company or team</span>
          <input name="company" type="text" autoComplete="organization" maxLength={120} required />
        </label>
      </div>

      <label>
        <span>Difficult system and guarded workflow</span>
        <textarea name="workflow" rows={3} maxLength={1400} required />
      </label>

      <div className={styles.submitRow}>
        <button type="submit" disabled={state.status === "loading"}>
          {state.status === "loading" ? "Sending request" : "Scope the proof pilot"}
          <ArrowRight size={16} weight="bold" aria-hidden="true" />
        </button>
        <p id="pilot-form-status" role="status" data-status={state.status}>
          {state.status === "error" ? (
            <>
              {state.message} <a href={fallback}>Send the same details by email.</a>
            </>
          ) : state.message}
        </p>
      </div>
    </form>
  );
}
