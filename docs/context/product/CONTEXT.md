# Product Context

## Product

This project is Bagtyyar's personal portfolio at bagtyyar.dev. It has to win his first freelance clients, and it also has to work for technical reviewers and recruiters.

## Positioning

Public line: **full-stack engineer, web + mobile.** Shipped work does the convincing, so every surface leads with real projects and a short, plain claim. The visual system (dark only, Geist Sans + Geist Mono, mostly monochrome, green only for live and verified states) is defined in `DESIGN.md` and ADR-0007.

The main audience is prospective clients, most of them arriving from Upwork. Bagtyyar has no Upwork reviews yet, so the site has to make proof and the hire path obvious within the first screen.

Every claim on the site must match `~/Projects/upwork-copilot/ME.md`. Copy follows its voice rules: short sentences, no em or en dashes, no exclamation marks, no AI-sounding filler.

## Homepage

No hero. In order:

1. Avatar, the one-line intro ("Bagtyyar, full-stack engineer.") and a second line naming Carberk, live on Google Play.
2. Last shipped build log link.
3. **Hire CTA:** "Hire me on Upwork" (primary) and "Book a 20-minute call".
4. **Featured:** the flagship project (Carberk), with its video once one exists, then its screenshots, summary and Google Play link.
5. Numbered selected work, latest writing, and the contact block.

## Case Studies (`/work/[slug]`)

- Header: title, summary, then a one-line **proof fact** (role, dates, status) from the static `projectFacts` map in `src/features/projects/media.ts`. Facts live in code, not the database, so they ship without a production reseed.
- The project **video** (if registered), then screenshots, then any extra galleries.
- Carberk shows a second gallery of the staff admin, titled "Staff admin · ships in the next update · sample data". The admin is never described as live.
- Tayyn Hyzmat is "delivery dispatch" with a "wallet and ledger", always labeled synthetic data and internal pilot. Never taxi, never real payments.
- Every case study ends with "Need something like this built?" and the hire CTA.

## About

Short, not a biography:

- his photo, who he is, and where he works from (China, overlapping European and Asian working hours)
- the intro video slot
- **How I work:** a ticket with acceptance criteria first, a prototype before UI, and no merge without type checks, tests and his own review (AI coding agents work inside those gates)
- work he takes on, then the hire CTA

## Contact and Hire Links

Email, Cal.com and Upwork URLs live in `src/lib/links.ts`. The contact block at the foot of every page, the `HireCta` component and the JSON-LD `sameAs` (GitHub, LinkedIn, Upwork) all read from it.

## Video

Short silent HyperFrames cuts that Bagtyyar voices himself (16:9, 1080p, a camera-safe bottom-right corner for a Loom face bubble). Order: the Upwork intro, then Carberk, Tayyn Hyzmat and MyORL. Projects and scripts live outside the repo in `~/Projects/portfolio-assets/videos/<name>/`.

- Self-hosted H.264 MP4 under 8 MB in `public/videos/`, with a poster image and a WebVTT captions file.
- Registered in the static `projectVideos` map in `src/features/projects/media.ts`, keyed by project slug, or `intro` for About. No Prisma change.
- `ProjectVideo` renders nothing until an entry exists. It never autoplays and uses `preload="none"`, so nothing downloads until play.
- Only synthetic or sample data appears on screen.
- Each voiced video lands in its own small PR.

## Project Catalog

Public order: Carberk, Tayyn Hyzmat, MyORL, the portfolio itself, Gonka. TM-WhatsApp is admin-only. Production project content comes from `prisma/seed.ts`.

Carberk (by Alpha Motors) is the public name per ADR-0093 in the product repo. The portfolio slug stays `/work/car-marketplace`, and internal identifiers keep the earlier AutoTM working name.

Each project needs a clear role and dates (the proof fact), a stack list, screenshots or video with an honest data label, and a case study body.

### Build Log

Chronological development updates, linked from the homepage.

### Writing

Engineering posts under `/blog`, listed on the homepage under Writing.

## HITL Product Review Gates

Human-in-the-loop product review is required for homepage positioning and About page positioning.

For those issues, agents must produce a compact shape brief before implementation:

- purpose
- primary user
- content
- feeling
- constraints
- review artifact
- approval question

The human reviewer should answer with one of:

- `approved`
- `revise`
- `blocked`

Agents may not treat product copy or public positioning as approved until the human explicitly approves it.

## Public Navigation

Work, Writing (Blog and Build Log), About (with Resume and Engineering System), Contact. Left sidebar on desktop, top bar on mobile.

## Private Rooms

Private rooms are read-only client-facing project spaces. They use signed links in v1, not client accounts.

Private rooms show curated updates by default, with optional technical evidence toggles.

Private-room sections:

- Status
- Milestones
- Updates
- Architecture
- Evidence
- Next Steps

## V1 Non-Goals

- no analytics dashboard
- no automation layer
- no comments
- no file uploads
- no client accounts
- no billing
- no multi-tenant agency roles
- no full project management clone
- no resume PDF generator (post-MVP)

## Localization

The MVP is English-only.

Localization is a future product capability, not part of the first implementation issues. The likely future locales are Turkish and Russian.

English-first is intentional for v1 because the first trust surface must be polished, complete, and easy to review. Half-finished localization would weaken trust.

Future localization should support:

- localized public portfolio pages
- localized project/case-study content
- localized private-room client-facing copy where needed
- locale-aware SEO metadata
- clear fallback behavior when a translation is missing

Do not add localization work to the MVP implementation issues unless the project scope is explicitly reopened.
