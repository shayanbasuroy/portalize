import Link from "next/link";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { NewProjectForm } from "./NewProjectForm";
import { UpgradeButton } from "@/components/admin/UpgradeButton";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function NewProjectPage() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) return null;

  const [{ data: clients }, { data: freelancer }, { count: projectCount }] = await Promise.all([
    supabase
      .from("clients")
      .select("id, client_name")
      .eq("freelancer_id", user.id)
      .order("client_name"),
    supabase
      .from("freelancers")
      .select("subscription_tier")
      .eq("id", user.id)
      .single(),
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("freelancer_id", user.id),
  ]);

  const isPro = freelancer?.subscription_tier === "pro";
  const isLimitReached = !isPro && (projectCount ?? 0) >= 1;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          New project
        </p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight text-[#151B45] sm:text-3xl">
          Create a project
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Set up a private portal your client can access with a 4-digit PIN.
        </p>
      </div>

      {isLimitReached ? (
        <div className="border border-zinc-200 bg-white p-8">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-5">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                Plan Index · Limit Reached
              </p>
              <h2 className="mt-2 text-xl font-medium tracking-tight text-[#151B45]">
                Free tier is limited to 1 client portal
              </h2>
            </div>
            <span className="font-mono text-xs text-zinc-400">[1/1 used]</span>
          </div>

          <div className="py-6">
            <p className="text-sm text-zinc-600">
              You already have an active client portal. Upgrade to the Pro plan ($19/month) to unlock:
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-zinc-600">
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-[7px] h-px w-3 shrink-0 bg-zinc-300" />
                <span><strong>Unlimited client portals</strong> for all current and future projects</span>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-[7px] h-px w-3 shrink-0 bg-zinc-300" />
                <span><strong>Custom branding</strong> (your custom logo & brand accent colors)</span>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-[7px] h-px w-3 shrink-0 bg-zinc-300" />
                <span><strong>Realtime read receipts</strong> and deliverable viewing trail</span>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-[7px] h-px w-3 shrink-0 bg-zinc-300" />
                <span><strong>Priority support</strong> directly from the team</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <UpgradeButton size="default" text="Upgrade to Pro — $19/mo" />
            <Link href="/dashboard/projects">
              <Button variant="outline" size="sm" className="border-zinc-200 text-[#151B45] hover:bg-zinc-100">
                View existing projects
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {(clients?.length ?? 0) === 0 && (
            <div className="border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm text-amber-800">
              You need at least one client before creating a project.{" "}
              <Link
                href="/dashboard/clients"
                className="font-medium underline underline-offset-4"
              >
                Add a client first
              </Link>
              .
            </div>
          )}

          <div className="border border-zinc-200 bg-white p-6">
            <NewProjectForm clients={clients || []} />
          </div>
        </>
      )}
    </div>
  );
}
