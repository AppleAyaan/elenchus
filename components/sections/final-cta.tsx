"use client";

import Link from "next/link";
import { RevealItem, SectionReveal } from "@/components/ui/section-reveal";

export function FinalCTA() {
  return (
    <section
      id="cta"
      className="border-t border-black/[0.06] px-6 py-32 md:py-44"
    >
      <div className="mx-auto max-w-3xl text-center">
        <SectionReveal>
          <RevealItem>
            <h2 className="font-serif text-4xl tracking-tight text-foreground md:text-6xl">
              Most startup ideas fail
              <br />
              <span className="italic">under questioning.</span>
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="mt-8 text-lg text-muted-foreground">
              Find out if yours survives.
            </p>
          </RevealItem>
          <RevealItem>
            <Link
              href="/video"
              className="mt-10 inline-flex h-12 items-center justify-center rounded-full bg-[#ff6600] px-8 text-sm font-medium text-white transition-colors hover:bg-[#e55a00]"
            >
              Start interrogation
            </Link>
          </RevealItem>
        </SectionReveal>
      </div>
    </section>
  );
}
