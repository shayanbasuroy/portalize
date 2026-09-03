import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Code, Lock, Shield, Terminal } from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Client Delivery Portal for Web Developers & Freelance Engineers | Portalize",
  description:
    "Deliver frontend code, scripts, zip archives, and staging links to clients securely. Clients preview code in-browser, and download archives unlock when payment clears.",
  alternates: {
    canonical: "/for/developers",
  },
  openGraph: {
    title: "Client Delivery Portal for Web Developers & Freelance Engineers | Portalize",
    description:
      "Share code snippets, build artifacts, and repository zips behind 4-digit PIN authentication. Seal source downloads until your milestone invoice is paid.",
    url: "https://portalize.site/for/developers",
  },
};

export default function ForDevelopersPage() {
  return (
    <div className="min-h-screen bg-[#F8F7FC] text-[#151B45] antialiased flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-24">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            Solutions · For Web & Software Developers
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-medium tracking-tight text-[#151B45] sm:text-6xl sm:leading-[1.05]">
            Hand off code deliverables with escrow protection.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Never hand over root repositories or production build zips before your final invoice is paid. Portalize provides syntax-highlighted in-browser code inspection while keeping the downloadable source locked until payment clears.
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
              Built for developer workflows
            </h2>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="border border-zinc-200 bg-white p-8">
                <span className="flex size-10 items-center justify-center border border-zinc-200 bg-zinc-50 text-[#151B45]">
                  <Code className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-medium text-[#151B45]">
                  Syntax-Highlighted Code Viewer
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Clients can inspect TypeScript, Python, HTML/CSS, and SQL snippets directly in an in-browser code viewer with line numbers and copy controls.
                </p>
              </div>

              <div className="border border-zinc-200 bg-white p-8">
                <span className="flex size-10 items-center justify-center border border-zinc-200 bg-zinc-50 text-[#151B45]">
                  <Lock className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-medium text-[#151B45]">
                  Payment-Gated Source Downloads
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Full codebase ZIPs, documentation PDFs, and build artifacts remain securely locked on the server until payment is marked complete.
                </p>
              </div>

              <div className="border border-zinc-200 bg-white p-8">
                <span className="flex size-10 items-center justify-center border border-zinc-200 bg-zinc-50 text-[#151B45]">
                  <Terminal className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-medium text-[#151B45]">
                  Zero-Login Client Experience
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Clients don&apos;t need GitHub accounts or portal logins. One private URL and a 4-digit PIN gives them immediate access.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-zinc-200">
          <div className="mx-auto max-w-6xl px-6 py-20 text-center">
            <h2 className="text-3xl font-medium text-[#151B45]">
              Stop losing final milestone payments on code handoffs
            </h2>
            <p className="mt-3 text-sm text-zinc-600">
              Deliver your next client project with Portalize in under 2 minutes.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex items-center gap-2 bg-[#151B45] px-8 py-3.5 text-sm font-medium text-[#F8F7FC] transition-colors hover:bg-zinc-800"
            >
              Create your developer portal
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
