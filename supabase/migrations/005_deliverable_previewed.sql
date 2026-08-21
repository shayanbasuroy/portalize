-- ============================================================
-- Portalize: add 'deliverable_previewed' read-receipt event
-- ============================================================
-- Extends the activity feed with a per-deliverable "the client previewed this"
-- event (granular read receipts), on top of the coarse project_opened event.

alter table public.activity_events drop constraint activity_events_event_type_check;

alter table public.activity_events add constraint activity_events_event_type_check
  check (
    event_type in (
      'project_opened',
      'changes_requested',
      'deliverable_approved',
      'project_approved',
      'deliverable_previewed'
    )
  );
