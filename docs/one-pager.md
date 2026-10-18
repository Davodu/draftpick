# Verdict — One-Pager

Oct 18, 2026 · @Davies Odu

## The pitch

**Verdict is the dispute layer for agent-to-agent commerce: escrow, evidence and a ruling in seconds when a machine-paid job goes wrong.**

*Working name.*

**Problem.** Cards have chargebacks. Stablecoin machine payments (x402, MPP on stablecoin rails) settle instantly with no chargeback mechanism. When agent A pays agent B for work and B delivers junk, there is nothing to appeal to and no way to get the money back.

**Why now.**

- Machine payment protocols are live: x402 in production, Stripe and Tempo's MPP since March 2026, streaming payments since April 2026.
- Agents can now hire agents: agent-to-agent channels (Inkbox) and agent marketplaces (Coinbase Agent.market) are live.
- Volume is still small, so the dispute layer can be set before it is needed at scale.

**One line:** "Cards have chargebacks. Machine payments have nothing. Verdict is the dispute layer for agents."

## Landscape and positioning

**Six players are circling agent disputes, mostly crypto-native juries that vote over hours or days. Verdict reproduces the disputed work and rules in seconds, with escrow on Stripe.**

| Player | Mechanism | Where Verdict differs |
| --- | --- | --- |
| Kleros (ai.kleros.io) | Staked human jurors vote | Human-speed, token-based |
| GenLayer / Internet Court | Rotating AI validators vote on evidence | Reads evidence; does not re-run the work |
| UMA Optimistic Oracle + ERC-8183 | Token-holder vote if disputed; escrow standard | On-chain, slow escalation |
| Labarna (ADRE) | Automated dispute filing on card networks | Card disputes, not machine payments |
| Agent Dispute | Auction-based arbitration, evidence ledger | Early, no public pricing |
| AAA AI Arbitrator | AI drafts; a human issues the award | Not agent-facing |
| Card networks, Stripe Smart Disputes | Chargebacks on card payments | No coverage for stablecoin machine payments |

*Rows 1–6 come from our September 2026 research and have not been independently verified; check them before pitching.*

**Three differentiators:**

1. **Reproduce, don't just read.** For digital work (data, code, API results), the judge re-runs the acceptance checks in a sandbox instead of weighing stories.
2. **Seconds, not days.** Machine-speed rulings for machine-speed transactions.
3. **Fiat and Stripe-native.** Escrow is a Stripe authorization hold, not a token.

## How it works

**Funds are held when the job starts; if the buyer disputes, Verdict re-runs the work, rules, and splits the payout.**

&#91;embedded content: escrow-to-ruling flow · accepted path and disputed path\]

The two highlighted steps are what Verdict adds; escrow and payout run on Stripe.

## Hackathon build

**Six components in Stripe test mode; the core is the sandbox reproduction plus a judge that outputs a payout split.**

| Component | What it does | Sponsor |
| --- | --- | --- |
| Contract + escrow | `open_escrow` records the job spec with machine-checkable acceptance criteria and creates a PaymentIntent with manual capture (an authorization hold) | Stripe |
| Agent channel | Agents A and B agree on the contract; both identities sign it | Inkbox |
| Arbitrator MCP server | Tools: `open_escrow`, `deliver`, `file_dispute`, `submit_evidence`, `get_ruling` | Manufact |
| Reproduction | Re-runs the acceptance checks against B's delivered output in an isolated sandbox | Blaxel |
| Judge | A frontier model reads contract, evidence and reproduction results; outputs a ruling with cited evidence and a payout split as JSON | Claude / GPT API |
| Store + settlement | Saves contracts, evidence and rulings; captures B's share of the hold and releases the rest | Supabase or InsForge, Stripe |

**Build order**

1. Contract schema: task, price, acceptance checks, deadline.
2. Escrow with manual capture in Stripe test mode.
3. Blaxel runner that executes acceptance checks on delivered output.
4. Judge prompt with structured output: findings, citations, payout split.
5. MCP server on Manufact; two demo agents (buyer, seller).
6. Ruling page and rehearsal.

**Cut:** appeals, reputation, multi-currency, non-verifiable work (design, writing quality).

## Demo script (90 seconds)

1. **Hook (15s):** "Cards have chargebacks. Machine payments have nothing. When an agent pays another agent for junk, the money is gone."
2. **The job (20s):** Agent A hires agent B: "100 verified company emails for $5." Verdict opens an escrow hold on Stripe.
3. **Bad delivery (10s):** B delivers 100 rows; 40 are fake.
4. **Dispute (30s):** A files a dispute. Verdict re-runs email verification in a Blaxel sandbox, finds 40% fail, compares against the contract, and issues a ruling with cited evidence.
5. **Money moves (15s):** Stripe captures $3 for B and releases $2 back to A, live in the dashboard.

Pre-build the job and delivery before going on stage so only the dispute and ruling run live.

## Risks and open questions

**The biggest risk is a wrong ruling moving real money; limit the first version to work whose acceptance can be checked by running code.**

| Risk | Severity | Response |
| --- | --- | --- |
| Judge makes a wrong ruling | High | Only arbitrate machine-checkable criteria; every ruling cites the reproduction results; add an appeal path later |
| Holding funds raises money-transmission questions | High (as a company) | Stripe holds funds via authorization; move to Stripe Connect before scaling |
| Seller games the acceptance checks | Medium | Hidden test cases sampled at dispute time, not shared in advance |
| Crypto protocols add fiat, or Stripe adds escrow disputes | Medium | Win on speed and reproduction; integrate rather than compete with Stripe |
| Card authorization holds expire after a few days | Low | Fine for short jobs; longer jobs need a different escrow |
| Only works for verifiable digital work | Medium | Start there: data, code, API results |

**Open questions:** Will both agents' operators accept a third-party ruling up front? What is the right fee: per escrow, or per dispute?

## Sources

- Legal-grade LLMs for agentic arbitration (internal research, September 2026)
- [How network rules govern agentic commerce; x402 has no chargeback mechanism (Lexology)](https://www.lexology.com/library/detail.aspx?g=5c1b1a29-552a-4ec5-ac3d-d7bf0cc90793)
- [Stripe Machine Payments Protocol (Eco)](https://eco.com/support/en/articles/14845486-stripe-machine-payments-protocol-mpp)
- [What is agentic commerce: the 2026 guide, incl. Coinbase Agent.market (Eco)](https://eco.com/support/en/articles/14839400-what-is-agentic-commerce-the-2026-guide)
- [Stripe Disputes API](https://docs.stripe.com/api/disputes)
- [Stripe agentic commerce docs](https://docs.stripe.com/agentic-commerce)
