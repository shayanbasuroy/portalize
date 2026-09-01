import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Portalize",
  description: "Terms governing your use of the Portalize service.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <Link
        href="/"
        className="font-mono text-xs text-zinc-400 hover:text-[#151B45] transition-colors"
      >
        ← portalize.site
      </Link>

      <h1 className="mt-8 text-3xl font-medium tracking-tight text-[#151B45]">
        Terms of Service
      </h1>
      <p className="mt-2 font-mono text-xs text-zinc-400">
        Last updated: September 2026
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-zinc-600">
        <section>
          <h2 className="font-medium text-[#151B45]">1. The service</h2>
          <p className="mt-3">
            Portalize provides private client delivery portals for freelancers
            and studios. By using the service you agree to these terms. If you
            disagree, do not use the service.
          </p>
        </section>

        <section>
          <h2 className="font-medium text-[#151B45]">2. Your account</h2>
          <p className="mt-3">
            You are responsible for keeping your login credentials secure and
            for all activity that occurs under your account. You must be at
            least 16 years old to use Portalize.
          </p>
        </section>

        <section>
          <h2 className="font-medium text-[#151B45]">3. Acceptable use</h2>
          <p className="mt-3">
            You may use Portalize to deliver legitimate client work. You may
            not use the service to distribute illegal content, infringe
            third-party intellectual property, or attempt to circumvent any
            security measure of the platform.
          </p>
        </section>

        <section>
          <h2 className="font-medium text-[#151B45]">4. Subscriptions & billing</h2>
          <p className="mt-3">
            Pro subscriptions are billed monthly via Dodo Payments. You may
            cancel at any time; access continues until the end of the current
            billing period. We reserve the right to change pricing with 30
            days' notice.
          </p>
        </section>

        <section>
          <h2 className="font-medium text-[#151B45]">5. Your content</h2>
          <p className="mt-3">
            You retain ownership of any files and content you upload to
            Portalize. By uploading content you grant us the limited right to
            store and serve it as part of the service. We do not claim any
            ownership over your work.
          </p>
        </section>

        <section>
          <h2 className="font-medium text-[#151B45]">6. Limitation of liability</h2>
          <p className="mt-3">
            Portalize is provided "as is." We are not liable for any indirect,
            incidental, or consequential damages arising from your use of the
            service. Our total liability to you shall not exceed the fees you
            paid us in the past 12 months.
          </p>
        </section>

        <section>
          <h2 className="font-medium text-[#151B45]">7. Termination</h2>
          <p className="mt-3">
            We reserve the right to suspend or terminate accounts that violate
            these terms. You can delete your account at any time from your
            dashboard settings.
          </p>
        </section>

        <section>
          <h2 className="font-medium text-[#151B45]">8. Contact</h2>
          <p className="mt-3">
            Questions about these terms?{" "}
            <a
              href="mailto:hello@portalize.site"
              className="text-[#151B45] underline underline-offset-4"
            >
              hello@portalize.site
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
