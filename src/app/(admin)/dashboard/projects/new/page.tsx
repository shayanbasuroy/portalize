import Link from "next/link";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { NewProjectForm } from "./NewProjectForm";
import { UpgradeButton } from "@/components/admin/UpgradeButton";
import { Sparkles, ArrowLeft, Check } from "lucide-react";
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
        <div className="border border-[#6C3FE8]/40 bg-white p-8 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#6C3FE8] text-white">
              <Sparkles className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-medium text-[#151B45]">
                Portal limit reached on Free plan
              </h2>
              <p className="text-xs text-zinc-500">
                You have reached the 1-portal limit on the Free tier.
              </p>
            </div>
          </div>

          <div className="my-6 space-y-3 border-y border-zinc-200 py-6">
            <p className="text-sm font-medium text-[#151B45]">Upgrade to Pro ($19/mo) and get:</p>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-600" />
                <strong>Unlimited client portals</strong> for all your active client work
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-600" />
                <strong>Custom branding</strong> (your logo and custom brand colors)
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-600" />
                <strong>Realtime read receipts</strong> & activity feeds
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-600" />
                <strong>Priority support</strong>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <UpgradeButton size="lg" className="w-full bg-[#6C3FE8] text-white hover:bg-[#582ed1] sm:w-auto" />
            <Link href="/dashboard/projects" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full">
                <ArrowLeft className="mr-2 size-4" />
                Back to projects
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
