"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { LogoLink } from "@/components/landing/logo";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

/**
 * Fixed bar pinned to the top, drawn with a single hairline border. The
 * background is the paper color at 90% so content scrolling underneath
 * reads through faintly. No pill, no shadow — just a rule and ink.
 */
export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-200 bg-[#F8F7FC]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <LogoLink />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-zinc-600 transition-colors duration-150 ease-out hover:text-[#151B45]"
            >
              {l.label}
            </a>
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
            className="inline-flex items-center gap-1.5 bg-[#151B45] px-4 py-2 text-sm font-medium text-[#F8F7FC] transition-colors duration-150 ease-out hover:bg-zinc-800"
          >
            Get started
            <ArrowUpRight className="size-3.5" strokeWidth={2} />
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

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-zinc-200 bg-[#F8F7FC] md:hidden"
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
        </div>
      )}
    </header>
  );
}
