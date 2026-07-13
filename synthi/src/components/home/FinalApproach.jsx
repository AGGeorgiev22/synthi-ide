"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { VectantMark } from "@/components/Logo";
import styles from "@/components/home/FinalApproach.module.css";
import { PILOT_MAILTO } from "@/lib/pilot";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const RECEIPT = [
  { term: "Boundary", detail: "Scoped before work" },
  { term: "Runtime", detail: "State held live" },
  { term: "Evidence", detail: "Replay attached" },
];

export function FinalApproach() {
  const rootRef = useRef(null);
  const surfaceRef = useRef(null);
  const leftShutterRef = useRef(null);
  const rightShutterRef = useRef(null);
  const handoffMarkRef = useRef(null);
  const copyRef = useRef(null);
  const productRef = useRef(null);
  const receiptRef = useRef(null);
  const runwayRef = useRef(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(surfaceRef.current, { autoAlpha: 0.18, scale: 1.025 });
        gsap.set(copyRef.current, { autoAlpha: 0, y: 54 });
        gsap.set(productRef.current, { autoAlpha: 0, y: 130, rotateX: 8, scale: 0.92 });
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
          .to(handoffMarkRef.current, { autoAlpha: 0, scale: 0.72, duration: 0.24, ease: "power2.in" }, "open+=0.12")
          .to(runwayRef.current, { scaleX: 1, duration: 0.54 }, "open+=0.18")
          .addLabel("invitation", 0.42)
          .to(copyRef.current, { autoAlpha: 1, y: 0, duration: 0.48, ease: "power3.out" }, "invitation")
          .to(productRef.current, { autoAlpha: 1, y: 0, rotateX: 0, scale: 1, duration: 0.68, ease: "power3.out" }, "invitation+=0.18")
          .to(receiptRef.current, { autoAlpha: 1, y: 0, duration: 0.36, ease: "power2.out" }, "invitation+=0.62")
          .to({}, { duration: 0.4 });

        return () => timeline.kill();
      });

      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <section id="pricing" ref={rootRef} className={styles.finalApproach} data-film-act="daylight">
      <div id="waitlist" className={styles.finalApproachSticky}>
        <div ref={surfaceRef} className={styles.finalSurface}>
          <div className={styles.finalRunway} aria-hidden="true">
            <i ref={runwayRef} />
            <i />
            <i />
          </div>

          <div ref={copyRef} className={styles.finalCopy}>
            <h2>
              <span>Put one hard system</span>
              <span>under control.</span>
            </h2>
            <p>
              Start with the repository you still will not hand to an agent. Scope its authority,
              keep live state visible, and leave with proof your team can replay.
            </p>
            <a href={PILOT_MAILTO} className={styles.finalAction}>
              Request a proof pilot
              <ArrowUpRight size={17} weight="bold" />
            </a>
          </div>

          <figure ref={productRef} className={styles.finalProduct}>
            <div className={styles.finalProductMedia}>
              <Image
                src="/product-proof/codesite-full-workflow-ui.png"
                alt="Vectant control plane showing a full workflow, airspace map, collision forecast, and landing queue"
                fill
                sizes="(max-width: 767px) calc(100vw - 2rem), 64vw"
                className={styles.finalProductImage}
              />
            </div>
            <figcaption>
              <span>Full workflow proof</span>
              <b>3 flights</b>
              <b>1 lease</b>
              <b>2 transactions</b>
              <b>0 required</b>
            </figcaption>
          </figure>

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
