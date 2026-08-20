import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F7FC] px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2.5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.png" alt="" className="h-14 w-auto object-contain" />
          <span className="text-lg font-medium tracking-tight text-[#151B45]">
            Portalize
          </span>
        </Link>

        <div className="border border-zinc-200 bg-white p-8">{children}</div>

        <p className="mt-6 text-center font-mono text-xs text-zinc-400">
          Zero-login portals for your clients — no accounts for them, ever.
        </p>
      </div>
    </div>
  );
}
