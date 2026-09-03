import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
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
    url: "https://www.portalize.site/alternatives/google-drive",
  },
};

const comparisonRows = [
  {
    feature: "Payment-Gated Downloads",
    drive: "No — client can download immediately",
    portalize: "Yes — downloads locked until you mark as paid",
    driveBad: true,
  },
  {
    feature: "Automatic Watermarked Previews",
    drive: "No watermarks on shared files",
    portalize: "Canvas watermarking on all previews",
    driveBad: true,
  },
  {
    feature: "Client Account Required",
    drive: "Google account required for restricted files",
    portalize: "No account — 1 link + 4-digit PIN",
    driveBad: true,
  },
  {
    feature: "Realtime Read Receipts",
    drive: "No view tracking",
    portalize: "Timestamped open & preview receipts",
    driveBad: true,
  },
  {
    feature: "Custom Studio Branding",
    drive: "Shows Google Drive UI",
    portalize: "Your studio logo and identity",
    driveBad: true,
  },
  {
    feature: "Deliverable Link Expiry",
    drive: "Links can be revoked but don't auto-expire",
    portalize: "Time-limited secure download links post-payment",
    driveBad: false,
  },
  {
    feature: "Monthly Cost",
    drive: "Free (15GB) / $2.99–$9.99/mo for storage",
    portalize: "Free (1 portal) / $9/mo for unlimited",
    driveBad: false,
  },
];

const scenarios = [
  {
    title: "The ghosted final invoice scenario",
    before:
      "You share a Google Drive link with the completed brand identity. The client downloads everything — logo SVGs, brand guide PDF, source AI files — thanks you, and then goes silent. Your final 50% payment never arrives.",
    after:
      "With Portalize, the client can browse beautiful watermarked previews in-browser. Every asset shows your studio watermark until you click 'Mark as Paid'. They literally cannot download a clean file until payment clears.",
  },
  {
    title: "The 'can you send it again' scenario",
    before:
      "You email a Drive link. The client's Google account can't access it. They reply asking you to re-share. You fiddle with permissions. Three back-and-forth emails later, the client gives up reviewing until tomorrow.",
    after:
      "You send one private portal URL and a 4-digit PIN via any channel. The client opens it on any device with zero friction. No Google account, no permission juggling, no support tickets.",
  },
  {
    title: "The 'did they even look at it' scenario",
    before:
      "You uploaded the deliverables to Drive three days ago. You have no idea if the client viewed them, what they thought, or if the link even worked. You send a chaser email into the void.",
    after:
      "Portalize sends you a realtime notification the moment your client enters their PIN and begins previewing your work — with timestamps for each file opened. You know exactly when to follow up.",
  },
];

const faqs = [
  {
    q: "Can't I just restrict permissions on Google Drive?",
    a: "You can restrict a Drive folder so only invited emails can access it — but this still requires your client to have and be logged into a Google account. It also doesn't add watermarks or lock downloads until payment. The permission model protects against random internet visitors, not against an authenticated client who decides not to pay their final invoice.",
  },
  {
    q: "What if my client doesn't have a Google account?",
    a: "This is a surprisingly common pain point. If you share a restricted Drive folder, a client without a Google account simply cannot access it. Portalize requires no account at all — just the link and the 4-digit PIN you share with your client through any channel.",
  },
  {
    q: "Does Portalize store my files forever?",
    a: "Files are stored securely for the duration of the active portal. You control when to close or archive a portal. Active portals persist indefinitely so clients can always reference their delivered work.",
  },
  {
    q: "What file types work with Portalize?",
    a: "Portalize supports PDFs, images (PNG, JPG, WebP, SVG), ZIP archives, video files, and code snippets. Image and PDF files render as watermarked in-browser previews. ZIPs and other files show a secure locked download card until payment is confirmed.",
  },
  {
    q: "Can I use Portalize alongside Google Drive?",
    a: "Absolutely. Many freelancers use Drive internally for project files and Portalize exclusively for the client-facing deliverable handoff. Think of Portalize as the professional storefront for your finished work, while Drive remains your internal working storage.",
  },
];

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
            When you send a Google Drive link, the client can immediately download all your raw source files before paying your final invoice. Portalize closes that vulnerability forever with watermarked previews and payment-gated downloads.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-[#151B45] px-6 py-3 text-sm font-medium text-[#F8F7FC] transition-colors hover:bg-zinc-800"
            >
              Try Portalize free
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

        {/* Real-world scenarios */}
        <section className="border-t border-zinc-200 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <h2 className="text-2xl font-medium text-[#151B45] sm:text-3xl">
              Real scenarios where Google Drive fails freelancers
            </h2>
            <p className="mt-4 max-w-3xl text-sm text-zinc-600 leading-relaxed">
              These aren't edge cases — they happen to independent creatives and developers every week.
            </p>
            <div className="mt-10 space-y-8">
              {scenarios.map((s) => (
                <div key={s.title} className="border border-zinc-200 p-8">
                  <h3 className="text-base font-medium text-[#151B45]">{s.title}</h3>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded bg-red-50/60 border border-red-100 p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-red-600 mb-2">With Google Drive</p>
                      <p className="text-sm leading-relaxed text-zinc-700">{s.before}</p>
                    </div>
                    <div className="rounded bg-emerald-50/60 border border-emerald-100 p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-700 mb-2">With Portalize</p>
                      <p className="text-sm leading-relaxed text-zinc-700">{s.after}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                  {comparisonRows.map((row) => (
                    <tr key={row.feature}>
                      <td className="p-4 sm:px-6 font-medium text-[#151B45]">{row.feature}</td>
                      <td className={`p-4 sm:px-6 ${row.driveBad ? "text-red-600" : "text-zinc-600"}`}>
                        {row.driveBad && <X className="size-4 inline mr-1" />}
                        {row.drive}
                      </td>
                      <td className={`p-4 sm:px-6 font-medium bg-[#151B45]/5 ${row.driveBad ? "text-emerald-700" : "text-zinc-600"}`}>
                        {row.driveBad && <Check className="size-4 inline mr-1 text-emerald-600" />}
                        {row.portalize}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-zinc-200 bg-white">
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
