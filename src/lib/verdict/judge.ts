import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { ROW_CHECK_LABELS, type Acceptance, type Finding, type Reproduction } from "./types";

export const JUDGE_MODEL = "claude-opus-5-5";

export type EvidenceItem = { label: string; party: string; kind: string; content: unknown };

const RulingSchema = z.object({
  summary: z.string().describe("One sentence stating the outcome, plain language."),
  findings: z
    .array(
      z.object({
        text: z.string().describe("One finding, a single sentence."),
        cites: z.array(z.string()).describe("Evidence labels supporting it, e.g. ['E2']."),
      }),
    )
    .min(1)
    .max(5),
});

const SYSTEM = `You are the judge in Verdict, an arbitration service for jobs one AI agent pays another to do.
You rule only on machine-checkable acceptance criteria. The reproduction evidence was produced by re-running the contract's checks against the seller's delivery; treat it as the primary fact. Statements from either party are claims, weigh them against the reproduction.
The payout split is computed from the contract's payout rule and is already decided; your job is to explain the ruling.
Write 2 to 4 findings. Each must be one sentence, specific (use the numbers), and cite the evidence labels it relies on. Do not invent facts that are not in the evidence.`;

type JudgeInput = {
  task: string;
  price: number;
  currency: string;
  acceptance: Acceptance;
  evidence: EvidenceItem[];
  reproduction: Reproduction;
  payout: { seller: number; buyer: number; meets: boolean };
};

/**
 * Asks Claude to explain the ruling with cited findings. Falls back to a
 * deterministic write-up when no API key is set or the call fails.
 */
export async function judge(input: JudgeInput): Promise<{ summary: string; findings: Finding[]; model: string }> {
  if (!process.env.ANTHROPIC_API_KEY) return fallbackRuling(input);

  try {
    // Explicit base URL so a stray ANTHROPIC_BASE_URL in the environment can't redirect the key.
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      baseURL: process.env.VERDICT_ANTHROPIC_BASE_URL ?? "https://api.anthropic.com",
    });
    const response = await client.messages.parse({
      model: JUDGE_MODEL,
      max_tokens: 4000,
      output_config: { effort: "low", format: zodOutputFormat(RulingSchema) },
      system: SYSTEM,
      messages: [{ role: "user", content: renderCase(input) }],
    });
    if (response.stop_reason === "refusal" || !response.parsed_output) return fallbackRuling(input);
    return { ...response.parsed_output, model: JUDGE_MODEL };
  } catch (error) {
    console.error("[judge] falling back to rules-only ruling:", error instanceof Error ? error.message : error);
    return fallbackRuling(input);
  }
}

function money(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount / 100);
}

function renderCase(input: JudgeInput) {
  const { acceptance, reproduction: r } = input;
  const checks = acceptance.row_checks.map((c) => `- ${c}: ${ROW_CHECK_LABELS[c]}`).join("\n");
  const evidence = input.evidence
    .map((e) => `[${e.label}] ${e.party} · ${e.kind}\n${JSON.stringify(e.content, null, 2)}`)
    .join("\n\n");
  return `CONTRACT
Task: ${input.task}
Price: ${money(input.price, input.currency)}
Acceptance: at least ${acceptance.min_rows} rows; at least ${Math.round(acceptance.min_pass_rate * 100)}% of rows must pass every check:
${checks}
Payout rule: full price if the delivery meets acceptance; otherwise the seller is paid pro rata for passing rows out of the rows required.

EVIDENCE
${evidence}

DECIDED PAYOUT (from the payout rule)
Seller: ${money(input.payout.seller, input.currency)} · Buyer refund: ${money(input.payout.buyer, input.currency)}
Delivery ${input.payout.meets ? "meets" : "does not meet"} acceptance (${r.passed}/${r.total} rows pass, ${(r.pass_rate * 100).toFixed(0)}%).

Write the ruling.`;
}

function fallbackRuling(input: JudgeInput) {
  const { reproduction: r, acceptance, payout } = input;
  const repro = input.evidence.find((e) => e.kind === "reproduction")?.label ?? "E1";
  const claim = input.evidence.find((e) => e.party === "buyer")?.label;
  const worst = Object.entries(r.by_check).sort((a, b) => b[1].failed - a[1].failed)[0];
  const findings: Finding[] = [
    {
      text: `${r.passed} of ${r.total} delivered rows pass every acceptance check on re-run (${(r.pass_rate * 100).toFixed(0)}%), against a required ${Math.round(acceptance.min_pass_rate * 100)}%.`,
      cites: [repro],
    },
  ];
  if (worst && worst[1].failed > 0) {
    findings.push({
      text: `${worst[1].failed} rows fail "${ROW_CHECK_LABELS[worst[0] as keyof typeof ROW_CHECK_LABELS]}".`,
      cites: [repro],
    });
  }
  if (claim) {
    findings.push({
      text: payout.meets
        ? "The buyer's claim is not supported by the reproduction."
        : "The reproduction supports the buyer's claim.",
      cites: [claim, repro],
    });
  }
  return {
    summary: payout.meets
      ? "Delivery meets the contract. Seller is paid in full."
      : payout.seller > 0
        ? "Partial delivery. Seller is paid for the rows that pass."
        : "Delivery fails the contract. Buyer is refunded in full.",
    findings,
    model: "rules-only",
  };
}
