import { createClient } from "@/lib/supabase/server";
import { AddClientDialog } from "@/components/admin/AddClientDialog";
import { ClientActions } from "@/components/admin/ClientActions";
import { Users } from "lucide-react";

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .eq("freelancer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            Clients
          </p>
          <h1 className="mt-2 text-2xl font-medium tracking-tight text-[#151B45] sm:text-3xl">
            Your clients
          </h1>
        </div>
        <AddClientDialog />
      </div>

      {clients && clients.length > 0 ? (
        <div className="divide-y divide-zinc-200 border-y border-zinc-200">
          {clients.map((client) => (
            <div key={client.id} className="flex flex-wrap items-center gap-4 py-4">
              <span className="flex size-9 shrink-0 items-center justify-center border border-zinc-200 text-[#151B45]">
                <Users className="size-4" strokeWidth={1.75} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#151B45]">
                  {client.client_name}
                </p>
                <p className="truncate font-mono text-[11px] text-zinc-400">
                  {client.company_name || "No company"}
                </p>
              </div>

              <a
                href={`mailto:${client.client_email}`}
                className="shrink-0 text-sm text-[#151B45] underline-offset-4 hover:underline"
              >
                {client.client_email}
              </a>

              <ClientActions client={client} />
            </div>
          ))}
        </div>
      ) : (
        <div className="border-y border-dashed border-zinc-200 py-16 text-center">
          <p className="text-sm text-zinc-500">
            No clients found. Add your first client to get started.
          </p>
        </div>
      )}
    </div>
  );
}
