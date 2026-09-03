import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, X, Shield, Lock, Zap } from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Why Freelancers Are Switching From Google Drive to Portalize | Comparison",
  description:
    "Google Drive lets clients download your work before paying. See why freelance designers and developers use Portalize for watermarked previews, PIN security, and payment-gated delivery.",
  alternates: {
    canonical: "/alternatives/google-drive",
  },
  openGraph: {
    title: "Google Drive vs Portalize for Client Deliverables | Comparison",
    description:
      "Stop losing final invoice payments. Compare Google Drive with Portalize's zero-login client portals with payment-gated downloads.",
    url: "https://portalize.site/alternatives/google-drive",
  },
};

export default function GoogleDriveAlternativePage() {
  return (
    <div className="min-h-screen bg-[#F8F7FC] text-[#151B45] antialiased flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-24">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            Comparison · Google Drive vs Portalize
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-medium tracking-tight text-[#151B45] sm:text-6xl sm:leading-[1.05]">
            Google Drive is for cloud storage. Portalize is for getting paid.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
            When you send a Google Drive link, the client can immediately download all your raw source files before paying your final invoice. Portalize closes that vulnerability forever.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-[#151B45] px-6 py-3 text-sm font-medium text-[#F8F7FC] transition-colors hover:bg-zinc-800"
            >
              Try Portalize free
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="border-t border-zinc-200">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <h2 className="text-2xl font-medium text-[#151B45] sm:text-3xl">
              Side-by-side deliverable comparison
            </h2>

            <div className="mt-10 overflow-x-auto border border-zinc-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50/75 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                    <th className="p-4 sm:px-6">Feature</th>
                    <th className="p-4 sm:px-6 text-zinc-500">Google Drive</th>
                    <th className="p-4 sm:px-6 text-[#151B45] font-semibold bg-[#151B45]/5">Portalize</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-zinc-700">
                  <tr>
                    <td className="p-4 sm:px-6 font-medium text-[#151B45]">Payment-Gated Downloads</td>
                    <td className="p-4 sm:px-6 text-red-600 flex items-center gap-1.5"><X className="size-4" /> No (instant download)</td>
                    <td className="p-4 sm:px-6 text-emerald-700 font-medium bg-[#151B45]/5"><Check className="size-4 inline mr-1 text-emerald-600" /> Yes (locked until paid)</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:px-6 font-medium text-[#151B45]">Automatic Watermarked Previews</td>
                    <td className="p-4 sm:px-6 text-red-600"><X className="size-4 inline mr-1" /> No</td>
                    <td className="p-4 sm:px-6 text-emerald-700 font-medium bg-[#151B45]/5"><Check className="size-4 inline mr-1 text-emerald-600" /> Yes (canvas watermarking)</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:px-6 font-medium text-[#151B45]">Client Login Required</td>
                    <td className="p-4 sm:px-6 text-amber-700">Requires Google account for permissions</td>
                    <td className="p-4 sm:px-6 text-emerald-700 font-medium bg-[#151B45]/5"><Check className="size-4 inline mr-1 text-emerald-600" /> No (1 link + 4-digit PIN)</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:px-6 font-medium text-[#151B45]">Realtime Read Receipts</td>
                    <td className="p-4 sm:px-6 text-red-600"><X className="size-4 inline mr-1" /> No</td>
                    <td className="p-4 sm:px-6 text-emerald-700 font-medium bg-[#151B45]/5"><Check className="size-4 inline mr-1 text-emerald-600" /> Yes (instant open & preview timestamps)</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:px-6 font-medium text-[#151B45]">Custom Studio Branding</td>
                    <td className="p-4 sm:px-6 text-red-600"><X className="size-4 inline mr-1" /> No (shows Google UI)</td>
                    <td className="p-4 sm:px-6 text-emerald-700 font-medium bg-[#151B45]/5"><Check className="size-4 inline mr-1 text-emerald-600" /> Yes (your studio logo & identity)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-zinc-200">
          <div className="mx-auto max-w-6xl px-6 py-20 text-center">
            <h2 className="text-3xl font-medium text-[#151B45]">
              Upgrade your client delivery workflow today
            </h2>
            <p className="mt-3 text-sm text-zinc-600">
              Free to start with 1 active portal. Pro is just $9/month.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex items-center gap-2 bg-[#151B45] px-8 py-3.5 text-sm font-medium text-[#F8F7FC] transition-colors hover:bg-zinc-800"
            >
              Create your first portal in 2 minutes
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
