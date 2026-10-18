import { z } from "zod";

export const ROW_CHECKS = ["email_syntax", "email_mx", "domain_matches_company"] as const;
export type RowCheck = (typeof ROW_CHECKS)[number];

export const ROW_CHECK_LABELS: Record<RowCheck, string> = {
  email_syntax: "Email is well-formed",
  email_mx: "Email domain accepts mail (MX record)",
  domain_matches_company: "Email domain matches the company domain",
};

/** Machine-checkable acceptance criteria agreed at contract time. */
export const AcceptanceSchema = z.object({
  min_rows: z.number().int().min(1),
  min_pass_rate: z.number().min(0).max(1),
  row_checks: z.array(z.enum(ROW_CHECKS)).min(1),
});
export type Acceptance = z.infer<typeof AcceptanceSchema>;

export const LeadRowSchema = z.object({
  name: z.string(),
  email: z.string(),
  company: z.string(),
  domain: z.string(),
});
export type LeadRow = z.infer<typeof LeadRowSchema>;

export const DeliveryPayloadSchema = z.object({
  rows: z.array(LeadRowSchema).max(5000),
});
export type DeliveryPayload = z.infer<typeof DeliveryPayloadSchema>;

export type ContractStatus =
  | "open"
  | "delivered"
  | "accepted"
  | "disputed"
  | "ruled"
  | "settled"
  | "cancelled";

export type Contract = {
  id: string;
  owner_id: string;
  buyer_agent_id: string;
  seller_agent_id: string;
  task: string;
  price_amount: number;
  currency: string;
  acceptance: Acceptance;
  payout_rule: string;
  deadline: string | null;
  status: ContractStatus;
  stripe_payment_intent_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Agent = {
  id: string;
  owner_id: string;
  name: string;
  role: "buyer" | "seller" | "both";
  created_at: string;
};

export type Reproduction = {
  runner: string;
  total: number;
  passed: number;
  failed: number;
  pass_rate: number;
  by_check: Record<string, { passed: number; failed: number }>;
  failures: { row: number; email: string; failed: RowCheck[] }[];
  duration_ms: number;
};

export type Finding = { text: string; cites: string[] };

export type Ruling = {
  id: string;
  dispute_id: string;
  summary: string;
  findings: Finding[];
  seller_amount: number;
  buyer_amount: number;
  model: string;
  duration_ms: number | null;
  created_at: string;
};
