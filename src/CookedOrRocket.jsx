import { useState, useEffect, useRef, useCallback } from "react";

const DISRUPTION_ZONES = {
  ephemeral: {
    name: "Ephemeral App Generator", icon: "⚡", color: "#ff6b35",
    desc: "AI generates bespoke apps on demand, killing per-seat SaaS",
    long: "Instead of buying a SaaS subscription, a manager prompts: \"Build me an app to track warehouse inventory and integrate with our supplier API.\" The AI writes, tests, deploys, and hosts it in seconds. If the workflow changes tomorrow, it rewrites the app on the fly. When the marginal cost of bespoke software hits zero, paying $150/user/month for rigid platforms looks like a legacy tax.",
    exposed: "Salesforce, Workday, Monday.com, Smartsheet",
    evidence: "Anthropic's Cowork + Claude Code already close the build→deploy loop. OpenAI Canvas signals 'build alongside the model' workflows.",
  },
  sre: {
    name: "Autonomous SRE Swarm", icon: "🤖", color: "#ff4444",
    desc: "Agents auto-diagnose and auto-remediate, bypassing dashboards",
    long: "When a memory leak or zero-day exploit occurs, an agent autonomously reads raw telemetry, writes a patch, tests it in a sandbox, and hot-swaps the code — before a human is even paged. AI agents don't need beautiful dashboards. They read the raw matrix. The multi-billion-dollar market for 'human-readable observability' and 'incident routing' faces structural compression.",
    exposed: "Datadog, PagerDuty, Dynatrace, Splunk/Cisco",
    evidence: "Claude Code Security found 500+ vulnerabilities in open-source codebases. Claude Code ships 'preview, review, and merge' flows to close the remediation loop.",
  },
  zeroTicket: {
    name: "Zero-Ticket Enterprise", icon: "🎫", color: "#e040fb",
    desc: "AI resolves IT/HR requests instantly, collapsing ticket queues",
    long: "An employee messages: \"My laptop screen is broken\" or \"Process a refund for Client X.\" An AI agent with admin-grade governance resolves it instantly — provisioning hardware via vendor APIs or executing the refund. A 'ticket' is just a state machine designed to manage human delay (routing from Tier 1 to Tier 2). If the AI executes solutions instantly, the concept of a helpdesk queue is rendered useless.",
    exposed: "ServiceNow, Zendesk, Freshworks",
    evidence: "Cowork plugins expand into HR, finance, and IT functions. Enterprise integrations (Google Workspace, DocuSign) enable cross-system execution.",
  },
  semanticCU: {
    name: "Semantic Computer Use", icon: "👁️", color: "#7c4dff",
    desc: "Vision models navigate any UI at machine speed, replacing RPA",
    long: "A frontier model visually reads screens, understands proprietary legacy software (even Citrix environments), and translates data between a 1990s mainframe and a modern cloud app — just by 'looking' and 'typing' at machine speed. When the UI IS the API, the value of brittle screen-scraping bots and massive consulting fees for integration work compresses toward zero.",
    exposed: "UiPath, MuleSoft/Salesforce, Zapier, Global System Integrators",
    evidence: "OpenAI's Computer-Using Agent (CUA) processes raw pixels, uses virtual mouse/keyboard, and navigates multi-step tasks. Anthropic's MCP provides structured connectors for the rest.",
  },
  migration: {
    name: "Zero-Friction Migration", icon: "🔄", color: "#448aff",
    desc: "AI untangles legacy code, destroying switching-cost moats",
    long: "AI agents capable of untangling a Fortune 500 company's deeply customized, 20-year-old ERP architecture — translating spaghetti logic into modern cloud-native code with automated equivalence testing. SAP and Oracle stay alive through the terror of migration: moving off SAP is a multi-year, $50M+ nightmare. If AI drives the cost, time, and risk of migration toward zero, switching costs evaporate.",
    exposed: "SAP, Oracle, IBM (mainframe franchise), IT services firms",
    evidence: "Anthropic's Code Modernization Playbook targets COBOL-to-modern migration. Microsoft published an 'agentic migration factory' for COBOL. IBM dropped 13% in a day on this narrative.",
  },
};

const KNOWN_TICKERS = {
  CRM: {
    name: "Salesforce", score: -72, verdict: "COOKED",
    tagline: "The $150/seat CRM meets the $0.02/task agent",
    zones: {
      ephemeral: { exposure: 85, note: "If bespoke apps cost nothing, why rent a bloated platform?" },
      sre: { exposure: 15, note: "Minimal direct SRE exposure" },
      zeroTicket: { exposure: 40, note: "Service Cloud ticket routing faces agent compression" },
      semanticCU: { exposure: 70, note: "MuleSoft integration middleware is prime 'digital duct tape'" },
      migration: { exposure: 55, note: "Lock-in narrative weakens if migration friction drops" },
    },
    defense: "Massive installed base, data gravity, and Einstein AI pivot. But per-seat pricing is the vulnerability.",
    wallStreet: "The entire moat is customizability and lock-in — but if the marginal cost of bespoke software hits zero, $150/user/month for rigid platforms looks like a legacy tax.",
  },
  WDAY: {
    name: "Workday", score: -65, verdict: "COOKED",
    tagline: "HR workflows meet the autonomous agent era",
    zones: {
      ephemeral: { exposure: 75, note: "Custom HR/finance apps could be generated on demand" },
      sre: { exposure: 10, note: "Low SRE exposure" },
      zeroTicket: { exposure: 60, note: "Employee self-service requests get auto-resolved" },
      semanticCU: { exposure: 35, note: "Some integration layer exposure" },
      migration: { exposure: 50, note: "HCM switching costs under pressure" },
    },
    defense: "Deep payroll/compliance logic is hard to replicate. Regulatory moat is real.",
    wallStreet: "Seat-based HR platform pricing gets attacked when agents handle onboarding, provisioning, and routine HR requests autonomously.",
  },
  MNDY: {
    name: "Monday.com", score: -78, verdict: "COOKED",
    tagline: "The 'workflow UI' poster child in the agent crosshairs",
    zones: {
      ephemeral: { exposure: 90, note: "Work management is exactly what agents replace first" },
      sre: { exposure: 5, note: "No SRE exposure" },
      zeroTicket: { exposure: 45, note: "Internal request routing becomes agent-native" },
      semanticCU: { exposure: 30, note: "Low middleware exposure" },
      migration: { exposure: 20, note: "Low lock-in, easy to leave" },
    },
    defense: "Strong SMB adoption and ease of use. But that's also the vulnerability — easiest to replace.",
    wallStreet: "Named in Cowork plugin selloff coverage. When Claude becomes the project manager, who needs the project management UI?",
  },
  TEAM: {
    name: "Atlassian", score: -35, verdict: "CONTESTED",
    tagline: "Fighting to become the agent runtime, not the agent's victim",
    zones: {
      ephemeral: { exposure: 60, note: "Jira/Confluence face 'workflow UI displacement' risk" },
      sre: { exposure: 30, note: "Some DevOps workflow exposure via Jira" },
      zeroTicket: { exposure: 50, note: "JSM ticket routing faces compression" },
      semanticCU: { exposure: 25, note: "Moderate integration exposure" },
      migration: { exposure: 20, note: "Low legacy lock-in risk" },
    },
    defense: "Rovo + Teamwork Graph is the strongest 'become the agent runtime' play among workflow SaaS. Rovo Studio lets customers build agents.",
    wallStreet: "The investable question: does the agent layer capture pricing power, leaving Atlassian as a backend — or does Rovo keep it as the primary platform?",
  },
  DDOG: {
    name: "Datadog", score: -68, verdict: "COOKED",
    tagline: "Beautiful dashboards for humans who won't be looking",
    zones: {
      ephemeral: { exposure: 10, note: "Low app generation exposure" },
      sre: { exposure: 95, note: "Ground zero. Agents read raw telemetry, not dashboards" },
      zeroTicket: { exposure: 30, note: "Some incident routing overlap" },
      semanticCU: { exposure: 15, note: "Low middleware exposure" },
      migration: { exposure: 10, note: "Low migration risk" },
    },
    defense: "Telemetry ingestion at scale is genuinely hard. Agents still NEED the data — just not the UI. Pivot to 'agent telemetry platform' is possible.",
    wallStreet: "AI agents don't need beautiful dashboards. They read the raw matrix. The $40B+ premium for 'human-readable observability' faces structural compression.",
  },
  PD: {
    name: "PagerDuty", score: -82, verdict: "COOKED",
    tagline: "You can't page a robot that already fixed it",
    zones: {
      ephemeral: { exposure: 5, note: "No app generation exposure" },
      sre: { exposure: 98, note: "Incident routing IS the product. Auto-remediation kills the loop" },
      zeroTicket: { exposure: 40, note: "On-call scheduling becomes less critical" },
      semanticCU: { exposure: 10, note: "Low middleware exposure" },
      migration: { exposure: 5, note: "Low migration risk" },
    },
    defense: "Compliance and audit trails for incidents still matter. But the core 'wake up a human' value prop is existentially threatened.",
    wallStreet: "PagerDuty's entire value is routing humans to incidents. If the agent auto-remediates before a human is paged, the queue ceases to exist.",
  },
  NOW: {
    name: "ServiceNow", score: -55, verdict: "COOKED",
    tagline: "The $170B ticket machine meets the zero-ticket future",
    zones: {
      ephemeral: { exposure: 40, note: "Custom workflow apps could bypass NOW entirely" },
      sre: { exposure: 35, note: "IT operations management overlap" },
      zeroTicket: { exposure: 95, note: "Ground zero. Tickets are state machines for human delay" },
      semanticCU: { exposure: 30, note: "Some integration platform exposure" },
      migration: { exposure: 25, note: "Moderate lock-in exposure" },
    },
    defense: "Massive enterprise entrenchment, system-of-record status, and their own AI pivot (Now Assist). Deep process embedding is real defense.",
    wallStreet: "A 'ticket' is a state machine designed to manage human delay. If AI executes solutions instantly, the concept of a helpdesk queue is rendered useless.",
  },
  PATH: {
    name: "UiPath", score: -85, verdict: "COOKED",
    tagline: "Screen-scraping bots meet the model that can see",
    zones: {
      ephemeral: { exposure: 15, note: "Low app generation exposure" },
      sre: { exposure: 20, note: "Some automation overlap" },
      zeroTicket: { exposure: 25, note: "Some helpdesk automation overlap" },
      semanticCU: { exposure: 99, note: "Existential. Semantic computer use IS what RPA does, but better" },
      migration: { exposure: 30, note: "Legacy automation scripts face obsolescence" },
    },
    defense: "Existing enterprise deployments and governance. But the core tech — brittle screen-scraping bots — is exactly what vision models commoditize.",
    wallStreet: "When the UI IS the API and frontier models navigate any interface at machine speed, the value of rigid, brittle RPA bots compresses to zero.",
  },
  IBM: {
    name: "IBM", score: -30, verdict: "CONTESTED",
    tagline: "250 billion lines of COBOL say it's complicated",
    zones: {
      ephemeral: { exposure: 10, note: "Low app generation exposure" },
      sre: { exposure: 25, note: "Some infrastructure management overlap" },
      zeroTicket: { exposure: 15, note: "Low ticket exposure" },
      semanticCU: { exposure: 20, note: "Some middleware exposure" },
      migration: { exposure: 90, note: "Ground zero. COBOL modernization narrative directly threatens mainframe franchise" },
    },
    defense: "Mainframes power 70% of global transactions by value. watsonx Code Assistant for Z is IBM's own counter-play. Transaction processing doesn't migrate over a weekend.",
    wallStreet: "Sharp 13% one-day drop on Anthropic COBOL modernization claims. The question isn't 'can AI rewrite COBOL' — it's who captures the modernization spend.",
  },
  SAP: {
    name: "SAP", score: -45, verdict: "CONTESTED",
    tagline: "The terror of migration is the moat. AI is the tunnel.",
    zones: {
      ephemeral: { exposure: 30, note: "Some custom app displacement" },
      sre: { exposure: 10, note: "Low SRE exposure" },
      zeroTicket: { exposure: 25, note: "Some internal workflow exposure" },
      semanticCU: { exposure: 35, note: "Integration complexity is the product" },
      migration: { exposure: 85, note: "If switching costs fall, monopoly retention assumptions collapse" },
    },
    defense: "Lock-in isn't just technical — it's process, regulatory, and organizational. Business process redesign remains hard even if code migration gets easier.",
    wallStreet: "SAP stays alive through migration terror. If AI drives migration cost toward zero, switching costs evaporate and multiples compress.",
  },
  ORCL: {
    name: "Oracle", score: -42, verdict: "CONTESTED",
    tagline: "Database moats meet the great untangling",
    zones: {
      ephemeral: { exposure: 25, note: "Some custom app displacement" },
      sre: { exposure: 15, note: "Low SRE exposure" },
      zeroTicket: { exposure: 20, note: "Some workflow exposure" },
      semanticCU: { exposure: 30, note: "Some integration exposure" },
      migration: { exposure: 80, note: "Legacy ERP lock-in is the core risk" },
    },
    defense: "Cloud infrastructure pivot (OCI) and database dominance provide alternative revenue streams. But ERP lock-in narrative faces the same pressure as SAP.",
    wallStreet: "Oracle's ERP moat is migration terror. Same thesis as SAP — if agents dramatically reduce switching costs, retention assumptions weaken.",
  },
  CRWD: {
    name: "CrowdStrike", score: -48, verdict: "CONTESTED",
    tagline: "Security demand rises with AI, but so does AI security",
    zones: {
      ephemeral: { exposure: 5, note: "No app generation exposure" },
      sre: { exposure: 75, note: "Scan-to-fix-to-verify agents compress detection/response value" },
      zeroTicket: { exposure: 20, note: "Some security ticket routing exposure" },
      semanticCU: { exposure: 15, note: "Low middleware exposure" },
      migration: { exposure: 5, note: "No migration exposure" },
    },
    defense: "Security demand actually INCREASES as AI expands attack surface. Trust, compliance SLAs, and integrated telemetry are powerful moats.",
    wallStreet: "Claude Code Security found 500+ vulns in open-source code. Market fear: 'AI will do security better than signature tools.'",
  },
  GTLB: {
    name: "GitLab", score: -70, verdict: "COOKED",
    tagline: "Per-developer-seat pricing meets the AI engineer",
    zones: {
      ephemeral: { exposure: 30, note: "Some development platform overlap" },
      sre: { exposure: 60, note: "CI/CD and deployment automation directly exposed" },
      zeroTicket: { exposure: 20, note: "Low ticket exposure" },
      semanticCU: { exposure: 25, note: "Some integration exposure" },
      migration: { exposure: 15, note: "Low migration risk" },
    },
    defense: "Can reframe as 'where agents run' — the execution substrate. But per-developer-seat pricing is exactly what autonomous coding agents attack.",
    wallStreet: "If Claude Code takes backlog item → edits code → opens PR → fixes CI → merges → deploys, the 'human labor moat' shrinks and seat pricing collapses.",
  },
  TRI: {
    name: "Thomson Reuters", score: -62, verdict: "COOKED",
    tagline: "Expensive legal research becomes an AI plugin feature",
    zones: {
      ephemeral: { exposure: 20, note: "Some custom app displacement" },
      sre: { exposure: 5, note: "No SRE exposure" },
      zeroTicket: { exposure: 30, note: "Legal workflow routing exposure" },
      semanticCU: { exposure: 25, note: "Some integration exposure" },
      migration: { exposure: 15, note: "Low migration risk" },
    },
    defense: "Proprietary legal content and regulated workflows. But the premium for packaging that content faces compression when AI plugins do the same work.",
    wallStreet: "Fell 15%+ on Cowork legal plugin announcement. What used to be expensive seat-based legal research becomes a low-cost AI plugin feature.",
  },
  FRSH: {
    name: "Freshworks", score: -75, verdict: "COOKED",
    tagline: "SMB helpdesk meets the zero-ticket agent",
    zones: {
      ephemeral: { exposure: 50, note: "SMB workflow tools easily displaced" },
      sre: { exposure: 10, note: "Low SRE exposure" },
      zeroTicket: { exposure: 90, note: "Helpdesk and ITSM core product directly threatened" },
      semanticCU: { exposure: 15, note: "Low middleware exposure" },
      migration: { exposure: 10, note: "Low lock-in, easy to leave" },
    },
    defense: "SMB focus and ease of adoption. But SMB is also where agents deploy fastest with least friction.",
    wallStreet: "Same thesis as ServiceNow but worse — less enterprise entrenchment, less system-of-record defensibility, and SMB is first to adopt agents.",
  },
  DT: {
    name: "Dynatrace", score: -60, verdict: "COOKED",
    tagline: "AI-powered observability... meet AI-powered auto-remediation",
    zones: {
      ephemeral: { exposure: 10, note: "Low app generation exposure" },
      sre: { exposure: 90, note: "Observability and AIOps core product directly exposed" },
      zeroTicket: { exposure: 25, note: "Some IT operations overlap" },
      semanticCU: { exposure: 15, note: "Low middleware exposure" },
      migration: { exposure: 10, note: "Low migration risk" },
    },
    defense: "Davis AI engine and full-stack observability. Already positioned as 'AI-powered' — but the question is whether observability stays a standalone category.",
    wallStreet: "Same structural compression as Datadog. When agents auto-diagnose and auto-remediate, the premium for 'human-readable observability' shrinks.",
  },
  OKTA: {
    name: "Okta", score: -25, verdict: "CONTESTED",
    tagline: "Identity becomes MORE critical, but pricing gets squeezed",
    zones: {
      ephemeral: { exposure: 15, note: "Low app generation exposure" },
      sre: { exposure: 30, note: "Some security automation overlap" },
      zeroTicket: { exposure: 35, note: "Identity provisioning requests get auto-resolved" },
      semanticCU: { exposure: 20, note: "Low middleware exposure" },
      migration: { exposure: 10, note: "Low migration risk" },
    },
    defense: "Identity and access management becomes MORE important in an agent world — agents need permissions, boundaries, audit trails. Okta could be infrastructure for agent governance.",
    wallStreet: "Dropped on Claude Code Security announcement, but identity is arguably the GOVERNANCE layer agents need. Could benefit from the GDT thesis.",
  },
  NVDA: {
    name: "NVIDIA", score: 88, verdict: "ROCKET",
    tagline: "Every disrupted workflow still needs GPU cycles",
    zones: {
      ephemeral: { exposure: -80, note: "More apps = more inference = more GPUs" },
      sre: { exposure: -85, note: "Auto-remediation agents need compute" },
      zeroTicket: { exposure: -70, note: "Every resolved ticket is an inference call" },
      semanticCU: { exposure: -90, note: "Vision models are the most compute-hungry" },
      migration: { exposure: -75, note: "Code migration at scale = massive GPU demand" },
    },
    defense: "N/A — NVIDIA IS the defense. Every disruption zone runs on their silicon.",
    wallStreet: "Capital consolidates into compute as the application layer gets squeezed. AI demand surges = NVIDIA demand surges. The base layer wins.",
  },
  TSM: {
    name: "TSMC", score: 82, verdict: "ROCKET",
    tagline: "You can't run agents without chips. Period.",
    zones: {
      ephemeral: { exposure: -75, note: "More apps = more chips needed" },
      sre: { exposure: -70, note: "Auto-remediation needs silicon" },
      zeroTicket: { exposure: -65, note: "Every agent call needs a chip" },
      semanticCU: { exposure: -80, note: "Vision models need cutting-edge process nodes" },
      migration: { exposure: -70, note: "Modernization workloads drive chip demand" },
    },
    defense: "N/A — monopoly on advanced chip manufacturing. Geopolitical risk is the only real concern.",
    wallStreet: "As AI demand surges, the chokepoint is fabrication. TSMC manufactures the GPUs that power every agent. Scarce layer = value capture.",
  },
  MSFT: {
    name: "Microsoft", score: 55, verdict: "ROCKET",
    tagline: "The house always wins when you own the cloud AND the model",
    zones: {
      ephemeral: { exposure: -40, note: "Azure + OpenAI partnership = platform for generated apps" },
      sre: { exposure: -50, note: "Azure becomes the agent execution substrate" },
      zeroTicket: { exposure: -30, note: "Copilot ecosystem captures agent demand" },
      semanticCU: { exposure: -45, note: "Own the OS, own the agent runtime" },
      migration: { exposure: -55, note: "Azure is the migration DESTINATION" },
    },
    defense: "N/A — Microsoft owns Azure, GitHub, OpenAI partnership, Windows, and Office. Multi-layer positioning.",
    wallStreet: "Capital rotates to infrastructure. Microsoft owns the cloud, the code platform, the model partner, the OS, and the productivity suite. The agent squeeze BENEFITS the platform owner.",
  },
  AMZN: {
    name: "Amazon", score: 45, verdict: "ROCKET",
    tagline: "AWS: where the agents actually run",
    zones: {
      ephemeral: { exposure: -35, note: "AWS hosts the generated apps" },
      sre: { exposure: -45, note: "Auto-remediation runs on cloud infrastructure" },
      zeroTicket: { exposure: -25, note: "Bedrock captures agent workloads" },
      semanticCU: { exposure: -30, note: "Cloud compute for vision models" },
      migration: { exposure: -40, note: "Cloud is the migration destination" },
    },
    defense: "N/A — AWS is the execution substrate. Every agentic workflow needs cloud compute, storage, and networking.",
    wallStreet: "The agentic squeeze compresses the application layer but EXPANDS cloud infrastructure demand. AWS captures the usage-based upside.",
  },
  GOOG: {
    name: "Alphabet", score: 50, verdict: "ROCKET",
    tagline: "Gemini + GCP + A2A protocol = full-stack agent play",
    zones: {
      ephemeral: { exposure: -30, note: "GCP + Gemini platform for agent deployment" },
      sre: { exposure: -40, note: "Cloud + AI infrastructure benefit" },
      zeroTicket: { exposure: -25, note: "Vertex AI agent builder captures demand" },
      semanticCU: { exposure: -35, note: "A2A protocol positions Google as interop standard" },
      migration: { exposure: -30, note: "Cloud migration destination" },
    },
    defense: "N/A — owns frontier models (Gemini), cloud (GCP), agent standards (A2A), and the world's data index.",
    wallStreet: "Google is building the standards (A2A) AND the platform. Frontier model + cloud + enterprise AI = multi-layer value capture.",
  },
  INTU: {
    name: "Intuit", score: -50, verdict: "COOKED",
    tagline: "TurboTax meets the agent that files taxes for free",
    zones: {
      ephemeral: { exposure: 70, note: "Tax/accounting workflows are prime for agent automation" },
      sre: { exposure: 5, note: "No SRE exposure" },
      zeroTicket: { exposure: 40, note: "Customer support routing exposure" },
      semanticCU: { exposure: 20, note: "Low middleware exposure" },
      migration: { exposure: 30, note: "Moderate switching cost exposure" },
    },
    defense: "Regulatory complexity and tax code expertise. But if an agent can navigate the same rules at near-zero cost, the premium collapses.",
    wallStreet: "Named in Cowork plugin selloff coverage. Tax preparation and bookkeeping are structured, rules-based workflows — exactly what agents excel at.",
  },
  PYPL: {
    name: "PayPal", score: -28, verdict: "CONTESTED",
    tagline: "Payments survive, but the workflow premium doesn't",
    zones: {
      ephemeral: { exposure: 30, note: "Some fintech workflow displacement" },
      sre: { exposure: 5, note: "No SRE exposure" },
      zeroTicket: { exposure: 35, note: "Payment dispute resolution automation" },
      semanticCU: { exposure: 25, note: "Some integration exposure" },
      migration: { exposure: 15, note: "Low migration risk" },
    },
    defense: "Payment rails are infrastructure. Transaction processing is a moat that agents actually need, not replace.",
    wallStreet: "Named in broader Cowork selloff but less directly exposed. Payments are infrastructure; the risk is more about workflow features around the core.",
  },
  ZS: {
    name: "Zscaler", score: -40, verdict: "CONTESTED",
    tagline: "Zero trust meets zero-human security operations",
    zones: {
      ephemeral: { exposure: 5, note: "No app generation exposure" },
      sre: { exposure: 65, note: "Security scanning and remediation automation" },
      zeroTicket: { exposure: 25, note: "Security ticket routing exposure" },
      semanticCU: { exposure: 15, note: "Low middleware exposure" },
      migration: { exposure: 5, note: "No migration exposure" },
    },
    defense: "Zero-trust architecture becomes MORE important with agents. Security demand increases as AI expands. But automated scanning compresses detection premium.",
    wallStreet: "Dropped on Claude Code Security announcement. AI security capabilities compress premium for human-in-the-loop security operations.",
  },
};

const AI_SYSTEM_PROMPT = `You are an AI stock analyst evaluating how frontier AI lab announcements (from Anthropic, OpenAI, Google DeepMind) might impact public tech companies. You apply the "Agentic Squeeze" thesis.

THE THESIS: B2B SaaS built trillion-dollar moats by taxing human workflows via per-seat pricing. Agentic AI attacks that model — when agents EXECUTE work autonomously, software designed to organize humans becomes overhead. Capital rotates from the application layer to scarce layers (compute, data, infrastructure).

THE 5 DISRUPTION ZONES:
1. Ephemeral App Generator — AI generates bespoke apps on demand, killing per-seat SaaS
2. Autonomous SRE Swarm — Agents auto-diagnose/remediate, bypassing observability dashboards
3. Zero-Ticket Enterprise — AI resolves IT/HR requests instantly, collapsing ticket queues
4. Semantic Computer Use — Vision models navigate any UI at machine speed, replacing RPA/middleware
5. Zero-Friction Migration — AI untangles legacy code, destroying switching-cost moats

THE GDT FRAMEWORK (what makes disruption real):
- Governance: Can agent be trusted with real permissions?
- Data: Can it access enterprise data safely?
- Tools: Can it execute end-to-end (not just draft)?

RESPOND WITH ONLY THIS JSON (no markdown, no backticks, no preamble):
{
  "name": "Company Name",
  "score": <number from -100 to 100, negative=cooked, positive=rocket>,
  "verdict": "<COOKED|CONTESTED|ROCKET>",
  "tagline": "<witty one-liner about their agentic exposure>",
  "zones": {
    "ephemeral": {"exposure": <-100 to 100>, "note": "<1 sentence>"},
    "sre": {"exposure": <-100 to 100>, "note": "<1 sentence>"},
    "zeroTicket": {"exposure": <-100 to 100>, "note": "<1 sentence>"},
    "semanticCU": {"exposure": <-100 to 100>, "note": "<1 sentence>"},
    "migration": {"exposure": <-100 to 100>, "note": "<1 sentence>"}
  },
  "wallStreet": "<2-3 sentences: the bear/bull case from Wall Street perspective>",
  "defense": "<2-3 sentences: the counter-narrative, what could defend this company>"
}

SCORING GUIDE:
- Score -60 to -100: COOKED (core product directly threatened by agentic AI)
- Score -20 to -59: CONTESTED (mixed — some disruption exposure but has defenses)  
- Score -19 to 19: CONTESTED (could go either way)
- Score 20 to 100: ROCKET (benefits from the agentic squeeze — infrastructure, compute, data layer)
- Exposure is positive (0-100) if the company is HURT by that zone, negative (-100 to 0) if it BENEFITS.

Be provocative but grounded. Think first principles.`;

const PORTFOLIO_PROMPT = `You are synthesizing a portfolio-level view of how frontier AI lab disruption affects a set of holdings. Given the individual ticker analyses below, provide a portfolio-level synthesis.

RESPOND WITH ONLY THIS JSON (no markdown, no backticks, no preamble):
{
  "overallScore": <weighted average score, -100 to 100>,
  "overallVerdict": "<COOKED|CONTESTED|ROCKET>",
  "headline": "<provocative 1-sentence portfolio diagnosis>",
  "concentration": "<which disruption zone is the portfolio MOST exposed to and why, 1-2 sentences>",
  "blindSpot": "<what risk is the portfolio NOT hedged against, 1-2 sentences>",
  "playbook": "<1-2 sentences: what move would rebalance this portfolio against the agentic squeeze>"
}`;

const Gauge = ({ score, animate }) => {
  const rotation = ((score + 100) / 200) * 180 - 90;
  const displayRotation = animate ? rotation : -90;
  const getColor = (s) => {
    if (s <= -60) return "#ff2d2d";
    if (s <= -30) return "#ff6b35";
    if (s <= 0) return "#ffab00";
    if (s <= 30) return "#64dd17";
    if (s <= 60) return "#00e676";
    return "#00e5ff";
  };
  return (
    <div style={{ position: "relative", width: "280px", height: "160px", margin: "0 auto" }}>
      <svg viewBox="0 0 280 160" style={{ width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff2d2d" /><stop offset="25%" stopColor="#ff6b35" />
            <stop offset="50%" stopColor="#ffab00" /><stop offset="75%" stopColor="#64dd17" />
            <stop offset="100%" stopColor="#00e5ff" />
          </linearGradient>
        </defs>
        <path d="M 30 145 A 110 110 0 0 1 250 145" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="18" strokeLinecap="round" />
        <path d="M 30 145 A 110 110 0 0 1 250 145" fill="none" stroke="url(#gaugeGrad)" strokeWidth="18" strokeLinecap="round" opacity="0.6" />
        <g style={{ transform: `rotate(${displayRotation}deg)`, transformOrigin: "140px 145px", transition: animate ? "transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)" : "none" }}>
          <line x1="140" y1="145" x2="140" y2="50" stroke={getColor(score)} strokeWidth="3" strokeLinecap="round" />
          <circle cx="140" cy="145" r="8" fill={getColor(score)} />
        </g>
        <text x="30" y="158" fill="#ff2d2d" fontSize="11" fontFamily="'JetBrains Mono', monospace" textAnchor="middle">COOKED</text>
        <text x="250" y="158" fill="#00e5ff" fontSize="11" fontFamily="'JetBrains Mono', monospace" textAnchor="middle">ROCKET</text>
      </svg>
    </div>
  );
};

const ExposureBar = ({ value, color, label, note }) => {
  const clampedValue = Math.max(-100, Math.min(100, Number(value) || 0));
  const isPositive = clampedValue < 0;
  const absVal = Math.abs(clampedValue);
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "12px" }}>
        <span style={{ color: "#aaa", fontFamily: "'JetBrains Mono', monospace" }}>{label}</span>
        <span style={{ color: isPositive ? "#00e676" : color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
          {isPositive ? "BENEFITS" : `${absVal}% exposed`}
        </span>
      </div>
      <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ width: `${absVal}%`, height: "100%", background: isPositive ? "#00e676" : color, borderRadius: "3px", transition: "width 0.8s ease", opacity: 0.8 }} />
      </div>
      <div style={{ fontSize: "11px", color: "#666", marginTop: "3px", lineHeight: 1.3 }}>{note}</div>
    </div>
  );
};

const LoadingPulse = ({ text }) => (
  <div style={{ textAlign: "center", padding: "60px 20px" }}>
    <div style={{ display: "inline-block", position: "relative" }}>
      <div style={{
        width: "48px", height: "48px", borderRadius: "50%",
        border: "2px solid rgba(255,255,255,0.1)", borderTopColor: "#ffab00",
        animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
    <div style={{ color: "#888", fontSize: "14px", fontFamily: "'JetBrains Mono', monospace" }}>{text}</div>
  </div>
);

const ThesisExplainer = ({ isOpen, onToggle }) => (
  <div style={{ marginBottom: "28px" }}>
    <button onClick={onToggle}
      style={{
        width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: isOpen ? "10px 10px 0 0" : "10px", padding: "14px 20px",
        color: "#888", fontSize: "13px", fontFamily: "'JetBrains Mono', monospace",
        cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#bbb"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#888"; }}
    >
      <span>📖 What is the Agentic Squeeze? — The thesis & 5 disruption zones</span>
      <span style={{ fontSize: "16px", transition: "transform 0.3s", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
    </button>
    {isOpen && (
      <div style={{
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderTop: "none",
        borderRadius: "0 0 10px 10px", padding: "20px 20px 24px", animation: "fadeIn 0.3s ease",
      }}>
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

        {/* Core thesis */}
        <div style={{ marginBottom: "20px", paddingBottom: "18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#ffab00", fontFamily: "'JetBrains Mono', monospace", marginBottom: "8px" }}>
            The Core Thesis
          </div>
          <p style={{ color: "#bbb", fontSize: "13px", lineHeight: 1.65, margin: 0 }}>
            For 20 years, B2B software companies built trillion-dollar market caps by acting as <strong style={{ color: "#fff" }}>tax collectors on human workflows</strong> — per-seat pricing that scales with headcount.
            Agentic AI breaks this model: when agents <em>execute</em> work autonomously (not just suggest), the software designed to organize humans becomes overhead.
            The $285B market rout following Anthropic's agent releases was the market learning to price this structural shift.
          </p>
        </div>

        {/* GDT Framework */}
        <div style={{ marginBottom: "20px", paddingBottom: "18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#ffab00", fontFamily: "'JetBrains Mono', monospace", marginBottom: "8px" }}>
            GDT Framework — What Makes Disruption Real
          </div>
          <div style={{ display: "grid", gap: "8px" }}>
            {[
              { letter: "G", label: "Governance", text: "Can the agent be trusted with real permissions, identity, audit trails?" },
              { letter: "D", label: "Data", text: "Can it access living enterprise data safely and broadly via connectors?" },
              { letter: "T", label: "Tools", text: "Can it execute end-to-end — not just draft text, but push buttons and change systems?" },
            ].map((item) => (
              <div key={item.letter} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "14px",
                  color: "#ffab00", background: "rgba(255,171,0,0.1)", borderRadius: "4px",
                  padding: "2px 8px", flexShrink: 0,
                }}>{item.letter}</span>
                <span style={{ color: "#999", fontSize: "13px", lineHeight: 1.5 }}>
                  <strong style={{ color: "#ccc" }}>{item.label}:</strong> {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 5 Disruption Zones */}
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#ffab00", fontFamily: "'JetBrains Mono', monospace", marginBottom: "12px" }}>
            The 5 Disruption Zones
          </div>
          <div style={{ display: "grid", gap: "12px" }}>
            {Object.entries(DISRUPTION_ZONES).map(([key, zone]) => (
              <div key={key} style={{
                padding: "14px 16px", background: `${zone.color}08`,
                border: `1px solid ${zone.color}18`, borderRadius: "8px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "16px" }}>{zone.icon}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "13px", color: zone.color }}>
                    {zone.name}
                  </span>
                </div>
                <p style={{ color: "#aaa", fontSize: "12.5px", lineHeight: 1.6, margin: "0 0 8px 0" }}>
                  {zone.long}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "11px" }}>
                  <span style={{ color: "#666" }}>
                    <span style={{ color: "#ff6b35" }}>Exposed:</span> {zone.exposed}
                  </span>
                </div>
                <div style={{ fontSize: "11px", color: "#555", marginTop: "6px", fontStyle: "italic" }}>
                  {zone.evidence}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Capital rotation */}
        <div style={{ marginTop: "20px", paddingTop: "18px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#ffab00", fontFamily: "'JetBrains Mono', monospace", marginBottom: "8px" }}>
            Where Capital Rotates
          </div>
          <div style={{ display: "grid", gap: "6px" }}>
            {[
              { icon: "🔲", label: "Base Layer", text: "Compute, energy, hyperscalers (NVIDIA, TSMC, nuclear power)" },
              { icon: "🗄️", label: "Proprietary Data", text: "Un-scrapable real-world data that agents need for grounding" },
              { icon: "🏛️", label: "Sovereign AI", text: "On-prem 'AI Factories' — enterprises can't pipe their operational nervous system to a public API" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "4px 0" }}>
                <span style={{ fontSize: "14px", flexShrink: 0 }}>{item.icon}</span>
                <span style={{ color: "#999", fontSize: "12.5px", lineHeight: 1.5 }}>
                  <strong style={{ color: "#ccc" }}>{item.label}:</strong> {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
);

const TickerCard = ({ ticker, data, onClick, compact }) => {
  const verdictColor = data.verdict === "COOKED" ? "#ff2d2d" : data.verdict === "ROCKET" ? "#00e5ff" : "#ffab00";
  const icon = data.verdict === "COOKED" ? "🔥" : data.verdict === "ROCKET" ? "🚀" : "⚔️";
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `View analysis for ${ticker} - ${data.name}` : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
      style={{
        background: `linear-gradient(135deg, ${verdictColor}08, ${verdictColor}03)`,
        border: `1px solid ${verdictColor}20`,
        borderRadius: "10px", padding: compact ? "12px 16px" : "16px 20px",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}
      onMouseEnter={onClick ? (e) => { e.currentTarget.style.borderColor = `${verdictColor}50`; e.currentTarget.style.transform = "translateY(-1px)"; } : undefined}
      onMouseLeave={onClick ? (e) => { e.currentTarget.style.borderColor = `${verdictColor}20`; e.currentTarget.style.transform = "translateY(0)"; } : undefined}
    >
      <div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#fff", marginRight: "10px" }}>${ticker}</span>
        <span style={{ color: "#666", fontSize: "13px" }}>{data.name}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "13px", color: verdictColor }}>
          {data.score > 0 ? "+" : ""}{data.score}
        </span>
        <span style={{ fontSize: "18px" }}>{icon}</span>
      </div>
    </div>
  );
};

// ⚠️ SECURITY: This key is exposed in the browser bundle. Only use for local
// development or personal use. For production deployments, route API calls
// through a backend proxy — see AGENTS.md "Backend Proxy" section.
const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || '';

export default function CookedOrRocket() {
  const [mode, setMode] = useState("single"); // single | portfolio
  const [input, setInput] = useState("");
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [selectedTickerSymbol, setSelectedTickerSymbol] = useState("");
  const [animate, setAnimate] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allTickers, setAllTickers] = useState({ ...KNOWN_TICKERS });
  const [portfolioInput, setPortfolioInput] = useState("");
  const [portfolioResults, setPortfolioResults] = useState(null);
  const [portfolioSynthesis, setPortfolioSynthesis] = useState(null);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [portfolioProgress, setPortfolioProgress] = useState("");
  const [aiGenerated, setAiGenerated] = useState(false);
  const [explainerOpen, setExplainerOpen] = useState(false);
  const inputRef = useRef(null);

  const knownKeys = Object.keys(allTickers).sort();

  useEffect(() => {
    if (input.length > 0 && !showResults) {
      const filtered = knownKeys.filter(
        (t) => t.startsWith(input.toUpperCase()) || allTickers[t].name.toLowerCase().includes(input.toLowerCase())
      );
      const hasExact = filtered.some((t) => t === input.toUpperCase());
      if (!hasExact && input.length >= 1) {
        setSuggestions([...filtered.slice(0, 5), "__CUSTOM__"]);
      } else {
        setSuggestions(filtered.slice(0, 6));
      }
    } else {
      setSuggestions([]);
    }
  }, [input, showResults]);

  const analyzeWithAI = useCallback(async (ticker) => {
    setLoading(true);
    setError(null);
    setAiGenerated(true);
    try {
      if (!ANTHROPIC_API_KEY) {
        setError("Set VITE_ANTHROPIC_API_KEY in your .env file to enable AI analysis. Pre-analyzed tickers still work without a key.");
        return null;
      }
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: AI_SYSTEM_PROMPT,
          messages: [{ role: "user", content: `Analyze ticker: ${ticker}. What company is this? How exposed is it to the Agentic Squeeze across the 5 disruption zones? Apply the GDT framework. Be provocative but grounded.` }],
        }),
      });
      if (!response.ok) {
        const errBody = await response.text().catch(() => "");
        throw new Error(`API error ${response.status}: ${errBody.slice(0, 200)}`);
      }
      const data = await response.json();
      const text = data.content.map((i) => i.text || "").join("\n");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      // Validate top-level structure
      if (!parsed.name || parsed.score === undefined || !parsed.verdict || !parsed.zones) {
        throw new Error("Invalid response structure");
      }
      // Clamp score and derive verdict
      parsed.score = Math.max(-100, Math.min(100, Number(parsed.score) || 0));
      if (parsed.score <= -20) parsed.verdict = parsed.score <= -60 ? "COOKED" : "CONTESTED";
      else if (parsed.score >= 20) parsed.verdict = "ROCKET";
      else parsed.verdict = "CONTESTED";
      // Validate and clamp zone exposures
      const zoneKeys = ["ephemeral", "sre", "zeroTicket", "semanticCU", "migration"];
      for (const zk of zoneKeys) {
        if (!parsed.zones[zk]) parsed.zones[zk] = { exposure: 0, note: "No data" };
        parsed.zones[zk].exposure = Math.max(-100, Math.min(100, Number(parsed.zones[zk].exposure) || 0));
        parsed.zones[zk].note = String(parsed.zones[zk].note || "");
      }
      parsed.wallStreet = String(parsed.wallStreet || "");
      parsed.defense = String(parsed.defense || "");
      parsed.tagline = String(parsed.tagline || "");
      return parsed;
    } catch (err) {
      console.error("AI analysis error:", err);
      setError("Could not analyze this ticker. It might not be a recognized public company, or the AI had trouble. Try again?");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyze = useCallback(async (ticker) => {
    const upperTicker = ticker.toUpperCase().trim();
    setInput(upperTicker);
    setSuggestions([]);
    setSelectedTicker(null);
    setShowResults(false);
    setAnimate(false);
    setError(null);
    setAiGenerated(false);

    if (allTickers[upperTicker]) {
      setTimeout(() => {
        setSelectedTicker(allTickers[upperTicker]);
        setSelectedTickerSymbol(upperTicker);
        setShowResults(true);
        setTimeout(() => setAnimate(true), 100);
      }, 200);
    } else {
      setLoading(true);
      setShowResults(true);
      const result = await analyzeWithAI(upperTicker);
      if (result) {
        setAllTickers((prev) => ({ ...prev, [upperTicker]: result }));
        setSelectedTicker(result);
        setSelectedTickerSymbol(upperTicker);
        setTimeout(() => setAnimate(true), 100);
      }
    }
  }, [allTickers, analyzeWithAI]);

  const analyzePortfolio = useCallback(async () => {
    const tickers = portfolioInput
      .toUpperCase()
      .split(/[,\s\n]+/)
      .map((t) => t.replace("$", "").trim())
      .filter((t) => t.length > 0 && t.length <= 6);

    if (tickers.length < 2) {
      setError("Enter at least 2 tickers to analyze a portfolio");
      return;
    }
    if (tickers.length > 15) {
      setError("Maximum 15 tickers per portfolio analysis");
      return;
    }

    setPortfolioLoading(true);
    setPortfolioResults(null);
    setPortfolioSynthesis(null);
    setError(null);

    const results = {};
    for (const ticker of tickers) {
      setPortfolioProgress(`Analyzing ${ticker}... (${Object.keys(results).length + 1}/${tickers.length})`);
      if (allTickers[ticker]) {
        results[ticker] = allTickers[ticker];
      } else {
        const result = await analyzeWithAI(ticker);
        if (result) {
          results[ticker] = result;
          setAllTickers((prev) => ({ ...prev, [ticker]: result }));
        }
      }
      setLoading(false);
    }

    setPortfolioResults(results);
    setPortfolioProgress("Synthesizing portfolio view...");

    // Now get portfolio synthesis
    if (ANTHROPIC_API_KEY && Object.keys(results).length >= 2) {
      try {
        const summaries = Object.entries(results).map(([t, d]) =>
          `${t} (${d.name}): score=${d.score}, verdict=${d.verdict}, tagline="${d.tagline}"`
        ).join("\n");

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: PORTFOLIO_PROMPT,
            messages: [{ role: "user", content: `Portfolio holdings:\n${summaries}\n\nSynthesize a portfolio-level diagnosis against the Agentic Squeeze thesis.` }],
          }),
        });
        if (!response.ok) throw new Error(`API error ${response.status}`);
        const data = await response.json();
        const text = data.content.map((i) => i.text || "").join("\n");
        const clean = text.replace(/```json|```/g, "").trim();
        const synthesis = JSON.parse(clean);
        setPortfolioSynthesis(synthesis);
      } catch (err) {
        console.error("Portfolio synthesis error:", err);
        setError("Portfolio synthesis failed — individual results are shown below.");
      }
    } else if (!ANTHROPIC_API_KEY) {
      // Skip synthesis when no API key — individual pre-analyzed results still show
    }

    setPortfolioLoading(false);
    setPortfolioProgress("");
  }, [portfolioInput, allTickers, analyzeWithAI]);

  const reset = () => {
    setShowResults(false);
    setSelectedTicker(null);
    setSelectedTickerSymbol("");
    setInput("");
    setAnimate(false);
    setError(null);
    setAiGenerated(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const data = selectedTicker;
  const verdictColor = data?.verdict === "COOKED" ? "#ff2d2d" : data?.verdict === "ROCKET" ? "#00e5ff" : "#ffab00";

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0f", color: "#e0e0e0",
      fontFamily: "'IBM Plex Sans', -apple-system, sans-serif", position: "relative", overflow: "hidden",
    }}>
      {/* Fonts loaded in index.html */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at 20% 50%, rgba(255,45,45,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(0,229,255,0.04) 0%, transparent 50%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 20px", position: "relative" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", color: "#555", fontFamily: "'JetBrains Mono', monospace", marginBottom: "16px" }}>
            Speculative · Not Financial Advice · Open Source
          </div>
          <h1 style={{
            fontSize: "clamp(32px, 7vw, 52px)", fontWeight: 700, fontFamily: "'IBM Plex Sans', sans-serif",
            lineHeight: 1.05, margin: "0 0 12px 0",
            background: "linear-gradient(135deg, #ff2d2d 0%, #ffab00 50%, #00e5ff 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Cooked or Rocket?
          </h1>
          <p style={{ color: "#666", fontSize: "15px", lineHeight: 1.5, maxWidth: "500px", margin: "0 auto 20px" }}>
            How frontier AI lab announcements might reprice tech stocks.
            Based on the <span style={{ color: "#888" }}>Agentic Squeeze</span> thesis.
          </p>

          {/* Mode Toggle */}
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.04)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
            {[["single", "Single Ticker"], ["portfolio", "Portfolio X-Ray"]].map(([m, label]) => (
              <button key={m} onClick={() => { setMode(m); reset(); setPortfolioResults(null); setPortfolioSynthesis(null); }}
                style={{
                  padding: "10px 24px", background: mode === m ? "rgba(255,255,255,0.08)" : "transparent",
                  border: "none", color: mode === m ? "#fff" : "#666", fontSize: "13px",
                  fontFamily: "'JetBrains Mono', monospace", fontWeight: mode === m ? 700 : 400,
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >{label}</button>
            ))}
          </div>
        </div>

        {/* Thesis Explainer */}
        <ThesisExplainer isOpen={explainerOpen} onToggle={() => setExplainerOpen(!explainerOpen)} />

        {/* ===================== SINGLE TICKER MODE ===================== */}
        {mode === "single" && (
          <>
            <div style={{ position: "relative", marginBottom: "32px" }}>
              <div style={{
                display: "flex", alignItems: "center",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px", padding: "4px",
              }}>
                <span style={{ padding: "0 12px", color: "#555", fontFamily: "'JetBrains Mono', monospace", fontSize: "14px" }}>$</span>
                <label htmlFor="ticker-input" className="sr-only" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0,0,0,0)" }}>Stock ticker symbol</label>
                <input id="ticker-input" ref={inputRef} type="text" value={input}
                  aria-label="Enter a stock ticker symbol"
                  onChange={(e) => { setInput(e.target.value.toUpperCase()); if (showResults) { setShowResults(false); setSelectedTicker(null); } }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (suggestions.length > 0 && suggestions[0] !== "__CUSTOM__") analyze(suggestions[0]);
                      else if (input.trim().length > 0) analyze(input.trim());
                    }
                  }}
                  placeholder="Any ticker — known or AI-analyzed"
                  style={{
                    flex: 1, background: "none", border: "none", outline: "none", color: "#fff",
                    fontSize: "18px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                    padding: "14px 0", letterSpacing: "2px",
                  }}
                />
              </div>

              {suggestions.length > 0 && !showResults && (
                <div style={{
                  position: "absolute", top: "100%", left: 0, right: 0, background: "#141420",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", marginTop: "4px", overflow: "hidden", zIndex: 10,
                }}>
                  {suggestions.map((t) => {
                    if (t === "__CUSTOM__") {
                      return (
                        <div key="custom" role="button" tabIndex={0} onClick={() => analyze(input.trim())}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); analyze(input.trim()); } }}
                          aria-label={`AI-analyze ${input.toUpperCase()}`}
                          style={{
                            padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px",
                            borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,171,0,0.04)",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,171,0,0.08)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,171,0,0.04)")}
                        >
                          <span style={{ fontSize: "16px" }}>🤖</span>
                          <div>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#ffab00", fontWeight: 700 }}>
                              AI-analyze ${input.toUpperCase()}
                            </span>
                            <span style={{ color: "#666", fontSize: "12px", marginLeft: "8px" }}>Uses Claude to generate analysis</span>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={t} role="button" tabIndex={0} onClick={() => analyze(t)}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); analyze(t); } }}
                        aria-label={`Analyze ${t} - ${allTickers[t].name}`}
                        style={{
                          padding: "12px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between",
                          alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                      >
                        <div>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#fff", fontWeight: 700, marginRight: "12px" }}>${t}</span>
                          <span style={{ color: "#666", fontSize: "14px" }}>{allTickers[t].name}</span>
                        </div>
                        <span style={{
                          fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                          color: allTickers[t].verdict === "COOKED" ? "#ff2d2d" : allTickers[t].verdict === "ROCKET" ? "#00e5ff" : "#ffab00",
                        }}>
                          {allTickers[t].verdict === "COOKED" ? "🔥" : allTickers[t].verdict === "ROCKET" ? "🚀" : "⚔️"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {!showResults && (
              <div style={{ marginBottom: "40px" }}>
                <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#444", marginBottom: "12px", fontFamily: "'JetBrains Mono', monospace" }}>
                  Pre-analyzed · Or type any ticker for AI analysis
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {["CRM", "DDOG", "NOW", "PATH", "TEAM", "IBM", "NVDA", "CRWD", "GTLB", "SAP"].map((t) => (
                    <button key={t} onClick={() => analyze(t)}
                      style={{
                        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "6px", padding: "8px 14px", color: "#aaa", fontSize: "13px",
                        fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#aaa"; }}
                    >${t}</button>
                  ))}
                </div>
              </div>
            )}

            {showResults && loading && <LoadingPulse text={`AI is analyzing $${input}...`} />}

            {error && !loading && (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ color: "#ff6b35", fontSize: "14px", marginBottom: "16px" }}>{error}</div>
                <button onClick={reset} style={{
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
                  padding: "10px 24px", color: "#aaa", fontSize: "13px", fontFamily: "'JetBrains Mono', monospace", cursor: "pointer",
                }}>← Try another</button>
              </div>
            )}

            {showResults && data && !loading && (
              <div style={{ animation: "fadeIn 0.5s ease" }}>
                <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>

                {aiGenerated && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: "8px", justifyContent: "center",
                    marginBottom: "16px", padding: "8px 16px", background: "rgba(255,171,0,0.06)",
                    borderRadius: "8px", border: "1px solid rgba(255,171,0,0.15)",
                  }}>
                    <span style={{ fontSize: "14px" }}>🤖</span>
                    <span style={{ color: "#ffab00", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace" }}>
                      AI-generated analysis — speculative, not pre-vetted
                    </span>
                  </div>
                )}

                <div style={{
                  textAlign: "center", marginBottom: "32px", padding: "32px 24px",
                  background: `linear-gradient(135deg, ${verdictColor}08, ${verdictColor}03)`,
                  border: `1px solid ${verdictColor}20`, borderRadius: "16px",
                }}>
                  <div style={{ fontSize: "14px", fontFamily: "'JetBrains Mono', monospace", color: "#666", marginBottom: "8px" }}>
                    ${selectedTickerSymbol} · {data.name}
                  </div>
                  <Gauge score={data.score} animate={animate} />
                  <div style={{
                    fontSize: "36px", fontWeight: 700, color: verdictColor, fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "6px", marginTop: "8px",
                  }}>
                    {data.verdict === "COOKED" ? "🔥 " : data.verdict === "ROCKET" ? "🚀 " : "⚔️ "}{data.verdict}
                  </div>
                  <div style={{ color: "#888", fontSize: "15px", marginTop: "8px", fontStyle: "italic" }}>"{data.tagline}"</div>
                </div>

                <div style={{
                  padding: "24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px", marginBottom: "16px",
                }}>
                  <h3 style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#555", fontFamily: "'JetBrains Mono', monospace", marginTop: 0, marginBottom: "20px" }}>
                    Disruption Zone Exposure
                  </h3>
                  {Object.entries(DISRUPTION_ZONES).map(([key, zone]) => (
                    <ExposureBar key={key} value={data.zones[key]?.exposure || 0} color={zone.color}
                      label={`${zone.icon} ${zone.name}`} note={data.zones[key]?.note || ""} />
                  ))}
                </div>

                <div style={{ padding: "24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#ff6b35", fontFamily: "'JetBrains Mono', monospace", marginTop: 0, marginBottom: "12px" }}>
                    🐻 The Bear Case
                  </h3>
                  <p style={{ color: "#bbb", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>{data.wallStreet}</p>
                </div>

                <div style={{ padding: "24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", marginBottom: "32px" }}>
                  <h3 style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#00e676", fontFamily: "'JetBrains Mono', monospace", marginTop: 0, marginBottom: "12px" }}>
                    🛡️ The Counter-Narrative
                  </h3>
                  <p style={{ color: "#bbb", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>{data.defense}</p>
                </div>

                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                  <button onClick={reset}
                    style={{
                      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
                      padding: "12px 32px", color: "#aaa", fontSize: "14px", fontFamily: "'JetBrains Mono', monospace", cursor: "pointer", transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#aaa"; }}
                  >← Analyze another ticker</button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ===================== PORTFOLIO MODE ===================== */}
        {mode === "portfolio" && (
          <>
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#444", marginBottom: "10px", fontFamily: "'JetBrains Mono', monospace" }}>
                Enter tickers separated by commas or spaces (2–15)
              </div>
              <div style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px", padding: "4px",
              }}>
                <textarea value={portfolioInput}
                  onChange={(e) => setPortfolioInput(e.target.value.toUpperCase())}
                  placeholder="NVDA, CRM, DDOG, TEAM, IBM, NOW, MSFT, PATH"
                  rows={3}
                  style={{
                    width: "100%", background: "none", border: "none", outline: "none", color: "#fff",
                    fontSize: "16px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                    padding: "14px 16px", letterSpacing: "1px", resize: "vertical", boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "12px", flexWrap: "wrap" }}>
                <button onClick={analyzePortfolio} disabled={portfolioLoading}
                  style={{
                    background: portfolioLoading ? "rgba(255,171,0,0.15)" : "linear-gradient(135deg, rgba(255,171,0,0.15), rgba(255,107,53,0.15))",
                    border: "1px solid rgba(255,171,0,0.3)", borderRadius: "8px", padding: "12px 28px",
                    color: "#ffab00", fontSize: "14px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                    cursor: portfolioLoading ? "wait" : "pointer", transition: "all 0.15s",
                  }}
                >{portfolioLoading ? "Analyzing..." : "🔬 X-Ray Portfolio"}</button>
                <button onClick={() => setPortfolioInput("NVDA, CRM, DDOG, TEAM, IBM, NOW, MSFT, PATH, SAP, CRWD")}
                  style={{
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px", padding: "12px 20px", color: "#666", fontSize: "13px",
                    fontFamily: "'JetBrains Mono', monospace", cursor: "pointer",
                  }}
                >Load sample</button>
              </div>
            </div>

            {error && <div style={{ color: "#ff6b35", fontSize: "13px", marginBottom: "16px", fontFamily: "'JetBrains Mono', monospace" }}>{error}</div>}

            {portfolioLoading && <LoadingPulse text={portfolioProgress} />}

            {portfolioResults && !portfolioLoading && (
              <div style={{ animation: "fadeIn 0.5s ease" }}>
                <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>

                {/* Portfolio Synthesis */}
                {portfolioSynthesis && (
                  <div style={{ marginBottom: "24px" }}>
                    {(() => {
                      const s = portfolioSynthesis;
                      const sc = s.overallScore || 0;
                      const vc = sc <= -20 ? "#ff2d2d" : sc >= 20 ? "#00e5ff" : "#ffab00";
                      const icon = sc <= -20 ? "🔥" : sc >= 20 ? "🚀" : "⚔️";
                      return (
                        <div style={{
                          padding: "28px 24px", borderRadius: "16px",
                          background: `linear-gradient(135deg, ${vc}08, ${vc}03)`,
                          border: `1px solid ${vc}20`, marginBottom: "20px",
                        }}>
                          <div style={{ textAlign: "center", marginBottom: "20px" }}>
                            <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#555", fontFamily: "'JetBrains Mono', monospace", marginBottom: "8px" }}>
                              Portfolio Diagnosis
                            </div>
                            <Gauge score={sc} animate={true} />
                            <div style={{ fontSize: "32px", fontWeight: 700, color: vc, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "4px", marginTop: "4px" }}>
                              {icon} {s.overallVerdict}
                            </div>
                            <div style={{ color: "#888", fontSize: "15px", marginTop: "8px", fontStyle: "italic" }}>
                              "{s.headline}"
                            </div>
                          </div>

                          <div style={{ display: "grid", gap: "12px" }}>
                            {[
                              { label: "🎯 Biggest Exposure", text: s.concentration, color: "#ff6b35" },
                              { label: "🕳️ Blind Spot", text: s.blindSpot, color: "#e040fb" },
                              { label: "♟️ Rebalancing Play", text: s.playbook, color: "#00e676" },
                            ].map((item, i) => (
                              <div key={i} style={{ padding: "14px 16px", background: "rgba(0,0,0,0.3)", borderRadius: "8px" }}>
                                <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: item.color, fontFamily: "'JetBrains Mono', monospace", marginBottom: "6px" }}>
                                  {item.label}
                                </div>
                                <div style={{ color: "#bbb", fontSize: "13px", lineHeight: 1.5 }}>{item.text}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Ticker Grid — sorted by score */}
                <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#444", marginBottom: "10px", fontFamily: "'JetBrains Mono', monospace" }}>
                  Holdings ranked by agentic exposure
                </div>
                <div style={{ display: "grid", gap: "8px", marginBottom: "32px" }}>
                  {Object.entries(portfolioResults)
                    .sort(([, a], [, b]) => a.score - b.score)
                    .map(([ticker, tickerData]) => (
                      <TickerCard key={ticker} ticker={ticker} data={tickerData}
                        onClick={() => { setMode("single"); analyze(ticker); }} />
                    ))}
                </div>

                {/* Zone Heatmap */}
                <div style={{
                  padding: "24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px", marginBottom: "32px", overflowX: "auto",
                }}>
                  <h3 style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#555", fontFamily: "'JetBrains Mono', monospace", marginTop: 0, marginBottom: "16px" }}>
                    Zone Exposure Heatmap
                  </h3>
                  <div style={{ minWidth: "500px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "80px repeat(5, 1fr)", gap: "4px", marginBottom: "4px" }}>
                      <div />
                      {Object.entries(DISRUPTION_ZONES).map(([key, zone]) => (
                        <div key={key} style={{ fontSize: "10px", color: zone.color, fontFamily: "'JetBrains Mono', monospace", textAlign: "center", padding: "4px" }}>
                          {zone.icon}
                        </div>
                      ))}
                    </div>
                    {Object.entries(portfolioResults)
                      .sort(([, a], [, b]) => a.score - b.score)
                      .map(([ticker, tickerData]) => (
                        <div key={ticker} style={{ display: "grid", gridTemplateColumns: "80px repeat(5, 1fr)", gap: "4px", marginBottom: "3px" }}>
                          <div style={{ fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", color: "#888", padding: "6px 4px" }}>
                            {ticker}
                          </div>
                          {Object.keys(DISRUPTION_ZONES).map((zoneKey) => {
                            const exp = tickerData.zones[zoneKey]?.exposure || 0;
                            const isGood = exp < 0;
                            const absExp = Math.abs(exp);
                            const bg = isGood
                              ? `rgba(0, 230, 118, ${absExp / 250})`
                              : `rgba(255, 45, 45, ${absExp / 250})`;
                            return (
                              <div key={zoneKey} style={{
                                background: bg, borderRadius: "4px", padding: "6px 4px", textAlign: "center",
                                fontSize: "10px", fontFamily: "'JetBrains Mono', monospace",
                                color: absExp > 50 ? "#fff" : "#888",
                              }}>
                                {exp > 0 ? exp : exp < 0 ? exp : "—"}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "32px 0", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ fontSize: "11px", color: "#333", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.8 }}>
            {Object.keys(allTickers).length} tickers in database · AI-powered analysis for any ticker
            <br />
            The "Agentic Squeeze" Thesis · GDT Framework · 5 Disruption Zones
            <br />
            Built by Heikki · Open source · Not financial advice
            <br />
            Speculative scenario planning — no crystal ball, just first principles
          </div>
        </div>
      </div>
    </div>
  );
}
