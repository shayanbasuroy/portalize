-- ============================================================
-- Portalize: Freelancer Brand Assets (public logos)
-- ============================================================

-- Public bucket for freelancer brand assets (logos shown on client portals).
-- The bucket is public so client portals can render logos without signing in.
insert into storage.buckets (id, name, public)
values ('brand-assets', 'brand-assets', true)
on conflict (id) do nothing;

-- Freelancers can upload/update/delete their own brand assets
create policy "Freelancers upload own brand assets"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'brand-assets'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "Freelancers update own brand assets"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'brand-assets'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  )
  with check (
    bucket_id = 'brand-assets'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "Freelancers delete own brand assets"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'brand-assets'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

-- Anonymous can read brand assets for portal display
create policy "Public read brand assets"
  on storage.objects for select
  to anon
  using (bucket_id = 'brand-assets');
