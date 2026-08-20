"use client";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/admin/CopyButton";
import { togglePaymentStatus, deleteProjectAction } from "@/app/actions/projects";
import { vibrate } from "@/lib/haptics";
import { Trash2, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

const statusLabels: Record<string, string> = {
  in_review: "In review",
  changes_requested: "Changes requested",
  approved: "Approved",
};

export function ProjectHeader({
  project,
  portalBaseUrl,
}: {
  project: any;
  portalBaseUrl: string;
}) {
  const searchParams = useSearchParams();
  const newlyCreatedPin = searchParams.get("pin");

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
                <CopyButton text={portalLink} className="h-7 w-7" />
              </div>
              <p className="mt-2 truncate font-mono text-[11px] text-[#151B45]">
                {portalLink}
              </p>
            </div>

            {newlyCreatedPin && (
              <div className="border border-amber-200 bg-amber-50/60 px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-1.5 font-mono text-[11px] text-amber-800">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Access PIN
                  </p>
                  <CopyButton text={newlyCreatedPin} className="h-6 w-6" />
                </div>
                <p className="mt-1 font-mono text-lg tracking-wider text-[#151B45]">
                  {newlyCreatedPin}
                </p>
                <p className="mt-0.5 text-xs text-amber-700">
                  Save this PIN and send it to your client. It will not be shown
                  again.
                </p>
              </div>
            )}

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
