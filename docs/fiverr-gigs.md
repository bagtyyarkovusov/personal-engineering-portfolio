# Fiverr Gig Package — Review Before Publishing

Strategy: 3 gigs, fully optimized before publishing (Fiverr gives new gigs a temporary visibility boost — don't waste it). All 6 gig images + video filled at launch. Prices are new-seller rates; raise ~20% after 5 reviews, again after Level 1. Fiverr takes 20% — prices below are what buyers pay.

Profile tagline (used across all gigs):
> Full-stack Next.js engineer. I ship production-grade software — tests, CI/CD, Docker — not demo-ware. Live client sites, public repos, and a 192-GPU AI infrastructure deployment behind me.

---

## Gig A — Figma to Next.js (bread-and-butter)

**Title:** I will convert your Figma design to a pixel perfect Next.js or React website

**Category:** Web Development > Website Development (most specific subcategory available)

**Search tags:** figma to nextjs, next js developer, react developer, figma to react, typescript

**Packages:**

| | Basic — $150 | Standard — $250 | Premium — $400 |
|---|---|---|---|
| Pages | 1 landing page | Up to 3 pages | Up to 6 pages |
| Responsive | ✓ | ✓ | ✓ |
| Animations | — | ✓ | ✓ |
| CMS/contact form wiring | — | ✓ | ✓ |
| Deployment (Vercel/Railway) | — | — | ✓ |
| Revisions | 1 | 2 | 3 |
| Delivery | 3 days | 5 days | 7 days |

**Description (first 2 lines carry the keywords — do not bury them):**
> Pixel-perfect Figma to Next.js conversion with production-grade code — TypeScript, responsive, accessible, and tested. Not a page-builder export: real engineering you can hand to any developer later.
>
> I'm a full-stack engineer whose work is live in production right now — including a bilingual healthcare platform serving real patients (link in my portfolio). Every page I deliver is built with Next.js App Router, Tailwind CSS, semantic HTML, and checked against your Figma at multiple breakpoints.
>
> **What you get:** clean component structure, mobile/tablet/desktop responsiveness, SEO metadata, performance budget (Lighthouse 90+ target), and a walkthrough video of the delivered work.
>
> **What I need from you:** Figma link, brand assets, and any copy that isn't final in the design.
>
> Message me before ordering if your design has more than 6 pages or needs backend integration — I'll send a custom offer.

**FAQ:**
- *Will it match the design exactly?* Yes — I check against Figma at desktop, tablet, and mobile widths before delivery.
- *Can you deploy it?* Premium package includes deployment to Vercel or Railway on your account.
- *What if I don't have Figma, just screenshots?* Message me — I can work from screenshots or references with a small scope adjustment.
- *Do you use page builders?* No. Hand-written TypeScript and Tailwind — maintainable by any developer.

**Gig images:** (1) Figma→browser side-by-side of the myORL site, (2) responsive mockup triptych, (3) package comparison table, (4) Lighthouse score screenshot, (5) code-quality sample (component + test), (6) "how we work" 3-step graphic.

---

## Gig B — AI / LLM Integration (demand-rider)

**Title:** I will integrate AI chatbot and LLM features into your Next.js web application

**Category:** Web Development > AI Development / Chatbots (pick the most specific AI subcategory; validate in autocomplete)

**Search tags:** AI integration, AI chatbot, OpenAI API, LLM integration, nextjs AI

**Packages:**

| | Basic — $300 | Standard — $500 | Premium — $800 |
|---|---|---|---|
| Scope | 1 AI feature (chat, summarization, or Q&A) | Multi-turn chatbot w/ your data (RAG-lite) | Full AI feature set + streaming UI + admin controls |
| Provider setup (OpenAI/Anthropic/self-hosted) | ✓ | ✓ | ✓ |
| Streaming responses | ✓ | ✓ | ✓ |
| Rate limiting & cost controls | — | ✓ | ✓ |
| Tests for the AI paths | — | ✓ | ✓ |
| Revisions | 1 | 2 | 3 |
| Delivery | 4 days | 7 days | 10 days |

**Description:**
> Production-grade AI integration for your Next.js app — chatbots, LLM features, and OpenAI/Anthropic APIs wired in with streaming, validation, and cost controls. I don't demo-ware this: I've deployed and supported a 192-GPU inference cluster serving open-weight LLMs, and I maintain a public OpenAI-compatible API gateway.
>
> Most AI integrations break in the same places: streaming edge cases, runaway token costs, no validation on model output, and zero tests. I build the boring parts right so the exciting part keeps working.
>
> **What you get:** TypeScript throughout, Zod-validated model outputs, streaming UI, error handling and retries, rate limiting, and tests covering the AI paths.
>
> **Self-hosted option:** want to avoid per-token API bills or keep data private? I can set you up with open-weight models (Qwen, Llama) on your own GPU infrastructure — message me for a custom offer.

**FAQ:**
- *Which providers do you support?* OpenAI, Anthropic, and OpenAI-compatible endpoints (including self-hosted vLLM/Ollama-style setups).
- *Can you work with my existing codebase?* Yes — I integrate into your app, I don't rebuild it.
- *Will my API costs explode?* No — Standard and Premium include rate limiting, token caps, and caching where it makes sense.
- *Can you fine-tune a model?* That's a custom engagement — message me.

**Gig images:** (1) architecture diagram: your app → gateway → LLM, (2) streaming chat UI screenshot, (3) package table, (4) GonkaProvider repo screenshot with tests passing, (5) "192 GPUs deployed" stat card, (6) cost-control checklist graphic.

---

## Gig C — AI Prototype Rescue / Production Hardening (differentiator)

**Title:** I will rescue your AI built web app and make it production ready with tests and CI

**Category:** Web Development > Website Maintenance / Bug Fixes (validate subcategory)

**Search tags:** code review, production ready, CI CD pipeline, bug fixing, web app security

**Packages:**

| | Basic — $200 | Standard — $400 | Premium — $600 |
|---|---|---|---|
| Scope | Audit report only (findings + fix roadmap) | Audit + critical fixes (security, data loss, crashes) | Full hardening: fixes + tests + CI/CD + deploy |
| Security review | ✓ | ✓ | ✓ |
| Test suite setup | — | Smoke tests | Meaningful coverage of core flows |
| CI/CD pipeline | — | — | ✓ |
| Docker + deployment | — | — | ✓ |
| Delivery | 3 days | 5 days | 10 days |

**Description:**
> Your AI-built prototype works in the demo — and breaks with real users. I'll audit it, fix what's dangerous, and put tests, CI, and a proper deployment pipeline under it.
>
> AI coding tools are great at prototypes. But the apps they produce usually ship with no tests, no input validation, secrets in the frontend, and a deployment process of "it works on my laptop." I've rebuilt production systems from scratch and run real AI infrastructure — I know exactly where these apps fail first.
>
> **Basic (audit):** a written report — what's broken, what's dangerous, what it costs to fix, in plain English.
> **Standard (rescue):** I fix the critical issues: security holes, data-loss bugs, crash paths.
> **Premium (hardening):** everything above plus automated tests, a CI/CD pipeline, Docker, and deployment to your host.
>
> My own portfolio is built to this standard — 138 tests, full CI gates, public repo. Inspect it before you order.

**FAQ:**
- *My app was built with Cursor/v0/Lovable/Bolt — can you help?* Yes, that's exactly who this gig is for.
- *Will you judge my codebase?* No. These tools are how everyone prototypes now. My job is to get you from prototype to production.
- *Do I need the audit first?* It's recommended — it tells you what fixing will actually cost. But you can start anywhere.
- *What stacks?* Next.js, React, TypeScript, Node, Postgres. Message me for anything else.

**Gig images:** (1) "prototype vs production" comparison, (2) redacted audit-report page sample, (3) CI pipeline screenshot with green checks, (4) package table, (5) test-count badge graphic, (6) before/after deployment diagram.

---

## Gig Video Script (60–90s, use for all three gigs with gig-specific intro/outro)

**Format:** you on camera (upper body, good light) + screen-recorded cutaways. Subtitles burned in. 1080p. One CTA at the end.

**[0:00–0:08] Camera — hook**
> "Most Fiverr code works in the demo. Mine works in production — and I can prove it in 30 seconds."

**[0:08–0:25] Screen recording — live proof**
> (Cut to screen: scroll the live myORL site, switch language Greek↔Russian)
> "This is a bilingual healthcare platform I built for a clinic in Athens. It's live, serving real patients right now — not a mockup."
> (Cut: portfolio CI page / GitHub Actions green checks)
> "This is my own site: 138 automated tests, full CI pipeline, deployed with Docker. Every project I deliver gets this discipline."

**[0:25–0:40] Camera — AI credibility**
> "I've also deployed AI infrastructure at real scale — a 24-server, 192-GPU cluster serving open-weight language models, with a three-month support guarantee that I delivered to completion."

**[0:40–0:55] Gig-specific segment**
- **Gig A:** "Send me your Figma. You'll get pixel-perfect, responsive Next.js code with tests — code any developer can maintain after me."
- **Gig B:** "Want AI in your app? I'll wire in chatbots and LLM features with streaming, cost controls, and tests — so it works after the demo too."
- **Gig C:** "Built something with AI tools and it's falling apart? I'll audit it, fix what's dangerous, and put real engineering under it."

**[0:55–1:10] Camera — close**
> "I answer messages within the hour. Tell me what you're building — first consultation is free. Let's ship something that lasts."

**Production notes:** record camera segments in one take, screen segments separately, assemble in CapCut/DaVinci (free). Burn English subtitles. Keep total under 90s. Filmed face > voiceover-only for trust.

---

## Launch checklist

- [ ] Profile: photo, tagline, description, skills (Next.js, TypeScript, React, PostgreSQL, Docker, AI integration), languages (English, Russian, Turkmen)
- [ ] All 3 gigs drafted with 6 images + video each BEFORE publishing any
- [ ] Publish all 3 within the same 48h window
- [ ] Portfolio links point to bagtyyar.dev case studies
- [ ] Fiverr app installed, notifications on, <1h response time from day 1
- [ ] Validate tags against Fiverr search autocomplete before finalizing
