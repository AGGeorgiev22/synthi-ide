"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import styles from "@/components/home/CinematicHero.module.css";
import { PILOT_MAILTO } from "@/lib/pilot";

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger, useGSAP);

export function CinematicHero() {
  const rootRef = useRef(null);
  const atmosphereRef = useRef(null);
  const routePathRef = useRef(null);
  const routeTokenRef = useRef(null);
  const conflictRef = useRef(null);
  const incidentRef = useRef(null);
  const copyRef = useRef(null);
  const shutterLeftRef = useRef(null);
  const shutterRightRef = useRef(null);
  const productRef = useRef(null);
  const productImageRef = useRef(null);
  const productTelemetryRef = useRef(null);
  const productFrameRef = useRef(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const routePath = routePathRef.current;
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.55,
            invalidateOnRefresh: true,
          },
        });

        gsap.set(routePath, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(routeTokenRef.current, {
          autoAlpha: 0,
          motionPath: {
            path: routePath,
            align: routePath,
            alignOrigin: [0.5, 0.5],
            start: 0,
            end: 0,
          },
        });
        gsap.set([conflictRef.current, incidentRef.current], { autoAlpha: 0 });
        gsap.set(shutterLeftRef.current, { xPercent: -108 });
        gsap.set(shutterRightRef.current, { xPercent: 108 });
        gsap.set(productRef.current, { autoAlpha: 0, scale: 0.82, yPercent: 7 });
        gsap.set([productTelemetryRef.current, productFrameRef.current], { autoAlpha: 0 });

        gsap.fromTo(
          copyRef.current,
          { autoAlpha: 0, y: 28, clipPath: "inset(0 0 100% 0)" },
          {
            autoAlpha: 1,
            y: 0,
            clipPath: "inset(0 0 0% 0)",
            duration: 1.05,
            ease: "power4.out",
            delay: 0.14,
          },
        );

        timeline
          .addLabel("coldOpen", 0)
          .to(
            atmosphereRef.current,
            { scale: 1.085, xPercent: -1.8, yPercent: -2.2, duration: 1.25 },
            "coldOpen",
          )
          .to(routePath, { strokeDashoffset: 0, duration: 0.72 }, 0.08)
          .to(
            routeTokenRef.current,
            {
              autoAlpha: 1,
              motionPath: {
                path: routePath,
                align: routePath,
                alignOrigin: [0.5, 0.5],
                start: 0,
                end: 1,
              },
              duration: 0.72,
            },
            0.08,
          )
          .addLabel("conflict", 0.76)
          .to(conflictRef.current, { autoAlpha: 1, scale: 1.15, duration: 0.07, ease: "power3.out" }, "conflict")
          .to(incidentRef.current, { autoAlpha: 1, y: -8, duration: 0.12, ease: "power3.out" }, "conflict")
          .to(copyRef.current, { autoAlpha: 0, y: -54, duration: 0.2, ease: "power2.in" }, 0.82)
          .to(shutterLeftRef.current, { xPercent: 0, duration: 0.2, ease: "power4.in" }, 0.82)
          .to(shutterRightRef.current, { xPercent: 0, duration: 0.2, ease: "power4.in" }, 0.82)
          .set(productRef.current, { autoAlpha: 1 }, 1.01)
          .to(incidentRef.current, { autoAlpha: 0, duration: 0.06 }, 1.01)
          .addLabel("aperture", 1.02)
          .to(shutterLeftRef.current, { xPercent: -108, duration: 0.34, ease: "power4.inOut" }, "aperture")
          .to(shutterRightRef.current, { xPercent: 108, duration: 0.34, ease: "power4.inOut" }, "aperture")
          .to(productRef.current, { scale: 1, yPercent: 0, duration: 0.62, ease: "power3.out" }, "aperture")
          .fromTo(
            productImageRef.current,
            { scale: 1.075, xPercent: 1.8 },
            { scale: 1.01, xPercent: 0, duration: 0.78 },
            "aperture",
          )
          .to([productFrameRef.current, productTelemetryRef.current], { autoAlpha: 1, duration: 0.2 }, 1.28)
          .to({}, { duration: 0.22 });

        return () => timeline.kill();
      });

      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <section id="top" ref={rootRef} className={styles.cinemaHero} data-film-act="cold-open">
      <div className={styles.cinemaHeroSticky}>
        <div ref={atmosphereRef} className={styles.cinemaAtmosphere} aria-hidden="true">
          <Image
            src="/cinema/controlled-flight-night.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.cinemaAtmosphereImage}
          />
          <div className={styles.cinemaAtmosphereGrade} />
        </div>

        <svg
          className={styles.cinemaFlightPaths}
          viewBox="0 0 1600 900"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            ref={routePathRef}
            className={styles.cinemaIntrusionPath}
            pathLength="1"
            d="M 1175 -55 C 1120 115 930 228 724 430"
          />
          <g ref={routeTokenRef} className={styles.cinemaRouteToken}>
            <rect x="-7" y="-7" width="14" height="14" rx="1" />
            <path d="M -14 0 H 14 M 0 -14 V 14" />
          </g>
          <g ref={conflictRef} className={styles.cinemaConflictPoint} transform="translate(724 430)">
            <circle r="5" />
            <circle r="20" />
          </g>
        </svg>

        <div ref={incidentRef} className={styles.cinemaIncident} role="status">
          <span>Protected path crossed</span>
          <strong>Write held · route moved to holding</strong>
        </div>

        <div ref={copyRef} className={styles.cinemaHeroCopy}>
          <p className={styles.cinemaEyebrow}>Vectant control plane</p>
          <h1>
            <span>Agents move.</span>
            <span>Authority stays bounded.</span>
          </h1>
          <div className={styles.cinemaHeroFooter}>
            <p>
              Parallel coding agents get live runtime state, scoped authority, and proof your team can replay.
            </p>
            <a href={PILOT_MAILTO} className={styles.cinemaPrimaryAction}>
              Request a proof pilot
              <ArrowUpRight size={16} weight="bold" />
            </a>
          </div>
        </div>

        <figure ref={productRef} className={styles.cinemaProductReveal}>
          <div className={styles.cinemaProductWindow}>
            <div ref={productImageRef} className={styles.cinemaProductCamera}>
              <Image
                src="/product-proof/codesite-full-workflow-ui.png"
                alt="Vectant CodeSite showing a live authority map, landing queue, and collision forecast"
                fill
                sizes="(max-width: 767px) 1120px, 100vw"
                className={styles.cinemaProductImage}
              />
            </div>
            <div className={styles.cinemaProductGrade} aria-hidden="true" />
            <svg
              ref={productFrameRef}
              className={styles.cinemaProductFrame}
              viewBox="0 0 1600 900"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M -40 850 L 800 454 L 1640 850" />
            </svg>
          </div>
          <figcaption ref={productTelemetryRef} className={styles.cinemaProductTelemetry}>
            <span>Flights <strong>3</strong></span>
            <span>Leases <strong>1</strong></span>
            <span>Transactions <strong>2</strong></span>
            <span>Required <strong>0</strong></span>
          </figcaption>
        </figure>

        <div className={styles.cinemaShutters} aria-hidden="true">
          <i ref={shutterLeftRef} className={styles.cinemaShutterLeft} />
          <i ref={shutterRightRef} className={styles.cinemaShutterRight} />
        </div>
      </div>
    </section>
  );
}
