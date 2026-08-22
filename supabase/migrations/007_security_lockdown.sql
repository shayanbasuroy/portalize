-- ============================================================
-- Portalize: Remove anonymous read/write on portal tables
-- ============================================================
-- The client portal is protected by a PIN + HMAC session cookie, enforced at
-- the application layer. The previous schema additionally allowed the `anon`
-- role (whose key ships to every browser) to SELECT/DELETE/INSERT directly
-- against the REST API, which let anyone read deliverables (`code_content`,
-- storage paths), feedback, project metadata, and the hashed `access_pin`
-- without ever entering the PIN.
--
-- Portal reads now go through the service role in server components/actions
-- (see `p/[slug]/*` and `app/actions/portal.ts`), so these anon policies are
-- no longer needed. This drops them and keeps only the authenticated
-- (freelancer) policies.
--
-- Tradeoff: the anonymous client-portal no longer receives Supabase Realtime
-- `postgres_changes` events (anon can no longer SELECT these tables). Portal
-- mutations still update instantly via Server Actions + revalidatePath; the
-- freelancer's authenticated activity feed keeps Realtime.

drop policy if exists "Public can read deliverables" on public.deliverables;
drop policy if exists "Public can update deliverable status" on public.deliverables;

drop policy if exists "Public can read feedback" on public.feedback_comments;
drop policy if exists "Public can insert feedback" on public.feedback_comments;

drop policy if exists "Public insert activity" on public.activity_events;

drop policy if exists "Public can read projects by slug" on public.projects;
