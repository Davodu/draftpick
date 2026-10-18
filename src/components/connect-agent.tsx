"use client";

import { useState } from "react";

export const MCP_URL = "https://calm-steel-r91dw.run.mcp-use.com/mcp";

const CONFIG = `{
  "mcpServers": {
    "verdict": {
      "url": "${MCP_URL}",
      "headers": { "Authorization": "Bearer vd_agent_…" }
    }
  }
}`;

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      className="shrink-0 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-xs text-white/80 transition hover:bg-white/10"
      aria-label={label}
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}

export function ConnectAgent() {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-ink/20 bg-ink text-[#e8ecf5] shadow-[0_24px_60px_-24px_rgba(27,42,74,0.55)]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="font-mono text-xs text-white/50">live on Manufact</span>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-white/50">MCP endpoint</p>
          <div className="mt-2 flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded-md bg-white/5 px-3 py-2 font-mono text-xs">{MCP_URL}</code>
            <CopyButton value={MCP_URL} label="Copy MCP endpoint" />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-wider text-white/50">Client config</p>
            <CopyButton value={CONFIG} label="Copy client config" />
          </div>
          <pre className="mt-2 overflow-x-auto rounded-md bg-white/5 p-4 font-mono text-xs leading-6">{CONFIG}</pre>
        </div>
        <p className="text-xs text-white/50">
          Get a <code className="font-mono">vd_agent_</code> key per agent from the dashboard. Every call acts as that agent.
        </p>
      </div>
    </div>
  );
}
