-- ============================================================
-- Portalize: Activity Events (read receipts / activity feed)
-- ============================================================

-- A lightweight audit trail of client actions on a portal. Powers the
-- freelancer's "read receipts and activity" view: when a client opens the
-- portal, requests changes, or approves work.
create table public.activity_events (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  deliverable_id uuid references public.deliverables(id) on delete cascade,
  event_type text check (
    event_type in ('project_opened', 'changes_requested', 'deliverable_approved', 'project_approved')
  ) not null,
  detail text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.activity_events enable row level security;

-- Freelancers read activity for their own projects.
create policy "Freelancers read own activity"
  on public.activity_events for select
  to authenticated
  using (
    project_id in (
      select id from public.projects where freelancer_id = (select auth.uid())
    )
  );

-- Anonymous clients can record activity (portal actions run with the anon role;
-- writes are also made via the service role in server actions).
create policy "Public insert activity"
  on public.activity_events for insert
  to anon
  with check (true);

create index idx_activity_project on public.activity_events(project_id);

-- Realtime so the freelancer's activity feed updates live.
alter publication supabase_realtime add table public.activity_events;
