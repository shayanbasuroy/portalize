-- ============================================================
-- Portalize: Subscriptions Schema (Dodo Payments Integration)
-- ============================================================

-- Add subscription tier and tracking columns to freelancers table
alter table public.freelancers
  add column if not exists subscription_tier text check (subscription_tier in ('free', 'pro')) default 'free',
  add column if not exists subscription_id text,
  add column if not exists customer_id text,
  add column if not exists subscription_status text default 'none';

-- Create index for fast tier and status lookups
create index if not exists idx_freelancers_subscription 
  on public.freelancers(subscription_tier, subscription_status);
