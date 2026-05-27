"use client";

import { motion, useReducedMotion } from "framer-motion";

export function MicPulse() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative flex h-14 w-14 items-center justify-center" aria-hidden>
      {!prefersReducedMotion && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border border-sky-400/30"
              initial={{ scale: 0.6, opacity: 0.6 }}
              animate={{ scale: 1.8 + i * 0.4, opacity: 0 }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}
      <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-sm">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4 text-sky-400"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Z"
            strokeLinecap="round"
          />
          <path d="M19 11v1a7 7 0 0 1-14 0v-1M12 18v3" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
