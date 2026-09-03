import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Lock, Shield, CreditCard, Sparkles } from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Payment-Gated Deliverable Downloads for Freelancers | Portalize",
  description:
    "Lock client downloads until invoice payment clears. Clients preview deliverables with watermarks and download full-resolution source files instantly upon payment.",
  alternates: {
    canonical: "/features/payment-gated-downloads",
  },
  openGraph: {
    title: "Payment-Gated Deliverable Downloads | Portalize",
    description:
      "Eliminate unpaid client invoices. Gate source file downloads until invoice payment is verified.",
    url: "https://portalize.site/features/payment-gated-downloads",
  },
};

export default function PaymentGatedDownloadsPage() {
  return (
    <div className="min-h-screen bg-[#F8F7FC] text-[#151B45] antialiased flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-24">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            Feature · Escrow Delivery
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-medium tracking-tight text-[#151B45] sm:text-6xl sm:leading-[1.05]">
            Never get ghosted on your final 50% milestone again.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Payment-gated downloads protect your hard work. Clients can inspect previews in the browser, request revisions, or approve the project — but download links remain strictly sealed until payment clears.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-[#151B45] px-6 py-3 text-sm font-medium text-[#F8F7FC] transition-colors hover:bg-zinc-800"
            >
              Start protecting your deliverables
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        {/* How It Works */}
        <section className="border-t border-zinc-200 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <h2 className="text-2xl font-medium text-[#151B45] sm:text-3xl">
              How Payment Gating Works
            </h2>

            <div className="mt-12 space-y-8">
              <div className="flex gap-6 border-b border-zinc-100 pb-8">
                <span className="flex size-10 shrink-0 items-center justify-center font-mono text-sm font-medium border border-zinc-200 bg-zinc-50 text-[#151B45]">
                  01
                </span>
                <div>
                  <h3 className="text-lg font-medium text-[#151B45]">Upload your deliverables & attach invoice link</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                    Upload PDFs, images, ZIPs, or code snippets. Optionally paste your Stripe, PayPal, or Wise invoice payment link.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 border-b border-zinc-100 pb-8">
                <span className="flex size-10 shrink-0 items-center justify-center font-mono text-sm font-medium border border-zinc-200 bg-zinc-50 text-[#151B45]">
                  02
                </span>
                <div>
                  <h3 className="text-lg font-medium text-[#151B45]">Client reviews with watermarked previews</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                    Your client opens the portal with a 4-digit PIN. Previews render clearly in-browser with automated watermark protection.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <span className="flex size-10 shrink-0 items-center justify-center font-mono text-sm font-medium border border-zinc-200 bg-zinc-50 text-[#151B45]">
                  03
                </span>
                <div>
                  <h3 className="text-lg font-medium text-[#151B45]">Mark as paid — downloads unlock instantly</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                    Once payment clears, 1-click &quot;Mark as Paid&quot; removes all watermarks and unlocks secure, time-limited high-resolution download links for the client.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-zinc-200">
          <div className="mx-auto max-w-6xl px-6 py-20 text-center">
            <h2 className="text-3xl font-medium text-[#151B45]">
              Protect your next client delivery
            </h2>
            <p className="mt-3 text-sm text-zinc-600">
              Free to start with 1 active portal. Unlimited on Pro ($9/mo).
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex items-center gap-2 bg-[#151B45] px-8 py-3.5 text-sm font-medium text-[#F8F7FC] transition-colors hover:bg-zinc-800"
            >
              Get started free
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
