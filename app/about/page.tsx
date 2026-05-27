"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f0] px-6 pt-24 pb-16">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Image
            src="/elenchus_transparent.png"
            alt="Elenchus"
            width={80}
            height={80}
            className="mx-auto h-20 w-20"
          />
          <h1 className="mt-8 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
            About <span className="italic">Elenchus</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Named after Socrates&apos; method of cross-examination, Elenchus is an AI that 
            stress-tests your startup ideas through rigorous questioning.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 space-y-8"
        >
          <div className="rounded-2xl border border-black/[0.06] bg-white p-8 shadow-sm">
            <h2 className="font-serif text-2xl text-foreground">The Philosophy</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              The Socratic method, or <em>elenchus</em>, is a form of cooperative argumentative 
              dialogue that stimulates critical thinking by asking and answering questions. 
              Rather than providing answers, it exposes contradictions in beliefs and leads 
              to deeper understanding.
            </p>
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-white p-8 shadow-sm">
            <h2 className="font-serif text-2xl text-foreground">Our Mission</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We believe the best startup ideas are forged through relentless questioning. 
              Elenchus serves as your intellectual sparring partner—challenging assumptions, 
              exposing blind spots, and strengthening your pitch before you face real investors.
            </p>
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-white p-8 shadow-sm">
            <h2 className="font-serif text-2xl text-foreground">How It Works</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Present your startup idea to Elenchus in a 2-minute pitch session. Our AI will 
              cross-examine your premise, unit economics, market assumptions, and founding 
              thesis. You&apos;ll receive a verdict along with actionable insights to refine 
              your approach.
            </p>
          </div>
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 flex items-center justify-center gap-2"
        >
          <Image
            src="/elenchus_transparent.png"
            alt="Elenchus"
            width={20}
            height={20}
            className="h-5 w-5"
          />
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Elenchus
          </p>
        </motion.footer>
      </div>
    </main>
  );
}
