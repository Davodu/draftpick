import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { payoutFor, reproduce } from "./checks";
import { placeHold, settle } from "./escrow";
import { judge, type EvidenceItem } from "./judge";
import { generateApiKey, hashApiKey } from "./keys";
import {
  AcceptanceSchema,
  DeliveryPayloadSchema,
  type Acceptance,
  type Agent,
  type Contract,
  type DeliveryPayload,
  type Reproduction,
  type Ruling,
} from "./types";

/**
 * Every operation runs as an actor: the operator who owns the agents, and,
 * for MCP calls, the specific agent making the call. All queries use the
 * service-role client, so ownership is enforced here rather than by RLS.
 */
export type Actor = { ownerId: string; agentId?: string };

export class VerdictError extends Error {}

const db = () => createAdminClient();

function must<T>(res: { data: T | null; error: { message: string } | null }, what: string): T {
  if (res.error) throw new VerdictError(`${what}: ${res.error.message}`);
  if (res.data === null) throw new VerdictError(`${what}: not found`);
  return res.data;
}

// Agents ----------------------------------------------------------------------

export async function registerAgent(actor: Actor, input: { name: string; role: Agent["role"] }) {
  const apiKey = generateApiKey();
  const agent = must(
    await db()
      .from("agents")
      .insert({ owner_id: actor.ownerId, name: input.name, role: input.role, api_key_hash: hashApiKey(apiKey) })
      .select("id, owner_id, name, role, created_at")
      .single<Agent>(),
    "Register agent",
  );
  return { agent, apiKey };
}

export async function listAgents(actor: Actor) {
  return must(
    await db()
      .from("agents")
      .select("id, owner_id, name, role, created_at")
      .eq("owner_id", actor.ownerId)
      .order("created_at")
      .returns<Agent[]>(),
    "List agents",
  );
}

export async function agentForApiKey(apiKey: string): Promise<Agent | null> {
  const { data } = await db()
    .from("agents")
    .select("id, owner_id, name, role, created_at")
    .eq("api_key_hash", hashApiKey(apiKey))
    .maybeSingle<Agent>();
  return data;
}

async function getAgent(actor: Actor, id: string) {
  const { data } = await db()
    .from("agents")
    .select("id, owner_id, name, role, created_at")
    .eq("id", id)
    .eq("owner_id", actor.ownerId)
    .maybeSingle<Agent>();
  if (!data) throw new VerdictError(`Agent ${id} not found`);
  return data;
}

// Contracts -------------------------------------------------------------------

export async function getContract(actor: Actor, id: string): Promise<Contract> {
  const { data } = await db()
    .from("contracts")
    .select("*")
    .eq("id", id)
    .eq("owner_id", actor.ownerId)
    .maybeSingle<Contract>();
  if (!data) throw new VerdictError(`Contract ${id} not found`);
  if (actor.agentId && actor.agentId !== data.buyer_agent_id && actor.agentId !== data.seller_agent_id) {
    throw new VerdictError("This agent is not a party to the contract");
  }
  return data;
}

function requireParty(actor: Actor, contract: Contract, party: "buyer" | "seller") {
  const id = party === "buyer" ? contract.buyer_agent_id : contract.seller_agent_id;
  if (actor.agentId && actor.agentId !== id) {
    throw new VerdictError(`Only the ${party} agent can do this`);
  }
}

function requireStatus(contract: Contract, ...allowed: Contract["status"][]) {
  if (!allowed.includes(contract.status)) {
    throw new VerdictError(`Contract is ${contract.status}; expected ${allowed.join(" or ")}`);
  }
}

async function setStatus(id: string, status: Contract["status"]) {
  must(await db().from("contracts").update({ status }).eq("id", id).select("id").single(), "Update contract");
}

export async function listContracts(actor: Actor, limit = 20) {
  let query = db()
    .from("contracts")
    .select("*")
    .eq("owner_id", actor.ownerId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (actor.agentId) {
    query = query.or(`buyer_agent_id.eq.${actor.agentId},seller_agent_id.eq.${actor.agentId}`);
  }
  return must(await query.returns<Contract[]>(), "List contracts");
}

export async function openEscrow(
  actor: Actor,
  input: {
    buyerAgentId?: string;
    sellerAgentId: string;
    task: string;
    priceAmount: number;
    currency?: string;
    acceptance: Acceptance;
    deadline?: string;
  },
) {
  const buyerAgentId = actor.agentId ?? input.buyerAgentId;
  if (!buyerAgentId) throw new VerdictError("buyer_agent_id is required");
  if (buyerAgentId === input.sellerAgentId) throw new VerdictError("Buyer and seller must be different agents");
  if (!Number.isInteger(input.priceAmount) || input.priceAmount < 50) {
    throw new VerdictError("price_amount is in cents and must be at least 50");
  }
  await getAgent(actor, buyerAgentId);
  await getAgent(actor, input.sellerAgentId);
  const acceptance = AcceptanceSchema.parse(input.acceptance);

  const contract = must(
    await db()
      .from("contracts")
      .insert({
        owner_id: actor.ownerId,
        buyer_agent_id: buyerAgentId,
        seller_agent_id: input.sellerAgentId,
        task: input.task,
        price_amount: input.priceAmount,
        currency: (input.currency ?? "usd").toLowerCase(),
        acceptance,
        deadline: input.deadline ?? null,
      })
      .select("*")
      .single<Contract>(),
    "Open contract",
  );

  try {
    const pi = await placeHold({
      contractId: contract.id,
      amount: contract.price_amount,
      currency: contract.currency,
      description: contract.task,
    });
    return must(
      await db()
        .from("contracts")
        .update({ stripe_payment_intent_id: pi })
        .eq("id", contract.id)
        .select("*")
        .single<Contract>(),
      "Save escrow",
    );
  } catch (error) {
    await setStatus(contract.id, "cancelled");
    throw new VerdictError(`Escrow hold failed: ${error instanceof Error ? error.message : error}`);
  }
}

export async function deliver(actor: Actor, contractId: string, payload: DeliveryPayload) {
  const contract = await getContract(actor, contractId);
  requireParty(actor, contract, "seller");
  requireStatus(contract, "open");
  const parsed = DeliveryPayloadSchema.parse(payload);

  must(
    await db().from("deliveries").insert({ contract_id: contract.id, payload: parsed }).select("id").single(),
    "Save delivery",
  );
  await setStatus(contract.id, "delivered");
  return { ...contract, status: "delivered" as const };
}

export async function acceptDelivery(actor: Actor, contractId: string) {
  const contract = await getContract(actor, contractId);
  requireParty(actor, contract, "buyer");
  requireStatus(contract, "delivered");
  await settle(contract.stripe_payment_intent_id!, contract.price_amount);
  await setStatus(contract.id, "settled");
  return { ...contract, status: "settled" as const };
}

// Disputes --------------------------------------------------------------------

export async function fileDispute(
  actor: Actor,
  contractId: string,
  input: { reason: string; ruleNow?: boolean },
) {
  const contract = await getContract(actor, contractId);
  requireParty(actor, contract, "buyer");
  requireStatus(contract, "delivered");

  const dispute = must(
    await db()
      .from("disputes")
      .insert({ contract_id: contract.id, reason: input.reason })
      .select("id")
      .single<{ id: string }>(),
    "File dispute",
  );
  await db()
    .from("evidence")
    .insert({ dispute_id: dispute.id, party: "buyer", kind: "statement", content: { text: input.reason } });
  await setStatus(contract.id, "disputed");

  if (input.ruleNow === false) return { disputeId: dispute.id, ruling: null };
  const ruling = await rule(actor, contract.id);
  return { disputeId: dispute.id, ruling };
}

export async function submitEvidence(actor: Actor, contractId: string, statement: string) {
  const contract = await getContract(actor, contractId);
  requireStatus(contract, "disputed");
  const party = actor.agentId === contract.seller_agent_id ? "seller" : "buyer";
  const dispute = await getDispute(contract.id);
  must(
    await db()
      .from("evidence")
      .insert({ dispute_id: dispute.id, party, kind: "statement", content: { text: statement } })
      .select("id")
      .single(),
    "Submit evidence",
  );
  return { disputeId: dispute.id, party };
}

async function getDispute(contractId: string) {
  return must(
    await db().from("disputes").select("id, reason, created_at").eq("contract_id", contractId).single<{
      id: string;
      reason: string;
      created_at: string;
    }>(),
    "Dispute",
  );
}

/** Re-runs the acceptance checks, has the judge write the ruling, and settles escrow. */
export async function rule(actor: Actor, contractId: string): Promise<Ruling> {
  const started = Date.now();
  const contract = await getContract(actor, contractId);
  requireStatus(contract, "disputed");
  const dispute = await getDispute(contract.id);

  const delivery = must(
    await db()
      .from("deliveries")
      .select("payload")
      .eq("contract_id", contract.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single<{ payload: DeliveryPayload }>(),
    "Delivery",
  );

  const reproduction = await reproduce(delivery.payload.rows, contract.acceptance);
  await db().from("evidence").insert({
    dispute_id: dispute.id,
    party: "verdict",
    kind: "reproduction",
    content: { ...reproduction, failures: reproduction.failures.slice(0, 25) },
  });

  const evidenceRows = must(
    await db()
      .from("evidence")
      .select("party, kind, content")
      .eq("dispute_id", dispute.id)
      .order("created_at")
      .returns<{ party: string; kind: string; content: unknown }[]>(),
    "Evidence",
  );
  const evidence: EvidenceItem[] = evidenceRows.map((e, i) => ({ label: `E${i + 1}`, ...e }));

  const payout = payoutFor(contract.price_amount, contract.acceptance, reproduction);
  const written = await judge({
    task: contract.task,
    price: contract.price_amount,
    currency: contract.currency,
    acceptance: contract.acceptance,
    evidence,
    reproduction,
    payout,
  });

  const ruling = must(
    await db()
      .from("rulings")
      .insert({
        dispute_id: dispute.id,
        summary: written.summary,
        findings: written.findings,
        seller_amount: payout.seller,
        buyer_amount: payout.buyer,
        model: written.model,
        duration_ms: Date.now() - started,
      })
      .select("*")
      .single<Ruling>(),
    "Save ruling",
  );
  await setStatus(contract.id, "ruled");

  await settle(contract.stripe_payment_intent_id!, payout.seller);
  await setStatus(contract.id, "settled");
  return ruling;
}

// Case view -------------------------------------------------------------------

export type CaseFile = {
  contract: Contract;
  buyer: Agent;
  seller: Agent;
  delivery: { rows: number; created_at: string } | null;
  dispute: { id: string; reason: string; created_at: string } | null;
  evidence: { label: string; party: string; kind: string; content: unknown; created_at: string }[];
  reproduction: Reproduction | null;
  ruling: Ruling | null;
};

export async function getCaseFile(actor: Actor, contractId: string): Promise<CaseFile> {
  const contract = await getContract(actor, contractId);
  const client = db();
  const [buyer, seller, delivery, dispute] = await Promise.all([
    getAgent(actor, contract.buyer_agent_id),
    getAgent(actor, contract.seller_agent_id),
    client
      .from("deliveries")
      .select("payload, created_at")
      .eq("contract_id", contract.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle<{ payload: DeliveryPayload; created_at: string }>(),
    client
      .from("disputes")
      .select("id, reason, created_at")
      .eq("contract_id", contract.id)
      .maybeSingle<{ id: string; reason: string; created_at: string }>(),
  ]);

  let evidence: CaseFile["evidence"] = [];
  let ruling: Ruling | null = null;
  if (dispute.data) {
    const [ev, ru] = await Promise.all([
      client
        .from("evidence")
        .select("party, kind, content, created_at")
        .eq("dispute_id", dispute.data.id)
        .order("created_at")
        .returns<{ party: string; kind: string; content: unknown; created_at: string }[]>(),
      client.from("rulings").select("*").eq("dispute_id", dispute.data.id).maybeSingle<Ruling>(),
    ]);
    evidence = (ev.data ?? []).map((e, i) => ({ label: `E${i + 1}`, ...e }));
    ruling = ru.data;
  }

  const repro = evidence.find((e) => e.kind === "reproduction");
  return {
    contract,
    buyer,
    seller,
    delivery: delivery.data
      ? { rows: delivery.data.payload.rows.length, created_at: delivery.data.created_at }
      : null,
    dispute: dispute.data,
    evidence,
    reproduction: (repro?.content as Reproduction | undefined) ?? null,
    ruling,
  };
}
