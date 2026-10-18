import { EvidencePanel } from "@/components/evidence-panel";
import { PartnerForm } from "@/components/partner-form";

function Logo() {
  return (
    <a href="#" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
        <circle cx="12" cy="12" r="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="6.5" fill="none" stroke="var(--ink)" strokeWidth="1" strokeDasharray="1.5 1.5" />
        <path d="M8.5 12.2l2.3 2.3 4.7-5" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      warrant
    </a>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <div className="hidden items-center gap-8 text-sm text-muted md:flex">
          <a href="#why-now" className="hover:text-foreground">Why now</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#developers" className="hover:text-foreground">Developers</a>
        </div>
        <a
          href="#partners"
          className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-background transition hover:bg-accent"
        >
          <span className="sm:hidden">Join</span>
          <span className="hidden sm:inline">Become a design partner</span>
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
            Dispute evidence for agentic commerce on Stripe
          </div>
          <h1 className="text-balance font-serif text-5xl leading-[1.05] tracking-tight sm:text-7xl">
            Proof of what the human <em className="text-ink">actually</em> authorized.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted">
            When an AI agent buys from you, Warrant captures the person&apos;s instruction,
            signs it at purchase, and attaches it to the dispute if they later say
            &ldquo;I didn&apos;t tell it to buy that.&rdquo;
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#partners"
              className="w-full rounded-lg bg-ink px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent sm:w-auto"
            >
              Become a design partner
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
          <EvidencePanel />
          <p className="mt-4 text-center font-mono text-xs text-muted">
            Example: a dispute weeks after purchase, with the signed mandate attached automatically.
          </p>
        </div>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section className="border-y border-border bg-surface/60">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="font-mono text-sm text-accent">The problem</p>
          <h2 className="mt-3 text-balance font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            The proof sits with the agent. The chargeback lands on you.
          </h2>
          <p className="mt-5 text-muted">
            When an agent buys, you never see the human&apos;s instruction. If the customer
            disputes it, you have no evidence, you eat the chargeback, and it counts
            against your monitoring ratios.
          </p>
          <p className="mt-4 text-muted">
            The mandate lives with the agent platform. You need it weeks later, at dispute
            time. Nothing routes it across.
          </p>
        </div>

        <div className="space-y-4">
          <FlowRow
            label="Today"
            tone="loss"
            steps={["Human → agent", "Agent buys", "Mandate stays with agent"]}
            end="Dispute lost, no evidence"
          />
          <FlowRow
            label="With Warrant"
            tone="accent"
            steps={["Human → agent", "Agent signs mandate", "Warrant stores it by PaymentIntent"]}
            end="Evidence auto-submitted"
          />
        </div>
      </div>
    </section>
  );
}

function FlowRow({
  label,
  tone,
  steps,
  end,
}: {
  label: string;
  tone: "loss" | "accent";
  steps: string[];
  end: string;
}) {
  const endCls =
    tone === "loss"
      ? "border-loss/30 bg-loss/10 text-loss"
      : "border-accent/30 bg-accent/10 text-accent";
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <p className="font-mono text-xs uppercase tracking-wider text-muted">{label}</p>
      <ol className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        {steps.map((s) => (
          <li key={s} className="flex items-center gap-2">
            <span className="rounded-md border border-border bg-background px-2.5 py-1">{s}</span>
            <span className="text-muted" aria-hidden>→</span>
          </li>
        ))}
        <li>
          <span className={`rounded-md border px-2.5 py-1 font-medium ${endCls}`}>{end}</span>
        </li>
      </ol>
    </div>
  );
}

function WhyNow() {
  const events = [
    {
      when: "Q4 2026",
      title: "Agents shop at scale",
      body: "The first holiday season with consumer shopping agents buying on people's behalf.",
      now: true,
    },
    {
      when: "Jan–Mar 2027",
      title: "Holiday disputes arrive",
      body: "Customers dispute what their agents bought. Merchants need proof of authorization.",
    },
    {
      when: "~Apr 2027",
      title: "Network rules, at the earliest",
      body: "Analysts expect binding Visa or Mastercard rules for agent-initiated disputes no sooner than spring.",
    },
  ];
  return (
    <section id="why-now" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <p className="font-mono text-sm text-accent">Why now</p>
      <h2 className="mt-3 max-w-2xl text-balance font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
        Disputes arrive months before the rules do.
      </h2>
      <ol className="relative mt-14 grid gap-8 md:grid-cols-3 md:gap-6">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border md:left-0 md:right-0 md:top-[7px] md:bottom-auto md:h-px md:w-auto" aria-hidden />
        {events.map((e) => (
          <li key={e.when} className="relative pl-8 md:pl-0 md:pt-10">
            <span
              className={`absolute left-0 top-1 size-[15px] rounded-full border-2 md:top-0 ${
                e.now ? "border-accent bg-accent" : "border-ink/40 bg-background"
              }`}
              aria-hidden
            />
            <p className="font-mono text-sm text-ink">{e.when}</p>
            <h3 className="mt-2 text-lg font-medium">{e.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{e.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "I",
      name: "Sign at purchase",
      body: "The agent records what the human authorized (item, price cap, expiry, their own words) and signs it with its agent identity.",
      code: "deposit_mandate(pi_3QxK…, mandate, sig)",
    },
    {
      n: "II",
      name: "Store by PaymentIntent",
      body: "Warrant keeps the signed mandate keyed to the Stripe PaymentIntent, ready for the day it's needed.",
      code: "mandates[pi_3QxK…] = { intent, cart, payment }",
    },
    {
      n: "III",
      name: "Attach on dispute",
      body: "When Stripe fires charge.dispute.created, Warrant finds the mandate, verifies the signature, and submits it as evidence.",
      code: "on charge.dispute.created → verify → submit",
    },
  ];
  return (
    <section id="how" className="scroll-mt-20 border-y border-border bg-surface/60">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <p className="font-mono text-sm text-accent">How it works</p>
        <h2 className="mt-3 max-w-2xl text-balance font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
          Signed at checkout. Delivered at dispute.
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Everything else stays your existing Stripe flow. Warrant adds two steps: the
          mandate at purchase, and the evidence at dispute.
        </p>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="flex min-w-0 flex-col rounded-xl border border-border bg-background p-6">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-2xl text-accent">{s.n}</span>
                <h3 className="text-lg font-medium">{s.name}</h3>
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{s.body}</p>
              <code className="mt-6 block overflow-x-auto whitespace-nowrap rounded-lg border border-border bg-surface px-3 py-2.5 font-mono text-xs text-ink">
                {s.code}
              </code>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const MANDATE_JSON = `{
  "payment_intent": "pi_3QxK...9fA2",
  "intent": {
    "instruction": "Buy noise-cancelling headphones under $200",
    "constraints": { "max_amount": 20000, "currency": "usd",
                     "expires_at": "2026-11-29T15:14:00Z" }
  },
  "cart": [{ "sku": "NC-700", "name": "Noise-cancelling headphones",
             "amount": 17900 }],
  "approved_at": "2026-11-28T15:14:00Z",
  "agent": "did:key:z6Mk...7Qx",
  "signature": "ed25519:9b1f...e04c"
}`;

function Developers() {
  return (
    <section id="developers" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        <div>
          <p className="font-mono text-sm text-accent">For agent builders</p>
          <h2 className="mt-3 text-balance font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            Two MCP tools. One webhook.
          </h2>
          <p className="mt-4 text-muted">
            Agents deposit mandates through Warrant&apos;s MCP server. Merchants connect
            their Stripe account once; the dispute bridge does the rest.
          </p>
          <ul className="mt-8 space-y-4">
            <li className="rounded-xl border border-border bg-surface p-5">
              <code className="font-mono text-sm text-accent">deposit_mandate</code>
              <span className="font-mono text-xs text-muted">(payment_intent, mandate, signature)</span>
              <p className="mt-2 text-sm text-muted">
                Called by the agent at checkout. Stores the signed mandate against the PaymentIntent.
              </p>
            </li>
            <li className="rounded-xl border border-border bg-surface p-5">
              <code className="font-mono text-sm text-accent">get_mandate</code>
              <span className="font-mono text-xs text-muted">(payment_intent)</span>
              <p className="mt-2 text-sm text-muted">
                Returns the mandate and its verification status for a given payment.
              </p>
            </li>
          </ul>
          <p className="mt-6 text-sm text-muted">
            Mandate fields follow the intent, cart and payment structure of Mastercard and
            Google&apos;s Verifiable Intent and AP2.
          </p>
        </div>

        <div className="min-w-0 overflow-hidden rounded-2xl border border-ink/20 bg-ink text-[#e8ecf5] lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 font-mono text-xs text-white/60">
            <span>mandate.json</span>
            <span>signed by agent</span>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-xs leading-6">{MANDATE_JSON}</pre>
        </div>
      </div>
    </section>
  );
}

function Standards() {
  const items = [
    ["Mastercard + Google", "Verifiable Intent", "The open spec for a signed record of identity, instruction and outcome."],
    ["Visa", "Compelling Evidence 3.0", "Counts agentic provider login IDs as dispute evidence from Oct 24, 2026."],
    ["Stripe", "Disputes API", "Where Warrant submits the evidence, on the flow you already run."],
  ];
  return (
    <section className="border-y border-border bg-surface/60">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="max-w-3xl">
          <p className="font-mono text-sm text-accent">Built on the standard</p>
          <h2 className="mt-3 text-balance font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            Mastercard and Google wrote the standard. Warrant makes it work on Stripe today.
          </h2>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
          {items.map(([org, name, body]) => (
            <div key={name} className="bg-background p-6">
              <p className="font-mono text-xs uppercase tracking-wider text-muted">{org}</p>
              <h3 className="mt-2 font-medium">{name}</h3>
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
    <section id="partners" className="scroll-mt-20 mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-14 text-background sm:px-14">
        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-balance font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
              Be ready before January.
            </h2>
            <p className="mt-4 text-background/70">
              We&apos;re onboarding a small group of Stripe merchants and agent builders ahead
              of the holiday dispute season.
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
        <p className="font-serif text-base italic">A written authority to act on someone&apos;s behalf.</p>
        <p>© 2026 Warrant</p>
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
        <Developers />
        <Standards />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
