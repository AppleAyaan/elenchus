"use client";

import { RevealItem, SectionReveal } from "@/components/ui/section-reveal";

const features = [
  {
    title: "Voice interrogation",
    description: "Speak naturally. Elenchus listens, interrupts, and challenges in the flow of conversation.",
  },
  {
    title: "Contradiction detection",
    description: "Cross-references every claim. Flags inconsistencies the moment they appear.",
  },
  {
    title: "Investor personas",
    description: "Skeptical VC, technical founder, market operator — choose your interrogator.",
  },
  {
    title: "Pitch scoring",
    description: "Quantified breakdown of defensibility, market clarity, and execution risk.",
  },
  {
    title: "Memory across claims",
    description: "Remembers everything you've said. Uses your own words against weak arguments.",
  },
  {
    title: "VC-level logic",
    description: "Trained on how top investors actually stress-test early-stage pitches.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="border-t border-black/[0.06] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionReveal>
          <RevealItem>
            <h2 className="text-center font-serif text-4xl tracking-tight text-foreground md:text-5xl">
              Built to find what you&apos;re
              <br />
              <span className="italic">hiding from yourself</span>
            </h2>
          </RevealItem>

          <div className="mt-20 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <RevealItem key={feature.title}>
                <div>
                  <h3 className="font-serif text-xl tracking-tight text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </RevealItem>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
