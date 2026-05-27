"use client";

import { ReactNode } from "react";
import { Navbar } from "./navbar";
import { PageTransition } from "./page-transition";

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <Navbar />
      <PageTransition>{children}</PageTransition>
    </>
  );
}
