# ADR 0007: Dark-Only Theme, Geist Type and a Sidebar Shell

## Status

Accepted

## Context

The light "Engineer's Notebook" design (Instrument Serif headlines, IBM Plex body, warm paper neutrals) was not converting visitors. A heuristic audit in October 2026 measured these problems:

- **Home page:** a full-viewport hero with a 60px serif claim pushed the first project roughly 1,560px down a 4,400px page.
- **Navigation:** 7 nav items plus a CTA band repeated on every page.
- **Pages:** inconsistent top spacing (32px on some pages, 96px on others), and no project media anywhere.
- **Light palette:** hard-coded light colors and a `.dark` token set that nothing ever applied.

The owner chose a content-first direction modeled on keyik.dev: near-black surfaces, one grotesk typeface, modest headings, and work shown immediately. This explicitly reverses the earlier "no dark mode" rule in `DESIGN.md`.

## Decision

1. **Dark only.** `:root` holds the dark token set, `<html>` carries the `dark` class so existing `dark:` variants apply, and there is no theme toggle. A scoped `.theme-paper` class provides a light surface for print-first pages (the resume).
2. **Monochrome actions.** Primary actions are near-white on near-black. Green remains only as status (verified, live, open to projects) and as the focus ring.
3. **Geist Sans and Geist Mono** replace Instrument Serif and IBM Plex. Body text is 15px. The `--font-serif` token now aliases Geist Sans, so legacy `font-serif` classes render correctly until each page is redesigned.
4. **Four-destination shell.** A fixed left rail on desktop and a slim top bar on mobile link to Work, Writing, About and Contact. Older routes stay reachable and highlight their parent destination. Contact is a single block (`#contact`) at the foot of every public page, replacing the repeated CTA band and social footer.
5. **Home page without a hero.** It shows a two-line intro, the flagship project's screenshots, a numbered project index, latest writing, and contact.

## Alternatives Considered

- **Dark by default with a light toggle.** Rejected for now: it doubles the surfaces to verify for contrast, and the reference direction is dark only.
- **Keep the serif at smaller sizes.** Rejected: the serif was the main source of the "too loud, too editorial" feel.
- **Redesign every page in one change.** Rejected: too large to review. Work, Writing, About and admin follow in separate PRs.

## Consequences

- Pages not yet redesigned inherit dark tokens and Geist automatically, but keep their old spacing until their own PR.
- Admin surfaces turn dark as a side effect. Hard-coded `bg-white`/`text-white` in admin forms are cleaned up in the admin PR.
- The axe `color-contrast` rule is enabled again, so contrast regressions in the dark palette fail the accessibility suite.
- Route consolidation (Writing, About children, `/contact`) and permanent redirects from the old URLs land with the page PRs that move those routes.
