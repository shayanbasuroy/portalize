import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: freelancer } = await supabase
    .from("freelancers")
    .select("full_name, business_name, brand_color, logo_url")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-2xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
        Settings
      </p>
      <h1 className="mt-2 text-2xl font-medium tracking-tight text-[#151B45] sm:text-3xl">
        Profile &amp; branding
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        Manage your profile and how your portals look to clients.
      </p>
      <div className="mt-6">
        <SettingsForm
          profile={{
            full_name: freelancer?.full_name ?? "",
            business_name: freelancer?.business_name ?? null,
            brand_color: freelancer?.brand_color ?? "#151B45",
            logo_url: freelancer?.logo_url ?? null,
          }}
        />
      </div>
    </div>
  );
}
