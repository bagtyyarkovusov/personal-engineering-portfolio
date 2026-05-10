# Plan: Issue #10 — Add Public Shell With Real Navigation Routes

## Decision

Issue #10 is the best next actionable issue because:

1. **Earliest open issue in the dependency chain** — its blocker (#9 Design Tokens) is complete.
2. **Unblocks three immediate slices** — #11 (Homepage), #12 (About), and #13 (Work With Me) all depend on the public shell existing first.
3. **No HITL gate** — can be implemented by an AFK agent without waiting for human copy approval.
4. **Foundational for the tracer-bullet MVP** — without navigation, the individual page slices cannot be experienced as a coherent product.
5. **Bounded scope** — four acceptance criteria with clear boundaries; no database changes, no auth, no deep policy modules.

## Context

- **Parent**: [#1 — Tracer-bullet MVP](https://github.com/bagtyyarkovusov/personal-engineering-portfolio/issues/1)
- **Blocked by**: #9 (Define Design Tokens And Status Semantics) — ✅ Done
- **Blocks**: #11, #12, #13
- **Type**: AFK

## Current State

- `src/app/layout.tsx` — root layout with fonts (Instrument Serif, IBM Plex Sans, IBM Plex Mono) but **no navigation**.
- `src/app/page.tsx` — health slice from issue #3, no nav links.
- `src/app/work/page.tsx` — real Work page with project cards, but **no way to reach it** except direct URL.
- `src/app/design-system/page.tsx` — design system demo page.
- Design tokens (`src/design/tokens.ts`) and status semantics (`src/design/statuses.ts`) are in place.
- Single shadcn component installed: `button`.
- Architecture expects route groups: `src/app/(public)/`, `src/app/admin/`, `src/app/rooms/[token]/`.

## Acceptance Criteria

- [ ] The public layout includes stable navigation to all MVP public routes.
- [ ] Each public route renders a meaningful placeholder or initial state.
- [ ] Navigation works on desktop and mobile widths.
- [ ] The shell follows the design-token and shadcn composition rules.

## Implementation Plan

### 1. Restructure routes into `(public)` group

Move public pages into the expected architecture:

```
src/app/
  (public)/
    layout.tsx      ← public nav shell
    page.tsx        ← homepage (keep current health slice as placeholder)
    work/
      page.tsx      ← existing Work page
    engineering-system/
      page.tsx      ← placeholder
    build-log/
      page.tsx      ← placeholder
    about/
      page.tsx      ← placeholder
    work-with-me/
      page.tsx      ← placeholder
  layout.tsx        ← root layout (fonts, metadata, no nav)
  globals.css
```

**Note**: Move `/design-system` out of `(public)` or leave it as a root-level route — it is a dev/tooling page, not part of the MVP public surface.

### 2. Build the public navigation shell

Create `src/app/(public)/layout.tsx`:

- **Desktop**: horizontal nav bar with route links
  - Links: Work, Engineering System, Build Log, About, Work With Me
  - Active route highlighted
  - Uses `font-sans` for nav text
  - Editorial left-aligned layout (no centered generic hero)
- **Mobile**: hamburger or collapsible nav
  - Consider installing `sheet` from shadcn for a mobile drawer
  - Or use a simple responsive collapse with Tailwind
- **Design rules**:
  - Light-first theme
  - Use semantic tokens (`--foreground`, `--muted-foreground`, `--primary`, `--border`)
  - Restrained spacing, no nested cards
  - Keep public pages editorial; admin/client rooms will be more dashboard-like later

### 3. Create placeholder pages

Each placeholder should:

- Use the public layout (inherited from `(public)/layout.tsx`)
- Display the page title in `font-serif`
- Include a brief description of what this page will become
- Link back to other routes via the shared nav
- Follow the asymmetric editorial layout pattern from the product context

Pages to create:

| Route | Placeholder Content |
|-------|---------------------|
| `/engineering-system` | "How Bagtyyar builds and ships software" — placeholder for #19 |
| `/build-log` | "Active development rhythm" — placeholder for #20 |
| `/about` | "Personal-led, agency-ready engineering" — placeholder for #12 |
| `/work-with-me` | "Start a project or hiring conversation" — placeholder for #13 |

### 4. Update root layout

`src/app/layout.tsx` should remain minimal:

- Fonts and CSS variables
- `lang="en"` on `<html>`
- No navigation (moved to `(public)/layout.tsx`)
- No page-specific metadata (each route handles its own later, #21)

### 5. Update homepage placeholder

`src/app/(public)/page.tsx` (current health slice):

- Keep the seeded-project verification as a health indicator
- Add the navigation shell so it feels like a real page
- This is a placeholder — issue #11 will replace it with the full trust copy and CTAs

### 6. Install shadcn primitives if needed

If the mobile drawer approach is chosen, install `sheet` via shadcn CLI:

```bash
npx shadcn@latest add sheet
```

Alternatively, implement mobile nav with pure Tailwind responsive utilities to keep dependencies minimal for this slice.

### 7. Verification checklist

- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` passes (no broken links, no prerender failures)
- [ ] `pnpm test` passes
- [ ] All public routes render without errors:
  - `/`
  - `/work`
  - `/engineering-system`
  - `/build-log`
  - `/about`
  - `/work-with-me`
- [ ] Navigation links work on desktop (click each link)
- [ ] Navigation collapses or drawers work on mobile (resize browser or use devtools)
- [ ] Active route is visually distinguishable
- [ ] Design tokens are used (no hardcoded colors)
- [ ] No generic SaaS gradient or glassmorphism introduced

## Domain Vocabulary

Use the terms defined in the context docs when naming components, files, and copy:

- **Public routes**: Work, Engineering System, Build Log, About, Work With Me
- **Trust claim**: "Production-minded software engineering, built to stay maintainable after launch"
- **Editorial command center**: asymmetric, left-anchored, no centered generic hero
- **Status tokens**: verified, inProgress, attention, risk, neutral

## Out of Scope

- Full homepage trust copy and CTAs (issue #11)
- About page personal-led positioning (issue #12)
- Work With Me contact form or CRM integration (issue #13)
- Engineering System page content (issue #19)
- Build Log page content (issue #20)
- SEO metadata, sitemap, share previews (issue #21)
- Three.js pipeline map (issues #48–#49)
- Admin routes or auth (issues #22–#23)

## Risk and Mitigation

| Risk | Mitigation |
|------|------------|
| Moving routes into `(public)` breaks existing imports or links | Verify all relative imports still resolve; Next.js route groups do not affect URL paths |
| Mobile nav implementation grows too complex | Use simple responsive collapse; defer drawer polish to a later design pass |
| shadcn component installation conflicts with Tailwind v4 | Verify the shadcn CLI supports Tailwind v4; if not, build custom primitives |
| Placeholder copy feels too finished and blocks HITL issues | Keep placeholders explicitly minimal — title + one sentence + nav |
