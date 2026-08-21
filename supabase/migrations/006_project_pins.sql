-- ============================================================
-- Portalize: store the plaintext client PIN for the dashboard
-- ============================================================
-- `projects.access_pin` stays hashed (that's what the client's PIN check
-- verifies against). This table holds the plaintext PIN so the freelancer can
-- always see + copy it from their dashboard. It is readable only by the
-- owning freelancer — anonymous portal visitors have no access.

create table public.project_pins (
  project_id uuid references public.projects(id) on delete cascade primary key,
  pin text not null
);

alter table public.project_pins enable row level security;

create policy "Freelancers manage own project pins"
  on public.project_pins for all
  to authenticated
  using (
    project_id in (
      select id from public.projects where freelancer_id = (select auth.uid())
    )
  )
  with check (
    project_id in (
      select id from public.projects where freelancer_id = (select auth.uid())
    )
  );
