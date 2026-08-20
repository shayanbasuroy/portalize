"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, Users, Settings, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { logout } from "@/app/actions/auth";

interface Freelancer {
  id: string;
  full_name?: string;
  email: string;
}

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban, exact: false },
  { href: "/dashboard/clients", label: "Clients", icon: Users, exact: false },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, exact: false },
];

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icon.png" alt="" aria-hidden className="h-12 w-auto shrink-0 object-contain" />
      <span className="text-[15px] font-medium tracking-tight text-[#151B45]">
        Portalize
      </span>
    </span>
  );
}

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Primary">
      {links.map((link) => {
        const isActive = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-[#151B45] text-[#F8F7FC]"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-[#151B45]"
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

function UserBlock({ freelancer }: { freelancer: Freelancer | null }) {
  return (
    <div className="p-4">
      {freelancer && (
        <div className="mb-4 px-1">
          <p className="truncate text-sm font-medium text-[#151B45]">
            {freelancer.full_name || freelancer.email}
          </p>
          <p className="truncate font-mono text-xs text-zinc-400">
            {freelancer.email}
          </p>
        </div>
      )}
      <form action={logout}>
        <Button variant="outline" className="w-full justify-start" type="submit">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </form>
    </div>
  );
}

export function Sidebar({ freelancer }: { freelancer: Freelancer | null }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-zinc-200 bg-[#F8F7FC]/85 px-4 backdrop-blur-md md:hidden">
        <Link href="/dashboard" aria-label="Portalize dashboard">
          <Logo />
        </Link>
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="flex size-10 items-center justify-center text-[#151B45] hover:bg-zinc-200/60"
        >
          <Menu className="size-5" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-zinc-200 bg-[#F8F7FC] md:flex">
        <div className="px-6 pb-4 pt-6">
          <Link href="/dashboard" aria-label="Portalize dashboard">
            <Logo />
          </Link>
        </div>
        <Separator className="bg-zinc-200" />
        <NavItems />
        <UserBlock freelancer={freelancer} />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/25"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-zinc-200 bg-[#F8F7FC]">
            <div className="flex items-center justify-between px-6 pb-4 pt-6">
              <Logo />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex size-10 items-center justify-center text-[#151B45] hover:bg-zinc-200/60"
              >
                <X className="size-5" />
              </button>
            </div>
            <Separator className="bg-zinc-200" />
            <NavItems onNavigate={() => setOpen(false)} />
            <UserBlock freelancer={freelancer} />
          </aside>
        </div>
      )}
    </>
  );
}
