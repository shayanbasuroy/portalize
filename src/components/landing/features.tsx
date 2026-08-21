import type { ReactNode } from "react";
import {
  Check,
  Code2,
  FileArchive,
  FileText,
  Frame,
  Image as ImageIcon,
  Lock,
  Video,
  Zap,
} from "lucide-react";
import { Reveal } from "@/components/landing/reveal";

/**
 * The capability grid, drawn as an asymmetric bento of micro-UI mockups. Four
 * flat cells on a 3-column grid (2 · 1 / 1 · 2), ruled by 1px hairlines the
 * way the rest of the page is — no shadows, no gradients, sharp corners. Each
 * cell shows the feature working rather than describing it.
 */
export function Features() {
  return (
    <section id="features" className="scroll-mt-16 border-t border-zinc-200">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            Features
          </p>
          <h2 className="mt-6 text-3xl font-medium leading-[1.05] tracking-[-0.02em] text-[#151B45] sm:text-4xl lg:text-5xl">
            Everything a delivery needs, on one page.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-600">
            No more chasing files, invoices, and feedback across five apps. It
            all lives behind one link.
          </p>
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
        <span className="font-mono text-[11px] text-zinc-400">{tag}</span>
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

/** A tabbed previewer: one of many formats, rendered in the browser. */
function PreviewEngine() {
  return (
    <div className="mt-6 border border-zinc-200">
      <div className="flex items-center gap-1 overflow-x-auto border-b border-zinc-200 px-2 py-2">
        {previewTabs.map((t, i) => (
          <span
            key={t.label}
            className={`flex shrink-0 items-center gap-1.5 border-b-2 px-2.5 py-1.5 text-[12px] font-medium ${
              i === 0
                ? "border-[#6C3FE8] text-[#151B45]"
                : "border-transparent text-zinc-400"
            }`}
          >
            <t.icon className="size-3.5" strokeWidth={1.75} />
            {t.label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 p-4">
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
    </div>
  );
}

/** A watermarked photo preview with a locked file row underneath. */
function WatermarkPreview() {
  return (
    <div className="mt-6">
      <div className="relative aspect-[4/3] overflow-hidden border border-zinc-200 bg-zinc-50">
        {/* Faux photo — a flat light surface with a faint image mark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageIcon className="size-10 text-zinc-200" strokeWidth={1.25} />
        </div>

        {/* Watermark overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="-rotate-[14deg] border border-amber-300 bg-amber-50/80 px-3 py-1 font-mono text-[11px] tracking-[0.16em] text-amber-700">
            PREVIEW ONLY — UNPAID
          </span>
        </div>
        <span className="absolute right-2.5 top-2.5 flex size-6 items-center justify-center border border-zinc-200 bg-white/80 text-amber-600">
          <Lock className="size-3" strokeWidth={2} />
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between border border-zinc-200 px-3 py-2.5">
        <span className="flex items-center gap-2 font-mono text-[11px] text-zinc-500">
          <FileArchive className="size-3.5 text-zinc-400" strokeWidth={1.75} />
          deliverables.zip
        </span>
        <span className="inline-flex items-center gap-1.5 border border-zinc-300 px-2 py-1 font-mono text-[11px] text-zinc-500">
          <Lock className="size-3" strokeWidth={2} />
          Locked
        </span>
      </div>
    </div>
  );
}

/** A dark read-receipt toast, set in Portal Navy (not pitch black). */
function ReadReceiptToast() {
  return (
    <div className="mt-6">
      <div className="border border-[#151B45] bg-[#151B45] p-4">
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
      </div>

      <ul className="mt-3 space-y-2 border-t border-zinc-200 pt-3 font-mono text-[11px] text-zinc-500">
        <li>Opened portal — 2m ago</li>
        <li>Previewed case-study.pdf — 4m ago</li>
        <li className="flex items-center gap-1.5 text-emerald-600">
          <Check className="size-3" strokeWidth={2.5} />
          Approved final deliverable
        </li>
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
          {accounts.map((a) => (
            <li
              key={a}
              className="truncate border border-zinc-200 px-2.5 py-1.5 font-mono text-[11px] text-zinc-400 line-through decoration-zinc-300"
            >
              {a}
            </li>
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
            <span
              key={i}
              className={`flex size-9 items-center justify-center border font-mono text-sm text-[#151B45] ${
                i === 3 ? "border-[#6C3FE8]" : "border-zinc-300"
              }`}
            >
              {d}
            </span>
          ))}
        </div>
        <p className="mt-4 font-mono text-[11px] text-zinc-500">
          1 link · 4-digit PIN
        </p>
      </div>
    </div>
  );
}
