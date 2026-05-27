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

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative flex h-screen snap-start snap-always flex-col items-center justify-between px-6 pb-8 pt-24">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-serif text-5xl leading-[1.1] tracking-tight text-foreground sm:text-6xl md:text-7xl"
          >
            Elenchus<sup className="text-[0.5em] align-super">™</sup> breaks your pitch
            <br />
            <span className="italic">to make it stronger</span>
          </motion.h1>

          <motion.blockquote
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
            className="mx-auto mt-14 max-w-md border-l-2 border-foreground/20 pl-6 text-left"
          >
            <p className="font-serif text-base italic leading-relaxed text-muted-foreground">
              &ldquo;A defensible idea is one that survives relentless
              questioning, regardless of whatever objections are raised.&rdquo;
            </p>
            <footer className="mt-3 text-sm text-foreground/60">
              — Socrates
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
