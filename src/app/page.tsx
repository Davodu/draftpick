import { PartnerForm } from "@/components/partner-form";
import { RulingPanel } from "@/components/ruling-panel";

function Logo() {
  return (
    <a href="#" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v17M7 20h10M4 7h16" stroke="var(--ink)" strokeWidth="1.5" />
        <path d="M4 7l-2.5 6a2.5 2.5 0 005 0L4 7z" stroke="var(--ink)" strokeWidth="1.3" />
        <path d="M20 7l-2.5 6a2.5 2.5 0 005 0L20 7z" stroke="var(--accent)" strokeWidth="1.3" />
      </svg>
      verdict
    </a>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <div className="hidden items-center gap-8 text-sm text-muted md:flex">
          <a href="#problem" className="hover:text-foreground">Why</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#developers" className="hover:text-foreground">Developers</a>
        </div>
        <a
          href="#early-access"
          className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-background transition hover:bg-accent"
        >
          <span className="sm:hidden">Join</span>
          <span className="hidden sm:inline">Get early access</span>
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="ruled-bg pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-muted">
            <span className="size-1.5 rounded-full bg-accent" />
            The dispute layer for agent-to-agent commerce
          </div>
          <h1 className="text-balance font-serif text-5xl leading-[1.05] tracking-tight sm:text-7xl">
            Cards have chargebacks. Machine payments have <em className="text-ink">nothing</em>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted">
            When one agent pays another for work and gets junk back, Verdict holds the
            funds, re-runs the work, and rules on the split in seconds. Escrow and payout
            run on Stripe.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#early-access"
              className="w-full rounded-lg bg-ink px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent sm:w-auto"
            >
              Get early access
            </a>
            <a
              href="#how"
              className="w-full rounded-lg border border-border bg-surface px-6 py-3 text-sm font-medium transition hover:border-ink/40 sm:w-auto"
            >
              See how it works
            </a>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <RulingPanel />
          <p className="mt-4 text-center font-mono text-xs text-muted">
            Example: a buyer agent disputes a $5 data job. Verdict re-checks every row and splits the hold.
          </p>
        </div>
      </div>
    </section>
  );
}

function Problem() {
  const rows: [string, string, string][] = [
    ["Settlement", "Days, reversible", "Instant, final"],
    ["Bad delivery", "Chargeback through the issuer", "No mechanism"],
    ["Who decides", "Issuer, with evidence", "Nobody"],
  ];
  return (
    <section id="problem" className="scroll-mt-20 border-y border-border bg-surface/60">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="font-mono text-sm text-accent">The problem</p>
          <h2 className="mt-3 text-balance font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            When an agent pays for junk, the money is gone.
          </h2>
          <p className="mt-5 text-muted">
            Machine payments on x402 and stablecoin rails settle instantly, with no
            chargeback. If agent B delivers bad work, agent A has nothing to appeal to and
            no way to get paid back.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-surface text-sm">
          <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-border bg-surface-2/60 px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-muted sm:px-5">
            <span />
            <span>Cards</span>
            <span>Machine payments</span>
          </div>
          {rows.map(([k, cards, machine]) => (
            <div key={k} className="grid grid-cols-[1fr_1fr_1fr] gap-3 border-b border-border px-4 py-4 last:border-0 sm:px-5">
              <span className="text-muted">{k}</span>
              <span>{cards}</span>
              <span className="text-loss">{machine}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyNow() {
  const items = [
    {
      title: "Machine payments are live",
      body: "x402 is in production. Stripe and Tempo's MPP shipped in March 2026, with streaming payments in April.",
    },
    {
      title: "Agents now hire agents",
      body: "Agent-to-agent channels and agent marketplaces are live, so agents are buying work from each other.",
    },
    {
      title: "Volume is still small",
      body: "There's a window to set the dispute layer now, before it's needed at scale.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <p className="font-mono text-sm text-accent">Why now</p>
      <h2 className="mt-3 max-w-2xl text-balance font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
        Set the rules before the volume arrives.
      </h2>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {items.map((i, n) => (
          <div key={i.title} className="rounded-xl border border-border bg-surface p-6">
            <span className="font-serif text-2xl text-accent">{["I", "II", "III"][n]}</span>
            <h3 className="mt-2 text-lg font-medium">{i.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{i.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

type Step = { name: string; who: string; verdict?: boolean };

function Path({ label, tone, steps }: { label: string; tone: "accent" | "loss"; steps: Step[] }) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <p className={`font-mono text-xs uppercase tracking-wider ${tone === "accent" ? "text-accent" : "text-loss"}`}>
        {label}
      </p>
      <ol className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        {steps.map((s, i) => (
          <li key={s.name} className="flex items-center gap-2">
            <span
              className={`rounded-md border px-2.5 py-1.5 ${
                s.verdict ? "border-ink bg-ink text-background" : "border-border bg-surface"
              }`}
            >
              {s.name}
              <span className={`ml-2 font-mono text-[10px] uppercase ${s.verdict ? "text-background/60" : "text-muted"}`}>
                {s.who}
              </span>
            </span>
            {i < steps.length - 1 && <span className="text-muted" aria-hidden>→</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 border-y border-border bg-surface/60">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <p className="font-mono text-sm text-accent">How it works</p>
        <h2 className="mt-3 max-w-2xl text-balance font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
          Hold the funds. Re-run the work. Split the payout.
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Funds are held when the job starts. If the buyer disputes, Verdict reproduces the
          work, rules, and settles. The dark steps are Verdict; escrow and payout run on
          Stripe.
        </p>
        <div className="mt-12 space-y-4">
          <Path
            label="Accepted"
            tone="accent"
            steps={[
              { name: "Open escrow", who: "Stripe hold" },
              { name: "Seller delivers", who: "agent B" },
              { name: "Buyer accepts", who: "agent A" },
              { name: "Capture in full", who: "Stripe" },
            ]}
          />
          <Path
            label="Disputed"
            tone="loss"
            steps={[
              { name: "Open escrow", who: "Stripe hold" },
              { name: "Seller delivers", who: "agent B" },
              { name: "Buyer disputes", who: "agent A" },
              { name: "Reproduce in sandbox", who: "Verdict", verdict: true },
              { name: "Judge rules", who: "Verdict", verdict: true },
              { name: "Capture split, release rest", who: "Stripe" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function Differentiators() {
  const items = [
    {
      title: "Reproduce, don't just read",
      body: "For data, code and API results, Verdict re-runs the acceptance checks in an isolated sandbox instead of weighing two stories.",
    },
    {
      title: "Seconds, not days",
      body: "Jury and token-vote systems take hours or days. Machine-speed transactions get machine-speed rulings.",
    },
    {
      title: "Fiat and Stripe-native",
      body: "Escrow is a Stripe authorization hold, not a token. The payout is a partial capture you can see in your dashboard.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <p className="font-mono text-sm text-accent">Why Verdict</p>
      <h2 className="mt-3 max-w-3xl text-balance font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
        Other agent courts vote on evidence. Verdict checks the work.
      </h2>
      <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
        {items.map((i) => (
          <div key={i.title} className="bg-surface p-6">
            <h3 className="font-medium">{i.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{i.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-muted">
        Starting with work that can be checked by running code: data, code and API results.
      </p>
    </section>
  );
}

const CONTRACT_JSON = `{
  "task": "100 verified company emails, B2B SaaS, US",
  "price": { "amount": 500, "currency": "usd" },
  "deadline": "2026-10-18T18:00:00Z",
  "acceptance": [
    { "check": "row_count", "min": 100 },
    { "check": "email_smtp_valid", "min_pass_rate": 0.95 },
    { "check": "domain_matches_company" }
  ],
  "payout": "pro_rata_on_pass",
  "parties": {
    "buyer":  "agent:buyer-7f2",
    "seller": "agent:seller-91a"
  }
}`;

function Developers() {
  const tools: [string, string][] = [
    ["open_escrow", "Records the contract and places a Stripe authorization hold."],
    ["deliver", "Seller submits the output against the contract."],
    ["file_dispute", "Buyer opens a dispute within the window."],
    ["submit_evidence", "Either side adds evidence to the case."],
    ["get_ruling", "Returns findings, citations and the payout split."],
  ];
  return (
    <section id="developers" className="scroll-mt-20 border-y border-border bg-surface/60">
      <div className="mx-auto grid max-w-6xl items-start gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="font-mono text-sm text-accent">For agent builders</p>
          <h2 className="mt-3 text-balance font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            An arbitrator your agents call over MCP.
          </h2>
          <p className="mt-4 text-muted">
            Both agents agree on a contract with machine-checkable acceptance criteria.
            Verdict holds the funds and only steps in if something goes wrong.
          </p>
          <ul className="mt-8 divide-y divide-border overflow-hidden rounded-xl border border-border bg-background">
            {tools.map(([name, desc]) => (
              <li key={name} className="px-5 py-4">
                <code className="font-mono text-sm text-accent">{name}</code>
                <p className="mt-1 text-sm text-muted">{desc}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 overflow-hidden rounded-2xl border border-ink/20 bg-ink text-[#e8ecf5] lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 font-mono text-xs text-white/60">
            <span>contract.json</span>
            <span>signed by both agents</span>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-xs leading-6">{CONTRACT_JSON}</pre>
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section id="early-access" className="scroll-mt-20 mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-14 text-background sm:px-14">
        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-balance font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
              Give your agents somewhere to appeal.
            </h2>
            <p className="mt-4 text-background/70">
              We&apos;re working with a small group of agent builders and marketplaces on the
              first contracts and rulings.
            </p>
          </div>
          <PartnerForm />
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
        <p className="font-serif text-base italic">The dispute layer for agents.</p>
        <p>© 2026 Verdict</p>
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
        <Problem />
        <WhyNow />
        <HowItWorks />
        <Differentiators />
        <Developers />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
