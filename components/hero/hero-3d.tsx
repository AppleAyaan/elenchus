"use client";

import dynamic from "next/dynamic";

const InterrogationMonolith = dynamic(
  () =>
    import("./interrogation-monolith").then((mod) => mod.InterrogationMonolith),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full" aria-hidden />
    ),
  }
);

export function Hero3D() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-70">
      <div className="h-[min(70vh,520px)] w-full max-w-2xl translate-y-8">
        <InterrogationMonolith />
      </div>
    </div>
  );
}
