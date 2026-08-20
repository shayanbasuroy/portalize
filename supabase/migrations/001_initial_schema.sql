-- ============================================================
-- Portalize: Initial Database Schema
-- ============================================================

-- NOTE: ids use gen_random_uuid() (core Postgres 13+, no extension needed).
-- uuid-ossp / uuid_generate_v4() is not reliably available on all projects.

-- ============================================================
-- 1. FREELANCERS (Extends auth.users)
-- ============================================================
create table public.freelancers (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  business_name text,
  logo_url text,
  brand_color text default '#111111',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.freelancers enable row level security;

create policy "Freelancers can view own profile"
  on public.freelancers for select
  to authenticated
  using (id = (select auth.uid()));

create policy "Freelancers can update own profile"
  on public.freelancers for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "Freelancers can insert own profile"
  on public.freelancers for insert
  to authenticated
  with check (id = (select auth.uid()));

-- ============================================================
-- 2. CLIENTS
-- ============================================================
create table public.clients (
  id uuid default gen_random_uuid() primary key,
  freelancer_id uuid references public.freelancers(id) on delete cascade not null,
  client_name text not null,
  company_name text,
  client_email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.clients enable row level security;

create policy "Freelancers manage own clients"
  on public.clients for all
  to authenticated
  using (freelancer_id = (select auth.uid()))
  with check (freelancer_id = (select auth.uid()));

-- ============================================================
-- 3. PROJECTS
-- ============================================================
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  freelancer_id uuid references public.freelancers(id) on delete cascade not null,
  client_id uuid references public.clients(id) on delete cascade not null,
  title text not null,
  slug text unique not null,
  access_pin text not null,
  payment_status text check (payment_status in ('unpaid', 'paid')) default 'unpaid',
  project_status text check (project_status in ('in_review', 'changes_requested', 'approved')) default 'in_review',
  watermark_enabled boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.projects enable row level security;

-- Freelancers can manage their own projects
create policy "Freelancers manage own projects"
  on public.projects for all
  to authenticated
  using (freelancer_id = (select auth.uid()))
  with check (freelancer_id = (select auth.uid()));

-- Anonymous/public can read projects by slug (for client portal access)
create policy "Public can read projects by slug"
  on public.projects for select
  to anon
  using (true);

-- ============================================================
-- 4. DELIVERABLES
-- ============================================================
create table public.deliverables (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  deliverable_type text check (deliverable_type in ('file', 'link', 'code', 'embed')) not null,
  content_url text,
  code_content text,
  code_language text default 'javascript',
  file_size text,
  mime_type text,
  status text check (status in ('pending', 'changes_requested', 'approved')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.deliverables enable row level security;

-- Freelancers manage deliverables through project ownership
create policy "Freelancers manage own deliverables"
  on public.deliverables for all
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

-- Anonymous can read deliverables (portal access — PIN verified via middleware cookie)
create policy "Public can read deliverables"
  on public.deliverables for select
  to anon
  using (true);

-- Anonymous can update deliverable status (for client approvals/change requests)
create policy "Public can update deliverable status"
  on public.deliverables for update
  to anon
  using (true)
  with check (true);

-- ============================================================
-- 5. FEEDBACK COMMENTS
-- ============================================================
create table public.feedback_comments (
  id uuid default gen_random_uuid() primary key,
  deliverable_id uuid references public.deliverables(id) on delete cascade not null,
  sender_role text check (sender_role in ('freelancer', 'client')) not null,
  author_name text not null,
  comment_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.feedback_comments enable row level security;

-- Freelancers can manage comments on their deliverables
create policy "Freelancers manage own feedback"
  on public.feedback_comments for all
  to authenticated
  using (
    deliverable_id in (
      select d.id from public.deliverables d
      join public.projects p on d.project_id = p.id
      where p.freelancer_id = (select auth.uid())
    )
  )
  with check (
    deliverable_id in (
      select d.id from public.deliverables d
      join public.projects p on d.project_id = p.id
      where p.freelancer_id = (select auth.uid())
    )
  );

-- Anonymous can read feedback (portal)
create policy "Public can read feedback"
  on public.feedback_comments for select
  to anon
  using (true);

-- Anonymous can insert feedback (client submitting comments)
create policy "Public can insert feedback"
  on public.feedback_comments for insert
  to anon
  with check (true);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_projects_slug on public.projects(slug);
create index idx_projects_freelancer on public.projects(freelancer_id);
create index idx_projects_client on public.projects(client_id);
create index idx_deliverables_project on public.deliverables(project_id);
create index idx_clients_freelancer on public.clients(freelancer_id);
create index idx_feedback_deliverable on public.feedback_comments(deliverable_id);

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
insert into storage.buckets (id, name, public)
values ('deliverables-bucket', 'deliverables-bucket', false)
on conflict (id) do nothing;

-- Storage RLS: Freelancers can upload into their own directory
create policy "Freelancers upload own files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'deliverables-bucket'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

-- Storage RLS: Freelancers can read their own files
create policy "Freelancers read own files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'deliverables-bucket'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

-- Storage RLS: Freelancers can delete their own files
create policy "Freelancers delete own files"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'deliverables-bucket'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

-- ============================================================
-- REALTIME (Enable replication for live updates)
-- ============================================================
alter publication supabase_realtime add table public.projects;
alter publication supabase_realtime add table public.deliverables;
alter publication supabase_realtime add table public.feedback_comments;
