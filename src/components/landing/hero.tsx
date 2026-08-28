"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { InteractiveHeroDemo } from "@/components/landing/interactive-hero-demo";
import { EASE } from "@/components/landing/reveal";

/**
 * Left-aligned editorial hero with high-converting positioning and interactive sandbox.
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
            Private Client Delivery &amp; Escrow
          </motion.p>

          <h1 className="mt-6 text-[2.5rem] font-medium leading-[1.02] tracking-[-0.03em] text-[#151B45] sm:text-5xl lg:text-[4rem]">
            <MaskedLine delay={0.12}>
              <span className="text-zinc-400">Stop sending Google Drive links.</span>
            </MaskedLine>
            <MaskedLine delay={0.24}>
              Never get ghosted on final invoices.
            </MaskedLine>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.42 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-zinc-600"
          >
            No passwords for clients to forget. Send 1 link with a 4-digit PIN.
            Clients preview every file watermarked in-browser, while high-res
            downloads stay locked until the invoice settles.
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
              Create free client portal
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
            Zero client logins · 4-digit PIN · Watermarked previews · Realtime read receipts
          </motion.p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <InteractiveHeroDemo />
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
