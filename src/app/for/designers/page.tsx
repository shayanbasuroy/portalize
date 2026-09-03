import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Lock, Shield, Eye, FileImage } from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Client Portal for Designers & Creative Studios | Portalize",
  description:
    "Private, zero-login client portal for brand and UI/UX designers. Share Figma frames, logos, PDFs, and assets with watermarked previews and invoice-gated downloads.",
  alternates: {
    canonical: "/for/designers",
  },
  openGraph: {
    title: "Client Portal for Designers & Creative Studios | Portalize",
    description:
      "Share Figma frames, logos, and design assets with watermarked in-browser previews. High-res downloads unlock only when your invoice clears.",
    url: "https://portalize.site/for/designers",
  },
};

export default function ForDesignersPage() {
  return (
    <div className="min-h-screen bg-[#F8F7FC] text-[#151B45] antialiased flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-24">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            Solutions · For Designers & Studios
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-medium tracking-tight text-[#151B45] sm:text-6xl sm:leading-[1.05]">
            Deliver design work with watermarked previews. Get paid before exports unlock.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Stop sending unprotected Figma links or raw Drive folders. Portalize gives your clients a sleek 1-link portal with a 4-digit PIN where designs render beautifully in-browser with automated watermark protection.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-[#151B45] px-6 py-3 text-sm font-medium text-[#F8F7FC] transition-colors hover:bg-zinc-800"
            >
              Start for free — 2 minutes
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-[#151B45] hover:underline"
            >
              View pricing ($9/mo Pro)
            </Link>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="border-t border-zinc-200">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-2xl font-medium text-[#151B45] sm:text-3xl">
              Engineered for creative deliverables
            </h2>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="border border-zinc-200 bg-white p-8">
                <span className="flex size-10 items-center justify-center border border-zinc-200 bg-zinc-50 text-[#151B45]">
                  <Eye className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-medium text-[#151B45]">
                  In-Browser Visual Proofing
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Clients inspect high-res mockups, identity decks, and SVG logos directly in their browser without downloading huge files or creating accounts.
                </p>
              </div>

              <div className="border border-zinc-200 bg-white p-8">
                <span className="flex size-10 items-center justify-center border border-zinc-200 bg-zinc-50 text-[#151B45]">
                  <Lock className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-medium text-[#151B45]">
                  Automated Canvas Watermarking
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Previews are dynamically overlaid with subtle protection watermarks until you mark the project paid. Unprotected exports are strictly sealed.
                </p>
              </div>

              <div className="border border-zinc-200 bg-white p-8">
                <span className="flex size-10 items-center justify-center border border-zinc-200 bg-zinc-50 text-[#151B45]">
                  <Shield className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-medium text-[#151B45]">
                  Realtime Read Receipts
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Receive timestamped proof the exact second your client verifies their 4-digit PIN and reviews your design deliverables.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Strip */}
        <section className="border-t border-zinc-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-2xl font-medium text-[#151B45]">
              Why designers switch from Google Drive & Dropbox
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="border border-red-200 bg-red-50/40 p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-red-700">
                  The Old Way (Google Drive / WeTransfer)
                </p>
                <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                  <li className="flex items-start gap-2">✕ Client downloads raw source files before paying invoice</li>
                  <li className="flex items-start gap-2">✕ Unprofessional generic folders with no branding</li>
                  <li className="flex items-start gap-2">✕ WeTransfer links expire after 7 days</li>
                  <li className="flex items-start gap-2">✕ Zero visibility into whether the client viewed your work</li>
                </ul>
              </div>

              <div className="border border-emerald-200 bg-emerald-50/40 p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-emerald-800">
                  The Portalize Way
                </p>
                <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                  <li className="flex items-start gap-2 text-emerald-900"><Check className="size-4 shrink-0 text-emerald-600" /> Downloads unlock only when invoice payment is confirmed</li>
                  <li className="flex items-start gap-2 text-emerald-900"><Check className="size-4 shrink-0 text-emerald-600" /> Custom studio logo and private 4-digit PIN access</li>
                  <li className="flex items-start gap-2 text-emerald-900"><Check className="size-4 shrink-0 text-emerald-600" /> Permanent deliverable link that never expires</li>
                  <li className="flex items-start gap-2 text-emerald-900"><Check className="size-4 shrink-0 text-emerald-600" /> Instant read receipts and feedback collection</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-zinc-200">
          <div className="mx-auto max-w-6xl px-6 py-20 text-center">
            <h2 className="text-3xl font-medium text-[#151B45]">
              Deliver your next design project with Portalize
            </h2>
            <p className="mt-3 text-sm text-zinc-600">
              1 portal free forever. Upgrade to Pro for $9/mo when you need unlimited deliveries.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex items-center gap-2 bg-[#151B45] px-8 py-3.5 text-sm font-medium text-[#F8F7FC] transition-colors hover:bg-zinc-800"
            >
              Create your first design portal
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
