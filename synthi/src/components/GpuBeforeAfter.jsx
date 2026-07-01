"use client";

import Image from "next/image";
import { useId, useState } from "react";

const BEFORE = {
  src: "/product-proof/gpu-hmr-before.png",
  alt: "Before GPU HMR: the running compiled graphics workload before a hot swap.",
  width: 800,
  height: 600,
};

const AFTER = {
  src: "/product-proof/gpu-hmr-after.png",
  alt: "After GPU HMR: the running compiled graphics workload after a hot swap with state preserved.",
  width: 800,
  height: 600,
};

const DIFF = {
  src: "/product-proof/gpu-hmr-diff.png",
  alt: "GPU HMR visual diff showing the runtime output changed.",
  width: 800,
  height: 600,
};

export function GpuBeforeAfter() {
  const id = useId();
  const [position, setPosition] = useState(56);

  return (
    <div className="gpu-compare-shell" data-reveal>
      <div className="gpu-compare-toolbar">
        <div>
          <span>compiled runtime proof</span>
          <strong>Drag the divider. The runtime stayed alive.</strong>
        </div>
        <div className="gpu-compare-readout">{position}% after</div>
      </div>

      <div
        className="gpu-compare-stage"
        style={{ "--compare-position": `${position}%` }}
      >
        <Image
          src={BEFORE.src}
          alt={BEFORE.alt}
          width={BEFORE.width}
          height={BEFORE.height}
          sizes="(min-width: 1024px) 46vw, 100vw"
          className="gpu-compare-image"
          priority={false}
        />
        <div className="gpu-compare-after" aria-hidden="true">
          <Image
            src={AFTER.src}
            alt=""
            width={AFTER.width}
            height={AFTER.height}
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="gpu-compare-image"
            priority={false}
          />
        </div>

        <div className="gpu-compare-label gpu-compare-label-before">Before</div>
        <div className="gpu-compare-label gpu-compare-label-after">After</div>
        <div className="gpu-compare-divider" aria-hidden="true">
          <span />
        </div>

        <label className="sr-only" htmlFor={id}>
          Compare GPU HMR before and after
        </label>
        <input
          id={id}
          className="gpu-compare-range"
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-valuetext={`${position}% after image visible`}
        />
      </div>

      <div className="gpu-diff-proof">
        <Image
          src={DIFF.src}
          alt={DIFF.alt}
          width={DIFF.width}
          height={DIFF.height}
          sizes="(min-width: 1024px) 18vw, 60vw"
        />
        <div>
          <span>proof ledger</span>
          <p>Before, diff, after: the GPU output changed while the same session stayed continuous.</p>
        </div>
      </div>
    </div>
  );
}
