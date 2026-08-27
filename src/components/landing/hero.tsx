"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { PortalFigure } from "@/components/landing/portal-figure";
import { EASE } from "@/components/landing/reveal";

/**
 * Left-aligned editorial hero. The two-line headline rises from behind a
 * clip mask, the eyebrow, body and CTAs stagger in after it, and the product
 * figure settles flat from a slight perspective tilt.
 */
export function Hero() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 pt-36 pb-16 sm:pt-44 sm:pb-20">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
            className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500"
          >
            <span className="h-px w-8 bg-zinc-400" aria-hidden />
            For freelancers &amp; studios
          </motion.p>

          <h1 className="mt-6 text-[2.75rem] font-medium leading-[0.98] tracking-[-0.03em] text-[#151B45] sm:text-6xl lg:text-7xl">
            <MaskedLine delay={0.12}>
              <span className="text-zinc-400">You finished the work.</span>
            </MaskedLine>
            <MaskedLine delay={0.24}>
              Get paid before it leaves.
            </MaskedLine>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.42 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-zinc-600"
          >
            Portalize is a zero-login client portal. Send one link, let clients
            preview every deliverable in the browser, and keep downloads locked
            until the invoice settles.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.52 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              href="/signup"
              className="group inline-flex items-center justify-center gap-2 bg-[#151B45] px-7 py-3.5 text-sm font-medium text-[#F8F7FC] transition-colors duration-150 ease-out hover:bg-zinc-800"
            >
              Create your portal
              <motion.span
                className="inline-flex"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.4 }}
              >
                <ArrowRight className="size-4" strokeWidth={2} />
              </motion.span>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 border border-zinc-300 px-7 py-3.5 text-sm font-medium text-[#151B45] transition-colors duration-150 ease-out hover:border-[#151B45]"
            >
              See how it works
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.64 }}
            className="mt-8 font-mono text-xs tracking-[0.04em] text-zinc-400"
          >
            No client accounts · 4-digit PIN · Watermarked previews
          </motion.p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 8 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.9, ease: EASE }}
        style={{ transformPerspective: 1200 }}
        className="origin-top"
      >
        <PortalFigure />
      </motion.div>
    </section>
  );
}

function MaskedLine({
  children,
  delay,
}: {
  children: ReactNode;
  delay: number;
}) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className="block will-change-transform"
        initial={{ y: "115%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.95, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
