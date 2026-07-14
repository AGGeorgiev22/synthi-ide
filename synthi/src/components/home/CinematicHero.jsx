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
  const stickyRef = useRef(null);
  const atmosphereRef = useRef(null);
  const atmosphereDepthRef = useRef(null);
  const atmosphereFarRef = useRef(null);
  const atmosphereNearRef = useRef(null);
  const warningGradeRef = useRef(null);
  const flightPathsRef = useRef(null);
  const routePathRef = useRef(null);
  const routeTokenRef = useRef(null);
  const conflictRef = useRef(null);
  const incidentRef = useRef(null);
  const copyRef = useRef(null);
  const agentsLineRef = useRef(null);
  const authorityLineRef = useRef(null);
  const earlyProofRef = useRef(null);
  const earlyProofImageRef = useRef(null);
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
        gsap.set(warningGradeRef.current, { autoAlpha: 0 });
        gsap.set(earlyProofRef.current, { autoAlpha: 0, scale: 0.88, xPercent: 8, yPercent: 7 });
        gsap.set(earlyProofImageRef.current, { scale: 1.08, xPercent: 2.5 });
        gsap.set(atmosphereNearRef.current, { scale: 1.065, xPercent: 0, yPercent: 0 });
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
            { scale: 1.055, xPercent: -0.8, yPercent: -1.1, duration: 1.25 },
            "coldOpen",
          )
          .to(
            atmosphereFarRef.current,
            { scale: 1.045, xPercent: -0.7, yPercent: -0.45, duration: 1.25 },
            "coldOpen",
          )
          .to(
            atmosphereNearRef.current,
            { scale: 1.15, xPercent: -3.8, yPercent: -2.7, duration: 1.25 },
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
          .to(
            earlyProofRef.current,
            { autoAlpha: 0.94, scale: 1, xPercent: 0, yPercent: 0, duration: 0.2, ease: "power3.out" },
            0.12,
          )
          .to(
            earlyProofImageRef.current,
            { scale: 1, xPercent: 0, duration: 0.48, ease: "power2.out" },
            0.12,
          )
          .to(
            earlyProofRef.current,
            { autoAlpha: 0, scale: 0.96, xPercent: -7, yPercent: -4, duration: 0.16, ease: "power2.in" },
            0.56,
          )
          .addLabel("conflict", 0.69)
          .to(conflictRef.current, { autoAlpha: 1, scale: 1.15, duration: 0.07, ease: "power3.out" }, "conflict")
          .to(incidentRef.current, { autoAlpha: 1, y: -8, duration: 0.12, ease: "power3.out" }, "conflict")
          .to(warningGradeRef.current, { autoAlpha: 1, duration: 0.055, ease: "power3.out" }, "conflict")
          .to(warningGradeRef.current, { autoAlpha: 0.34, duration: 0.13, ease: "power2.out" }, "conflict+=0.055")
          .to(atmosphereNearRef.current, { scale: 1.18, duration: 0.09, ease: "power3.out" }, "conflict")
          .to(agentsLineRef.current, { xPercent: 4.5, yPercent: -28, autoAlpha: 0, duration: 0.18, ease: "power2.in" }, 0.75)
          .to(authorityLineRef.current, { scaleX: 0.86, yPercent: 24, autoAlpha: 0, duration: 0.2, ease: "power2.in" }, 0.75)
          .to(copyRef.current, { autoAlpha: 0, y: -26, duration: 0.2, ease: "power2.in" }, 0.79)
          .to(shutterLeftRef.current, { xPercent: 0, duration: 0.2, ease: "power4.in" }, 0.79)
          .to(shutterRightRef.current, { xPercent: 0, duration: 0.2, ease: "power4.in" }, 0.79)
          .set(productRef.current, { autoAlpha: 1 }, 0.98)
          .to(incidentRef.current, { autoAlpha: 0, duration: 0.06 }, 0.98)
          .addLabel("aperture", 0.99)
          .to(shutterLeftRef.current, { xPercent: -108, duration: 0.34, ease: "power4.inOut" }, "aperture")
          .to(shutterRightRef.current, { xPercent: 108, duration: 0.34, ease: "power4.inOut" }, "aperture")
          .to(productRef.current, { scale: 1, yPercent: 0, duration: 0.62, ease: "power3.out" }, "aperture")
          .fromTo(
            productImageRef.current,
            { scale: 1.075, xPercent: 1.8 },
            { scale: 1.01, xPercent: 0, duration: 0.78 },
            "aperture",
          )
          .to([productFrameRef.current, productTelemetryRef.current], { autoAlpha: 1, duration: 0.2 }, 1.25)
          .to({}, { duration: 0.22 });

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        };
      });

      media.add(
        "(min-width: 960px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const stage = stickyRef.current;
          const depthX = gsap.quickTo(atmosphereDepthRef.current, "x", { duration: 0.9, ease: "power3.out" });
          const depthY = gsap.quickTo(atmosphereDepthRef.current, "y", { duration: 0.9, ease: "power3.out" });
          const copyX = gsap.quickTo(copyRef.current, "x", { duration: 0.72, ease: "power3.out" });
          const routeX = gsap.quickTo(flightPathsRef.current, "x", { duration: 0.62, ease: "power3.out" });
          const routeY = gsap.quickTo(flightPathsRef.current, "y", { duration: 0.62, ease: "power3.out" });

          const settle = () => {
            depthX(0);
            depthY(0);
            copyX(0);
            routeX(0);
            routeY(0);
          };

          const onPointerMove = (event) => {
            const rect = stage.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            depthX(x * -10);
            depthY(y * -7);
            copyX(x * 6);
            routeX(x * 13);
            routeY(y * 9);
          };

          stage.addEventListener("pointermove", onPointerMove);
          stage.addEventListener("pointerleave", settle);

          return () => {
            stage.removeEventListener("pointermove", onPointerMove);
            stage.removeEventListener("pointerleave", settle);
            depthX.tween?.kill();
            depthY.tween?.kill();
            copyX.tween?.kill();
            routeX.tween?.kill();
            routeY.tween?.kill();
          };
        },
      );

      media.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(earlyProofRef.current, { xPercent: 16 });

        return () => {
          gsap.set(earlyProofRef.current, { clearProps: "xPercent" });
        };
      });

      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <section id="top" ref={rootRef} className={styles.cinemaHero} data-film-act="cold-open">
      <div ref={stickyRef} className={styles.cinemaHeroSticky}>
        <div ref={atmosphereRef} className={styles.cinemaAtmosphere} aria-hidden="true">
          <div ref={atmosphereDepthRef} className={styles.cinemaAtmosphereDepth}>
            <div ref={atmosphereFarRef} className={styles.cinemaAtmosphereFar}>
              <Image
                src="/cinema/controlled-flight-night.png"
                alt=""
                fill
                priority
                sizes="100vw"
                className={styles.cinemaAtmosphereImage}
              />
            </div>
            <div ref={atmosphereNearRef} className={styles.cinemaAtmosphereNear}>
              <Image
                src="/cinema/controlled-flight-night.png"
                alt=""
                fill
                sizes="100vw"
                className={styles.cinemaAtmosphereImage}
              />
            </div>
          </div>
          <div className={styles.cinemaAtmosphereGrade} />
          <div ref={warningGradeRef} className={styles.cinemaWarningGrade} />
        </div>

        <figure ref={earlyProofRef} className={styles.cinemaEarlyProof}>
          <div ref={earlyProofImageRef} className={styles.cinemaEarlyProofCamera}>
            <Image
              src="/codesite-proof/codesite-radar-desktop.png"
              alt="Vectant CodeSite radar forecasting collisions before a protected path is mutated"
              fill
              sizes="(max-width: 767px) 82vw, 34vw"
              className={styles.cinemaEarlyProofImage}
            />
          </div>
          <figcaption className={styles.cinemaVisuallyHidden}>
            CodeSite radar forecasts the collision before mutation.
          </figcaption>
        </figure>

        <svg
          ref={flightPathsRef}
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
            <span ref={agentsLineRef}>Agents move.</span>
            <span ref={authorityLineRef}>Authority stays bounded.</span>
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
