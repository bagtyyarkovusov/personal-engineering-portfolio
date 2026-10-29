---
name: Bagtyyar · Full-stack engineer
description: A dark, content-first portfolio where the work shows up before the claims.
colors:
  ink-black: "oklch(0.145 0.002 270)"
  raised: "oklch(0.175 0.002 270)"
  well: "oklch(0.22 0.002 270)"
  bone: "oklch(0.955 0 0)"
  ash: "oklch(0.7 0.004 270)"
  hairline: "oklch(1 0 0 / 10%)"
  signal-green: "oklch(0.74 0.13 165)"
  signal-blue: "oklch(0.72 0.09 230)"
  signal-amber: "oklch(0.8 0.11 80)"
  signal-red: "oklch(0.68 0.16 25)"
  paper: "oklch(0.985 0.002 80)"
typography:
  heading:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.5rem–1.875rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
components:
  button-primary:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink-black}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  link:
    textColor: "{colors.bone}"
    hoverTextColor: "{colors.ash}"
  card:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.bone}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: Bagtyyar

Decided in [ADR-0007](docs/adr/0007-dark-only-theme-and-sidebar-shell.md). Visual reference: keyik.dev.

## 1. Overview

**North star: "Show the work, then get out of the way."**

A visitor should see a shipped product within one screen. The interface is quiet: near-black surfaces, one typeface family, small confident headings, and no decoration competing with screenshots. Proof such as live apps, store links and dated build-log entries does the persuading. Copy is short and specific.

**Key characteristics:**
- **Dark only.** There is no theme toggle. The resume is the one exception, rendered on a `.theme-paper` surface because it is printed and saved as PDF.
- **Monochrome actions.** Links and buttons are bone on black. Hover dims to ash.
- **Green is a signal.** It marks live, verified and "open to projects", plus the focus ring. It never fills buttons or decorates.
- **Media first.** Real screenshots carry project sections. Tech stacks are short tag lists, never chip walls.

## 2. Colors

### Surfaces
- **Ink Black** (`oklch(0.145 0.002 270)`): page background (about `#0c0c0c`).
- **Raised** (`oklch(0.175 0.002 270)`): cards and popovers.
- **Well** (`oklch(0.22 0.002 270)`): hover fills, code blocks, secondary buttons.
- **Hairline** (`oklch(1 0 0 / 10%)`): every border and divider.

### Text
- **Bone** (`oklch(0.955 0 0)`): primary text and actions.
- **Ash** (`oklch(0.7 0.004 270)`): secondary text, metadata and hover state. Meets WCAG AA on Ink Black, so never fade it further with opacity.

### Status (state language only)
- **Signal Green:** verified, live, open to projects, focus ring.
- **Signal Blue:** in progress.
- **Signal Amber:** attention.
- **Signal Red:** risk and destructive actions.

### Named rules
**The Signal Rule.** If green appears where nothing is live, verified or focused, remove it.

## 3. Typography

**Geist Sans** for everything, **Geist Mono** for metadata (dates, numbering, labels, code).

- **Body:** 15px with line-height 1.6. Prose uses line-height 1.7 and a 65–75ch measure.
- **Headings:** weight 500 and tracking -0.02em. Page titles are 1.5–1.875rem. Section labels on the home page are mono 12px in Ash, not big headings.
- **No serif.** `font-serif` is aliased to Geist so legacy classes keep rendering until each page is rebuilt. Don't add new uses.

## 4. Layout

- **Desktop shell:** a fixed 224px left rail (`lg:pl-56` on content) with the wordmark, 4 links (Work, Writing, About, Contact), the availability signal and socials.
- **Mobile shell:** a 56px sticky top bar with a menu button. Every tap target is at least 44px.
- **Content well:** `max-w-5xl` for index pages, `max-w-prose` for reading.
- **Spacing:** pages start 40–64px below the top edge, never with a full-viewport hero. Sections are 80–96px apart.
- **Contact:** one `#contact` block at the foot of every public page, with email, Cal.com and Upwork.

## 5. Components

- **Buttons:** Primary is bone on black, 6px radius, 36px tall (44px on touch layouts). Outline and ghost use Hairline and Well.
- **Project index:** a numbered list (`01`, `02` …) with the title on the left and 2–3 lowercase tags on the right. The whole row is the link.
- **Screenshots:** 12px radius, a Hairline border, no shadow. Phone shots sit in a 3-up grid.
- **Status badge:** a pill with a status-color dot. The background is the status color at 10%, and the text is the status color.
- **Motion:** opacity and color transitions at 200–300ms. No scroll-triggered entrance animations on new surfaces. Respect `prefers-reduced-motion`.

## 6. Do's and don'ts

### Do
- Put a real screenshot or product within the first screen of any project surface.
- Keep copy specific: name the product, the platform and the outcome.
- Use mono for dates and numbering, not for paragraphs.

### Don't
- Don't use em dashes in copy. Use commas, colons or periods.
- Don't use stock CTA lines ("Ready to build something that lasts?", "Proof, not promises").
- Don't use gradients, glassmorphism, neon accents or glows.
- Don't use big-number hero metrics or walls of identical cards.
- Don't fade Ash text with extra opacity, because it breaks contrast.
- Don't use hard-coded colors (`bg-white`, hex values) outside `globals.css` and print styles.
