import "server-only";
import { z } from "zod";
import {
  acceptDelivery,
  deliver,
  fileDispute,
  getCaseFile,
  listAgents,
  listContracts,
  openEscrow,
  rule,
  submitEvidence,
  type Actor,
  VerdictError,
} from "./service";
import { AcceptanceSchema, LeadRowSchema, type Agent } from "./types";

/**
 * The agent-facing tools, defined once. Served over MCP at /api/mcp and as
 * plain JSON at /api/agent/tools/:name (which the Manufact-hosted MCP server calls).
 */

const contractId = z.string().uuid().describe("Contract id returned by open_escrow");

type ToolDef<S extends z.ZodObject = z.ZodObject> = {
  description: string;
  input: S;
  run: (agent: Agent, actor: Actor, args: z.infer<S>) => Promise<unknown>;
};

const tool = <S extends z.ZodObject>(def: ToolDef<S>) => def;

export const TOOLS = {
  whoami: tool({
    description: "Returns the calling agent and the other agents it can contract with.",
    input: z.object({}),
    run: async (agent, actor) => ({
      agent: { id: agent.id, name: agent.name, role: agent.role },
      counterparties: (await listAgents(actor))
        .filter((a) => a.id !== agent.id)
        .map((a) => ({ id: a.id, name: a.name, role: a.role })),
    }),
  }),

  open_escrow: tool({
    description:
      "Buyer only. Opens a contract with a seller agent and places the price on a Stripe authorization hold. Acceptance criteria must be machine-checkable.",
    input: z.object({
      seller_agent_id: z.string().uuid(),
      task: z.string().min(3).max(500),
      price_amount: z.number().int().min(50).describe("Price in cents"),
      currency: z.string().length(3).default("usd"),
      acceptance: AcceptanceSchema,
      deadline: z.string().datetime().optional(),
    }),
    run: async (_agent, actor, input) => {
      const c = await openEscrow(actor, {
        sellerAgentId: input.seller_agent_id,
        task: input.task,
        priceAmount: input.price_amount,
        currency: input.currency,
        acceptance: input.acceptance,
        deadline: input.deadline,
      });
      return { contract_id: c.id, status: c.status, escrow: c.stripe_payment_intent_id };
    },
  }),

  deliver: tool({
    description: "Seller only. Submits the delivered rows for a contract.",
    input: z.object({ contract_id: contractId, rows: z.array(LeadRowSchema).min(1).max(5000) }),
    run: async (_agent, actor, { contract_id, rows }) => ({
      status: (await deliver(actor, contract_id, { rows })).status,
    }),
  }),

  accept_delivery: tool({
    description: "Buyer only. Accepts the delivery and releases the full price to the seller.",
    input: z.object({ contract_id: contractId }),
    run: async (_agent, actor, { contract_id }) => ({
      status: (await acceptDelivery(actor, contract_id)).status,
    }),
  }),

  file_dispute: tool({
    description:
      "Buyer only. Disputes a delivery. By default Verdict re-runs the acceptance checks, rules and settles immediately; set rule_now=false to let the seller submit evidence first.",
    input: z.object({
      contract_id: contractId,
      reason: z.string().min(3).max(2000),
      rule_now: z.boolean().default(true),
    }),
    run: (_agent, actor, { contract_id, reason, rule_now }) =>
      fileDispute(actor, contract_id, { reason, ruleNow: rule_now }),
  }),

  submit_evidence: tool({
    description: "Either party. Adds a statement to an open dispute before the ruling.",
    input: z.object({ contract_id: contractId, statement: z.string().min(3).max(4000) }),
    run: (_agent, actor, { contract_id, statement }) => submitEvidence(actor, contract_id, statement),
  }),

  request_ruling: tool({
    description: "Either party. Asks Verdict to rule on an open dispute now and settle escrow.",
    input: z.object({ contract_id: contractId }),
    run: (_agent, actor, { contract_id }) => rule(actor, contract_id),
  }),

  get_ruling: tool({
    description: "Returns a contract's status, the reproduction results and the ruling, if any.",
    input: z.object({ contract_id: contractId }),
    run: async (_agent, actor, { contract_id }) => {
      const c = await getCaseFile(actor, contract_id);
      return {
        status: c.contract.status,
        reproduction: c.reproduction && {
          runner: c.reproduction.runner,
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
          model: c.ruling.model,
        },
      };
    },
  }),

  list_contracts: tool({
    description: "Lists recent contracts this agent is a party to.",
    input: z.object({}),
    run: async (agent, actor) =>
      (await listContracts(actor)).map((c) => ({
        id: c.id,
        task: c.task,
        status: c.status,
        price_amount: c.price_amount,
        role: c.buyer_agent_id === agent.id ? "buyer" : "seller",
      })),
  }),
} satisfies Record<string, ToolDef<z.ZodObject>>;

export type ToolName = keyof typeof TOOLS;
export const isToolName = (name: string): name is ToolName => Object.hasOwn(TOOLS, name);

/** Validates args and runs a tool as the given agent. Throws ZodError or VerdictError. */
export async function runTool(agent: Agent, name: ToolName, rawArgs: unknown) {
  const def = TOOLS[name] as ToolDef;
  const args = def.input.parse(rawArgs ?? {});
  return def.run(agent, { ownerId: agent.owner_id, agentId: agent.id }, args);
}

/** Runs a tool and maps expected failures to a message the agent can act on. */
export async function callTool(agent: Agent, name: ToolName, args: unknown) {
  try {
    return { ok: true as const, result: await runTool(agent, name, args) };
  } catch (error) {
    if (error instanceof VerdictError || error instanceof z.ZodError) {
      return { ok: false as const, error: error.message };
    }
    console.error(`[tool ${name}]`, error);
    return { ok: false as const, error: "Internal error" };
  }
}
