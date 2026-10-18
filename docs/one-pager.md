# Pickrate — One-Pager

Oct 18, 2026 · @Davies Odu

## The pitch

**Pickrate is Search Console for AI agents: it tells companies how often ChatGPT, Claude, Gemini and Cursor pick their tool, why they lose, and how to win.**

**Name:** *Pickrate*, the share of relevant agent requests where a model picks your tool over a competitor's. The product is named after the one metric it owns. Domain and trademark still need checking; a quick search found no MCP company using the name.

**Problem.** Over 43,000 MCP servers are now listed in the official registry, many competing for the same intents (stock prices, company enrichment, web search, travel). A model decides which tool to call almost entirely from tool names, descriptions and schemas. Vendors write that copy blind:

- They can't see the requests where a competitor was picked instead.
- They can't tell whether a new model release (GPT, Claude, Gemini) changed their share.
- They can't tie a tool call to a signup or to revenue.

GEO tools like Profound ($1B valuation) measure whether a brand is **mentioned** in an AI answer. Nobody measures whether a tool is **called**.

## Core insight

**Server-side analytics only sees the calls you won; Pickrate measures the ones you lost.**

MCP analytics tools (MCPcat, Agnost, Shinzo, Manufact) instrument a vendor's own server. That is Google Analytics without Search Console: it shows who arrived, never the requests that went to a competitor.

Pickrate works from the outside, the way Profound measures AI answers:

1. Build a library of real-world prompts per intent ("what's NVDA trading at", "enrich this company domain").
2. Run them through each major client and model with a realistic set of competing tools installed.
3. Record which tool gets picked, with what arguments, and whether the call succeeds.
4. Report **selection share** per intent, per model, per competitor, tracked over time.

Live server data, added later, calibrates the synthetic results against real traffic and connects calls to revenue.

## MVP: what to build first

**Ship layers 1 and 2 for one intent cluster; everything else waits for paying customers.**

| Layer | What it does | MVP? |
| --- | --- | --- |
| 1. Selection share | Share of prompts where each tool is picked, per model, with weekly trend | Yes |
| 2. Diagnosis | Why a tool lost: vague description, heavy schema, name clash, wrong arguments | Yes |
| 3. Optimization | Suggested rewrites of names, descriptions and schemas, A/B tested across models | Manual at first, done as a service |
| 4. Attribution | Live server SDK linking prompt to call to signup or revenue | Later |
| 5. Paid placement | Managing ad spend as ChatGPT ads mature | Later |

**Technical core for the MVP:**

- **Prompt library:** 200–500 prompts per intent, generated with an LLM and reviewed by hand, with paraphrases and edge cases.
- **Harness:** One runner that loads N competing MCP servers into a client and records the chosen tool and its arguments. Start with API models (Claude, GPT, Gemini) using their native tool calling. Add real clients (Claude Desktop, Cursor, ChatGPT developer mode) once the API numbers hold up.
- **Scoring:** Selection share, first-choice rate, argument accuracy, call success.
- **Repeatability:** Several runs per prompt, re-run on every model release; report confidence intervals, not single numbers.
- **Report:** A static weekly report or simple dashboard. No self-serve app yet.

## Customer, wedge and pricing

**Start with data and API vendors, because models choose among their tools without the user naming one.**

- **Buyer:** Head of growth, product or developer relations at a company with a public MCP server.
- **First wedge: financial market data.** Many MCP servers compete for the same intents (quotes, fundamentals, crypto prices). Examples include Alpha Vantage and CoinGecko, both already Manufact customers. Backup wedges: company enrichment and web search/scraping.
- **Later:** Consumer brands with ChatGPT apps, once suggestion and placement inside ChatGPT become competitive.
- **Agencies:** The SEO and GEO agencies already selling AI-visibility work are a resale channel.

| Plan | Price | Includes |
| --- | --- | --- |
| Free report | $0 | One-time selection-share snapshot for one intent; the lead magnet |
| Starter | $499/mo | 1 brand, 3 intents, 3 models, weekly tracking |
| Growth | $1,999/mo | 10 intents, all models and clients, diagnosis, release alerts |
| Agency / Enterprise | $5,000+/mo | Multi-brand, API access, optimization service |

Prices are modeled on GEO tools and are an assumption to test with the first customers.

## Competition and moat

**No one owns selection share today; the moat is a dataset across competitors and models that grows with every run.**

| Who | What they do | Why they don't cover this |
| --- | --- | --- |
| MCPcat, Agnost, Shinzo | Analytics inside a vendor's own server | Only see calls that were won |
| Manufact, Alpic | Hosting plus analytics and a quality score | Only see their own customers' servers; no competitive view |
| Open-source benchmarks (mcp-tool-selection-bench, testmcpy) | Tool-selection accuracy tests in CI | Free, single-server, built for engineers, not growth teams |
| Profound, Scrunch, Semrush | GEO: brand mentions in AI answers | Track being cited, not being called; most likely to add this as a feature |

**Moat, in order:**

1. A benchmark of every major server per intent across every model, re-run on each model release. Historical data can't be bought later.
2. A diagnosis model trained on thousands of description changes and the selection changes they caused.
3. Becoming the public scoreboard ("Pickrate index for market data"), which pulls vendors in to improve their number.

## Risks and what to validate

**The biggest risk is that real users install tools by name, leaving little competition at selection time; validate that first.**

| Risk | Severity | How to test or mitigate |
| --- | --- | --- |
| Little real competition at selection time (users @mention apps by name) | High | Start where models choose for themselves: coding agents and API/data tools. Confirm with vendors that losing calls is a felt pain |
| Synthetic prompts don't match real usage | Medium | Calibrate against live traffic from 2–3 design partners' servers |
| AI labs treat optimization as manipulation (tool poisoning) | Medium | Position as accuracy and quality; never recommend misleading descriptions |
| Results are noisy across runs | Medium | Multiple runs per prompt and confidence intervals in every report |
| Profound or Manufact ship the feature | Medium | Move fast on the cross-competitor dataset and the public index |
| Inference cost of benchmarking | Low | \~500 prompts × 4 models × 5 runs is about 10,000 calls per intent per week; budget it per plan |

## 60-day build plan and success metrics

**In 60 days, prove that 5 market-data vendors will pay to raise their selection share.**

&#91;embedded content: 60-day plan · 4 two-week phases, 1 go/no-go gate\]

Each phase is two weeks; the gate at day 60 decides whether to raise, keep going, or switch wedge.

| Metric | Day-60 target |
| --- | --- |
| Vendors willing to pay (go/no-go) | 5 |
| Free reports sent | 20 vendors |
| Discovery calls held | 15+ |
| Intent cluster benchmarked | 1 (market data), 10–15 servers |
| Models covered | 3 (Claude, GPT, Gemini) |
| Lift shown for a design partner | Selection share up after a rewrite |

Fewer than 5 paying vendors: rerun the same plan on company enrichment or web search before dropping the idea.
