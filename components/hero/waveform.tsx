"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const BAR_COUNT = 48;
const STATIC_HEIGHTS = Array.from({ length: BAR_COUNT }, (_, i) =>
  Math.max(0.15, Math.sin(i * 0.35) * 0.35 + 0.4)
);

function AnimatedBars() {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    let t = 0;
    const animate = () => {
      t += 0.08;
      barsRef.current.forEach((bar, i) => {
        if (!bar) return;
        const base = Math.sin(t + i * 0.35) * 0.35 + 0.4;
        const jitter = (Math.sin(t * 3 + i) * 0.5 + 0.5) * 0.15 - 0.075;
        const h = Math.max(0.08, Math.min(1, base + jitter));
        bar.style.height = `${h * 100}%`;
      });
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <>
      {STATIC_HEIGHTS.map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            barsRef.current[i] = el;
          }}
          className="w-[2px] rounded-full bg-gradient-to-t from-sky-500/40 to-sky-300/90"
          style={{ height: `${STATIC_HEIGHTS[i]! * 100}%` }}
        />
      ))}
    </>
  );
}

function StaticBars() {
  return (
    <>
      {STATIC_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className="w-[2px] rounded-full bg-gradient-to-t from-sky-500/40 to-sky-300/90"
          style={{ height: `${h * 100}%` }}
        />
      ))}
    </>
  );
}

export function Waveform({ className }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={cn("flex h-12 items-center justify-center gap-[3px]", className)}
      aria-hidden
    >
      {prefersReducedMotion ? <StaticBars /> : <AnimatedBars />}
    </div>
  );
}
