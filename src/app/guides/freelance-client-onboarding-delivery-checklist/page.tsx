import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "The Zero-Friction Freelance Client Delivery & Handoff Checklist | Portalize",
  description:
    "The complete checklist for freelance designers and developers. How to package deliverables, collect client feedback, and get paid before handing over root source files.",
  alternates: {
    canonical: "/guides/freelance-client-onboarding-delivery-checklist",
  },
  openGraph: {
    title: "Freelance Client Delivery & Handoff Checklist | Portalize Guide",
    description:
      "A complete framework for smooth client project handoffs with zero password friction and guaranteed invoice protection.",
    url: "https://portalize.site/guides/freelance-client-onboarding-delivery-checklist",
  },
};

const checklistItems = [
  {
    phase: "Phase 1: Pre-Delivery Preparation",
    items: [
      "Audit all deliverables against the original contract scope.",
      "Package assets logically (SVG icons, brand guidelines PDF, production ZIPs).",
      "Ensure master source vectors and repos are archived safely on your local backup.",
    ],
  },
  {
    phase: "Phase 2: Client Review & Feedback",
    items: [
      "Create a private client portal with 4-digit PIN access (no client account creation).",
      "Enable automated canvas watermark protection for visual proofing.",
      "Send the single private link to your primary client stakeholder.",
      "Monitor realtime read receipts to verify when the client opens your portal.",
    ],
  },
  {
    phase: "Phase 3: Approval & Escrow Handshake",
    items: [
      "Collect written sign-off or revision notes directly through the portal.",
      "Attach your Stripe/PayPal invoice link with final payment balance.",
      "Mark as paid once wire/card clears to automatically unlock unwatermarked master downloads.",
      "Transfer intellectual property commercial release documentation.",
    ],
  },
];

export default function ChecklistGuidePage() {
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
              <span className="uppercase tracking-[0.16em] text-[#151B45]">Workflows</span>
              <span>·</span>
              <span>4 min read</span>
              <span>·</span>
              <span>September 2026</span>
            </div>
            <h1 className="mt-4 text-3xl font-medium tracking-tight text-[#151B45] sm:text-5xl sm:leading-[1.1]">
              The Zero-Friction Freelance Client Delivery &amp; Handoff Checklist
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-zinc-600">
              How elite studios turn the final 10% of a project into a seamless, payment-protected experience that turns clients into repeat referral engines.
            </p>
          </header>

          {/* Body Content */}
          <div className="mt-10 space-y-12 text-base leading-relaxed text-zinc-700">
            {checklistItems.map((sec, idx) => (
              <section key={sec.phase} className="space-y-4">
                <h2 className="text-xl font-medium text-[#151B45]">
                  {sec.phase}
                </h2>
                <div className="border border-zinc-200 bg-white p-6 space-y-3">
                  {sec.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-start gap-3">
                      <CheckCircle2 className="size-5 shrink-0 text-emerald-600 mt-0.5" />
                      <p className="text-sm text-zinc-700">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            <section className="space-y-4 border-t border-zinc-200 pt-8">
              <h2 className="text-2xl font-medium text-[#151B45]">
                Why Traditional Delivery Breaks Down
              </h2>
              <p>
                Emailing zip files or sharing cluttered Google Drive folders creates three common failure points:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-zinc-600">
                <li>Clients lose download links across endless email threads.</li>
                <li>Clients download raw files and ignore final invoice reminders.</li>
                <li>Clients get confused by raw file formats and require extra hand-holding.</li>
              </ul>
              <p className="mt-4">
                By packaging deliveries inside a branded, PIN-protected portal with in-browser previews, you protect your revenue and present your work with agency-grade polish.
              </p>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-14 border border-zinc-200 bg-white p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-medium text-[#151B45]">Ready to streamline your client handoffs?</h3>
              <p className="mt-1 text-sm text-zinc-500">Create your first client delivery portal in 2 minutes</p>
            </div>
            <Link
              href="/signup"
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-[#151B45] px-6 py-2.5 text-sm font-medium text-[#F8F7FC] hover:bg-zinc-800 transition-colors"
            >
              Start for free
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
