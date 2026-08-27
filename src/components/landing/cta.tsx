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
            Ready to get paid before the files leave?
          </Heading>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600">
              Create your first portal in minutes. Free to start — no credit card.
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
              Create your portal
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
              Log in
            </Link>
          </motion.div>

          <Reveal delay={0.3}>
            <p className="mt-8 font-mono text-xs tracking-[0.04em] text-zinc-400">
              No client accounts · 4-digit PIN · Watermarked previews
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
