"use client";

import { RevealItem, SectionReveal } from "@/components/ui/section-reveal";

const steps = [
  {
    number: "01",
    title: "Speak your idea",
    description:
      "Voice or type your startup pitch. No deck required — just the core claim you're betting on.",
  },
  {
    number: "02",
    title: "Get interrogated",
    description:
      "Elenchus challenges every assumption in real time. Relentless Socratic questioning until your idea is defensible or exposed.",
  },
  {
    number: "03",
    title: "See the verdict",
    description:
      "Receive a pitch score, flagged contradictions, and a clear map of what needs work before you face real investors.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionReveal>
          <RevealItem>
            <h2 className="text-center font-serif text-4xl tracking-tight text-foreground md:text-5xl">
              How <span className="italic">Elenchus</span> works
            </h2>
          </RevealItem>

          <div className="mt-20 grid gap-16 md:grid-cols-3 md:gap-10">
            {steps.map((step) => (
              <RevealItem key={step.number}>
                <div className="text-center">
                  <span className="text-sm font-medium text-[#ff6600]">
                    {step.number}
                  </span>
                  <h3 className="mt-4 font-serif text-2xl tracking-tight text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
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
