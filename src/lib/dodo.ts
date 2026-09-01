import DodoPayments from "dodopayments";

// Centralized Dodo Payments SDK client
export const DODO_PRO_PRODUCT_ID =
  process.env.DODO_PAYMENTS_PRO_PRODUCT_ID || "pdt_0Nmdkb0DW0H6z2KN4PDza";

export function getDodoClient(): DodoPayments {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  if (!apiKey) {
    throw new Error("DODO_PAYMENTS_API_KEY is not configured.");
  }

  const environment =
    process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode"
      ? "live_mode"
      : "test_mode";

  return new DodoPayments({
    bearerToken: apiKey,
    environment,
    webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY,
  });
}
