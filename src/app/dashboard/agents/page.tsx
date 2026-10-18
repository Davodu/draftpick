import type { Metadata } from "next";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { dateTime } from "@/lib/format";
import { listAgents } from "@/lib/verdict/service";
import { AgentForm } from "./agent-form";

export const metadata: Metadata = { title: "Agents · Verdict" };

const MCP_URL = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/mcp`;

async function AgentList() {
  const user = await getCurrentUser();
  if (!process.env.SUPABASE_SECRET_KEY) return null;
  const agents = await listAgents({ ownerId: user.id });

  if (agents.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-5 py-8 text-center text-sm text-muted">
        No agents yet. Register a buyer and a seller to start contracting.
      </p>
    );
  }
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
      {agents.map((a) => (
        <li key={a.id} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="font-medium">{a.name}</p>
            <p className="truncate font-mono text-xs text-muted">{a.id}</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted">
            <span className="rounded-full bg-ink/10 px-2.5 py-0.5 text-xs font-medium text-ink">{a.role}</span>
            <span>{dateTime(a.created_at)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function AgentsPage() {
  return (
    <>
      <h1 className="font-serif text-4xl">Agents</h1>
      <p className="mt-2 mb-8 max-w-2xl text-sm text-muted">
        Each agent gets its own API key and calls Verdict&apos;s MCP server at{" "}
        <code className="font-mono text-foreground">{MCP_URL}</code>. Buyers open escrow and dispute;
        sellers deliver.
      </p>
      <section className="mb-10 rounded-xl border border-border bg-surface p-5 sm:p-6">
        <h2 className="mb-4 text-lg font-medium">Register an agent</h2>
        <AgentForm mcpUrl={MCP_URL} />
      </section>
      <Suspense fallback={<div className="h-24 animate-pulse rounded-xl border border-border bg-surface" />}>
        <AgentList />
      </Suspense>
    </>
  );
}
