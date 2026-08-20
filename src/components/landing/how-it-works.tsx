const steps = [
  {
    n: "01",
    title: "Build the portal",
    body: "Add deliverables — files, code snippets, embeds, live links — and set the invoice amount. One page, a few minutes.",
    tag: "≈ 5 minutes",
  },
  {
    n: "02",
    title: "Share the link and PIN",
    body: "Your client opens a single URL and enters a 4-digit PIN. No account, no password, nothing to install.",
    tag: "zero friction",
  },
  {
    n: "03",
    title: "Get paid, downloads unlock",
    body: "Mark the invoice paid and the files unlock automatically. Watermarks drop and the download buttons go live.",
    tag: "automatic",
  },
];

/**
 * Three numbered steps as full-width rows under a single rule. The mono index
 * and right-aligned annotation give it a spec-sheet rhythm without any cards.
 */
export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 border-t border-zinc-200">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            How it works
          </p>
          <h2 className="mt-6 text-3xl font-medium leading-[1.05] tracking-[-0.02em] text-[#151B45] sm:text-4xl lg:text-5xl">
            From handoff to paid in three steps.
          </h2>
        </div>

        <div className="mt-14 divide-y divide-zinc-200 border-t border-zinc-200">
          {steps.map((s) => (
            <div
              key={s.n}
              className="grid gap-3 py-10 md:grid-cols-[72px_1fr_auto] md:gap-6 md:py-12"
            >
              <span className="font-mono text-sm text-zinc-400">{s.n}</span>
              <div>
                <h3 className="text-xl font-medium tracking-tight text-[#151B45]">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-zinc-600">
                  {s.body}
                </p>
              </div>
              <span className="hidden font-mono text-xs text-zinc-400 md:block md:pt-1.5">
                {s.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
