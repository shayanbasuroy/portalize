const features = [
  {
    n: "01",
    title: "Payment-gated downloads",
    body: "Files stay locked until you mark the invoice paid. Raw storage URLs are never exposed.",
    tag: "automatic",
  },
  {
    n: "02",
    title: "Watermarked previews",
    body: "PDFs, images, and documents render in the browser with a preview-only watermark.",
    tag: "in-browser",
  },
  {
    n: "03",
    title: "Code & embed viewers",
    body: "Syntax-highlighted code and sandboxed embeds for Figma, Loom, and live prototypes.",
    tag: "native",
  },
  {
    n: "04",
    title: "Feedback & approvals",
    body: "Clients request changes per deliverable, or approve the whole project in one click.",
    tag: "per-deliverable",
  },
  {
    n: "05",
    title: "Read receipts",
    body: "See the moment a client opens the portal, previews a file, or signs off on work.",
    tag: "realtime",
  },
  {
    n: "06",
    title: "Custom branding",
    body: "Your logo, your colour, your subdomain — the portal reads like your own site.",
    tag: "yours",
  },
];

/**
 * The capability sheet. Each feature is a rule-divided row: a mono index, the
 * name and description, and a right-aligned annotation. No icons, no cards.
 */
export function Features() {
  return (
    <section id="features" className="scroll-mt-16 border-t border-zinc-200">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            Features
          </p>
          <h2 className="mt-6 text-3xl font-medium leading-[1.05] tracking-[-0.02em] text-[#151B45] sm:text-4xl lg:text-5xl">
            Everything a delivery needs, on one page.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-600">
            No more chasing files, invoices, and feedback across five apps. It
            all lives behind one link.
          </p>
        </div>

        <div className="mt-14 divide-y divide-zinc-200 border-t border-zinc-200">
          {features.map((f) => (
            <div
              key={f.n}
              className="grid gap-3 py-8 md:grid-cols-[64px_1fr_auto] md:items-baseline md:gap-6"
            >
              <span className="font-mono text-sm text-zinc-400">{f.n}</span>
              <div>
                <h3 className="text-lg font-medium tracking-tight text-[#151B45]">
                  {f.title}
                </h3>
                <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-zinc-600">
                  {f.body}
                </p>
              </div>
              <span className="hidden font-mono text-xs text-zinc-400 md:block">
                {f.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
