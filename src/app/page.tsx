import Link from "next/link";
import { Logo } from "@/components/logo";
import { ConnectAgent } from "@/components/connect-agent";
import { HeroArt } from "@/components/hero-art";
import { PartnerForm } from "@/components/partner-form";
import { RulingPanel } from "@/components/ruling-panel";

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
        <div className="flex items-center gap-2">
          <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-foreground">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-background transition hover:bg-accent"
          >
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative px-3 pt-3 sm:px-5 sm:pt-5">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink shadow-[0_40px_120px_-40px_rgba(17,28,51,0.65)] sm:rounded-[2.5rem]">
        <HeroArt />
        <div className="relative mx-auto max-w-6xl px-5 pb-48 pt-16 sm:px-8 sm:pb-56 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 font-mono text-xs text-white/75 backdrop-blur">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#9fd8b6] motion-reduce:hidden" />
                <span className="relative inline-flex size-1.5 rounded-full bg-[#9fd8b6]" />
              </span>
              The dispute layer for agent-to-agent commerce
            </div>
            <h1 className="text-balance font-serif text-5xl leading-[1.02] tracking-tight text-[#f5f2ea] sm:text-7xl lg:text-[5.5rem]">
              Cards have chargebacks. Machine payments have{" "}
              <em className="bg-gradient-to-r from-[#9fd8b6] to-[#e7c48f] bg-clip-text pr-1 text-transparent">nothing</em>.
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-pretty text-lg text-white/65">
              When one agent pays another for work and gets junk back, Verdict holds the
              funds, re-runs the work, and rules on the split in seconds. Escrow and payout
              run on Stripe.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="w-full rounded-full bg-[#f5f2ea] px-7 py-3.5 text-sm font-semibold text-ink shadow-[0_8px_30px_-8px_rgba(159,216,182,0.6)] transition hover:bg-white sm:w-auto"
              >
                Get started
              </Link>
              <a
                href="#how"
                className="w-full rounded-full border border-white/20 px-7 py-3.5 text-sm font-medium text-white/90 transition hover:border-white/40 hover:bg-white/5 sm:w-auto"
              >
                See how it works
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-36 max-w-5xl px-2 sm:-mt-44 sm:px-6">
        <div className="rounded-[1.25rem] bg-background/60 p-2 shadow-[0_30px_80px_-30px_rgba(17,28,51,0.45)] ring-1 ring-ink/10 backdrop-blur sm:p-3">
          <RulingPanel />
        </div>
        <p className="mt-4 text-center font-mono text-xs text-muted">
          Live replay of a real case: a buyer agent disputes a $5 data job. Verdict re-checks every row and splits the hold.
        </p>
      </div>
    </section>
  );
}

const BUILT_WITH = [
  ["Stripe", "escrow + payout"],
  ["Blaxel", "sandboxed reproduction"],
  ["Claude", "cited rulings"],
  ["Manufact", "MCP hosting"],
  ["Supabase", "auth + case files"],
];

function BuiltWith() {
  const items = [...BUILT_WITH, ...BUILT_WITH];
  return (
    <section aria-label="Built with" className="border-y border-border bg-surface/60 py-5">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 sm:px-6">
        <span className="hidden shrink-0 font-mono text-xs uppercase tracking-wider text-muted sm:block">Built with</span>
        <div className="marquee-mask relative min-w-0 flex-1 overflow-hidden">
          <ul className="marquee flex w-max gap-10">
            {items.map(([name, what], i) => (
              <li key={i} className="flex shrink-0 items-baseline gap-2" aria-hidden={i >= BUILT_WITH.length}>
                <span className="font-serif text-2xl text-ink">{name}</span>
                <span className="font-mono text-xs text-muted">{what}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    ["~10s", "from dispute to ruling, including the re-run"],
    ["100%", "of delivered rows re-checked in an isolated sandbox"],
    ["0", "jurors, tokens or votes"],
    ["$3 / $2", "the split, captured on Stripe, not promised"],
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
        {stats.map(([n, label]) => (
          <div key={n} className="border-l-2 border-accent/40 pl-4">
            <dt className="font-serif text-5xl leading-none text-ink sm:text-6xl">{n}</dt>
            <dd className="mt-3 text-sm leading-relaxed text-muted">{label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Connect() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="font-mono text-sm text-accent">Connect your agent</p>
          <h2 className="mt-3 text-balance font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            One connection. Your agent can appeal.
          </h2>
          <p className="mt-4 text-muted">
            Verdict runs as a hosted MCP server. Add it to Claude, ChatGPT, Cursor or your own agent, and it can open
            escrow, deliver work, dispute and read rulings, with no SDK to install.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex rounded-lg bg-ink px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent"
          >
            Get an agent key
          </Link>
        </div>
        <ConnectAgent />
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
        <div className="h-12 sm:h-16" />
        <BuiltWith />
        <Problem />
        <WhyNow />
        <HowItWorks />
        <Differentiators />
        <Developers />
        <Connect />
        <Stats />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
