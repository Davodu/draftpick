import "server-only";
import { promises as dns } from "node:dns";
import type { Acceptance, LeadRow, Reproduction, RowCheck } from "./types";

/**
 * Re-runs the contract's acceptance checks against the delivered rows.
 * Runs in-process today; the interface is the seam for an isolated sandbox runner.
 */
export async function reproduce(rows: LeadRow[], acceptance: Acceptance): Promise<Reproduction> {
  const started = Date.now();
  const mx = new Map<string, Promise<boolean>>();
  const hasMx = (domain: string) => {
    if (!mx.has(domain)) mx.set(domain, lookupMx(domain));
    return mx.get(domain)!;
  };

  const byCheck: Reproduction["by_check"] = Object.fromEntries(
    acceptance.row_checks.map((c) => [c, { passed: 0, failed: 0 }]),
  );
  const failures: Reproduction["failures"] = [];
  let passed = 0;

  await Promise.all(
    rows.map(async (row, i) => {
      const failed: RowCheck[] = [];
      for (const check of acceptance.row_checks) {
        const ok = await runCheck(check, row, hasMx);
        byCheck[check][ok ? "passed" : "failed"]++;
        if (!ok) failed.push(check);
      }
      if (failed.length === 0) passed++;
      else failures.push({ row: i + 1, email: row.email, failed });
    }),
  );

  failures.sort((a, b) => a.row - b.row);
  const total = rows.length;
  return {
    runner: "in-process",
    total,
    passed,
    failed: total - passed,
    pass_rate: total ? passed / total : 0,
    by_check: byCheck,
    failures,
    duration_ms: Date.now() - started,
  };
}

const EMAIL_RE = /^[^\s@]+@([a-z0-9-]+\.)+[a-z]{2,}$/i;

async function runCheck(
  check: RowCheck,
  row: LeadRow,
  hasMx: (domain: string) => Promise<boolean>,
): Promise<boolean> {
  const domain = row.email.split("@")[1]?.toLowerCase() ?? "";
  switch (check) {
    case "email_syntax":
      return EMAIL_RE.test(row.email);
    case "email_mx":
      return EMAIL_RE.test(row.email) && hasMx(domain);
    case "domain_matches_company":
      return domain === row.domain.toLowerCase().replace(/^www\./, "");
  }
}

async function lookupMx(domain: string): Promise<boolean> {
  try {
    const records = await Promise.race([
      dns.resolveMx(domain),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), 4000)),
    ]);
    return records.some((r) => r.exchange && r.exchange !== ".");
  } catch {
    return false;
  }
}

/**
 * Payout rule "pro_rata_on_pass": full price if the delivery meets the contract,
 * otherwise the seller is paid for the rows that pass, out of the rows required.
 */
export function payoutFor(
  price: number,
  acceptance: Acceptance,
  result: Pick<Reproduction, "total" | "passed" | "pass_rate">,
) {
  const meets = result.total >= acceptance.min_rows && result.pass_rate >= acceptance.min_pass_rate;
  const seller = meets
    ? price
    : Math.floor((price * Math.min(result.passed, acceptance.min_rows)) / acceptance.min_rows);
  return { seller, buyer: price - seller, meets };
}
