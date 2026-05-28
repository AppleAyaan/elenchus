"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { RevealItem, SectionReveal } from "@/components/ui/section-reveal";

export function DemoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!isPlaying) return;
    const video = videoRef.current;
    if (!video) return;
    // Best-effort: some browsers require user gesture; we already got one via click.
    void video.play().catch(() => {});
  }, [isPlaying]);

  const startPlayback = useCallback(() => {
    setIsPlaying(true);
  }, []);

  return (
    <section
      id="demo"
      className="flex h-screen min-h-screen snap-start snap-always flex-col items-center justify-between px-6 pt-6 pb-2"
    >
      <div className="flex w-full max-w-4xl flex-1 flex-col justify-center">
        <SectionReveal>
          <RevealItem>
            <h2 className="text-center font-serif text-3xl tracking-tight text-foreground md:text-4xl">
              See <span className="italic">Elenchus</span> in action
            </h2>
          </RevealItem>

          <RevealItem className="mt-8">
            <div className="relative aspect-video overflow-hidden rounded-lg border border-black/[0.08] bg-[#1a1a1a]">
              {isPlaying ? null : (
                <button
                  type="button"
                  onClick={startPlayback}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white"
                  aria-label="Play live demo video"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-transform hover:scale-105 md:h-20 md:w-20">
                    <Play className="h-6 w-6 fill-white text-white md:h-8 md:w-8" />
                  </div>
                  <div className="text-center">
                    <p className="font-serif text-base md:text-lg">Live demo</p>
                    <p className="mt-1 text-xs text-white/60 md:text-sm">
                      Click to play
                    </p>
                  </div>
                </button>
              )}

              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                src="/MOV_6893.mov"
                playsInline
                // Keep native controls available for scrubbing.
                controls
                // Hide until user clicks, to avoid autoplay issues.
                style={{ display: isPlaying ? "block" : "none" }}
              />
            </div>
          </RevealItem>

        </SectionReveal>
      </div>
      <footer className="mt-3 w-full border-t border-black/[0.06] py-3">
        <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <Image
              src="/elenchus_transparent.png"
              alt="Elenchus"
              width={14}
              height={14}
              className="h-3.5 w-3.5 rounded-sm"
            />
            <p className="text-xs leading-none text-muted-foreground">
              © {new Date().getFullYear()} Elenchus
            </p>
          </div>
          <p className="text-xs leading-none text-muted-foreground">
            Built by{" "}
            <a
              href="https://www.linkedin.com/in/ayaanfaisal18"
              target="_blank"
              rel="noreferrer"
              className="inline-block underline underline-offset-2 transition-transform hover:scale-105"
            >
              Ayaan
            </a>
            ,{" "}
            <a
              href="https://www.linkedin.com/in/zakariyah-akbar-b04a1324a/"
              target="_blank"
              rel="noreferrer"
              className="inline-block underline underline-offset-2 transition-transform hover:scale-105"
            >
              Zakariyah
            </a>{" "}
            and{" "}
            <a
              href="https://www.linkedin.com/in/adrian-shahnazari-darcheh/"
              target="_blank"
              rel="noreferrer"
              className="inline-block underline underline-offset-2 transition-transform hover:scale-105"
            >
              Adrian
            </a>
          </p>
        </div>
      </footer>
    </section>
  );
}
