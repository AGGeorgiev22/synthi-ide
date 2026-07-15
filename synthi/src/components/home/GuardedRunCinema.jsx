"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import styles from "@/components/home/GuardedRunCinema.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ACTS = ["Before execution", "During execution", "After execution"];
const SAMPLE_RUN_ID = "VCT-SAMPLE-001";

const BOUNDARY = [
  ["Repository", "sample/gpu-kernel attached"],
  ["Environment", "Isolated demo runtime online"],
  ["Authority", "Read plus src/kernels/** write"],
  ["Limit", "ABI, state, and output must verify"],
];

const REPLAY_EVENTS = [
  {
    state: "Allowed",
    title: "Runtime state read",
    detail: "The agent reads fluid_sim.comp and the attached state token inside the sample boundary.",
  },
  {
    state: "Blocked",
    title: "ABI-breaking patch held",
    detail: "A proposal removes output binding 2. It leaves the hot path with the failed ABI condition attached.",
  },
  {
    state: "Escalated",
    title: "Scoped lease requested",
    detail: "The reviewer receives the rejected proposal, corrected patch, ABI result, and expected visual boundary.",
  },
  {
    state: "Approved",
    title: "Corrected kernel patch resumes",
    detail: "A one-use lease admits only approved.patch. rejected.patch remains in the same run record.",
  },
];

const PROOF_BUNDLE = [
  ["Change", "approved.patch + rejected.patch"],
  ["Decisions", "evt-001 through evt-004"],
  ["Runtime", "Retained state + visual event"],
  ["Proof", "Versioned JSON + SHA-256 index"],
];

function useOptionalRunSound(replayIndex) {
  const nodesRef = useRef(null);
  const [soundOn, setSoundOn] = useState(false);

  const stop = useCallback(() => {
    const nodes = nodesRef.current;
    if (!nodes) return;
    const { context, gain } = nodes;
    gain.gain.cancelScheduledValues(context.currentTime);
    gain.gain.setTargetAtTime(0, context.currentTime, 0.04);
    window.setTimeout(() => context.close().catch(() => {}), 180);
    nodesRef.current = null;
    setSoundOn(false);
  }, []);

  const toggle = useCallback(() => {
    if (nodesRef.current) {
      stop();
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const context = new AudioContext();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    const low = context.createOscillator();
    const high = context.createOscillator();

    low.type = "sine";
    high.type = "sine";
    low.frequency.value = 54;
    high.frequency.value = 81;
    high.detune.value = 7;
    filter.type = "lowpass";
    filter.frequency.value = 170;
    filter.Q.value = 0.8;
    gain.gain.value = 0;

    low.connect(filter);
    high.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    low.start();
    high.start();
    gain.gain.linearRampToValueAtTime(0.006, context.currentTime + 0.8);

    nodesRef.current = { context, filter, gain };
    setSoundOn(true);
  }, [stop]);

  useEffect(() => {
    const nodes = nodesRef.current;
    if (!nodes) return;
    const { context, filter, gain } = nodes;
    const tense = replayIndex === 1 || replayIndex === 2;
    filter.frequency.setTargetAtTime(tense ? 270 : 170, context.currentTime, 0.18);
    gain.gain.setTargetAtTime(tense ? 0.009 : 0.006, context.currentTime, 0.18);
  }, [replayIndex]);

  useEffect(() => stop, [stop]);

  return { soundOn, toggleSound: toggle };
}

export function GuardedRunCinema() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const railRef = useRef(null);
  const railProgressRef = useRef(null);
  const tokenRef = useRef(null);
  const sceneRefs = useRef([]);
  const branchPathRef = useRef(null);
  const branchStatusRef = useRef(null);
  const [replayIndex, setReplayIndex] = useState(1);
  const { soundOn, toggleSound } = useOptionalRunSound(replayIndex);
  const replayEvent = REPLAY_EVENTS[replayIndex];

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const scenes = sceneRefs.current.filter(Boolean);
          const branchPath = branchPathRef.current;
          const tokenTravel = () => Math.max(0, railRef.current.clientWidth - tokenRef.current.offsetWidth);

          gsap.set(scenes, { autoAlpha: 0, yPercent: 4 });
          gsap.set(scenes[0], { autoAlpha: 1, yPercent: 0 });
          gsap.set(railProgressRef.current, { scaleX: 0, transformOrigin: "left center" });
          gsap.set(tokenRef.current, { x: 0 });
          gsap.set(branchPath, { strokeDasharray: 1, strokeDashoffset: 1 });
          gsap.set(branchStatusRef.current, { autoAlpha: 0, y: 12 });

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top top",
              end: () => `+=${window.innerHeight * 3.35}`,
              pin: stageRef.current,
              pinSpacing: true,
              scrub: 0.62,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .addLabel("before", 0)
            .to({}, { duration: 0.52 })
            .to(scenes[0], { autoAlpha: 0, yPercent: -3, duration: 0.18, ease: "power2.in" })
            .set(scenes[1], { autoAlpha: 1 })
            .to(scenes[1], { yPercent: 0, duration: 0.28, ease: "power3.out" })
            .to(tokenRef.current, { x: () => tokenTravel() * 0.5, duration: 0.36, ease: "power3.inOut" }, "<")
            .to(railProgressRef.current, { scaleX: 0.5, duration: 0.36 }, "<")
            .addLabel("during")
            .to(branchPath, { strokeDashoffset: 0, duration: 0.5 }, "during+=0.08")
            .to(branchStatusRef.current, { autoAlpha: 1, y: 0, duration: 0.2, ease: "power3.out" }, "during+=0.24")
            .to({}, { duration: 0.7 })
            .to(branchStatusRef.current, { autoAlpha: 0.5, duration: 0.18 })
            .to(scenes[1], { autoAlpha: 0, yPercent: -3, duration: 0.18, ease: "power2.in" })
            .set(scenes[2], { autoAlpha: 1 })
            .to(scenes[2], { yPercent: 0, duration: 0.28, ease: "power3.out" })
            .to(tokenRef.current, { x: () => tokenTravel(), duration: 0.4, ease: "power3.inOut" }, "<")
            .to(railProgressRef.current, { scaleX: 1, duration: 0.4 }, "<")
            .addLabel("after")
            .to({}, { duration: 0.72 });

          return () => {
            timeline.scrollTrigger?.kill();
            timeline.kill();
          };
        },
      );

      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <section id="guarded-run" ref={rootRef} className={styles.run} aria-labelledby="guarded-run-title">
      <div ref={stageRef} className={styles.stage}>
        <header className={styles.runHeader}>
          <div>
            <span className={styles.sampleRun}>Synthetic sample · {SAMPLE_RUN_ID}</span>
            <h2 id="guarded-run-title">One guarded run. Three acts. One record.</h2>
            <p>Trace one GPU kernel change from boundary to approved patch without losing the rejected path.</p>
          </div>
          <button
            type="button"
            className={styles.soundControl}
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? "Mute guarded run sound" : "Enable guarded run sound"}
          >
            {soundOn ? <SpeakerHigh size={16} weight="bold" /> : <SpeakerSlash size={16} weight="bold" />}
            <span>{soundOn ? "Sound on" : "Sound off"}</span>
          </button>
        </header>

        <div ref={railRef} className={styles.actRail} aria-label="Guarded run acts">
          <i><b ref={railProgressRef} /></i>
          <em ref={tokenRef} aria-hidden="true"><span /></em>
          {ACTS.map((act) => <span key={act}>{act}</span>)}
        </div>

        <div className={styles.scenes}>
          <article
            id="runtime"
            ref={(node) => { sceneRefs.current[0] = node; }}
            className={styles.scene}
          >
            <div className={styles.sceneCopy}>
              <span>Before execution</span>
              <h3>The boundary exists before the first mutation.</h3>
              <p>The sample GPU repository, runtime, path authority, and verification gates attach under one run ID.</p>
              <dl className={styles.boundaryList}>
                {BOUNDARY.map(([term, detail]) => (
                  <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>
                ))}
              </dl>
            </div>
            <figure className={styles.sceneMedia}>
              <Image
                src="/product-proof/browser-workflow-observe-ui.png"
                alt="Vectant attaching an isolated runtime, observation, replay policy, and guarded workspace before execution"
                fill
                sizes="(max-width: 767px) 100vw, 58vw"
                className={`${styles.sceneImage} ${styles.boundaryImage}`}
              />
              <figcaption>Boundary contract attached</figcaption>
            </figure>
          </article>

          <article
            id="runtime-path"
            ref={(node) => { sceneRefs.current[1] = node; }}
            className={styles.scene}
          >
            <div className={styles.sceneCopy}>
              <span>During execution</span>
              <h3>Useful work proceeds. Unsafe work stops.</h3>
              <p>One read succeeds. One protected write is held, reviewed, and resumed only inside a temporary lease.</p>

              <div className={styles.replay}>
                <div className={styles.replayReadout} aria-live="polite">
                  <span>{replayEvent.state}</span>
                  <strong>{replayEvent.title}</strong>
                  <p>{replayEvent.detail}</p>
                </div>
                <label className={styles.replayScrubber}>
                  <span className={styles.replayLabel}>
                    <span>Scrub Black Box replay</span>
                    <b>{String(replayIndex + 1).padStart(2, "0")} / {String(REPLAY_EVENTS.length).padStart(2, "0")}</b>
                  </span>
                  <span className={styles.scrubControl}>
                    <span className={styles.scrubTrack} aria-hidden="true">
                      <b
                        className={styles.scrubProgress}
                        style={{ transform: `scaleX(${replayIndex / (REPLAY_EVENTS.length - 1)})` }}
                      />
                      {REPLAY_EVENTS.map((event, index) => (
                        <i
                          key={event.state}
                          className={styles.scrubMarker}
                          data-reached={index <= replayIndex}
                        />
                      ))}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max={REPLAY_EVENTS.length - 1}
                      step="1"
                      value={replayIndex}
                      onChange={(event) => setReplayIndex(Number(event.target.value))}
                      aria-label="Scrub Black Box replay"
                      aria-valuetext={`${replayEvent.state}: ${replayEvent.title}`}
                    />
                  </span>
                </label>
                <ol aria-label="Black Box replay events">
                  {REPLAY_EVENTS.map((event, index) => (
                    <li key={event.state} data-active={index === replayIndex}>{event.state}</li>
                  ))}
                </ol>
              </div>
            </div>

            <figure className={styles.sceneMedia}>
              <Image
                src="/codesite-proof/codesite-black-box-desktop.png"
                alt="Vectant Black Box preserving an allowed read, denied write, escalation, approval, and ordered replay"
                fill
                sizes="(max-width: 767px) 100vw, 58vw"
                className={`${styles.sceneImage} ${styles.blackBoxImage}`}
              />
              <svg className={styles.failureBranch} viewBox="0 0 760 420" preserveAspectRatio="none" aria-hidden="true">
                <path
                  ref={branchPathRef}
                  pathLength="1"
                  d="M 60 186 C 226 186 244 330 392 330 C 536 330 548 186 704 186"
                />
                <circle cx="60" cy="186" r="5" />
                <circle cx="392" cy="330" r="7" />
                <circle cx="704" cy="186" r="5" />
              </svg>
              <div ref={branchStatusRef} className={styles.branchStatus}>
                <span>Rejected branch retained</span>
                <strong>Reason rejoins the final proof bundle</strong>
              </div>
            </figure>
          </article>

          <article
            id="proof"
            ref={(node) => { sceneRefs.current[2] = node; }}
            className={styles.scene}
          >
            <div className={styles.sceneCopy}>
              <span>After execution</span>
              <h3>The change leaves with its reasons.</h3>
              <p>The approved GPU diff, rejected ABI branch, retained state, and review trail travel together.</p>
              <dl className={styles.proofList}>
                {PROOF_BUNDLE.map(([term, detail]) => (
                  <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>
                ))}
              </dl>
            </div>
            <figure className={styles.sceneMedia}>
              <Image
                src="/product-proof/codesite-full-workflow-proof.png"
                alt="Vectant proof bundle with the reviewed change, authority decisions, runtime state, provenance, and export"
                fill
                sizes="(max-width: 767px) 100vw, 58vw"
                className={`${styles.sceneImage} ${styles.proofImage}`}
              />
              <figcaption>Replay and export ready</figcaption>
            </figure>
          </article>
        </div>
      </div>
    </section>
  );
}
