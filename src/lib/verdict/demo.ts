import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { acceptDelivery, deliver, fileDispute, openEscrow, type Actor } from "./service";
import type { Acceptance, LeadRow } from "./types";

/**
 * The demo job from the pitch: a buyer agent pays $5 for 100 verified company
 * emails; the seller delivers 100 rows, 40 of which fail verification.
 */

export const DEMO_ACCEPTANCE: Acceptance = {
  min_rows: 100,
  min_pass_rate: 0.95,
  row_checks: ["email_syntax", "email_mx", "domain_matches_company"],
};

export const DEMO_TASK = "100 verified company emails, B2B SaaS, US";

const FIRST = ["Ava", "Ben", "Chloe", "Dev", "Ella", "Femi", "Grace", "Hugo", "Isla", "Jon"];
const LAST = ["Park", "Okafor", "Nguyen", "Silva", "Cohen", "Haddad", "Lind", "Mehta", "Ross", "Tanaka"];

// Real companies whose domains publish MX records.
const GOOD = [
  ["Stripe", "stripe.com"],
  ["GitHub", "github.com"],
  ["Figma", "figma.com"],
  ["Linear", "linear.app"],
  ["Vercel", "vercel.com"],
  ["Airtable", "airtable.com"],
];
// Fabricated companies whose domains don't exist, so the MX check fails.
const FAKE = [
  ["Brightlane Analytics", "brightlane-analytics.com"],
  ["Quorvex Labs", "quorvex-labs.com"],
  ["Halvenly Data", "halvenly-data.com"],
  ["Trevalix Systems", "trevalix-systems.com"],
  ["Nimbrook AI", "nimbrook-ai.com"],
];

function person(i: number) {
  const first = FIRST[i % FIRST.length];
  const last = LAST[Math.floor(i / FIRST.length) % LAST.length];
  return { name: `${first} ${last}`, local: `${first}.${last}`.toLowerCase() };
}

export function demoDelivery(): LeadRow[] {
  const rows: LeadRow[] = [];
  let i = 0;
  // 60 good rows
  for (const [company, domain] of GOOD) {
    for (let k = 0; k < 10; k++, i++) {
      const p = person(i);
      rows.push({ name: p.name, email: `${p.local}@${domain}`, company, domain });
    }
  }
  // 25 rows on domains that don't exist
  for (const [company, domain] of FAKE) {
    for (let k = 0; k < 5; k++, i++) {
      const p = person(i);
      rows.push({ name: p.name, email: `${p.local}@${domain}`, company, domain });
    }
  }
  // 15 rows whose email domain doesn't match the company
  for (let k = 0; k < 15; k++, i++) {
    const p = person(i);
    const [company, domain] = GOOD[k % GOOD.length];
    const [, wrong] = GOOD[(k + 1) % GOOD.length];
    rows.push({ name: p.name, email: `${p.local}@${wrong}`, company, domain });
  }
  // Interleave so failures aren't all at the end.
  return rows.map((r, idx) => ({ r, key: (idx * 37) % rows.length })).sort((a, b) => a.key - b.key).map((x) => x.r);
}

async function ensureDemoAgents(ownerId: string) {
  const db = createAdminClient();
  const ids: Record<"buyer" | "seller", string> = { buyer: "", seller: "" };
  for (const role of ["buyer", "seller"] as const) {
    const name = `demo-${role}`;
    const { data } = await db
      .from("agents")
      .select("id")
      .eq("owner_id", ownerId)
      .eq("name", name)
      .maybeSingle<{ id: string }>();
    if (data) {
      ids[role] = data.id;
      continue;
    }
    const created = await db
      .from("agents")
      .insert({ owner_id: ownerId, name, role })
      .select("id")
      .single<{ id: string }>();
    if (created.error) throw new Error(created.error.message);
    ids[role] = created.data.id;
  }
  return ids;
}

/** Runs the full scenario. `outcome` picks the disputed path or the happy path. */
export async function runDemo(ownerId: string, outcome: "dispute" | "accept" = "dispute") {
  const agents = await ensureDemoAgents(ownerId);
  const buyer: Actor = { ownerId, agentId: agents.buyer };
  const seller: Actor = { ownerId, agentId: agents.seller };

  const contract = await openEscrow(buyer, {
    sellerAgentId: agents.seller,
    task: DEMO_TASK,
    priceAmount: 500,
    acceptance: DEMO_ACCEPTANCE,
  });

  const rows = demoDelivery();
  await deliver(seller, contract.id, {
    rows: outcome === "accept" ? rows.filter((r) => !r.domain.includes("-")) : rows,
  });

  if (outcome === "accept") {
    await acceptDelivery(buyer, contract.id);
  } else {
    await fileDispute(buyer, contract.id, {
      reason: "Most of these bounce. A lot of the companies don't seem to exist.",
    });
  }
  return contract.id;
}
