import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { asSingle } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UpgradeButton } from "@/components/admin/UpgradeButton";
import { ArrowRight, FolderKanban, Plus, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";

const borders = [
  "",
  "border-l border-zinc-200",
  "border-t border-zinc-200 lg:border-t-0 lg:border-l",
  "border-t border-l border-zinc-200 lg:border-t-0",
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) return null;

  // Single parallel round-trip: fetch all projects (derive counts + recent from
  // it), the client count, and the freelancer profile together.
  const [projectsResult, clientsResult, freelancerResult] = await Promise.all([
    supabase
      .from("projects")
      .select("id, title, created_at, payment_status, project_status, clients(client_name)")
      .eq("freelancer_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("freelancer_id", user.id),
    supabase
      .from("freelancers")
      .select("full_name, subscription_tier, subscription_status")
      .eq("id", user.id)
      .single(),
  ]);

  const freelancer = freelancerResult.data;
  const isPro = freelancer?.subscription_tier === "pro";
  const projects = projectsResult.data ?? [];
  const clientsCount = clientsResult.count ?? 0;

  const projectsCount = projects.length;
  const pendingReviewsCount = projects.filter((p) => p.project_status === "in_review").length;
  const paidProjectsCount = projects.filter((p) => p.payment_status === "paid").length;
  const recentProjects = projects.slice(0, 5);

  const stats = [
    { label: "Total projects", value: projectsCount },
    { label: "Active clients", value: clientsCount },
    { label: "Pending review", value: pendingReviewsCount },
    { label: "Paid projects", value: paidProjectsCount },
  ];

  return (
    <div className="space-y-10">
      {/* Upgrade Banner for Free Users */}
      {!isPro && (
        <div className="flex flex-col gap-4 border border-[#6C3FE8]/30 bg-[#6C3FE8]/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-[#6C3FE8] text-white">
                <Sparkles className="size-3" />
              </span>
              <p className="text-sm font-medium text-[#151B45]">
                Free Plan ({projectsCount}/1 client portal used)
              </p>
            </div>
            <p className="text-xs text-zinc-600">
              Upgrade to Pro ($19/mo) to create unlimited client portals, customize your logo & brand color, and get priority support.
            </p>
          </div>
          <UpgradeButton size="sm" className="shrink-0 bg-[#6C3FE8] text-white hover:bg-[#582ed1]" />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              Dashboard
            </p>
            <span
              className={`inline-flex items-center gap-1 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                isPro
                  ? "border-[#6C3FE8]/40 bg-[#6C3FE8]/10 text-[#6C3FE8]"
                  : "border-zinc-300 bg-zinc-100 text-zinc-600"
              }`}
            >
              {isPro && <ShieldCheck className="size-3" />}
              {isPro ? "Pro Plan" : "Free Plan"}
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-medium tracking-tight text-[#151B45] sm:text-3xl">
            Welcome back, {freelancer?.full_name || "Freelancer"}
          </h1>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="bg-[#151B45] text-[#F8F7FC] hover:bg-zinc-800">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats — rule-divided spec index */}
      <div className="border-y border-zinc-200">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col-reverse gap-1.5 px-6 py-8 ${borders[i]}`}
            >
              <dt className="font-mono text-[11px] leading-snug text-zinc-500">
                {s.label}
              </dt>
              <dd className="text-3xl font-medium tracking-tight text-[#151B45]">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Recent projects */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            Recent projects
          </h2>
          <Link
            href="/dashboard/projects"
            className="text-sm text-[#151B45] underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>

        {recentProjects && recentProjects.length > 0 ? (
          <div className="mt-4 divide-y divide-zinc-200 border-t border-zinc-200">
            {recentProjects.map((p) => (
              <Link
                key={p.id}
                href={`/dashboard/projects/${p.id}`}
                className="group flex items-center gap-4 py-4"
              >
                <span className="flex size-9 shrink-0 items-center justify-center border border-zinc-200 text-[#151B45]">
                  <FolderKanban className="size-4" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#151B45] group-hover:underline">
                    {p.title}
                  </p>
                  <p className="truncate font-mono text-[11px] text-zinc-400">
                    {asSingle(p.clients)?.client_name || "No client"}
                  </p>
                </div>
                <span
                  className={`shrink-0 font-mono text-[11px] ${
                    p.payment_status === "paid" ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {p.payment_status === "paid" ? "Paid" : "Unpaid"}
                </span>
                <ArrowRight className="size-4 shrink-0 text-zinc-400 transition-colors group-hover:text-[#151B45]" />
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-4 border-t border-zinc-200 pt-4 text-sm text-zinc-500">
            No projects yet. Create your first one to get started.
          </p>
        )}
      </div>
    </div>
  );
}
