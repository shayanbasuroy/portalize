"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Scroll-linked entrance for the marketing sections: a subtle 12px rise and
 * fade, fired once as each element scrolls into view. Reduced-motion is
 * handled by the surrounding `MotionConfig reducedMotion="user"`, so the
 * rendered props stay identical between server and client (no hydration
 * mismatch) while the animation still respects the user's OS setting.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
