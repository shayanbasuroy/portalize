import Link from "next/link";
import { LogoLink } from "@/components/landing/logo";

const columns = [
  {
    title: "Product",
    links: [
      { href: "#how-it-works", label: "How it works" },
      { href: "#features", label: "Features" },
      { href: "#pricing", label: "Pricing" },
      { href: "#faq", label: "FAQ" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/signup", label: "Get started" },
      { href: "/login", label: "Log in" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-200">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <LogoLink />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-zinc-500">
              Zero-login client portals for freelancers. Share work, collect
              feedback, and get paid before downloads unlock.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
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
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-zinc-200 pt-6 text-sm text-zinc-400 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Portalize</p>
          <p className="font-mono text-xs">Deliver work · Get paid first</p>
        </div>
      </div>
    </footer>
  );
}
