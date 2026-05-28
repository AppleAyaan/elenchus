"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ease } from "@/lib/motion";

const companies = [
  { name: "Boardy", logo: "/logos/boardy.png" },
  { name: "Lovable", logo: "/logos/lovable.svg" },
  { name: "Cursor", logo: "/logos/cursor.svg" },
  { name: "Carousel Studio", logo: "/logos/carousel_studio.jpeg" },
  { name: "ElevenLabs", logo: "/logos/elevenlabs.png" },
];
const quoteText =
  "a technique of cross-examination where Socrates would interrogate someone to test the truth of their beliefs";
const quoteWords = quoteText.split(" ");
const quoteMutedColor = "#6b7280";
const quoteActiveColor = "#111111";

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const wordStep = 0.1;
  const wordFadeDuration = 0.18;
  const pauseAtEnd = 1.2;
  const quoteCycleDuration = quoteWords.length * wordStep + pauseAtEnd;

  return (
    <section className="relative flex h-screen snap-start snap-always flex-col items-center justify-between px-6 pb-8 pt-24">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={false}
            animate={
              prefersReducedMotion
                ? { scale: 1 }
                : {
                    scale: [1, 1.012, 1],
                  }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: 2.4,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                  }
            }
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/50 bg-gradient-to-r from-white/45 via-white/30 to-white/45 px-4 py-1.5 text-xs font-medium text-foreground/90 shadow-sm backdrop-blur-md"
          >
            <span className="inline-flex items-center gap-2">
              <span>Won Best Use of </span>
              <Image src="/logos/elevenlabs.png" alt="ElevenLabs logo" width={60} height={45} />
              <span> at</span>
              <Image src="/logos/cursor.svg" alt="Cursor logo" width={60} height={20} />
              <span>Hackathon TTW 2026 🏆</span>
            </span>
          </motion.div>

          <motion.h1
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-serif text-5xl leading-[1.1] tracking-tight text-foreground sm:text-6xl md:text-7xl"
          >
            Elenchus breaks your pitch
            <br />
            <span className="italic">
              to{" "}
              <span className="relative inline-block">
                make it stronger
                <motion.svg
                  viewBox="0 0 220 18"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute -bottom-3 left-0 h-4 w-full"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M4 13 C 40 9, 82 17, 120 12 C 154 8, 188 15, 216 11"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      duration: 0.9,
                      delay: 0.55,
                      ease: "easeInOut",
                    }}
                  />
                </motion.svg>
              </span>
              .
            </span>
          </motion.h1>

          <motion.blockquote
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
            className="mx-auto mt-14 max-w-md border-l-2 border-foreground/20 pl-6 text-left"
          >
            <p className="font-serif text-base italic leading-relaxed text-muted-foreground">
              &ldquo;
              {quoteWords.map((word, index) => {
                const activateAt = (index * wordStep) / quoteCycleDuration;
                const resetAt =
                  (quoteWords.length * wordStep + pauseAtEnd) /
                  quoteCycleDuration;
                const fadeEnd = Math.min(
                  activateAt + wordFadeDuration / quoteCycleDuration,
                  resetAt - 0.001
                );
                const resetEnd = Math.min(resetAt + 0.02, 0.999);
                const times = [0, activateAt, fadeEnd, resetAt, resetEnd, 1];
                const colors = [
                  quoteMutedColor,
                  quoteMutedColor,
                  quoteActiveColor,
                  quoteActiveColor,
                  quoteMutedColor,
                  quoteMutedColor,
                ];

                return (
                  <motion.span
                    key={`${word}-${index}`}
                    animate={
                      prefersReducedMotion
                        ? { color: quoteMutedColor }
                        : { color: colors }
                    }
                    transition={
                      prefersReducedMotion
                        ? undefined
                        : {
                            duration: quoteCycleDuration,
                            ease: "linear",
                            repeat: Number.POSITIVE_INFINITY,
                            times,
                          }
                    }
                    className="inline-block"
                  >
                    {word}
                    {index < quoteWords.length - 1 ? "\u00A0" : ""}
                  </motion.span>
                );
              })}
              &rdquo;
            </p>
            <footer className="mt-3 text-sm text-foreground/60">
              — <a href="https://en.wikipedia.org/wiki/Socratic_method" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-foreground transition-colors">Elenchus' definition</a>.         
            </footer>
          </motion.blockquote>
        </div>
      </div>

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease }}
        className="w-full max-w-5xl"
      >
        <p className="mb-8 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Sponsored by
        </p>
        
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#f5f5f0] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#f5f5f0] to-transparent" />
          
          <div className="flex animate-marquee items-center gap-16">
            {[...companies, ...companies].map((company, i) => (
              <div
                key={`${company.name}-${i}`}
                className="flex shrink-0 items-center"
              >
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={120}
                  height={40}
                  className="h-8 w-auto object-contain opacity-60 grayscale"
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7, ease }}
        className="mt-8"
      >
        <Link
          href="#demo"
          className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </Link>
      </motion.div>
    </section>
  );
}
