"use client";

import { RevealItem, SectionReveal } from "@/components/ui/section-reveal";

const modes = [
  {
    name: "Skeptical VC",
    quote: "Show me the moat.",
  },
  {
    name: "Technical Founder",
    quote: "How does this scale?",
  },
  {
    name: "Market Operator",
    quote: "Who pays on day one?",
  },
  {
    name: "Philosophical Investor",
    quote: "Why must this exist?",
  },
];

export function InvestorModes() {
  return (
    <section className="border-t border-black/[0.06] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionReveal>
          <RevealItem>
            <h2 className="text-center font-serif text-4xl tracking-tight text-foreground md:text-5xl">
              Choose your <span className="italic">interrogator</span>
            </h2>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Each persona attacks a different weakness in your pitch.
            </p>
          </RevealItem>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {modes.map((mode) => (
              <RevealItem key={mode.name}>
                <div className="rounded-lg border border-black/[0.06] bg-white p-6 text-center transition-shadow hover:shadow-md">
                  <h3 className="font-serif text-lg text-foreground">
                    {mode.name}
                  </h3>
                  <p className="mt-4 text-sm italic text-muted-foreground">
                    &ldquo;{mode.quote}&rdquo;
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
