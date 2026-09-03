"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { LogoLink } from "@/components/landing/logo";
import { EASE } from "@/components/landing/reveal";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/#how-it-works", label: "How it works" },
      { href: "/#features", label: "Features" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/features/payment-gated-downloads", label: "Payment gating" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { href: "/for/designers", label: "For Designers" },
      { href: "/for/developers", label: "For Developers" },
      { href: "/alternatives/google-drive", label: "vs Google Drive" },
      { href: "/alternatives/dubsado", label: "vs Dubsado" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/guides", label: "All Guides" },
      { href: "/guides/what-to-do-when-client-wont-pay-final-invoice", label: "Unpaid invoices" },
      { href: "/guides/how-to-watermark-design-deliverables", label: "Watermarking" },
      { href: "/guides/freelance-client-onboarding-delivery-checklist", label: "Delivery checklist" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of service" },
      { href: "/login", label: "Log in" },
      { href: "/signup", label: "Get started" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-200">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <LogoLink />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-zinc-500">
              Zero-login client portals for freelancers. Share work, collect
              feedback, and get paid before downloads unlock.
            </p>
          </motion.div>

          {columns.map((col, i) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.08 + i * 0.08 }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                {col.title}
              </p>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-zinc-500 transition-colors duration-150 ease-out hover:text-[#151B45]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}
          className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-zinc-200 pt-6 text-sm text-zinc-400 sm:flex-row sm:items-center"
        >
          <p>© {new Date().getFullYear()} Portalize</p>
          <p className="font-mono text-xs">Deliver work · Get paid first</p>
        </motion.div>
      </div>
    </footer>
  );
}
