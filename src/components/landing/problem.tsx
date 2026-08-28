"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { EASE, Heading, Reveal } from "@/components/landing/reveal";

const before = [
  "A .zip in a Google Drive link, buried in an email thread",
  "Clients can't preview anything without downloading it first",
  "The invoice is sent separately — then chased, then chased again",
  "Feedback scattered across email, Slack, and four DMs",
];

const after = [
  "One branded link holds the entire delivery",
  "Every file renders in the browser, watermarked until paid",
  "Downloads unlock the moment you mark the invoice paid",
  "Feedback and approvals live in a single thread",
];

/**
 * "Then vs now" as an editorial split — two columns separated by a vertical
 * rule, never a pair of cards. The old way is struck through with a line that
 * draws itself in; the new way settles in ink with a leading arrow.
 */
export function Problem() {
  return (
    <section className="border-t border-zinc-200">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              The problem
            </p>
          </Reveal>
          <Heading className="mt-6 text-3xl font-medium leading-[1.05] tracking-[-0.02em] text-[#151B45] sm:text-4xl lg:text-5xl">
            The last mile of a project is the messy part.
          </Heading>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-600">
              You delivered great work. Then it scattered across a dozen links
              while the invoice sat unopened. Portalize turns that handoff into a
              single, calm page.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-zinc-200">
          <div className="lg:pr-12">
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                Before Portalize
              </p>
            </Reveal>
            <ul className="mt-6 space-y-4">
              {before.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
                  className="flex items-start gap-3 text-[15px] leading-relaxed text-zinc-400"
                >
                  <motion.span
                    aria-hidden
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.08 }}
                    className="mt-[9px] h-px w-4 shrink-0 origin-left bg-zinc-300"
                  />
                  <StrikeIn delay={0.15 + i * 0.08}>{item}</StrikeIn>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="lg:pl-12">
            <Reveal delay={0.08}>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                With Portalize
              </p>
            </Reveal>
            <ul className="mt-6 space-y-4">
              {after.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.08 }}
                  className="flex items-start gap-3 text-[15px] leading-relaxed text-[#151B45]"
                >
                  <motion.span
                    aria-hidden
                    initial={{ opacity: 0, x: -4 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.18 + i * 0.08 }}
                    className="mt-[5px] font-mono text-zinc-400"
                  >
                    →
                  </motion.span>
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/** A strike-through that draws itself left-to-right across the text. */
function StrikeIn({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <span className="relative inline-block">
      {children}
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, ease: EASE, delay }}
        className="absolute inset-x-0 top-1/2 h-px origin-left bg-zinc-400/70"
      />
    </span>
  );
}
