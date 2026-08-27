import { NextResponse } from "next/server";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { getDodoClient, DODO_PRO_PRODUCT_ID } from "@/lib/dodo";

function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "You must be signed in to upgrade." }, { status: 401 });
  }

  const supabase = await createClient();
  const { data: freelancer } = await supabase
    .from("freelancers")
    .select("full_name, subscription_tier, customer_id")
    .eq("id", user.id)
    .single();

  if (freelancer?.subscription_tier === "pro") {
    return NextResponse.json({ error: "You are already subscribed to the Pro plan." }, { status: 400 });
  }

  try {
    const dodo = getDodoClient();
    const appUrl = getAppUrl();

    const checkoutSession = await dodo.checkoutSessions.create({
      product_cart: [
        {
          product_id: DODO_PRO_PRODUCT_ID,
          quantity: 1,
        },
      ],
      customer: freelancer?.customer_id
        ? { customer_id: freelancer.customer_id }
        : {
            email: user.email || "",
            name: freelancer?.full_name || undefined,
          },
      metadata: {
        freelancer_id: user.id,
      },
      return_url: `${appUrl}/dashboard/settings?upgraded=true`,
    });

    const checkoutUrl = checkoutSession.checkout_url;
    if (!checkoutUrl) {
      return NextResponse.json({ error: "Failed to generate checkout URL." }, { status: 500 });
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (err: any) {
    console.error("Dodo checkout creation error:", err);
    return NextResponse.json({ error: err.message || "Failed to create checkout session." }, { status: 500 });
  }
}
