"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { RevealItem, SectionReveal } from "@/components/ui/section-reveal";

export function DemoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
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
    // User gesture path: try unmuting immediately.
    setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((m) => !m);
    const video = videoRef.current;
    if (!video) return;
    // Best-effort: sync immediately.
    const nextMuted = !isMuted;
    video.muted = nextMuted;
    if (!nextMuted) {
      void video.play().catch(() => {});
    }
  }, [isMuted]);

  const restart = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play().catch(() => {});
  }, []);

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
                muted={isMuted}
                playsInline
                // Keep native controls available for scrubbing.
                controls
                // Hide until user clicks, to avoid autoplay issues.
                style={{ display: isPlaying ? "block" : "none" }}
              />

              {/* Minimal custom controls (in addition to native controls) */}
              {isPlaying && (
                <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
                  <div className="pointer-events-auto flex items-center gap-2">
                    <button
                      type="button"
                      onClick={restart}
                      className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:bg-black/40"
                    >
                      Restart
                    </button>
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:bg-black/40"
                    >
                      {isMuted ? "Unmute" : "Mute"}
                    </button>
                  </div>
                </div>
              )}
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
