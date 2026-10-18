import { ReportForm } from "@/components/report-form";
import { SharePanel } from "@/components/share-panel";

function Logo() {
  return (
    <a href="#" className="flex items-center gap-2 font-semibold tracking-tight">
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
        <rect x="2" y="13" width="4" height="9" rx="1" fill="var(--muted)" />
        <rect x="10" y="8" width="4" height="14" rx="1" fill="var(--muted)" />
        <rect x="18" y="2" width="4" height="20" rx="1" fill="var(--accent)" />
      </svg>
      draftpick
    </a>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <div className="hidden items-center gap-8 text-sm text-muted md:flex">
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#tools" className="hover:text-foreground">MCP tools</a>
          <a href="#method" className="hover:text-foreground">Method</a>
        </div>
        <a
          href="#report"
          className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:bg-accent"
        >
          Free report
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--accent), transparent)" }}
      />
      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-muted">
            <span className="size-1.5 rounded-full bg-accent" />
            Selection share for MCP servers
          </div>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            Search Console for <span className="text-accent">AI agents</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted">
            See how often ChatGPT, Claude and Gemini pick your MCP tool over a
            competitor&apos;s, why you lose, and the rewrite that wins it back.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#report"
              className="w-full rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition hover:brightness-110 sm:w-auto"
            >
              Get your free report
            </a>
            <a
              href="#how"
              className="w-full rounded-lg border border-border px-6 py-3 text-sm font-medium transition hover:border-foreground/40 sm:w-auto"
            >
              See how it works
            </a>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <SharePanel />
        </div>
      </div>
    </section>
  );
}

function ModelStrip() {
  const models = ["Claude", "GPT", "Gemini", "Cursor"];
  return (
    <section className="border-y border-border bg-surface/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:justify-between sm:px-6">
        <span className="font-mono text-xs uppercase tracking-wider text-muted">
          Benchmarked across
        </span>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-2 text-sm font-medium text-foreground/70">
          {models.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Problem() {
  const pains = [
    {
      title: "You can't see the calls you lose",
      body: "When an agent picks a competitor's tool, your server never hears about it.",
    },
    {
      title: "Models change under you",
      body: "A new GPT, Claude or Gemini release can shift your share overnight, silently.",
    },
    {
      title: "Tool copy is written blind",
      body: "Models choose from names, descriptions and schemas. Nobody tests them against rivals.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="max-w-3xl">
        <p className="font-mono text-sm text-accent">The problem</p>
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          43,000+ MCP servers. When an agent needs a stock price, which one does it call?
        </h2>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {pains.map((p) => (
          <div key={p.title} className="rounded-xl border border-border bg-surface p-6">
            <h3 className="font-medium">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function InsideOut() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">
            Server analytics · inside-out
          </p>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight">
            Shows how agents use your product.
          </h3>
          <p className="mt-3 text-muted">
            Great for the calls you won. Blind to every request that went somewhere else.
          </p>
          <div className="mt-8 flex items-end gap-2" aria-hidden>
            {[30, 45, 38, 52].map((h, i) => (
              <div key={i} className="max-w-8 flex-1 rounded-t bg-foreground/30" style={{ height: h }} />
            ))}
            {[48, 60, 55, 70].map((h, i) => (
              <div
                key={`g${i}`}
                className="max-w-8 flex-1 rounded-t border border-dashed border-border"
                style={{ height: h }}
              />
            ))}
          </div>
          <p className="mt-3 font-mono text-xs text-muted">won calls · lost calls (invisible)</p>
        </div>
        <div className="rounded-2xl border border-accent/30 bg-gradient-to-b from-accent/[0.07] to-surface p-6 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-wider text-accent">
            Draftpick · outside-in
          </p>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight">
            Shows which product agents choose.
          </h3>
          <p className="mt-3 text-muted">
            We run real prompts against you and your competitors, side by side, and
            count every pick. Including the ones you never saw.
          </p>
          <div className="mt-8 flex items-end gap-2" aria-hidden>
            {[30, 45, 38, 52].map((h, i) => (
              <div key={i} className="max-w-8 flex-1 rounded-t bg-accent" style={{ height: h }} />
            ))}
            {[48, 60, 55, 70].map((h, i) => (
              <div key={`g${i}`} className="max-w-8 flex-1 rounded-t bg-loss/70" style={{ height: h }} />
            ))}
          </div>
          <p className="mt-3 font-mono text-xs text-muted">won calls · lost calls (measured)</p>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      name: "Benchmark",
      body: "We pull every competitor's tools live from their servers, then send 50+ real prompts per intent to each model with all tools installed.",
      out: (
        <>
          <span className="text-muted">share</span> your-server{" "}
          <span className="text-loss">12%</span>
          {"\n"}
          <span className="text-muted">winner</span> tickr-mcp{" "}
          <span className="text-accent">38%</span>
        </>
      ),
    },
    {
      n: "02",
      name: "Diagnose",
      body: "We explain each loss: vague description, name clash, heavy schema, wrong tool inside your server, or bad arguments.",
      out: (
        <>
          <span className="text-loss">✕</span> never says &quot;real-time quote&quot;
          {"\n"}
          <span className="text-loss">✕</span> 14 required params vs 1
        </>
      ),
    },
    {
      n: "03",
      name: "Rewrite",
      body: "We suggest new names, descriptions and parameter docs, then re-run the benchmark on the variant. Your live server stays untouched.",
      out: (
        <>
          <span className="text-muted">baseline</span> 12%{"  "}
          <span className="text-accent">→ 41%</span>
          {"\n"}
          <span className="text-muted">variant</span> v2 · ready to ship
        </>
      ),
    },
  ];
  return (
    <section id="how" className="scroll-mt-20 border-t border-border bg-surface/30">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <p className="font-mono text-sm text-accent">How it works</p>
        <h2 className="mt-3 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Measure. Explain. Win it back.
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="flex flex-col rounded-xl border border-border bg-surface p-6">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm text-accent">{s.n}</span>
                <h3 className="text-lg font-medium">{s.name}</h3>
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{s.body}</p>
              <pre className="mt-6 whitespace-pre-wrap rounded-lg border border-border bg-background p-4 font-mono text-xs leading-6">
                {s.out}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tools() {
  const tools = [
    {
      name: "benchmark_intent",
      args: "intent, server_ids[], models[], prompts, runs",
      desc: "Selection share per server per model, the overall winner and a benchmark_id.",
    },
    {
      name: "diagnose",
      args: "benchmark_id, server_id",
      desc: "Why the server lost, with the example prompts behind each reason.",
    },
    {
      name: "suggest_rewrite",
      args: "benchmark_id, server_id",
      desc: "Rewritten names, descriptions and params, plus a variant_id to re-benchmark.",
    },
  ];
  return (
    <section id="tools" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        <div>
          <p className="font-mono text-sm text-accent">Draftpick is an MCP server</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Ask your agent why it isn&apos;t picking you.
          </h2>
          <p className="mt-4 text-muted">
            Connect Draftpick to Claude, ChatGPT or Cursor and run benchmarks, diagnoses
            and rewrites right from the chat. Three tools, nothing to install.
          </p>
          <ul className="mt-8 space-y-4">
            {tools.map((t) => (
              <li key={t.name} className="rounded-xl border border-border bg-surface p-5">
                <code className="font-mono text-sm text-accent">{t.name}</code>
                <span className="font-mono text-xs text-muted">({t.args})</span>
                <p className="mt-2 text-sm text-muted">{t.desc}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-surface lg:sticky lg:top-24">
          <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
            <span className="size-2.5 rounded-full bg-surface-2" />
            <span className="size-2.5 rounded-full bg-surface-2" />
            <span className="size-2.5 rounded-full bg-surface-2" />
            <span className="ml-3 font-mono text-xs text-muted">claude · draftpick connected</span>
          </div>
          <div className="space-y-5 p-5 text-sm">
            <div className="ml-auto max-w-[85%] rounded-xl bg-surface-2 px-4 py-3">
              Why does Claude keep picking tickr-mcp over us for stock quotes?
            </div>
            <div className="rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs text-muted">
              → diagnose(benchmark_id: &quot;b_7f3a&quot;, server_id: &quot;your-server&quot;)
            </div>
            <div className="space-y-3 leading-relaxed">
              <p>You lost 44 of 50 prompts to tickr-mcp. Three reasons:</p>
              <ol className="list-decimal space-y-2 pl-5 text-muted">
                <li>
                  <span className="text-foreground">Vague description.</span> Yours says
                  &quot;financial data utilities&quot;; theirs says &quot;real-time stock quote by
                  ticker&quot;.
                </li>
                <li>
                  <span className="text-foreground">Name clash.</span>{" "}
                  <code className="font-mono text-xs">get_data</code> is ambiguous next to{" "}
                  <code className="font-mono text-xs">get_quote</code>.
                </li>
                <li>
                  <span className="text-foreground">Heavy schema.</span> 6 required params for
                  a one-ticker lookup.
                </li>
              </ol>
              <p className="text-muted">Want me to draft a rewrite and re-run it?</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Method() {
  const rules = [
    ["Live tool definitions", "Every competitor's names and descriptions are pulled from their own server, never written by us."],
    ["Shuffled tool order", "Models favor position, so order is randomized on every call."],
    ["Neutral prefixes only", "Tools are namespaced by server id to avoid clashes. Descriptions stay exactly as published."],
    ["Same system prompt", "One neutral system prompt for every model, every run."],
    ["“No tool” is a result", "When a model answers without calling anything, we count it as its own bucket."],
    ["Repeated runs", "Several runs per prompt, re-run on model releases, reported with confidence intervals."],
  ];
  return (
    <section id="method" className="scroll-mt-20 border-t border-border bg-surface/30">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <p className="font-mono text-sm text-accent">Method</p>
        <h2 className="mt-3 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Fair by design, so the numbers hold up.
        </h2>
        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {rules.map(([title, body]) => (
            <div key={title} className="bg-surface p-6">
              <h3 className="font-medium">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section id="report" className="scroll-mt-20 mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-14 sm:px-14">
        <div
          className="pointer-events-none absolute -right-40 -top-40 size-[480px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(closest-side, var(--accent), transparent)" }}
        />
        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Find out your pick rate.
            </h2>
            <p className="mt-4 text-muted">
              A free, one-time selection-share snapshot for one intent across Claude, GPT
              and Gemini, against the servers you compete with.
            </p>
          </div>
          <ReportForm />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:px-6">
        <Logo />
        <p>The share of agent requests where a model picks your tool.</p>
        <p>© 2026 Draftpick</p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ModelStrip />
        <Problem />
        <InsideOut />
        <HowItWorks />
        <Tools />
        <Method />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
