import { error, getRequestContext, MCPServer, text } from "mcp-use/server";
import { z } from "zod";

/**
 * Verdict's MCP server, built with mcp-use and deployed on Manufact.
 *
 * Each agent connects with its own Verdict API key (Authorization: Bearer vd_agent_…).
 * Tools forward the call, with that key, to the Verdict app's JSON tool endpoint,
 * so business logic, escrow and rulings live in one place.
 */

const VERDICT_API_URL = (process.env.VERDICT_API_URL ?? "http://localhost:3000").replace(/\/$/, "");

const server = new MCPServer({
  name: "verdict",
  version: "0.2.0",
  description:
    "The dispute layer for agent-to-agent commerce: escrow on Stripe, re-run acceptance checks, and a ruling with a payout split in seconds.",
});

async function forward(tool: string, args: unknown) {
  const auth = getRequestContext()?.req.header("authorization");
  if (!auth) {
    return error("Missing agent API key. Connect with the header Authorization: Bearer vd_agent_…");
  }
  const res = await fetch(`${VERDICT_API_URL}/api/agent/tools/${tool}`, {
    method: "POST",
    headers: { authorization: auth, "content-type": "application/json" },
    body: JSON.stringify(args ?? {}),
  });
  const body = await res.json().catch(() => ({ error: `Verdict returned ${res.status}` }));
  if (!res.ok) return error(typeof body.error === "string" ? body.error : JSON.stringify(body));
  return text(JSON.stringify(body, null, 2));
}

const contractId = z.string().uuid().describe("Contract id returned by open_escrow");

const Acceptance = z.object({
  min_rows: z.number().int().min(1).describe("Minimum number of rows the seller must deliver"),
  min_pass_rate: z.number().min(0).max(1).describe("Share of rows that must pass every check, 0–1"),
  row_checks: z
    .array(z.enum(["email_syntax", "email_mx", "domain_matches_company"]))
    .min(1)
    .describe("Checks Verdict re-runs on every delivered row"),
});

const LeadRow = z.object({
  name: z.string(),
  email: z.string(),
  company: z.string(),
  domain: z.string(),
});

const tools: { name: string; description: string; schema: z.ZodObject }[] = [
  {
    name: "whoami",
    description: "Returns the calling agent and the other agents it can contract with.",
    schema: z.object({}),
  },
  {
    name: "open_escrow",
    description:
      "Buyer only. Opens a contract with a seller agent and places the price on a Stripe authorization hold. Acceptance criteria must be machine-checkable.",
    schema: z.object({
      seller_agent_id: z.string().uuid(),
      task: z.string().min(3).max(500),
      price_amount: z.number().int().min(50).describe("Price in cents"),
      currency: z.string().length(3).default("usd"),
      acceptance: Acceptance,
      deadline: z.string().datetime().optional(),
    }),
  },
  {
    name: "deliver",
    description: "Seller only. Submits the delivered rows for a contract.",
    schema: z.object({ contract_id: contractId, rows: z.array(LeadRow).min(1).max(5000) }),
  },
  {
    name: "accept_delivery",
    description: "Buyer only. Accepts the delivery and releases the full price to the seller.",
    schema: z.object({ contract_id: contractId }),
  },
  {
    name: "file_dispute",
    description:
      "Buyer only. Disputes a delivery. By default Verdict re-runs the acceptance checks in a sandbox, rules and settles immediately; set rule_now=false to let the seller submit evidence first.",
    schema: z.object({
      contract_id: contractId,
      reason: z.string().min(3).max(2000),
      rule_now: z.boolean().default(true),
    }),
  },
  {
    name: "submit_evidence",
    description: "Either party. Adds a statement to an open dispute before the ruling.",
    schema: z.object({ contract_id: contractId, statement: z.string().min(3).max(4000) }),
  },
  {
    name: "request_ruling",
    description: "Either party. Asks Verdict to rule on an open dispute now and settle escrow.",
    schema: z.object({ contract_id: contractId }),
  },
  {
    name: "get_ruling",
    description: "Returns a contract's status, the reproduction results and the ruling, if any.",
    schema: z.object({ contract_id: contractId }),
  },
  {
    name: "list_contracts",
    description: "Lists recent contracts this agent is a party to.",
    schema: z.object({}),
  },
];

for (const t of tools) {
  server.tool({ name: t.name, description: t.description, schema: t.schema }, async (args) => forward(t.name, args));
}

server.listen();
