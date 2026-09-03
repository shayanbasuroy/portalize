import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Lock, CreditCard, Eye, Shield } from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Payment-Gated Deliverable Downloads for Freelancers | Portalize",
  description:
    "Lock client downloads until invoice payment clears. Clients preview deliverables with watermarks and download full-resolution source files instantly upon payment. Works with Stripe, PayPal, Wise, and any invoicing tool.",
  alternates: {
    canonical: "/features/payment-gated-downloads",
  },
  openGraph: {
    title: "Payment-Gated Deliverable Downloads | Portalize",
    description:
      "Eliminate unpaid client invoices. Gate source file downloads until invoice payment is verified.",
    url: "https://www.portalize.site/features/payment-gated-downloads",
  },
};

const faqs = [
  {
    q: "Does Portalize process the payment itself?",
    a: "No — Portalize doesn't handle money. It works alongside your existing invoicing setup (Stripe, PayPal, Wise, Bonsai, FreshBooks, Wave, or even a bank transfer). You paste your payment link into the portal. When payment arrives in your invoicing tool, you come back to Portalize and click 'Mark as Paid'. That single click unlocks the download for your client instantly.",
  },
  {
    q: "What happens if a client tries to download before paying?",
    a: "The download button is visually disabled and shows a 'Payment required' state. The actual file URL is never exposed to the browser — even inspecting page source or network requests reveals nothing downloadable. The secure download link is only generated server-side after you mark the portal as paid.",
  },
  {
    q: "Can a client see the files they're downloading before paying?",
    a: "Yes — that's the whole point. Clients get high-quality in-browser watermarked previews of images and PDFs so they can review, request revisions, and approve the work with full visibility. Only the clean, unprotected download file is locked. This keeps the review process frictionless while protecting your leverage.",
  },
  {
    q: "What file types can I upload and gate?",
    a: "Any file type can be payment-gated. Images (PNG, JPG, WebP, SVG) and PDFs show watermarked in-browser previews. ZIPs, video files, code archives, and any other file type show a secure 'locked' download card until payment is confirmed. There's no limit on file size beyond the 50MB per-file upload ceiling.",
  },
  {
    q: "Can I unlock downloads for individual files separately?",
    a: "Currently, payment gating applies to the entire portal at once — all files unlock when you mark the portal paid. Granular per-file payment gating is on the product roadmap for a future release.",
  },
  {
    q: "What if my client pays in installments?",
    a: "A common scenario for project-based work. You can create multiple portals — one for the milestone 1 deliverables, one for milestone 2, etc. Each portal has its own payment gate that you unlock independently as each invoice clears.",
  },
];

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
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-[#151B45] hover:underline"
            >
              View pricing ($9/mo Pro)
            </Link>
          </div>
        </section>

        {/* The problem */}
        <section className="border-t border-zinc-200 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <h2 className="text-2xl font-medium text-[#151B45] sm:text-3xl">
              Why "just email it over" is costing you money
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-600">
              The standard freelance delivery workflow has a fundamental flaw: you hand over your work before getting paid for it. A Google Drive link, Dropbox folder, email attachment, or WeTransfer download gives the client immediate, unrestricted access to your finished deliverables. There's nothing stopping them from downloading everything, using it in production, and quietly ignoring your final invoice.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-600">
              This isn't hypothetical. Studies consistently show that 71% of freelancers have experienced late payment, and a significant portion of those cases involve clients who received deliverables before paying their final invoice. Payment-gating your deliverables is the single most effective structural protection you can put in place.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <div className="border border-red-200 bg-red-50/40 p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-red-700 mb-3">Without Payment Gating</p>
                <ul className="space-y-2 text-sm text-zinc-700">
                  <li className="flex items-start gap-2">✕ Client downloads source files before final invoice is paid</li>
                  <li className="flex items-start gap-2">✕ No leverage to recover payment once work is delivered</li>
                  <li className="flex items-start gap-2">✕ Client can use your work commercially before you've been compensated</li>
                  <li className="flex items-start gap-2">✕ Chasing overdue invoices with nothing to withhold</li>
                </ul>
              </div>
              <div className="border border-emerald-200 bg-emerald-50/40 p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-emerald-800 mb-3">With Portalize Payment Gating</p>
                <ul className="space-y-2 text-sm text-zinc-700">
                  <li className="flex items-start gap-2"><Check className="size-4 shrink-0 text-emerald-600" /> Client reviews watermarked previews — work is fully visible, downloads are sealed</li>
                  <li className="flex items-start gap-2"><Check className="size-4 shrink-0 text-emerald-600" /> Full-resolution exports unlock the instant you confirm payment</li>
                  <li className="flex items-start gap-2"><Check className="size-4 shrink-0 text-emerald-600" /> Client has strong incentive to pay promptly to access their assets</li>
                  <li className="flex items-start gap-2"><Check className="size-4 shrink-0 text-emerald-600" /> You maintain leverage throughout the entire handoff process</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="border-t border-zinc-200">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <h2 className="text-2xl font-medium text-[#151B45] sm:text-3xl">
              How Payment Gating Works
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-600">
              Three steps. No payment processor to integrate, no complex webhooks to configure.
            </p>

            <div className="mt-12 space-y-8">
              <div className="flex gap-6 border-b border-zinc-100 pb-8">
                <span className="flex size-10 shrink-0 items-center justify-center font-mono text-sm font-medium border border-zinc-200 bg-zinc-50 text-[#151B45]">
                  01
                </span>
                <div>
                  <h3 className="text-lg font-medium text-[#151B45]">Upload your deliverables & attach your payment link</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                    Upload PDFs, images, ZIPs, code snippets, or any other file type to your portal. Optionally paste your Stripe, PayPal, Wise, or Bonsai invoice payment link — it appears as a prominent call-to-action button inside the client's portal view so they know exactly where to pay.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 border-b border-zinc-100 pb-8">
                <span className="flex size-10 shrink-0 items-center justify-center font-mono text-sm font-medium border border-zinc-200 bg-zinc-50 text-[#151B45]">
                  02
                </span>
                <div>
                  <h3 className="text-lg font-medium text-[#151B45]">Client reviews with watermarked in-browser previews</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                    Your client opens the portal with a 4-digit PIN — no account required. Images and PDFs render at full quality in-browser with a subtle canvas watermark overlay. They can inspect every detail, zoom in, request revisions, or approve. You receive a timestamped read receipt the moment they access the portal. The download button remains disabled and clearly shows a "Payment required" state throughout this review phase.
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
                    Once payment arrives in your invoicing tool, return to Portalize and click "Mark as Paid". All watermarks are removed and secure, time-limited full-resolution download links are generated for the client immediately. They can download everything they paid for — clean, unprotected, ready to use in production.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature highlights */}
        <section className="border-t border-zinc-200 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <h2 className="text-2xl font-medium text-[#151B45] sm:text-3xl">
              What makes Portalize payment gating different
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="border border-zinc-200 p-6">
                <span className="flex size-9 items-center justify-center border border-zinc-200 bg-zinc-50 text-[#151B45]">
                  <Lock className="size-4" />
                </span>
                <h3 className="mt-4 text-base font-medium text-[#151B45]">Server-side file locking</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  File URLs are never exposed client-side. Even a technically sophisticated client inspecting network traffic or page source cannot construct a working download link before payment is confirmed.
                </p>
              </div>
              <div className="border border-zinc-200 p-6">
                <span className="flex size-9 items-center justify-center border border-zinc-200 bg-zinc-50 text-[#151B45]">
                  <Eye className="size-4" />
                </span>
                <h3 className="mt-4 text-base font-medium text-[#151B45]">Watermarked previews, not blind delivery</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Unlike escrow services that hide work until payment, Portalize lets clients fully review everything before paying. This speeds up approval cycles and reduces revision requests while protecting your download leverage.
                </p>
              </div>
              <div className="border border-zinc-200 p-6">
                <span className="flex size-9 items-center justify-center border border-zinc-200 bg-zinc-50 text-[#151B45]">
                  <CreditCard className="size-4" />
                </span>
                <h3 className="mt-4 text-base font-medium text-[#151B45]">Invoicing tool agnostic</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Works with Stripe, PayPal, Wise, Bonsai, FreshBooks, Wave, QuickBooks, or a plain bank transfer. Portalize doesn't process payments — you control your invoicing workflow and just tell Portalize when to release.
                </p>
              </div>
              <div className="border border-zinc-200 p-6">
                <span className="flex size-9 items-center justify-center border border-zinc-200 bg-zinc-50 text-[#151B45]">
                  <Shield className="size-4" />
                </span>
                <h3 className="mt-4 text-base font-medium text-[#151B45]">Time-limited post-payment links</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Once unlocked, download links are time-limited and scoped to the specific session. This prevents clients from sharing direct download URLs publicly or with third parties after the handoff.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-zinc-200">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <h2 className="text-2xl font-medium text-[#151B45] sm:text-3xl">
              Frequently asked questions
            </h2>
            <dl className="mt-10 divide-y divide-zinc-200">
              {faqs.map((faq) => (
                <div key={faq.q} className="py-8">
                  <dt className="text-base font-medium text-[#151B45]">{faq.q}</dt>
                  <dd className="mt-3 text-sm leading-relaxed text-zinc-600">{faq.a}</dd>
                </div>
              ))}
            </dl>
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
