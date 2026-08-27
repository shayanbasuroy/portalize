"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import {
  Check,
  Download,
  FileText,
  Frame,
  Image as ImageIcon,
  Lock,
  Upload,
} from "lucide-react";
import { EASE, Heading, Reveal } from "@/components/landing/reveal";

/**
 * Three numbered steps as a horizontal flow of flat cells, each carrying a
 * mini UI mockup — upload, PIN, unlock — that animates as it scrolls into
 * view. The mono index and right-aligned tag keep the spec-sheet rhythm,
 * drawn with shared hairlines instead of cards.
 */
export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 border-t border-zinc-200">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              How it works
            </p>
          </Reveal>
          <Heading className="mt-6 text-3xl font-medium leading-[1.05] tracking-[-0.02em] text-[#151B45] sm:text-4xl lg:text-5xl">
            From handoff to paid in three steps.
          </Heading>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px border border-zinc-200 bg-zinc-200 lg:grid-cols-3">
          <Step n="01" tag="≈ 5 minutes" title="Upload & aggregate" delay={0}>
            <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">
              Add files, code snippets, embeds, and live links — set the invoice
              amount. One page, a few minutes.
            </p>
            <UploadMock />
          </Step>

          <Step n="02" tag="zero friction" title="Share the link & PIN" delay={0.08}>
            <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">
              Your client opens a single URL and enters a 4-digit PIN. Nothing
              to install.
            </p>
            <PinMock />
          </Step>

          <Step n="03" tag="automatic" title="Unlocked upon payment" delay={0.16}>
            <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">
              Mark the invoice paid and downloads unlock. Watermarks drop the
              second payment clears.
            </p>
            <UnlockMock />
          </Step>
        </div>
      </div>
    </section>
  );
}

/** A single step cell: mono index and tag, title, then the mockup. */
function Step({
  n,
  tag,
  title,
  children,
  delay,
}: {
  n: string;
  tag: string;
  title: string;
  children: ReactNode;
  delay?: number;
}) {
  return (
    <Reveal className="flex flex-col bg-white p-7 sm:p-8" delay={delay}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-sm text-zinc-400">{n}</span>
        <span className="font-mono text-[11px] text-zinc-400">{tag}</span>
      </div>
      <h3 className="mt-4 text-xl font-medium tracking-tight text-[#151B45]">
        {title}
      </h3>
      {children}
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Mockups                                                            */
/* ------------------------------------------------------------------ */

/** Step 1 — a drag-and-drop zone collecting a mixed set of deliverables. */
function UploadMock() {
  return (
    <div className="mt-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
        className="border border-dashed border-zinc-300 bg-zinc-50/50 px-4 py-5 text-center"
      >
        <motion.span
          initial={{ y: 0 }}
          whileInView={{ y: [0, -4, 0] }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.2, ease: "easeInOut", delay: 0.35, repeat: 2 }}
          className="inline-block"
        >
          <Upload className="mx-auto size-5 text-zinc-400" strokeWidth={1.75} />
        </motion.span>
        <p className="mt-2 font-mono text-[11px] text-zinc-400">
          Drop files or paste a link
        </p>
      </motion.div>

      <div className="mt-3 divide-y divide-zinc-200 border border-zinc-200">
        {[
          { icon: Frame, name: "brand-board.fig", done: true },
          { icon: ImageIcon, name: "hero-shot.png", done: true },
        ].map((row, i) => (
          <motion.div
            key={row.name}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.3 + i * 0.12 }}
            className="flex items-center gap-2 px-3 py-2"
          >
            <row.icon className="size-3.5 text-zinc-400" strokeWidth={1.75} />
            <span className="font-mono text-[11px] text-[#151B45]">{row.name}</span>
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.5 + i * 0.12 }}
              className="ml-auto inline-flex"
            >
              <Check className="size-3.5 text-emerald-600" strokeWidth={2.5} />
            </motion.span>
          </motion.div>
        ))}
        <div className="px-3 py-2">
          <div className="flex items-center gap-2">
            <FileText className="size-3.5 text-zinc-400" strokeWidth={1.75} />
            <span className="font-mono text-[11px] text-[#151B45]">case-study.pdf</span>
            <span className="ml-auto font-mono text-[10px] text-zinc-400">62%</span>
          </div>
          <div className="mt-2 h-1 w-full bg-zinc-100">
            <motion.div
              initial={{ width: "0%" }}
              whileInView={{ width: "62%" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.45 }}
              className="h-1 bg-[#6C3FE8]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Step 2 — a modal with a URL bar and a 4-digit PIN entry. */
function PinMock() {
  return (
    <div className="mt-6 border border-zinc-200">
      <div className="border-b border-zinc-200 px-4 py-2.5">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
          className="truncate font-mono text-[11px] text-zinc-400"
        >
          portalize.site/p/acme
        </motion.span>
      </div>
      <div className="px-4 py-6">
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
          Enter the 4-digit PIN
        </p>
        <div className="mt-4 flex justify-center gap-2">
          {[8, 4, 9, 2].map((d, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.6 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.35 + i * 0.14 }}
              className={`flex size-10 items-center justify-center border font-mono text-base text-[#151B45] ${
                i === 3 ? "border-[#6C3FE8]" : "border-zinc-300"
              }`}
            >
              {d}
            </motion.span>
          ))}
        </div>
        <p className="mt-4 text-center font-mono text-[11px] text-zinc-400">
          No account. No password.
        </p>
      </div>
    </div>
  );
}

/** Step 3 — a paid invoice flipping the download button to green. */
function UnlockMock() {
  return (
    <div className="mt-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
        className="flex items-center justify-between border border-zinc-200 px-3 py-2.5"
      >
        <span className="font-mono text-[11px] text-zinc-500">
          Invoice #INV-1042
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-600">
          <Check className="size-3.5" strokeWidth={2.5} />
          Paid
        </span>
      </motion.div>

      <div className="mt-3 flex items-center gap-2">
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.3 }}
          className="inline-flex shrink-0 items-center gap-1.5 border border-zinc-300 px-2.5 py-2 font-mono text-[11px] text-zinc-400"
        >
          <Lock className="size-3" strokeWidth={2} />
          Locked
        </motion.span>
        <motion.span
          aria-hidden
          initial={{ opacity: 0, x: -6 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.42 }}
          className="font-mono text-zinc-300"
        >
          →
        </motion.span>
        <motion.span
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.52 }}
          className="inline-flex flex-1 items-center justify-center gap-2 border border-emerald-600 bg-emerald-600 px-3 py-2.5 text-sm font-medium text-white"
        >
          <Download className="size-4" strokeWidth={2} />
          Download deliverables
        </motion.span>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.72 }}
        className="mt-3 font-mono text-[11px] text-zinc-400"
      >
        Watermarks drop · downloads go live
      </motion.p>
    </div>
  );
}
