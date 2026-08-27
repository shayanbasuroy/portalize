import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDodoClient } from "@/lib/dodo";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const webhookId = request.headers.get("webhook-id") || "";
  const webhookSignature = request.headers.get("webhook-signature") || "";
  const webhookTimestamp = request.headers.get("webhook-timestamp") || "";

  let event: any;

  try {
    const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY;
    if (webhookKey && webhookSignature) {
      const dodo = getDodoClient();
      event = dodo.webhooks.unwrap(rawBody, {
        headers: {
          "webhook-id": webhookId,
          "webhook-signature": webhookSignature,
          "webhook-timestamp": webhookTimestamp,
        },
      });
    } else {
      // In development / before webhook key is configured, parse JSON payload
      event = JSON.parse(rawBody);
      console.warn("Dodo webhook received without signature verification (set DODO_PAYMENTS_WEBHOOK_KEY for production verification).");
    }
  } catch (err: any) {
    console.error("Dodo webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const { type, data } = event;
  console.log(`[Dodo Webhook] Received event: ${type}`, { id: webhookId, type });

  const admin = createAdminClient();

  try {
    const customerId = data?.customer?.customer_id || data?.customer_id;
    const subscriptionId = data?.subscription_id;
    const freelancerId = data?.metadata?.freelancer_id;

    switch (type) {
      case "subscription.active":
      case "subscription.renewed":
      case "subscription.plan_changed": {
        let query = admin.from("freelancers").update({
          subscription_tier: "pro",
          subscription_status: "active",
          subscription_id: subscriptionId || undefined,
          customer_id: customerId || undefined,
        });

        if (freelancerId) {
          query = query.eq("id", freelancerId);
        } else if (customerId) {
          query = query.eq("customer_id", customerId);
        } else if (data?.customer?.email) {
          // Fallback match via email in auth.users
          const { data: userRecord } = await admin.auth.admin.listUsers();
          const matchedUser = userRecord?.users.find(
            (u) => u.email?.toLowerCase() === data.customer.email.toLowerCase()
          );
          if (matchedUser) {
            query = query.eq("id", matchedUser.id);
          }
        }

        const { error } = await query;
        if (error) {
          console.error("Error activating Pro subscription in Supabase:", error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        console.log(`[Dodo Webhook] Successfully activated Pro subscription for freelancer: ${freelancerId || customerId}`);
        break;
      }

      case "subscription.cancelled":
      case "subscription.expired":
      case "subscription.failed":
      case "subscription.on_hold": {
        let query = admin.from("freelancers").update({
          subscription_tier: "free",
          subscription_status: type.replace("subscription.", ""),
        });

        if (freelancerId) {
          query = query.eq("id", freelancerId);
        } else if (subscriptionId) {
          query = query.eq("subscription_id", subscriptionId);
        } else if (customerId) {
          query = query.eq("customer_id", customerId);
        }

        const { error } = await query;
        if (error) {
          console.error("Error revoking subscription in Supabase:", error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        console.log(`[Dodo Webhook] Subscription status updated to ${type} for freelancer.`);
        break;
      }

      default:
        console.log(`[Dodo Webhook] Unhandled event type: ${type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Error processing Dodo webhook:", err);
    return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
  }
}
