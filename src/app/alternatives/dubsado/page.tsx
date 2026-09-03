import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
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
    url: "https://www.portalize.site/alternatives/dubsado",
  },
};

const comparisonRows = [
  {
    criteria: "Monthly Price",
    dubsado: "$40 – $50 / month",
    portalize: "$9 / month (Free tier available)",
    dubsadoBad: true,
  },
  {
    criteria: "Client Login Required",
    dubsado: "Client must create an account & password",
    portalize: "Zero logins — 1 link + 4-digit PIN",
    dubsadoBad: true,
  },
  {
    criteria: "Setup Time",
    dubsado: "Days to weeks of configuration",
    portalize: "2 minutes to create your first portal",
    dubsadoBad: true,
  },
  {
    criteria: "Watermarked Deliverable Previews",
    dubsado: "Not available",
    portalize: "Built-in canvas watermarking",
    dubsadoBad: true,
  },
  {
    criteria: "Payment-Gated Downloads",
    dubsado: "No — files accessible immediately",
    portalize: "Downloads locked until invoice paid",
    dubsadoBad: true,
  },
  {
    criteria: "Realtime Read Receipts",
    dubsado: "No client view tracking",
    portalize: "Timestamped open & preview receipts",
    dubsadoBad: true,
  },
  {
    criteria: "Full CRM (contracts, questionnaires)",
    dubsado: "Yes — extensive feature set",
    portalize: "No — focused on delivery only",
    dubsadoBad: false,
  },
];

const faqs = [
  {
    q: "Does Portalize replace Dubsado entirely?",
    a: "No — and it's not trying to. Dubsado is a full CRM with contract signing, scheduling, and questionnaires. Portalize is laser-focused on one thing: delivering finished work to your client behind a watermark paywall and getting paid before they can download the source files. Many freelancers use both — Dubsado for project management, Portalize for the actual deliverable handoff.",
  },
  {
    q: "Do my clients need to create a Portalize account?",
    a: "Never. Clients open a single private link and enter the 4-digit PIN you give them — that's it. No signup, no password manager, no support tickets asking 'how do I log in?'. The friction-free experience means clients actually open and review your work instead of ignoring complex login emails.",
  },
  {
    q: "How does payment gating work without native Stripe integration?",
    a: "Portalize doesn't process payments itself — it works alongside any invoicing tool you already use (Stripe, PayPal, Wise, Bonsai, etc.). You upload your deliverables and paste your payment link. When payment clears in your invoicing tool, you click 'Mark as Paid' in Portalize and the download unlocks instantly for the client. Simple manual handshake, no complex integrations to configure.",
  },
  {
    q: "What file types can I deliver through Portalize?",
    a: "Portalize supports PDFs, PNG/JPG/WebP images, SVGs, ZIP archives, video files, and raw code snippets. Image and PDF previews render directly in-browser with watermark overlay. ZIPs and other binary files show a secure preview card with a locked download button until you mark the project paid.",
  },
  {
    q: "Is Portalize free?",
    a: "Yes — the free plan includes 1 active portal forever. Upgrade to Pro at $9/month for unlimited active portals, custom studio branding, and priority support.",
  },
];

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
            Dubsado and HoneyBook cost $40+/month and require weeks of setup, complex client logins, and tedious forms. Portalize takes 2 minutes to create a private 4-digit PIN delivery portal for $9/mo — or free for your first portal.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-[#151B45] px-6 py-3 text-sm font-medium text-[#F8F7FC] transition-colors hover:bg-zinc-800"
            >
              Get started free
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

        {/* Problem / Why section */}
        <section className="border-t border-zinc-200 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <h2 className="text-2xl font-medium text-[#151B45] sm:text-3xl">
              The problem with full-suite freelance CRMs
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-600">
              Dubsado and HoneyBook are powerful tools built for studios that need contracts, lead pipelines, scheduling, and complex client questionnaires. But for the majority of independent freelancers, they're massively overbuilt — and the price tag reflects it.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="border border-zinc-200 p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">Problem 1</p>
                <h3 className="mt-3 text-base font-medium text-[#151B45]">Client login friction kills approvals</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Dubsado requires clients to create accounts and remember passwords before accessing your delivered work. Many clients abandon the process entirely, delaying your approval and payment by days.
                </p>
              </div>
              <div className="border border-zinc-200 p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">Problem 2</p>
                <h3 className="mt-3 text-base font-medium text-[#151B45]">No watermark protection on previews</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Neither Dubsado nor HoneyBook offer watermarked in-browser previews. Clients can screenshot or screen-record your final design before paying a single dollar of their outstanding invoice.
                </p>
              </div>
              <div className="border border-zinc-200 p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">Problem 3</p>
                <h3 className="mt-3 text-base font-medium text-[#151B45]">$40/month is steep for delivery alone</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  If all you need is a secure way to share finished deliverables and lock downloads until paid, you're paying for dozens of CRM features you'll never touch. Portalize gives you exactly what you need at a fraction of the cost.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Grid */}
        <section className="border-t border-zinc-200">
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
                  {comparisonRows.map((row) => (
                    <tr key={row.criteria}>
                      <td className="p-4 sm:px-6 font-medium text-[#151B45]">{row.criteria}</td>
                      <td className={`p-4 sm:px-6 ${row.dubsadoBad ? "text-red-600" : "text-zinc-600"}`}>
                        {row.dubsadoBad && <X className="size-4 inline mr-1" />}
                        {row.dubsado}
                      </td>
                      <td className={`p-4 sm:px-6 font-medium bg-[#151B45]/5 ${row.dubsadoBad ? "text-emerald-700" : "text-zinc-500"}`}>
                        {row.dubsadoBad && <Check className="size-4 inline mr-1 text-emerald-600" />}
                        {row.portalize}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Who Portalize is for */}
        <section className="border-t border-zinc-200 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <h2 className="text-2xl font-medium text-[#151B45] sm:text-3xl">
              Who switches from Dubsado to Portalize
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-600">
              Portalize isn't right for everyone — but for these freelancers, it's a significant upgrade on the delivery experience specifically.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Freelance brand designers and UI/UX designers who need to share Figma exports, mockup PDFs, and logo packages behind a pay-before-you-download wall.",
                "Web developers who want to share finished build artifacts, zip archives, or code snippets without handing over root access before payment clears.",
                "Video editors and motion designers delivering finished cuts, project files, and raw exports who've been burned by clients downloading and ghosting on the final invoice.",
                "Copywriters and content strategists delivering long-form documents and brand strategy decks who need proof the client actually read the work.",
                "Any freelancer currently using Google Drive, WeTransfer, Dropbox, or a plain email attachment — and who has lost a final payment in the last 12 months.",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-zinc-700">
                  <Check className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                  {point}
                </li>
              ))}
            </ul>
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
