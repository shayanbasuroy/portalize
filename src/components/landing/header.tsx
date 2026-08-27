"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { LogoLink } from "@/components/landing/logo";
import { EASE } from "@/components/landing/reveal";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

/**
 * Fixed bar pinned to the top, drawn with a single hairline border. It slides
 * in on load, tightens its paper background once the page scrolls, and nav
 * links draw a hairline underline on hover. No pill, no shadow — a rule, ink,
 * and a spring-driven mobile sheet.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 12));

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${
        scrolled
          ? "border-zinc-300 bg-[#F8F7FC]/95"
          : "border-zinc-200 bg-[#F8F7FC]/85"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <LogoLink />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((l) => (
            <NavLink key={l.href} href={l.href}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/login"
            className="text-sm text-zinc-600 transition-colors duration-150 ease-out hover:text-[#151B45]"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="group inline-flex items-center gap-1.5 bg-[#151B45] px-4 py-2 text-sm font-medium text-[#F8F7FC] transition-colors duration-150 ease-out hover:bg-zinc-800"
          >
            Get started
            <motion.span
              className="inline-flex"
              animate={{ x: [0, 2, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.6 }}
            >
              <ArrowUpRight className="size-3.5" strokeWidth={2} />
            </motion.span>
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="flex size-10 items-center justify-center text-[#151B45] transition-colors duration-150 ease-out hover:bg-zinc-200/60 md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="mobile-nav"
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden border-t border-zinc-200 bg-[#F8F7FC] md:hidden"
          >
            <nav className="flex flex-col px-6 py-4" aria-label="Mobile">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-zinc-200 py-4 text-base text-[#151B45] last:border-b-0"
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-3 px-6 pb-8">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center border border-zinc-300 py-3 text-sm font-medium text-[#151B45]"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 bg-[#151B45] py-3 text-sm font-medium text-[#F8F7FC]"
              >
                Get started
                <ArrowUpRight className="size-4" strokeWidth={2} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="group relative text-sm text-zinc-600 transition-colors duration-150 ease-out hover:text-[#151B45]">
      {children}
      <span
        aria-hidden
        className="absolute -bottom-1 left-0 h-px w-full origin-left bg-[#6C3FE8] scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
      />
    </a>
  );
}
