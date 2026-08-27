export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="h-3.5 w-24 bg-zinc-200" />
          <div className="mt-2 h-7 w-44 bg-zinc-300" />
        </div>
        <div className="h-9 w-32 bg-zinc-200" />
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border border-zinc-200 bg-white p-5 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-3 w-16 bg-zinc-200" />
              <div className="size-4 bg-zinc-100" />
            </div>
            <div className="h-7 w-12 bg-zinc-300" />
          </div>
        ))}
      </div>

      {/* Main Table / Projects Skeleton */}
      <div className="border border-zinc-200 bg-white">
        <div className="p-5 border-b border-zinc-200 flex justify-between items-center">
          <div className="h-4 w-32 bg-zinc-200" />
          <div className="h-3 w-16 bg-zinc-100" />
        </div>
        <div className="divide-y divide-zinc-200">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="size-8 bg-zinc-100 border border-zinc-200" />
                <div className="space-y-1.5">
                  <div className="h-4 w-40 bg-zinc-200" />
                  <div className="h-3 w-24 bg-zinc-100" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 w-20 bg-zinc-100 border border-zinc-200" />
                <div className="h-4 w-16 bg-zinc-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
