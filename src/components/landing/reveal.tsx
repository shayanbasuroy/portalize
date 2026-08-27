"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { animate, motion, useInView } from "motion/react";

/** Shared spring for the marketing page — a critically-damped ease-out, no
 *  overshoot. Opacity + transform only (cheap, GPU-friendly). */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Common whileInView config so every section enters on the same trigger. */
export const VIEWPORT = { once: true, margin: "-60px" } as const;

/**
 * Scroll-linked entrance: a subtle rise + fade, fired once as each element
 * scrolls into view. Reduced-motion is handled by the surrounding
 * `MotionConfig reducedMotion="user"`, so the rendered props stay identical
 * between server and client (no hydration mismatch).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 12,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A "curtain" reveal for headlines: the text sits behind an overflow-hidden
 * mask and rises into place. Use `mount` for above-the-fold copy (animates on
 * load) or leave it to fire on scroll into view.
 */
export function MaskedLine({
  children,
  className,
  delay = 0,
  mount = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  mount?: boolean;
}) {
  return (
    <span className={`block overflow-hidden ${className ?? ""}`}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: "112%" }}
        {...(mount
          ? { animate: { y: "0%" } }
          : { whileInView: { y: "0%" }, viewport: VIEWPORT })}
        transition={{ duration: 0.9, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Section heading reveal — a rise with a short focus-in. The blur reads as
 * "settling into focus" rather than sliding, and avoids the wrapping/clipping
 * edge cases of a masked line on multi-line headlines. Cheap (once per view).
 */
export function Heading({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.h2
      className={className}
      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.h2>
  );
}

/**
 * Counts an integer up from 0 once it scrolls into view. `to=0` is a no-op
 * (the value simply stays put) — pair with a sibling reveal for those.
 */
export function CountUp({
  to,
  duration = 1.4,
  delay = 0,
  className,
}: {
  to: number;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      delay,
      ease: EASE,
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration, delay]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}

/**
 * A live-indicator dot with a soft expanding ring — sharp (square) to match
 * the system's status dots, not a rounded pill. Set the colour via `text-*`.
 */
export function PulseDot({ className }: { className?: string }) {
  return (
    <span className={`relative inline-flex size-1.5 ${className ?? ""}`} aria-hidden>
      <motion.span
        className="absolute inset-0 bg-current"
        animate={{ scale: [1, 2.6], opacity: [0.8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", repeatDelay: 0.4 }}
      />
      <span className="relative size-1.5 bg-current" />
    </span>
  );
}

/** A blinking text caret for "typing" reveals. */
export function Caret({ className }: { className?: string }) {
  return (
    <motion.span
      aria-hidden
      className={`inline-block ${className ?? ""}`}
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
    >
      ▍
    </motion.span>
  );
}
