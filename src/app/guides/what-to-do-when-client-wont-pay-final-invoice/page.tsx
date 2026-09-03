import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Shield, Lock, AlertTriangle } from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "What to Do When a Client Won't Pay Your Final Invoice (Templates & Prevention) | Portalize",
  description:
    "Step-by-step recovery process when a freelance client refuses to pay the final 50% invoice. Copy-paste reminder email scripts, legal recourse, and how to gate deliverables with escrow.",
  alternates: {
    canonical: "/guides/what-to-do-when-client-wont-pay-final-invoice",
  },
  openGraph: {
    title: "What to Do When a Client Won't Pay Your Final Invoice | Portalize Guide",
    description:
      "A complete guide with copy-paste email templates to recover unpaid freelance milestone payments and prevent delivery theft.",
    url: "https://portalize.site/guides/what-to-do-when-client-wont-pay-final-invoice",
  },
};

export default function UnpaidInvoiceGuidePage() {
  return (
    <div className="min-h-screen bg-[#F8F7FC] text-[#151B45] antialiased flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-24">
        <article className="mx-auto max-w-3xl px-6 py-12">
          {/* Breadcrumb */}
          <Link
            href="/guides"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-400 hover:text-[#151B45] transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Back to all guides
          </Link>

          {/* Header */}
          <header className="mt-8 border-b border-zinc-200 pb-8">
            <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-400">
              <span className="uppercase tracking-[0.16em] text-[#151B45]">Payment Recovery</span>
              <span>·</span>
              <span>6 min read</span>
              <span>·</span>
              <span>September 2026</span>
            </div>
            <h1 className="mt-4 text-3xl font-medium tracking-tight text-[#151B45] sm:text-5xl sm:leading-[1.1]">
              What to Do When a Client Won’t Pay Your Final Invoice
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-zinc-600">
              It&apos;s the most common and painful milestone in freelancing: you deliver the project, send the final invoice, and the client goes radio silent. Here is the step-by-step recovery playbook.
            </p>
          </header>

          {/* Body Content */}
          <div className="mt-10 space-y-10 text-base leading-relaxed text-zinc-700">
            <section className="space-y-4">
              <h2 className="text-2xl font-medium text-[#151B45]">
                Step 1: Check If You Made the &quot;Drive Folder&quot; Mistake
              </h2>
              <p>
                In 80% of unpaid final invoice cases, the freelancer accidentally handed over the high-resolution source files (Figma edit access, production code repos, or print-ready PDFs) before the payment cleared.
              </p>
              <p>
                Once a client has the raw files on their local machine, your negotiating leverage drops to zero. If you haven&apos;t sent the root files yet, <strong>do not send them</strong> until payment confirmation.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-medium text-[#151B45]">
                Step 2: Send the 3-Tier Reminder Sequence
              </h2>
              <p>
                Never get aggressive in your first follow-up. Escalate systematically across three polite but firm communications:
              </p>

              <div className="border border-zinc-200 bg-white p-6 space-y-2">
                <p className="font-mono text-xs font-semibold text-[#151B45] uppercase tracking-wider">Email 1 (Day 3 after due date): Gentle Verification</p>
                <p className="text-sm text-zinc-600 italic">
                  &quot;Hi [Client Name], just following up to confirm you received invoice #[000] for the [Project Name] completion sent on [Date]. Let me know if your accounts team needs any additional details to process the release.&quot;
                </p>
              </div>

              <div className="border border-zinc-200 bg-white p-6 space-y-2">
                <p className="font-mono text-xs font-semibold text-[#151B45] uppercase tracking-wider">Email 2 (Day 7 after due date): Direct Notice</p>
                <p className="text-sm text-zinc-600 italic">
                  &quot;Hi [Client Name], as of today invoice #[000] for $[Amount] is now past due. Per our agreement, full-resolution export files unlock once final milestone payment is confirmed. Here is the direct link to pay via card/bank transfer: [Link].&quot;
                </p>
              </div>

              <div className="border border-zinc-200 bg-white p-6 space-y-2">
                <p className="font-mono text-xs font-semibold text-[#151B45] uppercase tracking-wider">Email 3 (Day 14 after due date): Formal Demand</p>
                <p className="text-sm text-zinc-600 italic">
                  &quot;Hi [Client Name], this is a formal notice regarding unpaid invoice #[000] ($[Amount]). Please note that copyright and commercial usage rights for the deliverables remain with [Your Name/Studio] until full payment is received.&quot;
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-medium text-[#151B45]">
                Step 3: Legal &amp; Intellectual Property Protection
              </h2>
              <p>
                Under standard freelance contracts, **copyright only transfers upon full payment**. If an unpaid client publishes your designs, launches the code, or prints the branding without paying, they are committing copyright infringement.
              </p>
              <p>
                A polite reminder that unauthorized commercial use of unreleased work violates copyright law often resolves stalled invoices within 24 hours.
              </p>
            </section>

            <section className="space-y-4 border-t border-zinc-200 pt-8">
              <h2 className="text-2xl font-medium text-[#151B45]">
                How to Never Deal With This Again (Escrow Delivery)
              </h2>
              <p>
                Instead of sending raw Google Drive links or WeTransfer folders, use an escrow delivery portal like <strong>Portalize</strong>:
              </p>
              <ul className="space-y-2 text-sm text-zinc-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span><strong>Clients preview in-browser</strong> behind a 4-digit PIN with dynamic watermark overlays.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span><strong>Download links stay locked</strong> on the server until you mark the invoice as paid.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span><strong>Realtime read receipts</strong> give you timestamped proof when the client viewed the deliverables.</span>
                </li>
              </ul>
            </section>
          </div>

          {/* In-article CTA */}
          <div className="mt-14 border border-zinc-200 bg-white p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-medium text-[#151B45]">Protect your client handoffs with Portalize</h3>
              <p className="mt-1 text-sm text-zinc-500">Free to start · Watermarked previews · 1-click invoice unlock</p>
            </div>
            <Link
              href="/signup"
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-[#151B45] px-6 py-2.5 text-sm font-medium text-[#F8F7FC] hover:bg-zinc-800 transition-colors"
            >
              Get started free
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
