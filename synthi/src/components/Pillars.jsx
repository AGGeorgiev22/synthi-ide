"use client";

import { Cloud, Bot, Cpu, Gamepad2 } from "lucide-react";
import { SectionHeading } from "@/components/Section";
import { FeatureCard } from "@/components/FeatureCard";

const PILLARS = [
  {
    icon: Cloud,
    title: "Browser-based cloud workspace",
    copy: "Open a consistent development environment from any device. Avoid local setup, dependency drift, and machine-specific failures.",
    detail: "no local toolchain · reproducible",
  },
  {
    icon: Bot,
    title: "Runtime-native agent",
    copy: "The agent observes builds, logs, tests, crashes, previews, and state as the project runs.",
    detail: "observes · diagnoses · patches",
  },
  {
    icon: Cpu,
    title: "Compute & GPU feedback",
    copy: "Bring compile output, runtime logs, and failure signals into the loop - CUDA, ROCm, Metal, and beyond are examples, not limits.",
    detail: "every language · every runtime",
  },
  {
    icon: Gamepad2,
    title: "Interactive engine iteration",
    copy: "Develop game engines with a live viewport and fast runtime feedback instead of restarting the world after every change.",
    detail: "viewport · hot-reload · stats",
  },
];

export function Pillars() {
  return (
    <section className="relative scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Product pillars"
          align="center"
          title="Built around how software actually runs."
          subtitle="Four foundations that keep you and the agent close to real execution."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <FeatureCard key={p.title} {...p} delay={i * 70} />
          ))}
        </div>
      </div>
    </section>
  );
}

