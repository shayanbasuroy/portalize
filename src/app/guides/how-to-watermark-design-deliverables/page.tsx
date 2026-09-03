import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

const BASE = "https://www.portalize.site";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Watermark Design Deliverables (Figma, PDFs & Assets) Without Looking Amateur",
  description:
    "Learn how professional design studios protect client proofing mockups. How to apply automated canvas watermarks to Figma, PDF, and image deliverables before payment.",
  url: `${BASE}/guides/how-to-watermark-design-deliverables`,
  datePublished: "2026-09-01",
  dateModified: "2026-09-03",
  author: { "@type": "Organization", name: "Portalize", url: BASE },
  publisher: {
    "@type": "Organization",
    name: "Portalize",
    url: BASE,
    logo: { "@type": "ImageObject", url: `${BASE}/icon.png` },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE}/guides/how-to-watermark-design-deliverables` },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE },
    { "@type": "ListItem", position: 2, name: "Guides", item: `${BASE}/guides` },
    { "@type": "ListItem", position: 3, name: "How to Watermark Design Deliverables", item: `${BASE}/guides/how-to-watermark-design-deliverables` },
  ],
};

export const metadata: Metadata = {
  title: "How to Watermark Design Deliverables (Figma, PDFs & Assets) Without Looking Amateur | Portalize",
  description:
    "Learn how professional design studios protect client proofing mockups. How to apply automated canvas watermarks to Figma, PDF, and image deliverables before payment.",
  alternates: {
    canonical: "/guides/how-to-watermark-design-deliverables",
  },
  openGraph: {
    title: "How to Watermark Design Deliverables | Portalize Guide",
    description:
      "A complete guide for freelance designers on watermarking client previews while maintaining high-end studio presentation.",
    url: "https://www.portalize.site/guides/how-to-watermark-design-deliverables",
  },
};

export default function WatermarkGuidePage() {
  return (
    <div className="min-h-screen bg-[#F8F7FC] text-[#151B45] antialiased flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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
              <span className="uppercase tracking-[0.16em] text-[#151B45]">Design Protection</span>
              <span>·</span>
              <span>5 min read</span>
              <span>·</span>
              <span>September 2026</span>
            </div>
            <h1 className="mt-4 text-3xl font-medium tracking-tight text-[#151B45] sm:text-5xl sm:leading-[1.1]">
              How to Watermark Design Deliverables Without Looking Amateur
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-zinc-600">
              Big ugly red stamps ruin client presentations. Subtle, canvas-rendered escrow watermarks protect your commercial rights while keeping your studio work looking elite.
            </p>
          </header>

          {/* Body Content */}
          <div className="mt-10 space-y-10 text-base leading-relaxed text-zinc-700">
            <section className="space-y-4">
              <h2 className="text-2xl font-medium text-[#151B45]">
                Why Traditional Watermarks Hurt Client Relationships
              </h2>
              <p>
                When a freelancer pastes an aggressive opaque &quot;SAMPLE / DO NOT COPY&quot; label across the middle of a logo or brand deck, clients feel distrusted. Worse, they can&apos;t properly evaluate typography, color balance, or spacing.
              </p>
              <p>
                The goal of watermarking during client proofing is simple: <strong>allow thorough visual inspection, but prevent print-ready or production deployment</strong> until final payment clears.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-medium text-[#151B45]">
                The 3 Rules of Professional Deliverable Watermarking
              </h2>
              <ul className="space-y-4 text-sm text-zinc-700">
                <li className="border border-zinc-200 bg-white p-5">
                  <p className="font-mono text-xs uppercase tracking-wider text-[#151B45] font-semibold">1. Dynamic Canvas Rendering (Never bake into source)</p>
                  <p className="mt-1 text-zinc-600">Never manually bake watermarks into your master Figma vectors or Photoshop artboards. Watermarks should be rendered dynamically over the preview in-browser, leaving the master files pristine.</p>
                </li>
                <li className="border border-zinc-200 bg-white p-5">
                  <p className="font-mono text-xs uppercase tracking-wider text-[#151B45] font-semibold">2. Diagonal Hairlines &amp; Low Opacity</p>
                  <p className="mt-1 text-zinc-600">Use 8%–12% opacity with precise 45-degree micro-pattern text (&quot;PREVIEW · UNPAID DELIVERABLE&quot;). This prevents automatic AI vector tracing while allowing complete visual review.</p>
                </li>
                <li className="border border-zinc-200 bg-white p-5">
                  <p className="font-mono text-xs uppercase tracking-wider text-[#151B45] font-semibold">3. Automatic Removal Upon Payment</p>
                  <p className="mt-1 text-zinc-600">The moment your invoice clears, the client should not have to wait for you to manually re-export files. The portal should unlock clean downloads instantly.</p>
                </li>
              </ul>
            </section>

            <section className="space-y-4 border-t border-zinc-200 pt-8">
              <h2 className="text-2xl font-medium text-[#151B45]">
                Automated In-Browser Watermarking with Portalize
              </h2>
              <p>
                <strong>Portalize</strong> handles the entire proofing cycle automatically:
              </p>
              <p>
                Upload your raw deliverables once. Portalize generates browser-based previews with subtle canvas watermarking. When you mark the project as paid, the client gets instant access to the uncompressed, unwatermarked master exports.
              </p>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-14 border border-zinc-200 bg-white p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-medium text-[#151B45]">Try automated deliverable watermarking</h3>
              <p className="mt-1 text-sm text-zinc-500">1 portal free forever · Set up in 2 minutes</p>
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
