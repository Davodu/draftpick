import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { looksLikeApiKey } from "@/lib/verdict/keys";
import {
  acceptDelivery,
  agentForApiKey,
  deliver,
  fileDispute,
  getCaseFile,
  listAgents,
  listContracts,
  openEscrow,
  rule,
  submitEvidence,
  VerdictError,
  type Actor,
} from "@/lib/verdict/service";
import { AcceptanceSchema, LeadRowSchema } from "@/lib/verdict/types";
import type { Agent } from "@/lib/verdict/types";

/**
 * Verdict's MCP server. Each agent authenticates with its own API key
 * (Authorization: Bearer vd_agent_…), so every tool call acts as that agent.
 */

type Server = Parameters<Parameters<typeof createMcpHandler>[0]>[0];

const json = (value: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] });

async function run(fn: () => Promise<unknown>) {
  try {
    return json(await fn());
  } catch (error) {
    const message =
      error instanceof VerdictError || error instanceof z.ZodError
        ? error.message
        : "Internal error";
    if (!(error instanceof VerdictError)) console.error("[mcp]", error);
    return { ...json({ error: message }), isError: true };
  }
}

function registerTools(server: Server, agent: Agent) {
  const actor: Actor = { ownerId: agent.owner_id, agentId: agent.id };
  const contractId = z.string().uuid().describe("Contract id returned by open_escrow");

  server.registerTool(
    "whoami",
    { description: "Returns the calling agent and the other agents it can contract with.", inputSchema: z.object({}) },
    () =>
      run(async () => ({
        agent: { id: agent.id, name: agent.name, role: agent.role },
        counterparties: (await listAgents(actor)).filter((a) => a.id !== agent.id),
      })),
  );

  server.registerTool(
    "open_escrow",
    {
      description:
        "Buyer only. Opens a contract with a seller agent and places the price on a Stripe authorization hold. Acceptance criteria must be machine-checkable.",
      inputSchema: z.object({
        seller_agent_id: z.string().uuid(),
        task: z.string().min(3).max(500),
        price_amount: z.number().int().min(50).describe("Price in cents"),
        currency: z.string().length(3).default("usd"),
        acceptance: AcceptanceSchema,
        deadline: z.string().datetime().optional(),
      }),
    },
    (input) =>
      run(async () => {
        const c = await openEscrow(actor, {
          sellerAgentId: input.seller_agent_id,
          task: input.task,
          priceAmount: input.price_amount,
          currency: input.currency,
          acceptance: input.acceptance,
          deadline: input.deadline,
        });
        return { contract_id: c.id, status: c.status, escrow: c.stripe_payment_intent_id };
      }),
  );

  server.registerTool(
    "deliver",
    {
      description: "Seller only. Submits the delivered rows for a contract.",
      inputSchema: z.object({ contract_id: contractId, rows: z.array(LeadRowSchema).min(1).max(5000) }),
    },
    ({ contract_id, rows }) =>
      run(async () => ({ status: (await deliver(actor, contract_id, { rows })).status })),
  );

  server.registerTool(
    "accept_delivery",
    {
      description: "Buyer only. Accepts the delivery and releases the full price to the seller.",
      inputSchema: z.object({ contract_id: contractId }),
    },
    ({ contract_id }) => run(async () => ({ status: (await acceptDelivery(actor, contract_id)).status })),
  );

  server.registerTool(
    "file_dispute",
    {
      description:
        "Buyer only. Disputes a delivery. By default Verdict re-runs the acceptance checks, rules and settles immediately; set rule_now=false to let the seller submit evidence first.",
      inputSchema: z.object({
        contract_id: contractId,
        reason: z.string().min(3).max(2000),
        rule_now: z.boolean().default(true),
      }),
    },
    ({ contract_id, reason, rule_now }) =>
      run(() => fileDispute(actor, contract_id, { reason, ruleNow: rule_now })),
  );

  server.registerTool(
    "submit_evidence",
    {
      description: "Either party. Adds a statement to an open dispute before the ruling.",
      inputSchema: z.object({ contract_id: contractId, statement: z.string().min(3).max(4000) }),
    },
    ({ contract_id, statement }) => run(() => submitEvidence(actor, contract_id, statement)),
  );

  server.registerTool(
    "request_ruling",
    {
      description: "Either party. Asks Verdict to rule on an open dispute now and settle escrow.",
      inputSchema: z.object({ contract_id: contractId }),
    },
    ({ contract_id }) => run(() => rule(actor, contract_id)),
  );

  server.registerTool(
    "get_ruling",
    {
      description: "Returns a contract's status, the reproduction results and the ruling, if any.",
      inputSchema: z.object({ contract_id: contractId }),
    },
    ({ contract_id }) =>
      run(async () => {
        const c = await getCaseFile(actor, contract_id);
        return {
          status: c.contract.status,
          reproduction: c.reproduction && {
            total: c.reproduction.total,
            passed: c.reproduction.passed,
            pass_rate: c.reproduction.pass_rate,
            by_check: c.reproduction.by_check,
          },
          ruling: c.ruling && {
            summary: c.ruling.summary,
            findings: c.ruling.findings,
            seller_amount: c.ruling.seller_amount,
            buyer_amount: c.ruling.buyer_amount,
          },
        };
      }),
  );

  server.registerTool(
    "list_contracts",
    { description: "Lists recent contracts this agent is a party to.", inputSchema: z.object({}) },
    () =>
      run(async () =>
        (await listContracts(actor)).map((c) => ({
          id: c.id,
          task: c.task,
          status: c.status,
          price_amount: c.price_amount,
          role: c.buyer_agent_id === agent.id ? "buyer" : "seller",
        })),
      ),
  );
}

const unauthorized = () =>
  Response.json(
    { error: "Missing or invalid agent API key. Send Authorization: Bearer vd_agent_…" },
    { status: 401, headers: { "WWW-Authenticate": 'Bearer realm="verdict"' } },
  );

async function handle(request: Request) {
  const key = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!looksLikeApiKey(key)) return unauthorized();
  if (!process.env.SUPABASE_SECRET_KEY) {
    return Response.json({ error: "Verdict is not configured on this server." }, { status: 503 });
  }
  const agent = await agentForApiKey(key);
  if (!agent) return unauthorized();

  const handler = createMcpHandler((server) => registerTools(server, agent), {
    serverInfo: { name: "verdict", version: "0.1.0" },
  });
  return handler(request);
}

export { handle as GET, handle as POST, handle as DELETE };
