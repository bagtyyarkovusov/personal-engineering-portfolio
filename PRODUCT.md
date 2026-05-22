# Product

## Register

brand

## Users

- **Prospective clients** evaluating engineering partners for full-stack or mobile product builds. They need to see delivery discipline, not just shipped screenshots.
- **Hiring managers and recruiters** assessing whether a candidate understands production beyond feature development — testing, CI/CD, architecture decisions, operational clarity.
- **Peers and collaborators** in the engineering community who reference the portfolio as a working example of agentic workflows, transparent delivery, and maintainable systems.

Context matters: users arrive with skepticism ("every portfolio claims discipline") and leave with evidence ("the portfolio *is* the discipline").

## Product Purpose

A personal-led, agency-ready engineering portfolio that proves delivery discipline end to end. This project is the first case study in its own catalog — the portfolio proves the engineering system it describes.

Success looks like: a visitor can trace any claim on the homepage to its evidence (tests, Docker config, CI pipeline, architecture decision record) within two clicks. The site doesn't just describe engineering excellence; it demonstrates it structurally.

## Brand Personality

**Disciplined. Transparent. Editorial.**

The voice is calm, precise, and confident — never boastful, never apologetic. It speaks like an engineer who has done the hard work of making complexity legible. The interface should feel like reading a well-edited technical journal: every element earns its place, nothing is decorative for its own sake.

Emotional goals: trust through evidence, respect through restraint, curiosity through transparency.

## Anti-references

- **Generic SaaS landing page clichés.** No big-number hero metrics with gradient accents. No identical card grids with icon + heading + text repeated endlessly. No "boost your productivity 10x" copy.
- **Overdesigned creative agency portfolios.** No gratuitous motion, no scroll-jacking, no visual noise that competes with the evidence.
- **Dark-mode-with-neon tropes.** No purple gradients, neon accents, or glassmorphism used as default. The aesthetic is light-first and materially grounded.
- **Typical developer blog minimalism.** Not a bare Jekyll template with zero hierarchy. The design invests in typography and spacing because the content deserves it.

## Design Principles

1. **Practice what you preach.** The portfolio's build quality (tests, CI/CD, type safety, Docker) is part of the design. A broken build or untested component undermines every claim on the page.
2. **Show, don't tell.** Every discipline claim links to evidence: the engineering system page, the design system page, the pipeline map, the admin dashboard. Claims without evidence are removed.
3. **State language, never decoration.** Colors carry semantic meaning — especially the status palette (verified, in-progress, attention, risk, neutral). They communicate state across public pages, admin, and private rooms.
4. **Restraint over noise.** One accent color, limited motion, generous whitespace. The confidence of the work should speak louder than the decoration around it.
5. **Accessibility as evidence.** WCAG 2.1 AA compliance, prefers-reduced-motion support, and semantic HTML aren't checkboxes — they're proof that the engineering discipline extends to inclusion.

## Accessibility & Inclusion

- **Target:** WCAG 2.1 AA across all public surfaces.
- **Motion:** Full `prefers-reduced-motion` support; all animations degrade to instant state changes.
- **Testing:** Automated a11y scans via Playwright + axe-core run in CI on every push.
- **Color:** Status palette is designed for distinguishability beyond hue alone (lightness and chroma variation). No information is conveyed by color alone.
