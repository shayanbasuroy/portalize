"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { EASE, Heading, Reveal } from "@/components/landing/reveal";

export function Cta() {
  return (
    <section className="border-t border-zinc-200">
      <div className="mx-auto max-w-6xl px-6 py-28 md:py-40">
        <div className="max-w-3xl">
          <Heading className="text-4xl font-medium leading-[1.02] tracking-[-0.03em] text-[#151B45] sm:text-5xl lg:text-6xl">
            Your next client delivery is one portal away.
          </Heading>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600">
              No credit card. No client accounts. Just one link, a 4-digit PIN, and
              every file locked until payment clears.
            </p>
          </Reveal>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.22 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              href="/signup"
              className="group inline-flex items-center justify-center gap-2 bg-[#151B45] px-7 py-3.5 text-sm font-medium text-[#F8F7FC] transition-colors duration-150 ease-out hover:bg-zinc-800"
            >
              Start for free — 2 minutes
              <motion.span
                className="inline-flex"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.4 }}
              >
                <ArrowRight className="size-4" strokeWidth={2} />
              </motion.span>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-medium text-[#151B45] transition-colors duration-150 ease-out hover:underline"
            >
              Already have an account
            </Link>
          </motion.div>

          <Reveal delay={0.3}>
            <p className="mt-8 font-mono text-xs tracking-[0.04em] text-zinc-400">
              No client accounts · 4-digit PIN · Watermarked previews · Cancel anytime
            </p>
          </Reveal>

          <Reveal delay={0.38}>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] text-zinc-400">
              <span>✓ Free plan, no card required</span>
              <span>✓ Unlimited portals on Pro ($9/mo)</span>
              <span>✓ Cancel anytime, no lock-in</span>
              <span>✓ Works on any device for clients</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
