export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center gap-5">
        {/* Minimalist Portalize Logo Tile */}
        <div className="relative flex size-12 items-center justify-center border border-[#151B45] bg-[#151B45] text-[#F8F7FC] shadow-sm animate-pulse">
          <span className="font-mono text-xl font-bold tracking-tight">P</span>
        </div>

        {/* Minimalist indeterminate hairline bar */}
        <div className="h-[2px] w-36 overflow-hidden bg-zinc-200">
          <div className="h-full w-full bg-[#151B45] origin-left animate-[indeterminate_1.4s_infinite_linear]" />
        </div>

        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
          Loading Portalize
        </p>
      </div>
    </div>
  );
}
