import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, X, Shield, Lock, Zap } from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "The Lightweight, Zero-Login Alternative to Dubsado & HoneyBook | Portalize",
  description:
    "Tired of complex $40/month freelance CRMs that force clients to register passwords? Portalize gives you fast, elegant client portals with watermarked previews for just $9/mo.",
  alternates: {
    canonical: "/alternatives/dubsado",
  },
  openGraph: {
    title: "Dubsado vs Portalize: Lightweight Client Portals for Freelancers",
    description:
      "Why pay $40/mo for a complex CRM when you just want a sleek, zero-login portal to hand off deliverables and get paid? Compare Dubsado and Portalize.",
    url: "https://portalize.site/alternatives/dubsado",
  },
};

export default function DubsadoAlternativePage() {
  return (
    <div className="min-h-screen bg-[#F8F7FC] text-[#151B45] antialiased flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-24">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            Comparison · Dubsado vs Portalize
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-medium tracking-tight text-[#151B45] sm:text-6xl sm:leading-[1.05]">
            Everything you need for client delivery. None of the CRM bloat.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Dubsado and HoneyBook cost $40+/month and require weeks of setup, complex client logins, and tedious forms. Portalize takes 2 minutes to create a private 4-digit PIN delivery portal for $9/mo.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-[#151B45] px-6 py-3 text-sm font-medium text-[#F8F7FC] transition-colors hover:bg-zinc-800"
            >
              Get started free
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        {/* Comparison Grid */}
        <section className="border-t border-zinc-200 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <h2 className="text-2xl font-medium text-[#151B45] sm:text-3xl">
              Compare the essentials
            </h2>

            <div className="mt-10 overflow-x-auto border border-zinc-200">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50/75 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                    <th className="p-4 sm:px-6">Criteria</th>
                    <th className="p-4 sm:px-6 text-zinc-500">Dubsado / HoneyBook</th>
                    <th className="p-4 sm:px-6 text-[#151B45] font-semibold bg-[#151B45]/5">Portalize</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-zinc-700">
                  <tr>
                    <td className="p-4 sm:px-6 font-medium text-[#151B45]">Monthly Price</td>
                    <td className="p-4 sm:px-6 text-red-600">$40 – $50 / month</td>
                    <td className="p-4 sm:px-6 text-emerald-700 font-semibold bg-[#151B45]/5">$9 / month (Free tier available)</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:px-6 font-medium text-[#151B45]">Client Onboarding Friction</td>
                    <td className="p-4 sm:px-6 text-amber-700">Client must create passwords & log in</td>
                    <td className="p-4 sm:px-6 text-emerald-700 font-medium bg-[#151B45]/5"><Check className="size-4 inline mr-1 text-emerald-600" /> Zero logins (1 link + 4-digit PIN)</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:px-6 font-medium text-[#151B45]">Deliverable Watermark Escrow</td>
                    <td className="p-4 sm:px-6 text-red-600"><X className="size-4 inline mr-1" /> Not available</td>
                    <td className="p-4 sm:px-6 text-emerald-700 font-medium bg-[#151B45]/5"><Check className="size-4 inline mr-1 text-emerald-600" /> Built-in canvas watermarking</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:px-6 font-medium text-[#151B45]">Setup Time</td>
                    <td className="p-4 sm:px-6 text-amber-700">Days to weeks of configuration</td>
                    <td className="p-4 sm:px-6 text-emerald-700 font-medium bg-[#151B45]/5"><Check className="size-4 inline mr-1 text-emerald-600" /> 2 minutes to create your first portal</td>
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
              Ready to simplify your client handoffs?
            </h2>
            <p className="mt-3 text-sm text-zinc-600">
              No credit card required. Start delivering with Portalize in minutes.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex items-center gap-2 bg-[#151B45] px-8 py-3.5 text-sm font-medium text-[#F8F7FC] transition-colors hover:bg-zinc-800"
            >
              Start for free
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
