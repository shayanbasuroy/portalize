import { NextResponse } from "next/server";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { getDodoClient } from "@/lib/dodo";

function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const supabase = await createClient();
  const { data: freelancer } = await supabase
    .from("freelancers")
    .select("customer_id")
    .eq("id", user.id)
    .single();

  if (!freelancer?.customer_id) {
    return NextResponse.json(
      { error: "No active billing profile found. Upgrade to Pro first." },
      { status: 400 }
    );
  }

  try {
    const dodo = getDodoClient();
    const appUrl = getAppUrl();

    const portalSession = await dodo.customers.customerPortal.create(freelancer.customer_id, {
      return_url: `${appUrl}/dashboard/settings`,
    });

    return NextResponse.json({ url: portalSession.link });
  } catch (err: any) {
    console.error("Dodo customer portal error:", err);
    return NextResponse.json({ error: err.message || "Failed to load customer portal." }, { status: 500 });
  }
}
