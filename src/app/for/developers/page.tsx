import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Code, Lock, Terminal, Shield, GitBranch, FileArchive } from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Client Delivery Portal for Web Developers & Freelance Engineers | Portalize",
  description:
    "Deliver frontend code, scripts, zip archives, and staging links to clients securely. Clients preview code in-browser, and download archives unlock when payment clears. Works alongside any invoicing tool.",
  alternates: {
    canonical: "/for/developers",
  },
  openGraph: {
    title: "Client Delivery Portal for Web Developers & Freelance Engineers | Portalize",
    description:
      "Share code snippets, build artifacts, and repository zips behind 4-digit PIN authentication. Seal source downloads until your milestone invoice is paid.",
    url: "https://www.portalize.site/for/developers",
  },
};

const useCases = [
  {
    title: "Frontend projects & build artifacts",
    description:
      "Deliver compiled React, Next.js, or Vue builds, static site exports, and minified bundles. Clients can review what was built in a linked staging URL while the downloadable ZIP of production-ready code stays locked until payment.",
  },
  {
    title: "Custom scripts & automation tools",
    description:
      "Python scripts, shell automation, CLI tools, browser extensions — anything you've built and need to hand over securely. Paste a code snippet for in-browser preview with syntax highlighting, while the full implementation archive stays payment-gated.",
  },
  {
    title: "WordPress & CMS theme deliveries",
    description:
      "Hand over theme ZIPs, plugin bundles, and database exports with a professional client-facing portal instead of emailing raw .zip files. The client sees exactly what they're getting before they pay to access it.",
  },
  {
    title: "API integrations & backend services",
    description:
      "For milestone-based backend work — REST API services, database schemas, integration scripts — share sanitized code previews and architecture documentation in-browser while keeping the full source archive locked.",
  },
  {
    title: "Mobile app source code deliveries",
    description:
      "React Native, Flutter, or native iOS/Android projects. Deliver a readable preview of the project structure and key components while the full Xcode project or APK build file waits behind the payment gate.",
  },
];

const faqs = [
  {
    q: "Can clients see code before paying?",
    a: "Yes — you can paste representative code snippets that render in Portalize's syntax-highlighted in-browser viewer. This lets clients inspect implementation quality, code structure, and patterns before approving and paying for the full source archive. The complete downloadable ZIP remains locked until payment is confirmed.",
  },
  {
    q: "What file formats can I deliver for development projects?",
    a: "ZIP archives are the primary format for full codebase deliveries. You can also upload individual files — JS/TS, Python, SQL, shell scripts — for standalone script deliveries. PDFs work for technical documentation, architecture diagrams, and API reference docs.",
  },
  {
    q: "How does this work for milestone-based contracts?",
    a: "Create one portal per milestone. Milestone 1 (design mockups + initial architecture) gets its own portal with its own payment gate. Milestone 2 (working frontend) gets a second portal. Each unlocks independently when that invoice clears. This gives both you and the client a clear record of what was delivered and paid for at each stage.",
  },
  {
    q: "Can I share staging URLs or deployment links in the portal?",
    a: "Yes. The portal supports rich text notes and external links. You can include a link to the staging environment, a Vercel preview URL, or a Netlify deploy alongside the downloadable source code. The staging link is always accessible; the source ZIP remains gated.",
  },
  {
    q: "Does my client need a GitHub account or any technical setup?",
    a: "No. Portalize is deliberately non-technical from the client's perspective. They open a private URL, type a 4-digit PIN, and see a clean portal with everything you've delivered. No GitHub, no npm, no command line — just a browser.",
  },
  {
    q: "How do I handle revision cycles before payment?",
    a: "Revision requests go through Portalize's comment and feedback feature. The client can flag issues or request changes directly within the portal, and you can update the uploaded files before marking the project approved. Downloads remain locked throughout the revision cycle.",
  },
];

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

        {/* The developer-specific problem */}
        <section className="border-t border-zinc-200 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <h2 className="text-2xl font-medium text-[#151B45] sm:text-3xl">
              Why developer deliveries are uniquely vulnerable
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-600">
              When a designer delivers work over Google Drive, the worst case is a client using a logo they didn't pay for. When a developer hands over a repository or production build, the stakes are higher: the client could deploy your code to a live product, build additional features on top of it, or share it with other developers — all before you've received a cent of your final milestone payment.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-600">
              Traditional delivery methods — emailing ZIP files, sharing GitHub repository access, sending WeTransfer links, or granting Dropbox folder access — give clients immediate, unrestricted control over your work. There's no practical way to "take back" code once it's been handed over. Payment gating your deliverables before handoff is the only structural protection that works.
            </p>
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
                  Clients can inspect TypeScript, Python, HTML/CSS, SQL, and other code snippets directly in an in-browser viewer with line numbers and copy controls — without downloading anything or opening an IDE.
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
                  Full codebase ZIPs, documentation PDFs, and build artifacts remain securely locked server-side until you click "Mark as Paid". File URLs are never exposed in the browser — no clever inspect tricks bypass this.
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
                  Clients don&apos;t need GitHub accounts or portal logins. One private URL and a 4-digit PIN gives them immediate access to review your deliverables — no friction, no support tickets about login issues.
                </p>
              </div>

              <div className="border border-zinc-200 bg-white p-8">
                <span className="flex size-10 items-center justify-center border border-zinc-200 bg-zinc-50 text-[#151B45]">
                  <GitBranch className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-medium text-[#151B45]">
                  Milestone-Based Portal Structure
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Create separate portals for each project milestone. Each portal has its own payment gate — unlock them independently as invoices clear. Maintains a clean, professional audit trail of what was delivered when.
                </p>
              </div>

              <div className="border border-zinc-200 bg-white p-8">
                <span className="flex size-10 items-center justify-center border border-zinc-200 bg-zinc-50 text-[#151B45]">
                  <Shield className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-medium text-[#151B45]">
                  Timestamped Read Receipts
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Receive instant notifications the moment your client accesses the portal and reviews each deliverable. Know exactly when to follow up on approvals and outstanding invoices without awkward chaser emails.
                </p>
              </div>

              <div className="border border-zinc-200 bg-white p-8">
                <span className="flex size-10 items-center justify-center border border-zinc-200 bg-zinc-50 text-[#151B45]">
                  <FileArchive className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-medium text-[#151B45]">
                  Any File Format, Any Size
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  ZIPs, PDFs, images, videos, code files — all supported up to 50MB per file. No conversion required. Upload exactly what you built and deliver it as-is with professional presentation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="border-t border-zinc-200 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <h2 className="text-2xl font-medium text-[#151B45] sm:text-3xl">
              Common developer delivery scenarios
            </h2>
            <div className="mt-10 divide-y divide-zinc-200">
              {useCases.map((uc) => (
                <div key={uc.title} className="py-8">
                  <h3 className="text-base font-medium text-[#151B45]">{uc.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">{uc.description}</p>
                </div>
              ))}
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
