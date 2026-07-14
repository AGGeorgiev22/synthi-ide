"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import styles from "@/components/home/GpuProofChapter.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const GATES = ["State retained", "ABI matched", "Patch applied", "Output verified"];

export function GpuProofChapter() {
  const rootRef = useRef(null);
  const introRef = useRef(null);
  const plateRef = useRef(null);
  const pathRef = useRef(null);
  const gateRefs = useRef([]);
  const diffRef = useRef(null);
  const afterMaskRef = useRef(null);
  const dividerRef = useRef(null);
  const verdictRef = useRef(null);
  const latencyRef = useRef(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const gates = gateRefs.current.filter(Boolean);
        const latency = { value: 0 };
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.58,
            invalidateOnRefresh: true,
          },
        });

        gsap.set(introRef.current, { autoAlpha: 1, y: 0 });
        gsap.set(plateRef.current, { autoAlpha: 0, scale: 0.84, yPercent: 9 });
        gsap.set(pathRef.current, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(gates, { color: "rgba(231, 233, 239, 0.36)" });
        gsap.set(diffRef.current, { autoAlpha: 0, scale: 0.985 });
        gsap.set(afterMaskRef.current, { clipPath: "inset(0 100% 0 0)" });
        gsap.set(dividerRef.current, { left: "0%", autoAlpha: 0 });
        gsap.set(verdictRef.current, { autoAlpha: 0, y: 24 });
        if (latencyRef.current) latencyRef.current.textContent = "0";

        timeline
          .addLabel("pressure", 0)
          .to(pathRef.current, { strokeDashoffset: 0, duration: 0.76, ease: "none" }, 0.12)
          .to(plateRef.current, { autoAlpha: 1, scale: 1, yPercent: 0, duration: 0.58, ease: "power3.out" }, 0.2)
          .to(introRef.current, { autoAlpha: 0, y: -34, duration: 0.16, ease: "power2.in" }, 0.62)
          .to(gates[0], { color: "#f2efe9", duration: 0.12 }, 0.56)
          .to(gates[1], { color: "#f2efe9", duration: 0.12 }, 0.72)
          .addLabel("patch", 0.84)
          .to(gates[2], { color: "#ff7657", duration: 0.1 }, "patch")
          .to(diffRef.current, { autoAlpha: 1, scale: 1, duration: 0.14, ease: "power3.out" }, "patch")
          .to(diffRef.current, { autoAlpha: 0.48, duration: 0.22 }, 1.02)
          .addLabel("compare", 1.08)
          .to(dividerRef.current, { autoAlpha: 1, duration: 0.06 }, "compare")
          .to(afterMaskRef.current, { clipPath: "inset(0 0% 0 0)", duration: 0.58, ease: "power2.inOut" }, "compare")
          .to(dividerRef.current, { left: "100%", duration: 0.58, ease: "power2.inOut" }, "compare")
          .to(diffRef.current, { autoAlpha: 0, duration: 0.28 }, 1.34)
          .to(gates[3], { color: "#ff7657", duration: 0.12 }, 1.5)
          .to(verdictRef.current, { autoAlpha: 1, y: 0, duration: 0.24, ease: "power3.out" }, 1.52)
          .to(
            latency,
            {
              value: 90,
              duration: 0.28,
              ease: "power2.out",
              snap: { value: 1 },
              onUpdate: () => {
                if (latencyRef.current) latencyRef.current.textContent = String(Math.round(latency.value));
              },
            },
            1.52,
          )
          .to(dividerRef.current, { autoAlpha: 0, duration: 0.16 }, 1.64)
          .to(plateRef.current, { scale: 1.025, duration: 0.42, ease: "none" }, 1.58)
          .to({}, { duration: 0.24 });

        return () => timeline.kill();
      });

      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <section id="gpu-hmr" ref={rootRef} className={styles.gpuCinema} data-film-act="gpu-climax">
      <div className={styles.gpuStage}>
        <svg className={styles.gpuHotPath} viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
          <path
            ref={pathRef}
            pathLength="1"
            d="M -80 820 C 280 775 486 630 800 452 C 1094 286 1300 142 1680 76"
          />
        </svg>

        <div ref={introRef} className={styles.gpuIntro}>
          <p>GPU hot reload</p>
          <h2>Change the kernel. Keep the moment.</h2>
          <span>A compiled patch moves only when live state, ABI, output, and evidence agree.</span>
        </div>

        <figure ref={plateRef} className={styles.gpuPlate}>
          <div className={styles.gpuImageLayer}>
            <Image
              src="/product-proof/gpu-hmr-before.png"
              alt="GPU scene before a live hot reload patch"
              fill
              sizes="(max-width: 767px) 92vw, (min-width: 1200px) 1040px, 88vw"
              className={styles.gpuImage}
            />
          </div>

          <div ref={afterMaskRef} className={`${styles.gpuImageLayer} ${styles.gpuAfterLayer}`}>
            <Image
              src="/product-proof/gpu-hmr-after.png"
              alt="GPU scene after the compiled patch, with live state retained"
              fill
              sizes="(max-width: 767px) 92vw, (min-width: 1200px) 1040px, 88vw"
              className={styles.gpuImage}
            />
          </div>

          <div ref={diffRef} className={`${styles.gpuImageLayer} ${styles.gpuDiffLayer}`} aria-hidden="true">
            <Image
              src="/product-proof/gpu-hmr-diff.png"
              alt=""
              fill
              sizes="(max-width: 767px) 92vw, (min-width: 1200px) 1040px, 88vw"
              className={styles.gpuImage}
            />
          </div>

          <i ref={dividerRef} className={styles.gpuDivider} aria-hidden="true" />

          <figcaption className={styles.gpuGates}>
            {GATES.map((gate, index) => (
              <span key={gate} ref={(node) => { gateRefs.current[index] = node; }}>{gate}</span>
            ))}
          </figcaption>

          <div ref={verdictRef} className={styles.gpuVerdict}>
            <div className={styles.gpuVerdictCopy}>
              <span>No reset</span>
              <strong>Live state stayed attached.</strong>
            </div>
            <div className={styles.gpuLatency}>
              <p>Measured edit-to-visual</p>
              <b aria-label="Under 90 milliseconds">
                <i aria-hidden="true">&lt;</i>
                <em ref={latencyRef}>90</em>
                <small>ms</small>
              </b>
              <span>No matter the project size, only the changed boundary enters the hot path.</span>
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}
