"use client";

import dynamic from "next/dynamic";

const NotFoundBackground = dynamic(
  () => import("@/app/NotFoundBackground").then((module) => module.NotFoundBackground),
  { ssr: false },
);

export function NotFoundBackgroundLoader() {
  return <NotFoundBackground />;
}
