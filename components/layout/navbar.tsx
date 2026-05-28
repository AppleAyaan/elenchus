"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ease } from "@/lib/motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/demo", label: "Pitch" },
  { href: "/about", label: "About" },
];

const GITHUB_URL = "https://github.com/AppleAyaan/elenchus/tree/main";
const DEVPOST_URL = "https://devpost.com/software/elenchus-cvohb1?_gl=1*1bxpg09*_gcl_au*MTczOTU0Mjk4MC4xNzc2ODIxOTk5*_ga*MTQwMTEzNjM4MS4xNzc2ODIxOTk5*_ga_0YHJK3Y10M*czE3Nzk5NDM0ODIkbzEwJGcxJHQxNzc5OTQzNTI1JGoxNyRsMCRoMA..";

export function Navbar() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const maxWidth = useTransform(scrollY, [0, 100], [900, 700]);

  return (
    <motion.nav
      initial={prefersReducedMotion ? false : { opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      style={{
        maxWidth: prefersReducedMotion ? 900 : maxWidth,
      }}
      className="fixed left-1/2 top-4 z-[100] flex w-[calc(100%-2rem)] -translate-x-1/2 items-center justify-between gap-4 rounded-full border border-black/[0.08] bg-white/70 px-3 py-2 shadow-[0_2px_20px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-[40px] transition-all duration-300 md:px-4"
    >
      <div className="flex items-center gap-3 pl-1">
        {/* Logo + Brand */}
        <Link href="/" className="flex cursor-pointer items-center gap-2">
          <Image
            src="/elenchus_transparent.png"
            alt="Elenchus"
            width={16}
            height={16}
            className="h-4 w-4 rounded-full"
          />
          <span className="font-serif text-sm italic text-foreground">elenchus</span>
        </Link>
        <div className="flex items-center gap-1.5">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="inline-flex cursor-pointer items-center justify-center transition-opacity hover:opacity-80"
          >
            <Image
              src="/logos/github.png"
              alt="GitHub"
              width={16}
              height={16}
              className="h-4 w-4"
            />
          </a>
          <a
            href={DEVPOST_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Devpost"
            className="inline-flex cursor-pointer items-center justify-center transition-opacity hover:opacity-80"
          >
            <Image
              src="/logos/devpost.svg"
              alt="Devpost"
              width={16}
              height={16}
              className="h-4 w-4"
            />
          </a>
        </div>
      </div>

      {/* Nav Links - Center */}
      <div className="hidden items-center gap-1 md:flex">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative cursor-pointer rounded-full px-4 py-1.5 text-sm transition-colors duration-200 ${
                isActive
                  ? "text-foreground"
                  : "text-foreground/50 hover:text-foreground/80"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute inset-0 rounded-full bg-black/[0.06]"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5">
        <Link
          href="/demo"
          className="group relative cursor-pointer overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-medium text-white shadow-[0_2px_12px_rgba(245,158,11,0.3)] transition-all duration-300 hover:shadow-[0_4px_20px_rgba(245,158,11,0.4)]"
        >
          <span className="relative z-10 inline-flex items-center gap-1.5">
            Talk to Elenchus
            <span aria-hidden="true">→</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>
      </div>
    </motion.nav>
  );
}
