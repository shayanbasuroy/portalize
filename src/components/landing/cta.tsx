import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Cta() {
  return (
    <section className="border-t border-zinc-200">
      <div className="mx-auto max-w-6xl px-6 py-28 md:py-40">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-medium leading-[1.02] tracking-[-0.03em] text-[#151B45] sm:text-5xl lg:text-6xl">
            Ready to get paid before the files leave?
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600">
            Create your first portal in minutes. Free to start — no credit card.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-[#151B45] px-7 py-3.5 text-sm font-medium text-[#F8F7FC] transition-colors duration-150 ease-out hover:bg-zinc-800"
            >
              Create your portal
              <ArrowRight className="size-4" strokeWidth={2} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-medium text-[#151B45] transition-colors duration-150 ease-out hover:underline"
            >
              Log in
            </Link>
          </div>

          <p className="mt-8 font-mono text-xs tracking-[0.04em] text-zinc-400">
            No client accounts · 4-digit PIN · Watermarked previews
          </p>
        </div>
      </div>
    </section>
  );
}
