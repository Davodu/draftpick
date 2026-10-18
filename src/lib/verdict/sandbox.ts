import "server-only";
import { randomUUID } from "node:crypto";
import type { Acceptance, LeadRow, Reproduction } from "./types";

/**
 * Runs the acceptance checks inside a Blaxel sandbox (an isolated microVM), so the
 * disputed work is re-executed away from Verdict's own servers. One named sandbox
 * is reused; Blaxel suspends it to zero when idle and resumes it in milliseconds.
 *
 * Configured with BL_WORKSPACE and BL_API_KEY (read by the Blaxel SDK).
 */

export const blaxelConfigured = () => Boolean(process.env.BL_WORKSPACE && process.env.BL_API_KEY);

const SANDBOX_NAME = process.env.VERDICT_SANDBOX_NAME ?? "verdict-reproduce";
const IMAGE = "blaxel/node:latest";

// Standalone checker executed with Node inside the sandbox. Mirrors checks.ts.
const CHECKER = `
import { readFileSync } from "node:fs";
import { promises as dns } from "node:dns";
const { rows, acceptance } = JSON.parse(readFileSync(process.argv[2], "utf8"));
const started = Date.now();
const EMAIL_RE = /^[^\\s@]+@([a-z0-9-]+\\.)+[a-z]{2,}$/i;
const mx = new Map();
const hasMx = (d) => {
  if (!mx.has(d)) mx.set(d, Promise.race([dns.resolveMx(d), new Promise((_, r) => setTimeout(() => r(new Error("timeout")), 4000))])
    .then((recs) => recs.some((x) => x.exchange && x.exchange !== ".")).catch(() => false));
  return mx.get(d);
};
async function check(c, row) {
  const domain = (row.email.split("@")[1] || "").toLowerCase();
  if (c === "email_syntax") return EMAIL_RE.test(row.email);
  if (c === "email_mx") return EMAIL_RE.test(row.email) && (await hasMx(domain));
  if (c === "domain_matches_company") return domain === row.domain.toLowerCase().replace(/^www\\./, "");
  return false;
}
const by_check = Object.fromEntries(acceptance.row_checks.map((c) => [c, { passed: 0, failed: 0 }]));
const failures = [];
let passed = 0;
await Promise.all(rows.map(async (row, i) => {
  const failed = [];
  for (const c of acceptance.row_checks) {
    const ok = await check(c, row);
    by_check[c][ok ? "passed" : "failed"]++;
    if (!ok) failed.push(c);
  }
  if (failed.length === 0) passed++; else failures.push({ row: i + 1, email: row.email, failed });
}));
failures.sort((a, b) => a.row - b.row);
const total = rows.length;
console.log(JSON.stringify({ total, passed, failed: total - passed, pass_rate: total ? passed / total : 0, by_check, failures, duration_ms: Date.now() - started }));
`;

export async function reproduceInSandbox(rows: LeadRow[], acceptance: Acceptance): Promise<Reproduction> {
  const started = Date.now();
  const { SandboxInstance } = await import("@blaxel/core");

  const sandbox = await SandboxInstance.createIfNotExists({
    name: SANDBOX_NAME,
    image: IMAGE,
    memory: 2048,
    labels: { app: "verdict", purpose: "reproduction" },
  });

  const dir = `/tmp/verdict/${randomUUID()}`;
  await sandbox.fs.write(`${dir}/checker.mjs`, CHECKER);
  await sandbox.fs.write(`${dir}/input.json`, JSON.stringify({ rows, acceptance }));

  const run = await sandbox.process.exec({
    command: `node ${dir}/checker.mjs ${dir}/input.json`,
    workingDir: dir,
    waitForCompletion: true,
  });
  const { exitCode, stdout, stderr } = run as { exitCode: number; stdout: string; stderr: string };
  if (exitCode !== 0) throw new Error(`Checker exited ${exitCode}: ${stderr.slice(0, 500)}`);

  const result = JSON.parse(stdout.trim().split("\n").pop()!);
  return {
    ...result,
    runner: `blaxel:${SANDBOX_NAME}`,
    // Wall time including sandbox resume and file transfer, which is what the ruling waits on.
    duration_ms: Date.now() - started,
  };
}
