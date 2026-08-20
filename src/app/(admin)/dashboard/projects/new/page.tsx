import { createClient } from "@/lib/supabase/server";
import { NewProjectForm } from "./NewProjectForm";

export default async function NewProjectPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: clients } = await supabase
    .from("clients")
    .select("id, client_name")
    .eq("freelancer_id", user.id)
    .order("client_name");

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

      <div className="border border-zinc-200 bg-white p-6">
        <NewProjectForm clients={clients || []} />
      </div>
    </div>
  );
}
