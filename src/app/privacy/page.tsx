import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Portalize",
  description: "How Portalize collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <Link
        href="/"
        className="font-mono text-xs text-zinc-400 hover:text-[#151B45] transition-colors"
      >
        ← portalize.site
      </Link>

      <h1 className="mt-8 text-3xl font-medium tracking-tight text-[#151B45]">
        Privacy Policy
      </h1>
      <p className="mt-2 font-mono text-xs text-zinc-400">
        Last updated: September 2026
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-zinc-600">
        <section>
          <h2 className="font-medium text-[#151B45]">1. What we collect</h2>
          <p className="mt-3">
            When you sign up, we collect your email address and any profile
            information you provide. When you create client portals, we store
            the project details, deliverable files, and activity events
            (e.g. when a portal was opened) that you generate through the
            service. We do not collect any personal information from your
            clients beyond what is automatically logged as part of portal
            activity.
          </p>
        </section>

        <section>
          <h2 className="font-medium text-[#151B45]">2. How we use it</h2>
          <p className="mt-3">
            We use your data solely to provide and improve the Portalize
            service — to authenticate you, serve your portals, send
            transactional emails (read receipts, portal activity), and
            process subscription payments via Dodo Payments. We do not sell
            your data to third parties.
          </p>
        </section>

        <section>
          <h2 className="font-medium text-[#151B45]">3. Storage & security</h2>
          <p className="mt-3">
            All data is stored on Supabase (PostgreSQL) with row-level
            security. Deliverable files are stored in Supabase Storage with
            signed URLs. Payments are processed by Dodo Payments; we do not
            store card details.
          </p>
        </section>

        <section>
          <h2 className="font-medium text-[#151B45]">4. Cookies</h2>
          <p className="mt-3">
            We use a session cookie to keep you logged in and a short-lived
            signed cookie to verify client portal PIN sessions. We do not use
            tracking or advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="font-medium text-[#151B45]">5. Your rights</h2>
          <p className="mt-3">
            You can delete your account and all associated data at any time
            from your dashboard settings. For data requests or questions,
            contact us at{" "}
            <a
              href="mailto:hello@portalize.site"
              className="text-[#151B45] underline underline-offset-4"
            >
              hello@portalize.site
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-medium text-[#151B45]">6. Changes</h2>
          <p className="mt-3">
            We may update this policy as the product evolves. Significant
            changes will be communicated by email.
          </p>
        </section>
      </div>
    </main>
  );
}
