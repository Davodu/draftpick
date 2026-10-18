import "server-only";
import Stripe from "stripe";

/**
 * Escrow is a Stripe PaymentIntent with manual capture (an authorization hold).
 * Settlement captures the seller's share; Stripe releases the rest of the hold.
 *
 * Without STRIPE_SECRET_KEY, escrow is simulated so the rest of the flow still
 * runs locally. Simulated holds have ids starting with "sim_".
 */

let stripe: Stripe | null = null;
function client() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!key.startsWith("sk_test_")) {
    throw new Error("Only Stripe test-mode keys (sk_test_…) are allowed.");
  }
  stripe ??= new Stripe(key);
  return stripe;
}

export const escrowIsSimulated = () => !process.env.STRIPE_SECRET_KEY;

export async function placeHold(opts: {
  contractId: string;
  amount: number;
  currency: string;
  description: string;
}): Promise<string> {
  const s = client();
  if (!s) return `sim_${opts.contractId.slice(0, 8)}`;

  const pi = await s.paymentIntents.create({
    amount: opts.amount,
    currency: opts.currency,
    capture_method: "manual",
    payment_method: "pm_card_visa", // Stripe test card; the buyer's saved method in production
    confirm: true,
    automatic_payment_methods: { enabled: true, allow_redirects: "never" },
    description: `Verdict escrow: ${opts.description}`.slice(0, 1000),
    metadata: { verdict_contract_id: opts.contractId },
  });
  if (pi.status !== "requires_capture") {
    throw new Error(`Escrow hold failed: PaymentIntent is ${pi.status}`);
  }
  return pi.id;
}

/** Captures `sellerAmount` of the hold and releases the remainder to the buyer. */
export async function settle(paymentIntentId: string, sellerAmount: number) {
  const s = client();
  if (!s || paymentIntentId.startsWith("sim_")) return;

  if (sellerAmount <= 0) {
    await s.paymentIntents.cancel(paymentIntentId);
  } else {
    await s.paymentIntents.capture(paymentIntentId, { amount_to_capture: sellerAmount });
  }
}

export function stripeDashboardUrl(paymentIntentId: string | null) {
  if (!paymentIntentId || paymentIntentId.startsWith("sim_")) return null;
  return `https://dashboard.stripe.com/test/payments/${paymentIntentId}`;
}
