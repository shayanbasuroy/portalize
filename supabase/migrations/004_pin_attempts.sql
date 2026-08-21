-- ============================================================
-- Portalize: PIN attempt rate limiting (serverless-safe)
-- ============================================================
-- Backs the PIN brute-force limiter across serverless instances, where an
-- in-memory map resets on every cold start. Accessed only via the service
-- role (server actions), so there are no public RLS policies. The app's count
-- query only reads the last 60 seconds; a periodic job can purge older rows
-- (they are small, so slow growth is acceptable for now).

create table public.pin_attempts (
  id uuid default gen_random_uuid() primary key,
  key text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_pin_attempts_key_time on public.pin_attempts(key, created_at desc);

alter table public.pin_attempts enable row level security;
