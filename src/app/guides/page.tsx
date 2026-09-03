import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Freelance Client Delivery & Payment Protection Guides | Portalize",
  description:
    "Actionable guides for freelance designers, developers, and studios. Learn how to prevent unpaid invoices, watermark deliverables, protect your work during client proofing, and deliver client work professionally.",
  alternates: {
    canonical: "/guides",
  },
  openGraph: {
    title: "Freelance Client Delivery & Payment Protection Guides | Portalize",
    description:
      "Expert guides on client handoffs, escrow delivery, watermark protection, and getting paid on time.",
    url: "https://www.portalize.site/guides",
  },
};

const guides = [
  {
    slug: "what-to-do-when-client-wont-pay-final-invoice",
    title: "What to Do When a Client Won't Pay Your Final Invoice (Scripts & Strategy)",
    description:
      "A battle-tested 4-step framework to recover unpaid freelance milestone payments, with copy-paste email templates and escrow delivery prevention. Covers everything from polite follow-up to escalation and legal options.",
    category: "Payment Recovery",
    readTime: "6 min read",
    date: "September 2026",
  },
  {
    slug: "how-to-watermark-design-deliverables",
    title: "How to Watermark Design Deliverables (Figma, PDFs & Assets) Without Looking Amateur",
    description:
      "Protect your visual work during client proofing. How to apply subtle canvas watermarks that preserve client review quality while preventing unauthorized use before payment — and why bad watermarks can damage your studio reputation.",
    category: "Design Protection",
    readTime: "5 min read",
    date: "September 2026",
  },
  {
    slug: "freelance-client-onboarding-delivery-checklist",
    title: "The Zero-Friction Freelance Client Delivery & Handoff Checklist",
    description:
      "The complete step-by-step checklist for packaging deliverables, collecting approvals, and securing payment before handing over root source files. Covers file naming, version control, approval records, and handoff communication.",
    category: "Workflows",
    readTime: "4 min read",
    date: "September 2026",
  },
];

const topics = [
  {
    category: "Payment Recovery",
    description: "Scripts, frameworks, and timelines for recovering overdue freelance invoices. From first polite follow-up to escalation.",
  },
  {
    category: "Deliverable Protection",
    description: "Watermarking strategies, escrow delivery, and file locking techniques to protect your work before payment clears.",
  },
  {
    category: "Client Workflows",
    description: "Step-by-step checklists and systems for professional client onboarding, delivery, and handoff that reduce friction for everyone.",
  },
  {
    category: "Contracts & Legal",
    description: "Practical guidance on freelance contract clauses that protect your IP, milestone payments, and revision boundaries. Coming soon.",
  },
];

export default function GuidesIndexPage() {
  return (
    <div className="min-h-screen bg-[#F8F7FC] text-[#151B45] antialiased flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-24">
        {/* Header */}
        <section className="mx-auto max-w-5xl px-6 py-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            Resources · Freelance Guides
          </p>
          <h1 className="mt-4 text-4xl font-medium tracking-tight text-[#151B45] sm:text-5xl">
            Client Delivery & Escrow Guides
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-600">
            Actionable strategies and workflows for freelancers to eliminate payment disputes, protect creative work, and deliver like an elite studio. Written for designers, developers, and independent studios who are tired of chasing invoices.
          </p>
        </section>

        {/* Topic categories */}
        <section className="border-t border-zinc-200 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <h2 className="text-xl font-medium text-[#151B45]">What we cover</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {topics.map((topic) => (
                <div key={topic.category} className="border border-zinc-200 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#151B45]">{topic.category}</p>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-600">{topic.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Guides List */}
        <section className="border-t border-zinc-200">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <h2 className="text-xl font-medium text-[#151B45]">All guides</h2>
            <div className="mt-8 divide-y divide-zinc-200 border-y border-zinc-200">
              {guides.map((g) => (
                <article key={g.slug} className="py-10 group">
                  <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-400">
                    <span className="uppercase tracking-[0.16em] text-[#151B45]">{g.category}</span>
                    <span>·</span>
                    <span>{g.readTime}</span>
                    <span>·</span>
                    <span>{g.date}</span>
                  </div>

                  <h2 className="mt-3 text-2xl font-medium text-[#151B45] group-hover:underline">
                    <Link href={`/guides/${g.slug}`}>
                      {g.title}
                    </Link>
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-zinc-600 max-w-3xl">
                    {g.description}
                  </p>

                  <div className="mt-6">
                    <Link
                      href={`/guides/${g.slug}`}
                      className="inline-flex items-center gap-1.5 font-medium text-sm text-[#151B45] group-hover:gap-2.5 transition-all"
                    >
                      Read full guide
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="border-t border-zinc-200">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <div className="border border-zinc-200 bg-white p-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">Put it into practice</p>
              <h2 className="mt-3 text-2xl font-medium text-[#151B45]">
                Ready to start delivering work the right way?
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-600">
                Everything in these guides is built into Portalize — watermarked previews, payment-gated downloads, timestamped read receipts, and zero-login client portals. Start for free with your first portal.
              </p>
              <Link
                href="/signup"
                className="mt-6 inline-flex items-center gap-2 bg-[#151B45] px-6 py-3 text-sm font-medium text-[#F8F7FC] transition-colors hover:bg-zinc-800"
              >
                Create your first portal free
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
