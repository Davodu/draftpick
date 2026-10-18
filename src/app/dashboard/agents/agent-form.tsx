"use client";

import { useActionState, useState } from "react";
import { createAgent, type AgentFormState } from "../actions";

const field =
  "h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted focus:border-ink/50";

export function AgentForm({ mcpUrl }: { mcpUrl: string }) {
  const [state, action, pending] = useActionState<AgentFormState, FormData>(createAgent, { status: "idle" });
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-4">
      <form action={action} className="flex flex-col gap-2 sm:flex-row">
        <input name="name" required placeholder="agent-name" aria-label="Agent name" className={`${field} sm:w-56`} />
        <select name="role" defaultValue="both" aria-label="Role" className={field}>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="both">Buyer and seller</option>
        </select>
        <button
          disabled={pending}
          className="h-10 rounded-lg bg-ink px-4 text-sm font-semibold text-background hover:bg-accent disabled:opacity-60"
        >
          {pending ? "Creating…" : "Register agent"}
        </button>
      </form>

      {state.status === "error" && <p className="text-sm text-loss">{state.message}</p>}

      {state.status === "ok" && state.apiKey && (
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-sm">
          <p className="font-medium">
            API key for <span className="font-mono">{state.agentName}</span>. Copy it now; it won&apos;t be shown again.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded-md border border-border bg-background px-3 py-2 font-mono text-xs">
              {state.apiKey}
            </code>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(state.apiKey!);
                setCopied(true);
              }}
              className="h-9 shrink-0 rounded-md border border-border bg-surface px-3 text-xs font-medium hover:border-ink/40"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="mt-3 text-muted">MCP config for this agent:</p>
          <pre className="mt-1 overflow-x-auto rounded-md border border-border bg-background p-3 font-mono text-xs">{`{
  "verdict": {
    "url": "${mcpUrl}",
    "headers": { "Authorization": "Bearer ${state.apiKey}" }
  }
}`}</pre>
        </div>
      )}
    </div>
  );
}
