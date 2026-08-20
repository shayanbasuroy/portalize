const stats = [
  { value: "1", label: "link for the whole delivery" },
  { value: "0", label: "client accounts to create" },
  { value: "4-digit", label: "PIN instead of passwords" },
  { value: "100%", label: "of downloads gated until paid" },
];

// Hairlines per cell. Mobile is a 2-column grid (top+left rules), desktop is
// a single 4-across row (left rules only).
const borders = [
  "",
  "border-l border-zinc-200",
  "border-t border-zinc-200 lg:border-t-0 lg:border-l",
  "border-t border-l border-zinc-200 lg:border-t-0",
];

/**
 * A thin "spec index" strip. Four facts as a rule-divided row — mono values
 * over small labels. Ink and hairlines, no stat cards.
 */
export function Stats() {
  return (
    <section aria-label="At a glance" className="border-t border-zinc-200">
      <div className="mx-auto max-w-6xl px-6">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col gap-1.5 px-6 py-9 lg:px-8 ${borders[i]}`}
            >
              <dt className="order-2 font-mono text-[11px] leading-snug text-zinc-500">
                {s.label}
              </dt>
              <dd className="order-1 text-3xl font-medium tracking-tight text-[#151B45]">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
