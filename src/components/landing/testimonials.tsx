"use client";

import { motion } from "motion/react";
import { EASE, Heading, Reveal } from "@/components/landing/reveal";

const quotes = [
  {
    text: "I stopped chasing invoices. My clients can't download the files until they pay — so they pay.",
    name: "Maya",
    role: "Brand designer",
  },
  {
    text: "One link replaced a Drive folder, an email thread, and a Slack channel. Clients finally know where the work lives.",
    name: "Daniel",
    role: "Webflow developer",
  },
  {
    text: "The watermarked preview is the best closing tool I own. They approve, I mark it paid, it's done.",
    name: "Priya",
    role: "Freelance product designer",
  },
];

const cells = [
  "py-10 lg:py-0 lg:pr-10",
  "border-t border-zinc-200 py-10 lg:border-t-0 lg:border-l lg:px-10 lg:py-0",
  "border-t border-zinc-200 py-10 lg:border-t-0 lg:border-l lg:pl-10 lg:py-0",
];

/**
 * Three pull-quotes set as a rule-divided row. A hanging quote mark and a
 * mono attribution — a spread of voices, not a carousel of cards. Each quote
 * settles in on its own beat.
 */
export function Testimonials() {
  return (
    <section className="border-t border-zinc-200">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              From freelancers
            </p>
          </Reveal>
          <Heading className="mt-6 text-3xl font-medium leading-[1.05] tracking-[-0.02em] text-[#151B45] sm:text-4xl lg:text-5xl">
            The handoff, handled.
          </Heading>
        </div>

        <div className="mt-14 grid lg:grid-cols-3">
          {quotes.map((q, i) => (
            <motion.figure
              key={q.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.12 }}
              className={cells[i]}
            >
              <blockquote className="text-[17px] leading-relaxed text-[#151B45]">
                <motion.span
                  aria-hidden
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.15 + i * 0.12 }}
                  className="mr-0.5 inline-block font-mono text-zinc-300"
                >
                  “
                </motion.span>
                {q.text}
              </blockquote>
              <figcaption className="mt-6 font-mono text-xs text-zinc-400">
                — {q.name}, {q.role}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
