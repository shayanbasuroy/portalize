import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PortalFigure } from "@/components/landing/portal-figure";

/**
 * Left-aligned editorial hero. Two-tone headline — a muted setup line, then
 * the value proposition in ink. Sharp CTAs below, and the full product figure
 * sitting under a hairline rule.
 */
export function Hero() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 pt-36 pb-16 sm:pt-44 sm:pb-20">
        <div className="max-w-3xl">
          <p className="landing-rise font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            For freelancers &amp; studios
          </p>

          <h1
            className="landing-rise mt-6 text-[2.75rem] font-medium leading-[0.98] tracking-[-0.03em] text-[#151B45] sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            <span className="text-zinc-400">You finished the work.</span>
            <br />
            <span>Get paid before it leaves.</span>
          </h1>

          <p
            className="landing-rise mt-7 max-w-xl text-lg leading-relaxed text-zinc-600"
            style={{ animationDelay: "160ms" }}
          >
            Portalize is a zero-login client portal. Send one link, let clients
            preview every deliverable in the browser, and keep downloads locked
            until the invoice settles.
          </p>

          <div
            className="landing-rise mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-[#151B45] px-7 py-3.5 text-sm font-medium text-[#F8F7FC] transition-colors duration-150 ease-out hover:bg-zinc-800"
            >
              Create your portal
              <ArrowRight className="size-4" strokeWidth={2} />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 border border-zinc-300 px-7 py-3.5 text-sm font-medium text-[#151B45] transition-colors duration-150 ease-out hover:border-[#151B45]"
            >
              See how it works
            </a>
          </div>

          <p
            className="landing-rise mt-8 font-mono text-xs tracking-[0.04em] text-zinc-400"
            style={{ animationDelay: "320ms" }}
          >
            No client accounts · 4-digit PIN · Watermarked previews
          </p>
        </div>
      </div>

      <PortalFigure />
    </section>
  );
}
