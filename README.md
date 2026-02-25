# 🔥🚀 Cooked or Rocket?

**How frontier AI lab announcements might reprice the $Trillion B2B SaaS moat.**

A speculative, open-source tool that analyzes any public stock ticker through the lens of the "Agentic Squeeze" thesis — the idea that agentic AI is structurally deconstructing per-seat SaaS pricing by shifting the unit of work from "human seat-hours" to "task execution."

> ⚠️ **Not financial advice.** This is a scenario-planning and discussion tool. No crystal ball, just first principles.



---

## The Thesis

For 20 years, B2B software companies built trillion-dollar market caps by acting as **tax collectors on human workflows**. Per-seat pricing worked because software increased employee productivity, and vendor growth scaled with headcount.

**Agentic AI breaks this model at the root.**

When an AI agent can *execute* work autonomously — not just suggest, but act — the software layer designed to *organize humans doing the work* becomes overhead. The $285B market rout following Anthropic's agent releases in early 2026 wasn't a panic; it was the market learning to price this structural shift.

### The 5 Disruption Zones

| Zone | What It Means | Who's Exposed |
|------|--------------|---------------|
| ⚡ **Ephemeral App Generator** | AI generates bespoke apps on demand, killing per-seat SaaS | Salesforce, Workday, Monday.com |
| 🤖 **Autonomous SRE Swarm** | Agents auto-diagnose and auto-remediate, bypassing dashboards | Datadog, PagerDuty, Dynatrace |
| 🎫 **Zero-Ticket Enterprise** | AI resolves IT/HR requests instantly, collapsing ticket queues | ServiceNow, Zendesk, Freshworks |
| 👁️ **Semantic Computer Use** | Vision models navigate any UI at machine speed, replacing RPA | UiPath, MuleSoft, System Integrators |
| 🔄 **Zero-Friction Migration** | AI untangles legacy code, destroying switching-cost moats | SAP, Oracle, IBM |

### The GDT Framework

What makes a frontier lab announcement *actually* market-moving (vs. just interesting):

- **Governance**: Can the agent be trusted with real permissions?
- **Data**: Can it access living enterprise data safely and broadly?
- **Tools**: Can it execute end-to-end (not just draft text — push buttons, change systems)?

### Where Capital Rotates

As the application layer gets squeezed, capital consolidates into scarce layers:

1. **Base Layer** — Compute, energy, hyperscalers (NVIDIA, TSMC)
2. **Proprietary Data Monopolies** — Un-scrapable real-world data that agents need for grounding
3. **Sovereign/Localized AI** — On-prem "AI Factories" for enterprises that can't pipe their operational nervous system to a public API

---

## Features

### Single Ticker Analysis
- **25 pre-analyzed tickers** with hand-crafted exposure scores across all 5 disruption zones
- **AI-powered analysis for ANY ticker** — type any symbol and Claude generates a full Agentic Squeeze breakdown on the fly
- Animated gauge visualization (COOKED → CONTESTED → ROCKET)
- Bear case and counter-narrative for every ticker

### Portfolio X-Ray
- Paste up to 15 tickers for a portfolio-level diagnosis
- AI-synthesized overall score with concentration analysis
- **Blind spot detection** — what risk isn't your portfolio hedged against?
- **Rebalancing playbook** — suggested moves to position against the agentic squeeze
- Zone exposure heatmap across all holdings
- Click any holding to drill into full single-ticker analysis

---

## How It Works

This is a React app powered by Vite. It uses:

- **Pre-analyzed data** for 25 major tickers (Salesforce, Datadog, NVIDIA, IBM, etc.)
- **Claude API** (Sonnet) for on-the-fly analysis of unknown tickers and portfolio synthesis
- No backend, no database, no auth — it's intentionally simple and forkable

The AI analysis uses a carefully crafted system prompt that embeds the full Agentic Squeeze thesis, the 5 disruption zones, and the GDT framework so that every generated analysis is grounded in the same mental model.

### Architecture

```
User enters ticker
       │
       ├── Known ticker? → Return pre-analyzed data
       │
       └── Unknown ticker? → Claude Sonnet API call
                              │
                              └── System prompt: Agentic Squeeze thesis
                                  + 5 disruption zones + GDT framework
                                  │
                                  └── Structured JSON response
                                      → Rendered with same UI
```

For portfolio mode, individual analyses are collected, then a second API call synthesizes the portfolio-level diagnosis.

---

## Running It

### Prerequisites

- **Node.js 18+** — [download](https://nodejs.org/)
- **Anthropic API key** (optional) — needed only for AI analysis of unknown tickers. [Get one here](https://console.anthropic.com/). The 22 pre-analyzed tickers work without any API key.

### Quick Start

```bash
git clone https://github.com/your-handle/cooked-or-rocket.git
cd cooked-or-rocket
npm install

# Optional: enable AI analysis for any ticker
cp .env.example .env
# Edit .env and add your Anthropic API key

npm run dev
```

The app opens automatically at `http://localhost:5173`.

> ⚠️ **Security note**: The API key is bundled into the client-side code. This is fine for local development and personal use, but for public deployments, set up a backend proxy to protect your key. See `AGENTS.md` for details.

### Production Build

```bash
npm run build    # Output in dist/
npm run preview  # Preview locally
```

### As a Claude Artifact

The original component also runs as a Claude Artifact:
1. Copy the contents of `src/CookedOrRocket.jsx`
2. Paste into Claude (claude.ai) and ask it to render as an artifact
3. API calls route through Claude's built-in proxy

---

## Extending It

This is designed to be forked and built upon. Some ideas:

- **Add more pre-analyzed tickers** — the `KNOWN_TICKERS` object is a simple data structure
- **Adjust the scoring model** — change exposure scores based on your own thesis
- **Add real market data** — integrate with a financial API to show actual stock performance alongside the speculative scores
- **Build a time series** — track how scores change as frontier labs ship new capabilities
- **European / Asian tickers** — the AI analysis works for any public company globally
- **Custom disruption zones** — fork the thesis with your own zones

---

## The Research Behind It

This tool is built on a synthesis of three research documents:

1. **"Frontier AI Announcements and Stock-Market Shockwaves"** — Analysis of the $285B rout pattern, with detailed case studies on Atlassian (workflow commoditization) and IBM (COBOL modernization narrative), plus a framework for hypothetical next announcements
2. **"Frontier-Lab Agent Announcements and the Workflow Tax Repricing Thesis"** — Deep dive into the per-seat pricing attack, the GDT framework, five updated scenario archetypes, and capital rotation dynamics
3. **"AI's Market Impact Forecast"** — The original provocative "5 hypotheses" framing the first-principles case for SaaS disruption

Key sources referenced: Bloomberg ($285B rout), ABC News (Cowork plugin selloffs), Barron's (counter-narrative on enterprise events), Bain (per-seat pricing disruption), OpenAI Frontier, Anthropic MCP/Cowork/Claude Code, IBM watsonx, Microsoft agentic migration, McKinsey sovereign AI.

---

## Disclaimer

**This is not financial advice.** This tool is a speculative scenario-planning exercise for discussion and educational purposes. It does not predict stock prices, and the scores/verdicts are opinion-based hypotheses, not investment recommendations. The AI-generated analyses are speculative and not vetted by financial professionals. Always consult a qualified financial advisor before making investment decisions.

---

## Credits

- Built by [Heikki](https://github.com/heikkihamalainen)
- Powered by the Agentic Squeeze thesis
- AI analysis by Claude (Anthropic)
- Open source — fork it, break it, make it better

## License

MIT — do whatever you want with it. If you build something cool, let me know.
