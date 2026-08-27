export default function Loading() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 select-none">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Logo Container */}
        <div className="relative flex items-center justify-center">
          {/* Subtle ambient pulse ring */}
          <div className="absolute size-20 rounded-2xl bg-[#6C3FE8]/10 animate-ping [animation-duration:2s]" />

          {/* Logo icon with smooth floating and scale animation */}
          <div className="relative z-10 flex size-16 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white p-3 shadow-xs animate-pulse">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icon.png"
              alt="Portalize"
              className="size-full object-contain transition-transform duration-300"
            />
          </div>
        </div>

        {/* Minimalist hairline progress track */}
        <div className="h-[2px] w-36 overflow-hidden bg-zinc-200">
          <div className="h-full w-full bg-[#151B45] origin-left animate-[indeterminate_1.2s_infinite_ease-in-out]" />
        </div>

        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
          Loading Portalize
        </p>
      </div>
    </div>
  );
}
