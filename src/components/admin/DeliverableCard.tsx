"use client";

import { useState } from "react";
import { FileIcon, Code2, Link2, MonitorPlay, Trash2, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
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
      return { label: "Approved", className: "text-emerald-600 border-emerald-200 bg-emerald-50/50" };
    case "changes_requested":
      return { label: "Changes requested", className: "text-amber-600 border-amber-200 bg-amber-50/50" };
    default:
      return { label: "Pending", className: "text-zinc-500 border-zinc-200 bg-zinc-50/50" };
  }
}

interface FeedbackComment {
  id: string;
  sender_role: "client" | "freelancer" | string;
  author_name: string;
  comment_text: string;
  created_at: string;
}

interface Deliverable {
  id: string;
  title: string;
  deliverable_type: string;
  file_size?: number | null;
  status: string;
  content_url?: string | null;
  feedback_comments?: FeedbackComment[];
}

export function DeliverableCard({ deliverable }: { deliverable: Deliverable }) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const TypeIcon = typeIcons[deliverable.deliverable_type as keyof typeof typeIcons] ?? FileIcon;
  const status = statusMeta(deliverable.status);
  const comments = deliverable.feedback_comments || [];
  const hasComments = comments.length > 0;
  const hasChangesRequested = deliverable.status === "changes_requested";

  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

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

      <div className="flex items-center gap-2">
        <span className={`shrink-0 border px-2 py-0.5 font-mono text-[11px] ${status.className}`}>
          {status.label}
        </span>

        {hasChangesRequested && hasComments && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFeedbackOpen(true)}
            className="h-7 border-amber-300 bg-amber-50 text-xs font-medium text-amber-900 hover:bg-amber-100 hover:text-amber-950"
          >
            <AlertCircle className="mr-1.5 h-3.5 w-3.5 text-amber-600" />
            Read Feedback
          </Button>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {hasComments && (
          <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
            <DialogTrigger render={
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-600 hover:bg-zinc-100 hover:text-[#151B45]"
                title="View client feedback"
              />
            }>
              <MessageSquare className="mr-1.5 h-4 w-4 text-[#6C3FE8]" />
              <span className="font-mono text-xs">{comments.length}</span>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center border border-zinc-200 text-[#151B45]">
                    <TypeIcon className="size-3.5" strokeWidth={1.75} />
                  </span>
                  <DialogTitle className="text-base font-medium text-[#151B45]">
                    Client Feedback
                  </DialogTitle>
                </div>
                <DialogDescription className="font-mono text-xs text-zinc-500">
                  {deliverable.title} · {comments.length} comment{comments.length === 1 ? "" : "s"}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-2 max-h-[60vh] space-y-3 overflow-y-auto pr-1">
                {sortedComments.map((comment) => {
                  const isClient = comment.sender_role === "client";
                  const dateStr = new Date(comment.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={comment.id}
                      className="border border-zinc-200 bg-zinc-50/80 p-3 text-sm leading-relaxed"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-zinc-200/60 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#151B45]">
                            {comment.author_name}
                          </span>
                          <span
                            className={`border px-1.5 py-0.2 font-mono text-[10px] uppercase ${
                              isClient
                                ? "border-purple-200 bg-purple-50 text-[#6C3FE8]"
                                : "border-zinc-300 bg-white text-zinc-600"
                            }`}
                          >
                            {isClient ? "Client" : "Freelancer"}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-zinc-400">
                          {dateStr}
                        </span>
                      </div>
                      <p className="mt-2.5 whitespace-pre-wrap text-zinc-700">
                        {comment.comment_text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
        )}

        <form action={deleteDeliverableAction}>
          <input type="hidden" name="id" value={deliverable.id} />
          <input type="hidden" name="type" value={deliverable.deliverable_type} />
          <input type="hidden" name="content_url" value={deliverable.content_url || ""} />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:bg-destructive/10 hover:text-destructive"
            title="Delete deliverable"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
