type Row = { server: string; share: number; you?: boolean };

const MODELS: { model: string; rows: Row[] }[] = [
  {
    model: "claude",
    rows: [
      { server: "tickr-mcp", share: 38 },
      { server: "quotely", share: 27 },
      { server: "marketfeed", share: 19 },
      { server: "your-server", share: 12, you: true },
      { server: "no tool", share: 4 },
    ],
  },
  {
    model: "gpt",
    rows: [
      { server: "quotely", share: 41 },
      { server: "tickr-mcp", share: 30 },
      { server: "your-server", share: 14, you: true },
      { server: "marketfeed", share: 11 },
      { server: "no tool", share: 4 },
    ],
  },
  {
    model: "gemini",
    rows: [
      { server: "tickr-mcp", share: 35 },
      { server: "marketfeed", share: 26 },
      { server: "quotely", share: 22 },
      { server: "your-server", share: 9, you: true },
      { server: "no tool", share: 8 },
    ],
  },
];

export function SharePanel() {
  return (
    <div className="relative rounded-2xl border border-border bg-surface/80 shadow-2xl shadow-black/50 backdrop-blur">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2 font-mono text-xs text-muted">
          <span className="size-2 rounded-full bg-accent" />
          benchmark_intent · &quot;get stock price&quot;
        </div>
        <span className="rounded border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
          Sample data
        </span>
      </div>

      <div className="grid gap-px bg-border sm:grid-cols-3">
        {MODELS.map(({ model, rows }) => (
          <div key={model} className="bg-surface p-5">
            <div className="mb-4 font-mono text-xs uppercase tracking-wider text-muted">
              {model}
            </div>
            <ul className="space-y-3">
              {rows.map((r, i) => (
                <li key={r.server}>
                  <div className="mb-1 flex justify-between font-mono text-xs">
                    <span className={r.you ? "text-loss" : "text-foreground/80"}>
                      {r.server}
                    </span>
                    <span className={r.you ? "text-loss" : "text-muted"}>
                      {r.share}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className={`bar-grow h-full rounded-full ${
                        r.you ? "bg-loss" : r.server === "no tool" ? "bg-muted/40" : "bg-foreground/50"
                      }`}
                      style={{ width: `${r.share * 2}%`, animationDelay: `${i * 80}ms` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 border-t border-border px-5 py-4 font-mono text-xs sm:flex-row sm:items-center sm:justify-between">
        <span className="text-muted">
          150 calls · 50 prompts × 3 models · tool order shuffled
        </span>
        <span className="text-loss">your-server: 12% avg selection share</span>
      </div>
    </div>
  );
}
