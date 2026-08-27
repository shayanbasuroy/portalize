"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { EASE, Heading, Reveal } from "@/components/landing/reveal";

const items = [
  {
    q: "Do my clients need to create an account?",
    a: "No. Every portal opens with a link and a 4-digit PIN. No passwords, no signup, no plugins on their side. That is the whole point.",
  },
  {
    q: "When do downloads unlock for the client?",
    a: "The moment you mark the invoice as paid. Downloads are gated automatically, so the client sees watermarked previews until then and the real files the second payment clears.",
  },
  {
    q: "Can I watermark previews?",
    a: "Yes, watermarks are on by default. They appear on every preview and never touch the real files, which only unlock after payment.",
  },
  {
    q: "What can I share inside a portal?",
    a: "Files such as PDFs, images, and zips, plus code snippets and links. Anything with a preview renders right in the browser, so clients never need to download to look.",
  },
  {
    q: "Is there a free plan?",
    a: "Starter is free to try with one active portal. Upgrade to Pro Freelancer whenever you want unlimited portals, custom branding, and payment-gated downloads.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Pro is billed month to month. Cancel in one click and keep your portals working until the end of the billing period.",
  },
];

/**
 * A rule-divided accordion — questions hang from hairlines, not from a card.
 * Answers spring open with a height animation instead of a rigid grid toggle.
 */
export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="scroll-mt-16 border-t border-zinc-200">
      <div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            FAQ
          </p>
        </Reveal>
        <Heading className="mt-6 text-3xl font-medium leading-[1.05] tracking-[-0.02em] text-[#151B45] sm:text-4xl">
          Questions, answered.
        </Heading>

        <div className="mt-12 border-t border-zinc-200">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, ease: EASE, delay: i * 0.05 }}
                className="border-b border-zinc-200"
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span
                      className={`text-[15px] font-medium transition-colors duration-150 ease-out sm:text-base ${
                        isOpen ? "text-[#151B45]" : "text-zinc-700 hover:text-[#151B45]"
                      }`}
                    >
                      {item.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="shrink-0 text-zinc-400"
                    >
                      <Plus className="size-4" strokeWidth={2} />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="panel"
                      id={`faq-panel-${i}`}
                      role="region"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 text-sm leading-relaxed text-zinc-600">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
