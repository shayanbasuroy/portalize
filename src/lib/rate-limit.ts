// In-memory sliding-window rate limiter for PIN verification.
//
// PRD §6.2: enforce 5 failed attempts per minute per IP to prevent brute-forcing
// 4-digit PINs. This is a per-instance limiter — for multi-instance/serverless
// production deployments, back it with Redis or a database table.

const WINDOW_MS = 60_000
const MAX_FAILURES = 5

const failures = new Map<string, number[]>()

function recentFailures(key: string, now: number): number[] {
  const list = failures.get(key) || []
  const filtered = list.filter((t) => now - t < WINDOW_MS)
  if (filtered.length !== list.length) {
    if (filtered.length === 0) failures.delete(key)
    else failures.set(key, filtered)
  }
  return filtered
}

export function isRateLimited(key: string): boolean {
  const now = Date.now()
  return recentFailures(key, now).length >= MAX_FAILURES
}

export function recordFailure(key: string): void {
  const now = Date.now()
  const list = recentFailures(key, now)
  list.push(now)
  failures.set(key, list)
}

export function clearFailures(key: string): void {
  failures.delete(key)
}

// Best-effort cleanup so the map never grows unbounded.
const cleanup = setInterval(() => {
  const now = Date.now()
  for (const [key] of failures) {
    recentFailures(key, now)
  }
}, WINDOW_MS)

// Don't let the cleanup timer keep the serverless/Node process alive.
if (typeof cleanup.unref === 'function') {
  cleanup.unref()
}
