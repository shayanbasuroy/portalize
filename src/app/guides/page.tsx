import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Shield, Lock, FileCheck } from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Freelance Client Delivery & Payment Protection Guides | Portalize",
  description:
    "Actionable guides for freelance designers, developers, and studios. Learn how to prevent unpaid invoices, watermark deliverables, and deliver client work professionally.",
  alternates: {
    canonical: "/guides",
  },
  openGraph: {
    title: "Freelance Client Delivery & Payment Protection Guides | Portalize",
    description:
      "Expert guides on client handoffs, escrow delivery, watermark protection, and getting paid on time.",
    url: "https://portalize.site/guides",
  },
};

const guides = [
  {
    slug: "what-to-do-when-client-wont-pay-final-invoice",
    title: "What to Do When a Client Won't Pay Your Final Invoice (Scripts & Strategy)",
    description:
      "A battle-tested 4-step framework to recover unpaid freelance milestone payments, with copy-paste email templates and escrow delivery prevention.",
    category: "Payment Recovery",
    readTime: "6 min read",
    date: "September 2026",
  },
  {
    slug: "how-to-watermark-design-deliverables",
    title: "How to Watermark Design Deliverables (Figma, PDFs & Assets) Without Looking Amateur",
    description:
      "Protect your visual work during client proofing. How to apply subtle canvas watermarks that preserve client review while preventing unauthorized use.",
    category: "Design Protection",
    readTime: "5 min read",
    date: "September 2026",
  },
  {
    slug: "freelance-client-onboarding-delivery-checklist",
    title: "The Zero-Friction Freelance Client Delivery & Handoff Checklist",
    description:
      "The complete step-by-step checklist for packaging deliverables, collecting approvals, and securing payment before handing over root source files.",
    category: "Workflows",
    readTime: "4 min read",
    date: "September 2026",
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
            Client Delivery &amp; Escrow Guides
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-600">
            Actionable strategies and workflows for freelancers to eliminate payment disputes, protect creative work, and deliver like an elite studio.
          </p>
        </section>

        {/* Guides List */}
        <section className="border-t border-zinc-200">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <div className="divide-y divide-zinc-200 border-y border-zinc-200">
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
      </main>

      <Footer />
    </div>
  );
}
