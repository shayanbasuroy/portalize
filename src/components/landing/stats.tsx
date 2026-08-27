"use client";

import { motion } from "motion/react";
import { CountUp, EASE } from "@/components/landing/reveal";

const stats = [
  { value: 1, suffix: "", label: "link for the whole delivery" },
  { value: 0, suffix: "", label: "client accounts to create" },
  { value: null, text: "4-digit", label: "PIN instead of passwords" },
  { value: 100, suffix: "%", label: "of downloads gated until paid" },
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
 * over small labels. The numerals count up as the strip enters; the whole row
 * staggers in left to right. Ink and hairlines, no stat cards.
 */
export function Stats() {
  return (
    <section aria-label="At a glance" className="border-t border-zinc-200">
      <div className="mx-auto max-w-6xl px-6">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, ease: EASE, delay: i * 0.08 }}
              className={`flex flex-col gap-1.5 px-6 py-9 lg:px-8 ${borders[i]}`}
            >
              <dt className="order-2 font-mono text-[11px] leading-snug text-zinc-500">
                {s.label}
              </dt>
              <dd className="order-1 text-3xl font-medium tracking-tight text-[#151B45]">
                {s.value !== null ? (
                  <>
                    <CountUp to={s.value} duration={1.2} delay={i * 0.08} />
                    {s.suffix}
                  </>
                ) : (
                  s.text
                )}
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
