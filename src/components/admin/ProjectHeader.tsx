"use client";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/admin/CopyButton";
import {
  togglePaymentStatus,
  deleteProjectAction,
  toggleWatermarkAction,
  regeneratePinAction,
} from "@/app/actions/projects";
import { vibrate } from "@/lib/haptics";
import { Trash2, ExternalLink } from "lucide-react";

const statusLabels: Record<string, string> = {
  in_review: "In review",
  changes_requested: "Changes requested",
  approved: "Approved",
};

export function ProjectHeader({
  project,
  portalBaseUrl,
  pin,
}: {
  project: any;
  portalBaseUrl: string;
  pin?: string | null;
}) {
  const portalLink = `${portalBaseUrl}/p/${project.slug}`;
  const status = statusLabels[project.project_status] || project.project_status;
  const isPaid = project.payment_status === "paid";

  return (
    <div className="border border-zinc-200 bg-white">
      <div className="grid lg:grid-cols-[1fr_320px]">
        {/* Identity */}
        <div className="p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
            {project.clients?.client_name || "Client"} · Project
          </p>
          <h1 className="mt-1.5 text-2xl font-medium tracking-tight text-[#151B45]">
            {project.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="border border-zinc-200 px-2.5 py-1 font-mono text-[11px] text-zinc-500">
              {status}
            </span>
            <span
              className={`border px-2.5 py-1 font-mono text-[11px] ${
                isPaid
                  ? "border-emerald-200 text-emerald-600"
                  : "border-amber-200 text-amber-600"
              }`}
            >
              {isPaid ? "Paid" : "Unpaid"}
            </span>
          </div>
        </div>

        {/* Distribution + actions */}
        <div className="border-t border-zinc-200 p-6 lg:border-l lg:border-t-0">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                  Portal link
                </p>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`/p/${project.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-7 items-center gap-1 border border-zinc-200 px-2 font-mono text-[11px] text-[#151B45] hover:bg-zinc-100"
                    title="Open portal in new tab"
                  >
                    <ExternalLink className="size-3" />
                    <span>Open</span>
                  </a>
                  <CopyButton text={portalLink} className="h-7 w-7" />
                </div>
              </div>
              <p className="mt-2 truncate font-mono text-[11px] text-[#151B45]">
                {portalLink}
              </p>
            </div>

            <div className="border-t border-zinc-100 pt-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                  Access PIN
                </p>
                <form action={regeneratePinAction}>
                  <input type="hidden" name="id" value={project.id} />
                  <Button type="submit" variant="outline" size="sm">
                    Regenerate
                  </Button>
                </form>
              </div>
              {pin ? (
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-mono text-lg tracking-wider text-[#151B45]">
                    {pin}
                  </span>
                  <CopyButton text={pin} className="h-6 w-6" />
                </div>
              ) : (
                <p className="mt-2 text-xs text-zinc-400">
                  No PIN yet — regenerate to create one you can copy.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-zinc-100 pt-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#151B45]">Watermark previews</p>
                <p className="font-mono text-[11px] text-zinc-400">
                  {project.watermark_enabled ? "On" : "Off"} · unpaid previews are
                  watermarked until marked paid
                </p>
              </div>
              <form action={toggleWatermarkAction}>
                <input type="hidden" name="id" value={project.id} />
                <input
                  type="hidden"
                  name="current"
                  value={String(project.watermark_enabled)}
                />
                <Button type="submit" variant="outline" size="sm">
                  {project.watermark_enabled ? "Turn off" : "Turn on"}
                </Button>
              </form>
            </div>

            <div className="flex gap-2 border-t border-zinc-100 pt-4">
              <form action={togglePaymentStatus} className="flex-1">
                <input type="hidden" name="id" value={project.id} />
                <input
                  type="hidden"
                  name="current_status"
                  value={project.payment_status}
                />
                <Button
                  type="submit"
                  variant={isPaid ? "outline" : "default"}
                  className="w-full"
                  onClick={() => vibrate(20)}
                >
                  {isPaid ? "Mark as Unpaid" : "Mark as Paid"}
                </Button>
              </form>
              <form action={deleteProjectAction}>
                <input type="hidden" name="id" value={project.id} />
                <Button
                  type="submit"
                  variant="destructive"
                  size="icon"
                  title="Delete Project"
                  onClick={(e) => {
                    if (
                      !confirm(
                        "Are you sure you want to delete this project? This cannot be undone."
                      )
                    ) {
                      e.preventDefault();
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
