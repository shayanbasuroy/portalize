import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { FolderKanban, Plus } from "lucide-react";
import Link from "next/link";
import { CopyButton } from "@/components/admin/CopyButton";
import { portalUrl } from "@/lib/urls";

function statusLabel(status: string) {
  switch (status) {
    case "approved":
      return { label: "Approved", className: "text-emerald-600" };
    case "changes_requested":
      return { label: "Changes requested", className: "text-amber-600" };
    default:
      return { label: "In review", className: "text-zinc-500" };
  }
}

export default async function ProjectsPage() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) return null;

  const { data: projects } = await supabase
    .from("projects")
    .select("*, clients(client_name)")
    .eq("freelancer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            Projects
          </p>
          <h1 className="mt-2 text-2xl font-medium tracking-tight text-[#151B45] sm:text-3xl">
            Your projects
          </h1>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="bg-[#151B45] text-[#F8F7FC] hover:bg-zinc-800">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {projects && projects.length > 0 ? (
        <div className="divide-y divide-zinc-200 border-y border-zinc-200">
          {projects.map((project) => {
            const status = statusLabel(project.project_status);
            return (
              <div key={project.id} className="flex flex-wrap items-center gap-4 py-4">
                <span className="flex size-9 shrink-0 items-center justify-center border border-zinc-200 text-[#151B45]">
                  <FolderKanban className="size-4" strokeWidth={1.75} />
                </span>

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="text-sm font-medium text-[#151B45] hover:underline"
                  >
                    {project.title}
                  </Link>
                  <p className="truncate font-mono text-[11px] text-zinc-400">
                    Client: {project.clients?.client_name || "Unknown"}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <span
                    className={`font-mono text-[11px] ${
                      project.payment_status === "paid" ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {project.payment_status === "paid" ? "Paid" : "Unpaid"}
                  </span>
                  <span className={`font-mono text-[11px] ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Link href={`/dashboard/projects/${project.id}`}>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </Link>
                  <CopyButton text={portalUrl(project.slug)} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border border-dashed border-zinc-200 p-12 text-center">
          <span className="mx-auto flex size-12 items-center justify-center border border-zinc-200 bg-zinc-50 text-[#151B45]">
            <FolderKanban className="size-5" strokeWidth={1.5} />
          </span>
          <h3 className="mt-4 text-base font-medium text-[#151B45]">
            No projects yet
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-500">
            Create your first project portal to upload deliverables, set a 4-digit PIN, and protect your files before payment.
          </p>
          <Link
            href="/dashboard/projects/new"
            className="mt-6 inline-flex items-center gap-2 bg-[#151B45] px-6 py-2.5 text-sm font-medium text-[#F8F7FC] transition-colors hover:bg-zinc-800"
          >
            <Plus className="size-4" />
            Create your first portal
          </Link>
          <p className="mt-4 font-mono text-[11px] text-zinc-400">
            Takes 2 minutes · 1 active portal free forever
          </p>
        </div>
      )}
    </div>
  );
}
