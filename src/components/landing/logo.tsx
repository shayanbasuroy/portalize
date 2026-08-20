import Link from "next/link";

/**
 * Sharp, monochrome wordmark. A solid ink square with a single "P" — no
 * gradient, no glow — sits beside the name in medium weight.
 */
export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icon.png" alt="" aria-hidden className="h-10 w-auto shrink-0 object-contain" />
      <span className="text-[15px] font-medium tracking-tight text-[#151B45]">
        Portalize
      </span>
    </span>
  );
}

export function LogoLink() {
  return (
    <Link
      href="/"
      aria-label="Portalize home"
      className="inline-flex transition-opacity duration-150 ease-out hover:opacity-70"
    >
      <Logo />
    </Link>
  );
}
