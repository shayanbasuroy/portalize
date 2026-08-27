"use server";

import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { getDodoClient, DODO_PRO_PRODUCT_ID } from "@/lib/dodo";
import { redirect } from "next/navigation";

function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

/**
 * Creates a Dodo Payments checkout session for the $19/mo Pro subscription.
 */
export async function createUpgradeCheckoutAction(): Promise<{ url?: string; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "You must be signed in to upgrade." };
  }

  const supabase = await createClient();
  const { data: freelancer } = await supabase
    .from("freelancers")
    .select("full_name, subscription_tier, customer_id")
    .eq("id", user.id)
    .single();

  if (freelancer?.subscription_tier === "pro") {
    return { error: "You are already subscribed to the Pro plan." };
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
      return_url: `${appUrl}/dashboard/settings?session_id={CHECKOUT_SESSION_ID}&upgraded=true`,
    });

    const checkoutUrl = checkoutSession.checkout_url;
    if (!checkoutUrl) {
      return { error: "Failed to generate checkout URL." };
    }

    return { url: checkoutUrl };
  } catch (err: any) {
    console.error("Dodo checkout creation error:", err);
    return { error: err.message || "Failed to create checkout session." };
  }
}

/**
 * Creates a customer portal session for existing subscribers to manage payment methods or cancel.
 */
export async function createCustomerPortalAction(): Promise<{ url?: string; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "You must be signed in." };
  }

  const supabase = await createClient();
  const { data: freelancer } = await supabase
    .from("freelancers")
    .select("customer_id, subscription_tier")
    .eq("id", user.id)
    .single();

  if (!freelancer?.customer_id) {
    return { error: "No active billing profile found. Upgrade to Pro first." };
  }

  try {
    const dodo = getDodoClient();
    const appUrl = getAppUrl();

    const portalSession = await dodo.customers.customerPortal.create(freelancer.customer_id, {
      return_url: `${appUrl}/dashboard/settings`,
    });

    return { url: portalSession.link };
  } catch (err: any) {
    console.error("Dodo customer portal error:", err);
    return { error: err.message || "Failed to load customer portal." };
  }
}
