# AGENTS.md — Cooked or Rocket?

> Agent-friendly guide for AI coding assistants working on this project.

## Project Overview

**Cooked or Rocket?** is a speculative stock analysis tool that evaluates how frontier AI lab announcements might reprice tech stocks using the "Agentic Squeeze" thesis. It's a single-page React app with no backend.

**Stack**: Vite + React 18 · Vanilla CSS (inline styles) · Claude API (Anthropic) · No database

## File Map

```
├── index.html              # Entry point, Google Fonts, meta tags
├── package.json            # Deps: react, react-dom, vite
├── vite.config.js          # Vite + React plugin
├── .env.example            # VITE_ANTHROPIC_API_KEY template
├── src/
│   ├── main.jsx            # React root mount
│   ├── App.jsx             # Renders <CookedOrRocket />
│   ├── index.css           # Global reset, scrollbar, selection
│   └── CookedOrRocket.jsx  # THE app — everything lives here (~1240 lines)
├── README.md               # Thesis, features, usage, research
├── AGENTS.md               # This file
└── LICENSE                 # MIT
```

## Architecture

The app is intentionally a **single monolithic component** (`CookedOrRocket.jsx`). This is a design choice for forkability — one file to copy, read, and modify.

### Key Data Structures

- **`DISRUPTION_ZONES`** (line ~3): The 5 disruption zone definitions — name, icon, color, descriptions, exposed companies, evidence
- **`KNOWN_TICKERS`** (line ~41): Pre-analyzed ticker data with scores, verdicts, zone exposures, defense/bear-case narratives. Currently 25 tickers.
- **`AI_SYSTEM_PROMPT`** (line ~369): System prompt embedding the full Agentic Squeeze thesis, used for unknown ticker analysis
- **`PORTFOLIO_PROMPT`** (line ~411): System prompt for portfolio-level synthesis

### Sub-Components (defined inline)

| Component | Purpose |
|-----------|---------|
| `Gauge` | Animated semicircle gauge (-100 to +100) |
| `ExposureBar` | Horizontal bar for zone exposure % |
| `LoadingPulse` | Spinner with status text |
| `ThesisExplainer` | Collapsible thesis/zones/GDT explainer |
| `TickerCard` | Compact ticker row for portfolio view |

### Modes

1. **Single Ticker** — Type any ticker. Known tickers return pre-analyzed data instantly. Unknown tickers hit Claude API.
2. **Portfolio X-Ray** — Enter 2–15 tickers. Each is analyzed individually, then a second API call synthesizes a portfolio-level diagnosis.

## Coding Conventions

- **Inline styles everywhere** — no CSS modules, no Tailwind, no styled-components. All styles are JS objects in `style={{}}` props.
- **No external UI libraries** — the app has zero UI dependencies beyond React.
- **Monospace for data**: `JetBrains Mono` for tickers, scores, labels. `IBM Plex Sans` for body text.
- **Color system**: `#0a0a0f` background, `#ff2d2d` (cooked/red), `#ffab00` (contested/amber), `#00e5ff` (rocket/cyan), `#00e676` (green/benefit).

## AI Integration

- API key read from `import.meta.env.VITE_ANTHROPIC_API_KEY`
- Direct browser → Anthropic API calls (uses `anthropic-dangerous-direct-browser-access` header)
- Pre-analyzed tickers work without any API key
- Model: `claude-sonnet-4-20250514`
- Response format: structured JSON (see `AI_SYSTEM_PROMPT` for schema)

## Extension Points

### Adding Pre-Analyzed Tickers
Add entries to the `KNOWN_TICKERS` object following the existing shape:
```js
TICKER: {
  name: "Company Name", score: -50, verdict: "COOKED|CONTESTED|ROCKET",
  tagline: "Witty one-liner",
  zones: {
    ephemeral: { exposure: 0-100, note: "..." },
    sre: { exposure: 0-100, note: "..." },
    zeroTicket: { exposure: 0-100, note: "..." },
    semanticCU: { exposure: 0-100, note: "..." },
    migration: { exposure: 0-100, note: "..." },
  },
  defense: "Counter-narrative text",
  wallStreet: "Bear/bull case text",
}
```

### Adding New Disruption Zones
1. Add to `DISRUPTION_ZONES` object
2. Add matching key to all `KNOWN_TICKERS[*].zones`
3. Update `AI_SYSTEM_PROMPT` to include the new zone
4. The UI auto-renders from these objects

### Backend Proxy (Production)
For production, replace direct Anthropic API calls with a backend proxy to protect the API key:
1. Create an `/api/analyze` endpoint that forwards to Anthropic
2. Update `analyzeWithAI()` and the portfolio synthesis fetch to use `/api/analyze`
3. Remove `VITE_ANTHROPIC_API_KEY` from client

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Dev server at localhost:5173
npm run build      # Production build to dist/
npm run preview    # Preview production build
```

## Scoring Guide

| Score Range | Verdict | Meaning |
|------------|---------|---------|
| -100 to -60 | COOKED 🔥 | Core product directly threatened |
| -59 to -20 | CONTESTED ⚔️ | Mixed — some exposure but has defenses |
| -19 to 19 | CONTESTED ⚔️ | Could go either way |
| 20 to 100 | ROCKET 🚀 | Benefits from the agentic squeeze |

Exposure values: positive (0–100) = company is HURT, negative (-100 to 0) = company BENEFITS.
