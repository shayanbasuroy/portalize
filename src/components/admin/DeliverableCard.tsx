"use client";

import { FileIcon, Code2, Link2, MonitorPlay, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteDeliverableAction } from "@/app/actions/deliverables";

const typeIcons = {
  file: FileIcon,
  code: Code2,
  link: Link2,
  embed: MonitorPlay,
} as const;

function statusMeta(status: string) {
  switch (status) {
    case "approved":
      return { label: "Approved", className: "text-emerald-600" };
    case "changes_requested":
      return { label: "Changes requested", className: "text-amber-600" };
    default:
      return { label: "Pending", className: "text-zinc-500" };
  }
}

export function DeliverableCard({ deliverable }: { deliverable: any }) {
  const TypeIcon = typeIcons[deliverable.deliverable_type as keyof typeof typeIcons] ?? FileIcon;
  const status = statusMeta(deliverable.status);

  return (
    <div className="flex flex-wrap items-center gap-4 py-4">
      <span className="flex size-9 shrink-0 items-center justify-center border border-zinc-200 text-[#151B45]">
        <TypeIcon className="size-4" strokeWidth={1.75} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[#151B45]">
          {deliverable.title}
        </p>
        <p className="truncate font-mono text-[11px] text-zinc-400">
          {deliverable.deliverable_type}
          {deliverable.file_size
            ? ` · ${(deliverable.file_size / 1024 / 1024).toFixed(2)} MB`
            : ""}
        </p>
      </div>

      <span className={`shrink-0 font-mono text-[11px] ${status.className}`}>
        {status.label}
      </span>

      <div className="flex shrink-0 items-center gap-1">
        {deliverable.feedback_comments && deliverable.feedback_comments.length > 0 && (
          <Button variant="ghost" size="sm" className="text-zinc-500">
            <MessageSquare className="mr-1.5 h-4 w-4" />
            {deliverable.feedback_comments.length}
          </Button>
        )}
        <form action={deleteDeliverableAction}>
          <input type="hidden" name="id" value={deliverable.id} />
          <input type="hidden" name="type" value={deliverable.deliverable_type} />
          <input type="hidden" name="content_url" value={deliverable.content_url || ''} />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="text-zinc-500 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
