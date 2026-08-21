"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Eye, MessageSquare, CheckCircle2, ShieldCheck } from "lucide-react";
import { formatRelativeTime } from "@/lib/format";

const icons = {
  project_opened: Eye,
  changes_requested: MessageSquare,
  deliverable_approved: CheckCircle2,
  project_approved: ShieldCheck,
  deliverable_previewed: Eye,
} as const;

type ActivityEvent = {
  id: string;
  event_type: string;
  detail: string | null;
  created_at: string;
};

/**
 * Read receipts / activity feed. Renders the server-fetched events and then
 * subscribes to Supabase Realtime so new client activity appears live.
 */
export function ActivityFeed({
  projectId,
  initialEvents,
}: {
  projectId: string;
  initialEvents: ActivityEvent[];
}) {
  const [events, setEvents] = useState(initialEvents);

  useEffect(() => {
    if (!projectId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`activity-${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activity_events",
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          setEvents((prev) => [payload.new as ActivityEvent, ...prev]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  return (
    <div>
      <h2 className="text-lg font-medium tracking-tight">Activity</h2>

      {!events || events.length === 0 ? (
        <p className="mt-3 border-t border-zinc-200 pt-4 text-sm text-zinc-500">
          No activity yet. It will appear when your client opens the portal or
          acts on a deliverable.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-zinc-200 border-t border-zinc-200">
          {events.map((e) => {
            const Icon = icons[e.event_type as keyof typeof icons] ?? Eye;
            return (
              <li key={e.id} className="flex items-start gap-3 py-3">
                <Icon className="mt-0.5 size-4 shrink-0 text-zinc-400" />
                <div className="min-w-0">
                  <p className="text-sm text-[#151B45]">
                    {e.detail || e.event_type}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-zinc-400">
                    {formatRelativeTime(e.created_at)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
