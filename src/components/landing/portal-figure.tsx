import {
  Check,
  Download,
  Eye,
  FileArchive,
  FileCode2,
  Link2,
  Lock,
} from "lucide-react";

/**
 * A full-width, monochrome "figure" of the client portal. One flat surface —
 * no floating card, no shadow — with the UI drawn from hairline rules. The
 * only colour is semantic: amber for the pending/locked state, emerald for
 * the one item that is already approved.
 */
const deliverables = [
  {
    icon: Link2,
    name: "brand-system.fig",
    meta: "Figma embed · Updated 2h ago",
    status: "In review",
    tone: "text-zinc-500",
  },
  {
    icon: FileCode2,
    name: "navbar.tsx",
    meta: "Code · TypeScript",
    status: "Approved",
    tone: "text-emerald-600",
  },
  {
    icon: FileArchive,
    name: "logo-pack.zip",
    meta: "File · 42 MB",
    status: "In review",
    tone: "text-zinc-500",
  },
];

export function PortalFigure() {
  return (
    <figure className="border-t border-zinc-200">
      <div className="mx-auto max-w-6xl px-6 pt-12">
        <div className="border border-zinc-200 bg-white">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-zinc-200 px-5 py-3">
            <span className="flex gap-1.5" aria-hidden>
              <span className="size-2.5 bg-zinc-300" />
              <span className="size-2.5 bg-zinc-300" />
              <span className="size-2.5 bg-zinc-300" />
            </span>
            <span className="ml-3 truncate font-mono text-[11px] text-zinc-400">
              portalize.site/p/acme-brand-2026
            </span>
            <span className="ml-auto hidden items-center gap-1.5 font-mono text-[11px] text-zinc-400 sm:flex">
              <Lock className="size-3" strokeWidth={2} />
              PIN 8492
            </span>
          </div>

          <div className="grid lg:grid-cols-[1fr_300px]">
            {/* Main column */}
            <div className="min-w-0">
              {/* Project header */}
              <div className="flex items-start justify-between gap-4 px-5 py-6 sm:px-7">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                    Acme Co. · Project
                  </p>
                  <h3 className="mt-1.5 text-xl font-medium tracking-tight text-[#151B45]">
                    Brand identity &amp; website
                  </h3>
                </div>
                <span className="shrink-0 border border-zinc-200 px-2.5 py-1 font-mono text-[11px] text-zinc-500">
                  In review
                </span>
              </div>

              {/* Payment banner */}
              <div className="mx-5 border border-amber-200 bg-amber-50/60 px-4 py-3 sm:mx-7">
                <p className="flex items-center gap-2 text-[13px] text-amber-800">
                  <Lock className="size-3.5 shrink-0" strokeWidth={2} />
                  Payment pending — watermarked previews. Downloads unlock when
                  the invoice clears.
                </p>
              </div>

              {/* Deliverables */}
              <div className="mt-6 divide-y divide-zinc-200 border-t border-zinc-200">
                {deliverables.map((d) => (
                  <div
                    key={d.name}
                    className="flex items-center gap-4 px-5 py-4 sm:px-7"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center border border-zinc-200 text-[#151B45]">
                      <d.icon className="size-4" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#151B45]">
                        {d.name}
                      </p>
                      <p className="truncate font-mono text-[11px] text-zinc-400">
                        {d.meta}
                      </p>
                    </div>
                    <span
                      className={`hidden shrink-0 items-center gap-1.5 font-mono text-[11px] sm:flex ${d.tone}`}
                    >
                      {d.status === "Approved" && (
                        <Check className="size-3" strokeWidth={2.5} />
                      )}
                      {d.status}
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1.5 border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-500">
                      <Lock className="size-3.5" strokeWidth={2} />
                      Locked
                    </span>
                  </div>
                ))}
              </div>

              {/* Approve bar */}
              <div className="flex items-center justify-between gap-4 border-t border-zinc-200 px-5 py-4 sm:px-7">
                <p className="font-mono text-[11px] text-zinc-400">
                  3 deliverables · 1 approved
                </p>
                <span className="inline-flex items-center gap-2 border border-[#151B45] px-3.5 py-2 text-xs font-medium text-[#151B45]">
                  <Check className="size-3.5" strokeWidth={2} />
                  Approve project
                </span>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="border-t border-zinc-200 lg:border-l lg:border-t-0">
              <div className="space-y-6 p-5 sm:p-6">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                    Access
                  </p>
                  <p className="mt-2 text-2xl font-medium tracking-tight text-[#151B45]">
                    8492
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">
                    Share the link and this PIN. No account, no password.
                  </p>
                </div>

                <div className="border-t border-zinc-200 pt-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                    Payment
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[13px] text-amber-700">
                      <span className="size-1.5 bg-amber-500" aria-hidden />
                      Pending
                    </span>
                    <span className="font-mono text-[11px] text-zinc-400">
                      $2,400
                    </span>
                  </div>
                  <span className="mt-3 inline-flex w-full items-center justify-center border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-600">
                    Mark as paid
                  </span>
                </div>

                <div className="border-t border-zinc-200 pt-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                    Activity
                  </p>
                  <ul className="mt-3 space-y-2.5 text-[13px] text-zinc-500">
                    <li className="flex items-center gap-2">
                      <Eye className="size-3.5 text-zinc-400" strokeWidth={2} />
                      Opened 2m ago
                    </li>
                    <li className="flex items-center gap-2">
                      <Eye className="size-3.5 text-zinc-400" strokeWidth={2} />
                      Previewed design 4m ago
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-3.5 text-emerald-600" strokeWidth={2} />
                      Approved navbar.tsx
                    </li>
                    <li className="flex items-center gap-2">
                      <Download className="size-3.5 text-zinc-400" strokeWidth={2} />
                      Download blocked — unpaid
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <figcaption className="pt-4 pb-2 font-mono text-xs text-zinc-400">
          Fig. 01 — The client portal: everything in review, downloads gated
          until payment settles.
        </figcaption>
      </div>
    </figure>
  );
}
