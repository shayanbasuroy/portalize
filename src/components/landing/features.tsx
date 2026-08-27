"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  Code2,
  FileArchive,
  FileText,
  Frame,
  Image as ImageIcon,
  Lock,
  Play,
  Video,
  Zap,
} from "lucide-react";
import { EASE, Heading, PulseDot, Reveal } from "@/components/landing/reveal";

/**
 * The capability grid, drawn as an asymmetric bento of micro-UI mockups. Four
 * flat cells on a 3-column grid (2 · 1 / 1 · 2), ruled by 1px hairlines the
 * way the rest of the page is — no shadows, no gradients, sharp corners. Each
 * cell shows the feature working, and each mockup animates as it enters.
 */
export function Features() {
  return (
    <section id="features" className="scroll-mt-16 border-t border-zinc-200">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              Features
            </p>
          </Reveal>
          <Heading className="mt-6 text-3xl font-medium leading-[1.05] tracking-[-0.02em] text-[#151B45] sm:text-4xl lg:text-5xl">
            Everything a delivery needs, on one page.
          </Heading>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-600">
              No more chasing files, invoices, and feedback across five apps. It
              all lives behind one link.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px border border-zinc-200 bg-zinc-200 lg:grid-cols-3">
          <Bento n="01" tag="in-browser" title="Every file previews in-browser" className="lg:col-span-2" delay={0}>
            <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">
              Images, PDFs, Figma boards, video, and code — any deliverable
              renders right in the browser, so clients preview without
              downloading a thing.
            </p>
            <PreviewEngine />
          </Bento>

          <Bento n="02" tag="automatic" title="Payment lock protection" delay={0.06}>
            <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">
              Previews stay watermarked and downloads stay sealed until you mark
              the invoice paid.
            </p>
            <WatermarkPreview />
          </Bento>

          <Bento n="03" tag="realtime" title="Read receipts" delay={0.12}>
            <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">
              Know the moment a client opens the portal and what they linger on.
            </p>
            <ReadReceiptToast />
          </Bento>

          <Bento n="04" tag="zero-login" title="Zero client logins" className="lg:col-span-2" delay={0.18}>
            <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">
              Your client opens one link and types a 4-digit PIN. No accounts to
              create, no passwords to reset, nothing to install.
            </p>
            <LoginComparison />
          </Bento>
        </div>
      </div>
    </section>
  );
}

/**
 * A single bento cell: mono index and tag on the top hairline, a title, then
 * the mockup. `className` carries the grid span; the parent's `gap-px` grid
 * draws the shared hairlines.
 */
function Bento({
  n,
  tag,
  title,
  children,
  className = "",
  delay = 0,
}: {
  n: string;
  tag: string;
  title: string;
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <Reveal className={`flex flex-col bg-white p-7 sm:p-8 ${className}`} delay={delay}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-sm text-zinc-400">{n}</span>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
          {tag === "realtime" && <PulseDot className="text-emerald-600" />}
          {tag}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-medium tracking-tight text-[#151B45]">
        {title}
      </h3>
      {children}
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Mockups                                                            */
/* ------------------------------------------------------------------ */

const previewTabs = [
  { label: "Image", icon: ImageIcon },
  { label: "Figma", icon: Frame },
  { label: "PDF", icon: FileText },
  { label: "Video", icon: Video },
  { label: "Code", icon: Code2 },
];

/** A tabbed previewer whose active tab auto-cycles with a sliding underline. */
function PreviewEngine() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((a) => (a + 1) % previewTabs.length),
      2400,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mt-6 border border-zinc-200">
      <div className="flex items-center gap-1 overflow-x-auto border-b border-zinc-200 px-2 py-2">
        {previewTabs.map((t, i) => {
          const isActive = i === active;
          return (
            <button
              key={t.label}
              type="button"
              onClick={() => setActive(i)}
              className={`relative flex shrink-0 items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium transition-colors duration-150 ${
                isActive ? "text-[#151B45]" : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              <t.icon className="size-3.5" strokeWidth={1.75} />
              {t.label}
              {isActive && (
                <motion.span
                  layoutId="preview-tab-underline"
                  className="absolute inset-x-0 -bottom-[9px] h-0.5 bg-[#6C3FE8]"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <TabContent label={previewTabs[active].label} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function TabContent({ label }: { label: string }) {
  switch (label) {
    case "Image":
      return (
        <div className="grid grid-cols-3 gap-2">
          {["hero-shot.png", "product-shot.png", "portrait.jpg"].map((name) => (
            <div
              key={name}
              className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 border border-zinc-200 bg-zinc-50"
            >
              <ImageIcon className="size-5 text-zinc-300" strokeWidth={1.5} />
              <span className="font-mono text-[10px] text-zinc-400">{name}</span>
            </div>
          ))}
        </div>
      );
    case "Figma":
      return (
        <div className="relative grid aspect-[4/3] grid-cols-2 gap-2 border border-zinc-200 bg-zinc-50 p-3">
          <div className="border border-zinc-200 bg-white p-2">
            <div className="h-2 w-1/2 bg-zinc-200" />
            <div className="mt-2 h-1.5 w-full bg-zinc-100" />
            <div className="mt-1 h-1.5 w-2/3 bg-zinc-100" />
          </div>
          <div className="border border-zinc-200 bg-white p-2">
            <div className="h-2 w-1/3 bg-zinc-200" />
            <div className="mt-2 h-1.5 w-full bg-zinc-100" />
          </div>
          <span className="absolute bottom-2 left-3 font-mono text-[10px] text-zinc-400">
            brand-board.fig
          </span>
        </div>
      );
    case "PDF":
      return (
        <div className="space-y-2 border border-zinc-200 bg-zinc-50 p-4">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-1.5 border border-zinc-200 bg-white p-3">
              <div className="h-1.5 w-1/3 bg-zinc-200" />
              <div className="h-1 w-full bg-zinc-100" />
              <div className="h-1 w-full bg-zinc-100" />
              <div className="h-1 w-2/3 bg-zinc-100" />
            </div>
          ))}
        </div>
      );
    case "Video":
      return (
        <div className="relative flex aspect-[4/3] items-center justify-center border border-zinc-200 bg-zinc-50">
          <span className="flex size-12 items-center justify-center border border-zinc-300 bg-white">
            <Play className="size-4 text-[#151B45]" strokeWidth={2} fill="currentColor" />
          </span>
          <span className="absolute bottom-2 left-3 font-mono text-[10px] text-zinc-400">
            final-cut.mp4
          </span>
        </div>
      );
    default:
      return (
        <div className="space-y-1.5 border border-zinc-200 bg-zinc-50 p-4 font-mono text-[11px] leading-relaxed">
          <div><span className="text-zinc-400">1</span> <span className="text-[#6C3FE8]">const</span> <span className="text-[#151B45]">theme</span> = <span className="text-zinc-500">&quot;navy&quot;</span>;</div>
          <div><span className="text-zinc-400">2</span> <span className="text-[#6C3FE8]">export</span> <span className="text-[#151B45]">default</span> Portal;</div>
          <div><span className="text-zinc-400">3</span> <span className="text-zinc-400">{"// zero-login"}</span></div>
        </div>
      );
  }
}

/** A watermarked photo preview with a locked file row underneath. */
function WatermarkPreview() {
  return (
    <div className="mt-6">
      <div className="relative aspect-[4/3] overflow-hidden border border-zinc-200 bg-zinc-50">
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageIcon className="size-10 text-zinc-200" strokeWidth={1.25} />
        </div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.25 }}
        >
          <motion.span
            initial={{ scale: 1.5, rotate: -26, opacity: 0 }}
            whileInView={{ scale: 1, rotate: -14, opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.25 }}
            className="-rotate-[14deg] border border-amber-300 bg-amber-50/80 px-3 py-1 font-mono text-[11px] tracking-[0.16em] text-amber-700"
          >
            PREVIEW ONLY — UNPAID
          </motion.span>
        </motion.div>

        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.45 }}
          className="absolute right-2.5 top-2.5 flex size-6 items-center justify-center border border-zinc-200 bg-white/80 text-amber-600"
        >
          <Lock className="size-3" strokeWidth={2} />
        </motion.span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.55 }}
        className="mt-3 flex items-center justify-between border border-zinc-200 px-3 py-2.5"
      >
        <span className="flex items-center gap-2 font-mono text-[11px] text-zinc-500">
          <FileArchive className="size-3.5 text-zinc-400" strokeWidth={1.75} />
          deliverables.zip
        </span>
        <span className="inline-flex items-center gap-1.5 border border-zinc-300 px-2 py-1 font-mono text-[11px] text-zinc-500">
          <Lock className="size-3" strokeWidth={2} />
          Locked
        </span>
      </motion.div>
    </div>
  );
}

/** A dark read-receipt toast, set in Portal Navy (not pitch black). */
function ReadReceiptToast() {
  return (
    <div className="mt-6">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.2 }}
        className="relative border border-[#151B45] bg-[#151B45] p-4"
      >
        <span className="absolute right-3 top-3 flex items-center gap-1.5 font-mono text-[10px] text-white/45">
          <PulseDot className="text-emerald-400" />
          LIVE
        </span>
        <div className="flex items-start gap-3">
          <span className="flex size-6 shrink-0 items-center justify-center border border-white/20">
            <Zap className="size-3.5 text-amber-300" strokeWidth={2.25} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white">
              Acme Corp opened the portal
            </p>
            <p className="mt-0.5 font-mono text-[11px] text-white/55">
              2 mins ago · spent 4m reviewing deliverables
            </p>
          </div>
        </div>
      </motion.div>

      <ul className="mt-3 space-y-2 border-t border-zinc-200 pt-3 font-mono text-[11px] text-zinc-500">
        {[
          "Opened portal — 2m ago",
          "Previewed case-study.pdf — 4m ago",
          "Approved final deliverable",
        ].map((line, i) => (
          <motion.li
            key={line}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.4 + i * 0.12 }}
            className={i === 2 ? "flex items-center gap-1.5 text-emerald-600" : ""}
          >
            {i === 2 && <Check className="size-3" strokeWidth={2.5} />}
            {line}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/** Old way vs our way: six logins against one link and a 4-digit PIN. */
function LoginComparison() {
  const accounts = [
    "drive@client.com",
    "figma@client.com",
    "slack@client.com",
    "email@client.com",
    "drive@other.com",
    "loom@client.com",
  ];

  return (
    <div className="mt-6 grid grid-cols-1 gap-px border border-zinc-200 bg-zinc-200 sm:grid-cols-2">
      <div className="bg-white p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
          Old way
        </p>
        <ul className="mt-4 space-y-2">
          {accounts.map((a, i) => (
            <motion.li
              key={a}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, ease: EASE, delay: 0.2 + i * 0.08 }}
              className="relative truncate border border-zinc-200 px-2.5 py-1.5 font-mono text-[11px] text-zinc-400"
            >
              {a}
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, ease: EASE, delay: 0.34 + i * 0.08 }}
                className="absolute inset-x-0 top-1/2 h-px origin-left bg-zinc-300"
              />
            </motion.li>
          ))}
        </ul>
        <p className="mt-4 font-mono text-[11px] text-zinc-400">
          6 logins · 6 passwords
        </p>
      </div>

      <div className="bg-white p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#151B45]">
          Our way
        </p>
        <div className="mt-4 flex gap-2">
          {[8, 4, 9, 2].map((d, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 8, scale: 0.6 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, ease: EASE, delay: 0.5 + i * 0.12 }}
              className={`flex size-9 items-center justify-center border font-mono text-sm text-[#151B45] ${
                i === 3 ? "border-[#6C3FE8]" : "border-zinc-300"
              }`}
            >
              {d}
            </motion.span>
          ))}
        </div>
        <p className="mt-4 font-mono text-[11px] text-zinc-500">
          1 link · 4-digit PIN
        </p>
      </div>
    </div>
  );
}
