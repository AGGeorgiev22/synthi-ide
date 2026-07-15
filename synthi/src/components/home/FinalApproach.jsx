"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { VectantMark } from "@/components/Logo";
import { PilotForm } from "@/components/home/PilotForm";
import styles from "@/components/home/FinalApproach.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const RECEIPT = [
  { term: "Timeline", detail: "10 working days after access" },
  { term: "Support", detail: "Kickoff, working sessions, handoff" },
  { term: "Pricing", detail: "Fixed quote before access" },
];

const OFFER_DETAILS = [
  {
    term: "Required access",
    detail: "One repository or difficult system, a non-production environment, and one technical owner.",
  },
  {
    term: "Vectant configures",
    detail: "The workspace boundary, model and MCP access, permission leases, guarded workflow, and proof export.",
  },
  {
    term: "Deliverables",
    detail: "A configured workflow, boundary contract, replayable decision trail, change evidence, and proof review.",
  },
  {
    term: "Success criteria",
    detail: "One meaningful scoped change lands, a rejected action stays visible, and the evidence export replays.",
  },
];

export function FinalApproach() {
  const rootRef = useRef(null);
  const surfaceRef = useRef(null);
  const atmosphereRef = useRef(null);
  const leftShutterRef = useRef(null);
  const rightShutterRef = useRef(null);
  const handoffMarkRef = useRef(null);
  const copyRef = useRef(null);
  const offerRef = useRef(null);
  const receiptRef = useRef(null);
  const runwayRef = useRef(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(min-width: 1200px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(surfaceRef.current, { autoAlpha: 0.18, scale: 1.025 });
        gsap.set(atmosphereRef.current, { scale: 1.09, yPercent: 2.5 });
        gsap.set(copyRef.current, { autoAlpha: 0, y: 54 });
        gsap.set(offerRef.current, { autoAlpha: 0, y: 130, rotateX: 8, scale: 0.92 });
        gsap.set(receiptRef.current, { autoAlpha: 0, y: 28 });
        gsap.set(runwayRef.current, { scaleX: 0.08 });
        gsap.set(handoffMarkRef.current, { autoAlpha: 1, scale: 1 });

        const timeline = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .addLabel("open", 0)
          .to(leftShutterRef.current, { xPercent: -104, duration: 0.62 }, "open")
          .to(rightShutterRef.current, { xPercent: 104, duration: 0.62 }, "open")
          .to(surfaceRef.current, { autoAlpha: 1, scale: 1, duration: 0.58 }, "open+=0.04")
          .to(atmosphereRef.current, { scale: 1, yPercent: 0, duration: 1.12, ease: "power2.out" }, "open")
          .to(handoffMarkRef.current, { autoAlpha: 0, scale: 0.72, duration: 0.24, ease: "power2.in" }, "open+=0.12")
          .to(runwayRef.current, { scaleX: 1, duration: 0.54 }, "open+=0.18")
          .addLabel("invitation", 0.42)
          .to(copyRef.current, { autoAlpha: 1, y: 0, duration: 0.48, ease: "power3.out" }, "invitation")
          .to(offerRef.current, { autoAlpha: 1, y: 0, rotateX: 0, scale: 1, duration: 0.68, ease: "power3.out" }, "invitation+=0.18")
          .to(receiptRef.current, { autoAlpha: 1, y: 0, duration: 0.36, ease: "power2.out" }, "invitation+=0.62")
          .to({}, { duration: 0.4 });

        return () => timeline.kill();
      });

      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      id="pilot"
      ref={rootRef}
      className={styles.finalApproach}
      data-film-act="daylight"
      aria-labelledby="pilot-title"
    >
      <div id="waitlist" className={styles.finalApproachSticky}>
        <div ref={surfaceRef} className={styles.finalSurface}>
          <Image
            ref={atmosphereRef}
            src="/cinema/controlled-flight-dawn-6k.png"
            alt=""
            fill
            quality={90}
            sizes="(max-aspect-ratio: 12/5) 270vh, 110vw"
            className={styles.finalAtmosphere}
            aria-hidden="true"
          />
          <div className={styles.finalRunway} aria-hidden="true">
            <i ref={runwayRef} />
            <i />
            <i />
          </div>

          <div ref={copyRef} className={styles.finalCopy}>
            <h2 id="pilot-title">
              <span>One difficult system.</span>
              <span>One guarded workflow.</span>
              <span>One replayable proof bundle.</span>
            </h2>
            <p>
              A typical pilot runs for 10 working days after access is approved. We configure the
              boundary with your technical owner, support the run, and hand back the evidence.
            </p>
            <p className={styles.pricingNote}>
              A fixed quote is confirmed before access. A public price range is not published yet.
            </p>
          </div>

          <aside id="pricing" ref={offerRef} className={styles.finalOffer} aria-label="Proof pilot details">
            <header>
              <span>Defined proof pilot</span>
              <strong>Scope first. Access second.</strong>
            </header>
            <dl className={styles.offerDetails}>
              {OFFER_DETAILS.map((item) => (
                <div key={item.term}>
                  <dt>{item.term}</dt>
                  <dd>{item.detail}</dd>
                </div>
              ))}
            </dl>
            <PilotForm />
          </aside>

          <dl ref={receiptRef} className={styles.finalReceipt}>
            {RECEIPT.map((item) => (
              <div key={item.term}>
                <dt>{item.term}</dt>
                <dd>{item.detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={styles.finalShutters} aria-hidden="true">
          <i ref={leftShutterRef} className={styles.finalShutterLeft} />
          <i ref={rightShutterRef} className={styles.finalShutterRight} />
        </div>

        <div ref={handoffMarkRef} className={styles.finalHandoffMark} aria-hidden="true">
          <VectantMark gradientId="final-handoff-mark" />
        </div>
      </div>
    </section>
  );
}
