// Sliding-window rate limiter for PIN verification (PRD §6.2: max 5 failed
// attempts per minute per IP+slug).
//
// Backed by the `pin_attempts` table so it survives across serverless
// instances (an in-memory map resets on every cold start). Falls back to a
// per-instance in-memory limiter if the table isn't present or the DB is
// unreachable, so the portal still works before the migration is applied.

import { createAdminClient } from "@/lib/supabase/admin";

const WINDOW_MS = 60_000;
const MAX_FAILURES = 5;

/* ---------------------------- in-memory fallback ---------------------------- */

const failures = new Map<string, number[]>();

function recentFailures(key: string, now: number): number[] {
  const list = failures.get(key) || [];
  const filtered = list.filter((t) => now - t < WINDOW_MS);
  if (filtered.length !== list.length) {
    if (filtered.length === 0) failures.delete(key);
    else failures.set(key, filtered);
  }
  return filtered;
}

function memIsRateLimited(key: string): boolean {
  return recentFailures(key, Date.now()).length >= MAX_FAILURES;
}

function memRecordFailure(key: string): void {
  const now = Date.now();
  const list = recentFailures(key, now);
  list.push(now);
  failures.set(key, list);
}

function memClearFailures(key: string): void {
  failures.delete(key);
}

/* ------------------------------- public API ------------------------------- */

export async function isRateLimited(key: string): Promise<boolean> {
  try {
    const admin = createAdminClient();
    const since = new Date(Date.now() - WINDOW_MS).toISOString();
    const { count, error } = await admin
      .from("pin_attempts")
      .select("id", { count: "exact", head: true })
      .eq("key", key)
      .gte("created_at", since);
    if (!error) return (count ?? 0) >= MAX_FAILURES;
  } catch {
    // fall through to memory
  }
  return memIsRateLimited(key);
}

export async function recordFailure(key: string): Promise<void> {
  memRecordFailure(key);
  try {
    const admin = createAdminClient();
    await admin.from("pin_attempts").insert({ key });
  } catch {
    // memory fallback already recorded
  }
}

export async function clearFailures(key: string): Promise<void> {
  memClearFailures(key);
  try {
    const admin = createAdminClient();
    await admin.from("pin_attempts").delete().eq("key", key);
  } catch {
    // ignore
  }
}

// Best-effort memory cleanup so the fallback map never grows unbounded.
const cleanup = setInterval(() => {
  const now = Date.now();
  for (const [key] of failures) {
    recentFailures(key, now);
  }
}, WINDOW_MS);

// Don't let the cleanup timer keep the serverless/Node process alive.
if (typeof cleanup.unref === "function") {
  cleanup.unref();
}
