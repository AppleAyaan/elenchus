"use client";

import { RevealItem, SectionReveal } from "@/components/ui/section-reveal";

const conversation = [
  { role: "founder", text: "We're building AI for education." },
  { role: "elenchus", text: "Why hasn't this been built already by OpenAI?" },
  { role: "founder", text: "We use personalization." },
  { role: "elenchus", text: "You have no users. What data is that based on?" },
];

export function LiveDemo() {
  return (
    <section className="border-t border-black/[0.06] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-3xl">
        <SectionReveal>
          <RevealItem>
            <h2 className="text-center font-serif text-4xl tracking-tight text-foreground md:text-5xl">
              A conversation with <span className="italic">Elenchus</span>
            </h2>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Every claim gets pressure-tested.
            </p>
          </RevealItem>

          <RevealItem className="mt-16">
            <div className="space-y-8">
              {conversation.map((msg, i) => (
                <div
                  key={i}
                  className={
                    msg.role === "elenchus"
                      ? "border-l-2 border-[#ff6600] pl-6"
                      : "pl-6"
                  }
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {msg.role === "elenchus" ? "Elenchus" : "Founder"}
                  </p>
                  <p
                    className={`mt-2 font-serif text-xl leading-relaxed ${
                      msg.role === "elenchus"
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    &ldquo;{msg.text}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </RevealItem>
        </SectionReveal>
      </div>
    </section>
  );
}
