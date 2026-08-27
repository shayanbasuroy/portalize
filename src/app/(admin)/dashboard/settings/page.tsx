import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const { data: freelancer } = await supabase
    .from("freelancers")
    .select("full_name, business_name, brand_color, logo_url, subscription_tier, subscription_status, customer_id")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          Settings
        </p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight text-[#151B45] sm:text-3xl">
          Profile &amp; billing
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Manage your account, plan subscription, and client portal branding.
        </p>
      </div>
      <div>
        <SettingsForm
          profile={{
            full_name: freelancer?.full_name ?? "",
            business_name: freelancer?.business_name ?? null,
            brand_color: freelancer?.brand_color ?? "#151B45",
            logo_url: freelancer?.logo_url ?? null,
            subscription_tier: freelancer?.subscription_tier ?? "free",
            subscription_status: freelancer?.subscription_status ?? "none",
            customer_id: freelancer?.customer_id ?? null,
          }}
        />
      </div>
    </div>
  );
}
