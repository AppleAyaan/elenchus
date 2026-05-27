"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Overlay that fades out on enter */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-[200] bg-[#f5f5f0]"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      />
      {/* Page content that fades in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1], delay: 0.05 }}
      >
        {children}
      </motion.div>
    </>
  );
}
