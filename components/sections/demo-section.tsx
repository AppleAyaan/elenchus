"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { RevealItem, SectionReveal } from "@/components/ui/section-reveal";

export function DemoSection() {
  return (
    <section
      id="demo"
      className="flex h-screen snap-start snap-always flex-col items-center justify-center px-6"
    >
      <div className="w-full max-w-4xl">
        <SectionReveal>
          <RevealItem>
            <h2 className="text-center font-serif text-3xl tracking-tight text-foreground md:text-4xl">
              See <span className="italic">Elenchus</span> in action
            </h2>
          </RevealItem>

          <RevealItem className="mt-10">
            <div className="relative aspect-video overflow-hidden rounded-lg border border-black/[0.08] bg-[#1a1a1a]">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
                <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-transform hover:scale-105 md:h-20 md:w-20">
                  <Play className="h-6 w-6 fill-white text-white md:h-8 md:w-8" />
                </div>
                <div className="text-center">
                  <p className="font-serif text-base md:text-lg">Live demo</p>
                  <p className="mt-1 text-xs text-white/60 md:text-sm">
                    Replace this with your video
                  </p>
                </div>
              </div>
            </div>
          </RevealItem>

          <RevealItem className="mt-10 flex items-center justify-center gap-2">
            <Image
              src="/elenchus_transparent.png"
              alt="Elenchus"
              width={20}
              height={20}
              className="h-5 w-5 rounded-sm"
            />
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Elenchus
            </p>
          </RevealItem>
        </SectionReveal>
      </div>
    </section>
  );
}
