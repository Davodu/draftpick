# Warrant — One-Pager

Oct 18, 2026 · @Davies Odu

## The pitch

**Warrant gives merchants proof of what a human actually authorized their AI agent to buy, attached to every dispute automatically.**

*Working name: a warrant is a written authority to act on someone's behalf.*

**Problem.** When an agent buys, the merchant never sees the human's instruction. If the customer later says "I didn't tell it to buy that," the merchant has no evidence, eats the chargeback, and the dispute counts against its monitoring ratios. The proof (the mandate the human gave the agent) sits with the agent platform, not the merchant.

**Why now.**

- **Q4 2026** is the first holiday season with consumer shopping agents at scale (Claude Commerce Agents, Copilot Checkout).
- **Jan–Mar 2027:** holiday disputes arrive.
- **\~Apr 2027:** the earliest analysts expect binding Visa or Mastercard rules for agent-initiated disputes.

That gap is the window: disputes arrive months before the rules do.

## Landscape and positioning

**The industry has written the standard; nobody runs it end to end yet. Warrant is the working implementation on Stripe.**

| Player | What they're doing | Status |
| --- | --- | --- |
| Mastercard + Google | Verifiable Intent: open-source spec linking identity, agent instructions and outcome into a signed record for disputes | Spec + reference code (Mar 2026) |
| Visa | Compelling Evidence 3.0 counts agentic provider login IDs as dispute evidence | Live Oct 24, 2026 |
| EMVCo | Draft framework for a shared record of consumer intent | Draft, not a rule |
| Stripe | ACP + Shared Payment Tokens; Smart Disputes auto-builds evidence. Merchant still manages disputes | Live; no agent mandates in evidence yet |
| CertNode | Signs mandate + cart + receipt into one evidence package | Live, merchant-side only |
| Chargeflow, Justt, Chargebacks911 | Dispute automation, positioning for agentic disputes | Live |

**The gap:** the mandate lives with the agent platform, and the merchant only needs it weeks later, at dispute time. Nothing routes it across.

**Positioning:** "Mastercard and Google wrote the standard. Warrant makes it work on Stripe today: the agent signs at purchase, and the proof shows up in the dispute automatically."

## How it works

**The agent signs the human's limits at purchase; when a dispute arrives, Warrant attaches that proof to it automatically.**

&#91;embedded content: mandate-to-dispute flow · purchase, then dispute weeks later\]

The two highlighted boxes are Warrant; everything else is the existing Stripe flow.

## Hackathon build

**Four components, all in Stripe test mode, with each sponsor doing a real job.**

| Component | What it does | Sponsor |
| --- | --- | --- |
| Mandate signer | At purchase, the agent records what the human authorized (item, price cap, expiry, the human's words) and signs it with its agent identity | Inkbox (agent identity) |
| Mandate store + MCP server | Agents deposit mandates keyed to the Stripe PaymentIntent ID; exposed as MCP tools `deposit_mandate` and `get_mandate` | Manufact (hosting), Supabase or InsForge (storage) |
| Dispute bridge | Listens for Stripe `charge.dispute.created`, fetches the matching mandate, verifies the signature, and submits it as dispute evidence via Stripe's API | Stripe |
| Merchant view | One page: disputes, matched mandates, evidence submitted, outcome | — |

**Build order**

1. Mandate schema aligned with Verifiable Intent / AP2 fields (intent, cart, payment).
2. Store + MCP server on Manufact.
3. Demo agent that buys from a test Stripe merchant and deposits a mandate.
4. Webhook bridge that auto-submits evidence.
5. Merchant view and rehearsal.

**Cut:** real card networks, multi-merchant routing, selective disclosure, pricing.

## Demo script (2 minutes)

1. **Hook (15s):** "This is the first holiday season where agents shop for people. In January the disputes arrive, and the card networks' rules won't land until spring."
2. **Purchase (30s):** The user tells an agent: "Buy noise-cancelling headphones under $200." The agent buys a $179 pair; Warrant stores the signed mandate.
3. **Dispute (20s):** Trigger a dispute with a Stripe test card: "I didn't authorize this."
4. **Proof (40s):** The webhook fires, Warrant matches the mandate, verifies the signature, and submits evidence. The merchant view shows: "max $200, noise-cancelling, approved 3:14pm, signed by agent X."
5. **Close (15s):** "Mastercard and Google wrote the standard. Warrant makes it work on Stripe today."

Pre-create one purchase before going on stage so only the dispute runs live.

## Risks and open questions

**The core risk is that card networks or Stripe build this themselves; the hackathon pitch should own that rather than hide it.**

| Risk | Severity | Response |
| --- | --- | --- |
| Mastercard, Visa or Stripe ship it natively | High | Frame as the working implementation of an open standard; the likely exit is acquisition, like Ethoca and Verifi |
| Agent platforms (OpenAI, Anthropic, Google) won't send mandates | High | Start with merchants who run their own agent or checkout; ask platforms after proving dispute win rates |
| Issuers don't accept mandates as compelling evidence | Medium | Test win rates with design partners; align fields with Verifiable Intent and Visa CE 3.0 |
| Privacy of the human's instructions | Medium | Store hashes and disclose only fields needed for the dispute (selective disclosure, later) |
| Stablecoin rails (x402) have no chargebacks | Low | Out of scope; card rails first |

**Open questions:** Which reason codes do mandates actually win? Does Stripe's API accept structured mandate data, or only uploaded files as evidence?

## Sources

- [Why agent chargeback rules likely miss the 2026 holidays](https://shopappy.com/payments/card-networks/agent-chargeback-rules-holiday-2026)
- [Agentic payments and chargebacks: a merchant guide (chargeback.io)](https://www.chargeback.io/blog/agentic-payments-chargebacks)
- [AI agent chargeback liability (Chargeflow)](https://www.chargeflow.io/blog/ai-agent-chargeback-liability)
- [Mastercard and Google Verifiable Intent (Fintech News)](https://fintechnews.sg/127287/ai/mastercard-google-verifiable-intent/)
- [Visa widens chargeback evidence rules from Oct. 24](https://ecommerceparadise.com/visa-chargeback-evidence-rules/)
- [Agentic commerce for merchants in 2026 (Payment Review)](https://paymentreview.com/blog/agentic-commerce-merchants-2026/)
- [Stripe: introduction to payment disputes](https://stripe.com/guides/introduction-to-payment-disputes)
- [CertNode agentic commerce dispute defense](https://certnode.io/solutions/agentic-commerce)
- [Chargebacks911 on agentic dispute risk (Finopotamus)](https://www.finopotamus.com/post/chargebacks911-warns-ai-agents-are-creating-a-new-era-of-dispute-risk-for-merchants-and-banks)
- [Claude Commerce Agents and Copilot Checkout (Tech Insider)](https://tech-insider.org/?p=21278)
