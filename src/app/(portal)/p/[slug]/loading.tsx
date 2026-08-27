export default function PortalLoading() {
  return (
    <div className="mx-auto max-w-5xl py-8 px-4 sm:px-6">
      <div className="border border-zinc-200 bg-white animate-pulse">
        {/* Mock Browser Chrome Bar */}
        <div className="flex items-center gap-2 border-b border-zinc-200 px-5 py-3">
          <span className="flex gap-1.5">
            <span className="size-2.5 bg-zinc-200" />
            <span className="size-2.5 bg-zinc-200" />
            <span className="size-2.5 bg-zinc-200" />
          </span>
          <div className="ml-3 h-3 w-44 bg-zinc-100" />
          <div className="ml-auto h-3 w-16 bg-zinc-100" />
        </div>

        <div className="grid lg:grid-cols-[1fr_300px]">
          {/* Main Column */}
          <div className="min-w-0">
            {/* Project Header Skeleton */}
            <div className="flex items-start justify-between gap-4 px-5 py-6 sm:px-6 border-b border-zinc-100">
              <div className="space-y-2">
                <div className="h-3 w-32 bg-zinc-200" />
                <div className="h-6 w-56 bg-zinc-300" />
              </div>
              <div className="h-6 w-20 bg-zinc-100 border border-zinc-200" />
            </div>

            {/* Payment Pending Banner Skeleton */}
            <div className="border-b border-zinc-200 bg-amber-50/50 p-4 flex items-center gap-3">
              <div className="size-4 bg-amber-200" />
              <div className="h-3.5 w-64 bg-amber-200/60" />
            </div>

            {/* Deliverables List Skeleton */}
            <div className="divide-y divide-zinc-200">
              {[1, 2].map((i) => (
                <div key={i} className="p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 bg-zinc-100 border border-zinc-200" />
                      <div className="space-y-1.5">
                        <div className="h-4 w-48 bg-zinc-200" />
                        <div className="h-3 w-20 bg-zinc-100" />
                      </div>
                    </div>
                    <div className="h-8 w-28 bg-zinc-100 border border-zinc-200" />
                  </div>
                  {/* File preview placeholder box */}
                  <div className="h-48 w-full bg-zinc-50 border border-zinc-200 flex items-center justify-center">
                    <div className="h-4 w-24 bg-zinc-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="border-t border-zinc-200 lg:border-l lg:border-t-0 p-5 sm:p-6 space-y-6">
            <div className="space-y-3">
              <div className="h-3 w-24 bg-zinc-200" />
              <div className="flex items-center gap-3">
                <div className="size-10 bg-zinc-200" />
                <div className="space-y-1.5">
                  <div className="h-4 w-28 bg-zinc-200" />
                  <div className="h-3 w-16 bg-zinc-100" />
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-6 space-y-2">
              <div className="h-3 w-20 bg-zinc-200" />
              <div className="h-12 w-full bg-zinc-50 border border-zinc-200" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
