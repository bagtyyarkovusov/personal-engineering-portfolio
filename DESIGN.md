---
name: Bagtyyar — Production-Minded Engineer
description: A personal engineering portfolio that proves delivery discipline end to end through an editorial, evidence-first interface.
colors:
  moss-cyan: "oklch(0.62 0.11 170)"
  ink: "oklch(0.18 0.01 280)"
  warm-paper: "oklch(0.985 0.002 80)"
  warm-ash: "oklch(0.94 0.005 80)"
  slate: "oklch(0.55 0.005 280)"
  cool-mist: "oklch(0.95 0.01 200)"
  alert-red: "oklch(0.55 0.14 25)"
  parchment-line: "oklch(0.88 0.005 80)"
  signal-blue: "oklch(0.58 0.07 215)"
  caution-amber: "oklch(0.72 0.09 75)"
  warm-graphite: "oklch(0.65 0.008 80)"
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(3rem, 5vw, 3.75rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "1.875rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.25
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
components:
  button-primary:
    backgroundColor: "{colors.moss-cyan}"
    textColor: "{colors.warm-paper}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "oklch(0.62 0.11 170 / 0.9)"
  button-secondary:
    backgroundColor: "{colors.cool-mist}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-outline:
    backgroundColor: "{colors.warm-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "4px 12px"
    size: "36px"
  card:
    backgroundColor: "{colors.warm-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: Bagtyyar

## 1. Overview

**Creative North Star: "The Engineer's Notebook"**

The Engineer's Notebook is a bound, well-kept journal where every claim is dated, tested, and cross-referenced. The interface feels precise but human — an engineer who has done the hard work of making complexity legible. Typography carries the editorial weight (Instrument Serif headlines against IBM Plex Sans body), while the muted green-cyan accent functions as a signal, not decoration. Every surface earns its place.

This system explicitly rejects generic SaaS landing page clichés, overdesigned creative agency portfolios, and dark-mode-with-neon tropes. There are no big-number hero metrics with gradient accents, no identical card grids repeated endlessly, no gratuitous motion competing with the evidence. The confidence of the work speaks louder than the decoration around it.

**Key Characteristics:**
- **Restrained palette** — one accent color (Moss Cyan) on a field of warm tinted neutrals. The accent is used for action and state, never for decoration.
- **Editorial typography** — serif display for headlines creates gravitas; sans body for readability; mono for metadata and code.
- **Flat-by-default surfaces** — depth is conveyed through tonal layering (background shifts, borders) rather than shadow casts. Shadows appear only as a response to state.
- **Evidence-first spacing** — generous section padding (64–96px) and a tight content well (max-w-3xl) keep the reader focused on claims and their supporting evidence.
- **State language, never decoration** — the status palette (Verified, In Progress, Attention, Risk, Neutral) communicates state across every surface, from public project cards to the Three.js pipeline map.

## 2. Colors

The palette is restrained technical: warm tinted neutrals with a single muted green-cyan accent that signals action, verification, and state.

### Primary
- **Moss Cyan** (`oklch(0.62 0.11 170)`): The primary action color. Used for buttons, links, focus rings, active navigation states, and the "Verified" status. It is grounded and organic — enough green to feel natural rather than digital. It appears on ≤10% of any given screen; its rarity is the point.

### Secondary
- **Cool Mist** (`oklch(0.95 0.01 200)`): The secondary surface color. Used for secondary buttons, hover backgrounds, and subtle accents. It is a cool-tinted off-white that provides just enough separation from the main background to signal hierarchy without drawing attention.

### Neutral
- **Warm Paper** (`oklch(0.985 0.002 80)`): The primary background. A warm-tinted near-white that reduces eye strain and prevents the sterile feeling of pure white. Used for body background, card surfaces, and popovers.
- **Warm Ash** (`oklch(0.94 0.005 80)`): The muted surface. Used for hover states, skeleton loaders, and secondary backgrounds where tonal layering is needed.
- **Ink** (`oklch(0.18 0.01 280)`): The primary text color. A dark blue-tinted neutral that reads softer than pure black. Used for headings, body text, and foreground elements.
- **Slate** (`oklch(0.55 0.005 280)`): The muted text color. Used for captions, secondary labels, metadata, and placeholder text.
- **Parchment Line** (`oklch(0.88 0.005 80)`): The border and divider color. Warm-tinted to harmonize with the background. Used for card borders, section dividers, input strokes, and navigation separators.

### Status Palette
- **Signal Blue** (`oklch(0.58 0.07 215)`): "In Progress" state. Used for active builds, running pipelines, and current milestones.
- **Caution Amber** (`oklch(0.72 0.09 75)`): "Attention" state. Used for blocked items, pending reviews, and partial evidence.
- **Alert Red** (`oklch(0.55 0.14 25)`): "Risk" and "Destructive" actions. Used for failed checks, revoked access, invalid tokens, and destructive buttons.
- **Warm Graphite** (`oklch(0.65 0.008 80)`): "Neutral" state. Used for drafts, archived items, and unavailable metadata.

### Named Rules
**The One Voice Rule.** The primary accent (Moss Cyan) is used on ≤10% of any given screen. Its rarity is the point. If more than 10% of a surface is calling for attention, the hierarchy is broken, not the color strategy.

**The State Language Rule.** Status colors mean state, never decoration. They are reused across public pages, admin dashboard, private rooms, and pipeline evidence. No status color may be repurposed for branding, marketing, or decorative elements.

## 3. Typography

**Display Font:** Instrument Serif (with Georgia, serif fallback)
**Body Font:** IBM Plex Sans (with system-ui, sans-serif fallback)
**Label/Mono Font:** IBM Plex Mono (with ui-monospace, monospace fallback)

**Character:** The pairing reads like a well-edited technical journal. Instrument Serif brings editorial confidence to headlines; IBM Plex Sans brings Swiss clarity to body text; IBM Plex Mono grounds metadata and code in engineering credibility.

### Hierarchy
- **Display** (400 weight, clamp(3rem, 5vw, 3.75rem), line-height 1.05, tracking-tight): Hero headlines and major section titles. Used once per page, maximum twice. The serif face at this scale carries the full weight of the portfolio's trust claim.
- **Headline** (400 weight, 1.875rem, line-height 1.2, tracking-tight): Section headings (h2) and prose titles. Still in Instrument Serif to maintain editorial continuity.
- **Title** (600 weight, 1.25rem, line-height 1.4): Subsection headings (h3–h4), card titles, and feature labels. Switches to IBM Plex Sans to signal functional hierarchy.
- **Body** (400 weight, 1rem / 1.125rem at lg, line-height 1.65): Paragraphs, descriptions, and prose content. Cap line length at 65–75ch for optimal readability.
- **Label** (500 weight, 0.875rem, line-height 1.25): Navigation links, button text, badge labels, metadata, and timestamps. May be uppercase only for status badges and technical tags.

### Named Rules
**The Serif-Only-At-Scale Rule.** Instrument Serif is reserved for display and headline sizes (≥1.5rem). At smaller sizes, IBM Plex Sans takes over. Serif at body scale looks precious, not precise.

## 4. Elevation

This system is flat by default. Depth is conveyed primarily through tonal layering — background color shifts, border separators, and subtle hover treatments — rather than through shadow casts. Shadows appear only as a response to state: a card lifts slightly on hover with a diffuse, low-contrast shadow. There is no ambient shadow vocabulary; surfaces do not float.

### Shadow Vocabulary
- **Card Hover Lift** (`box-shadow: 0 1px 3px oklch(0 0 0 / 0.08)`): The only shadow in the system. Applied to cards and interactive containers on hover. It is barely perceptible — just enough to confirm the surface has responded to the cursor.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, elevation, focus). If a component feels like it needs a shadow to read as elevated, redesign it with tonal layering instead.

**The Tonal Layering Rule.** Depth is conveyed through background color shifts and borders, never through shadow casts. Background → Card → Popover creates a three-layer stack through color alone: Warm Paper → Warm Ash → White.

## 5. Components

### Buttons
- **Shape:** Gently curved edges (6px radius, `rounded-md`). Height 36px (`h-9`) for default size.
- **Primary:** Moss Cyan background (`{colors.moss-cyan}`), Warm Paper text, padding 8px 16px. Hover darkens to 90% opacity with a subtle scale-down on active (`active:scale-[0.97]`).
- **Secondary:** Cool Mist background, Ink text. Hover darkens background.
- **Outline:** Warm Paper background, Parchment Line border, Ink text. Hover shifts to Cool Mist background.
- **Ghost:** Transparent background, Ink text. Hover shifts to Accent background.
- **Link:** Moss Cyan text, underline on hover, no background.
- **Focus:** 3px ring in Moss Cyan at 50% opacity (`focus-visible:ring-[3px] focus-visible:ring-ring/50`).

### Chips / Tags
- **Style:** Rounded-full (pill shape), Parchment Line border, Warm Paper background, Ink text at 0.875rem font-medium.
- **Usage:** Technology stack tags on project cards, filter pills, metadata labels.

### Cards / Containers
- **Corner Style:** 8px radius (`rounded-lg`).
- **Background:** Warm Paper or Card token.
- **Shadow Strategy:** Flat at rest. On hover: Card Hover Lift shadow + slight translate-y (-0.5px) + background shift to Accent/40.
- **Border:** 1px Parchment Line.
- **Internal Padding:** 24px (`p-6`).

### Inputs / Fields
- **Style:** 1px Parchment Line stroke, transparent background, 6px radius, height 36px.
- **Focus:** Border shifts to Moss Cyan, 3px ring at 50% opacity.
- **Error:** Border shifts to Alert Red, ring at 20% opacity.
- **Disabled:** Pointer events disabled, opacity 50%.

### Navigation
- **Style:** Sticky top bar, Warm Paper background at 95% opacity with backdrop blur. Height 56px (`h-14`). Max width 5xl centered.
- **Typography:** Brand wordmark in Instrument Serif at 1.125rem. Links in IBM Plex Sans at 0.875rem font-medium.
- **Default:** Muted Slate text.
- **Hover:** Cool Mist background at 50%, Ink text.
- **Active:** Cool Mist background at 100%, Ink text.
- **Mobile:** Slide-down panel with staggered link entrance (40ms delay per item), ease-out-quart transition.

### Status Badge
- **Style:** Pill shape (rounded-full), solid background from status palette, contrasting foreground text. 0.875rem font-medium. Padding 5px 10px (`px-2.5 py-0.5`).
- **Variants:** Verified (Moss Cyan), In Progress (Signal Blue), Attention (Caution Amber), Risk (Alert Red), Neutral (Warm Graphite).

### AnimateIn (Signature Component)
- **Behavior:** Scroll-triggered entrance animations. Elements fade up (default), fade in, scale in, or slide down when entering the viewport.
- **Timing:** 600–700ms duration, ease-out-quart easing, configurable delay for staggered reveals.
- **Accessibility:** Respects `prefers-reduced-motion`; animations degrade to instant state changes.

## 6. Do's and Don'ts

### Do:
- **Do** use Moss Cyan for primary actions, verified states, and focus rings. It is the system's only saturated accent.
- **Do** cap body line length at 65–75ch. Longer lines reduce readability and signal lazy layout.
- **Do** use tonal layering (background shifts, borders) before reaching for shadows.
- **Do** respect `prefers-reduced-motion`. All animations must degrade gracefully.
- **Do** use status colors for state only. Verified, In Progress, Attention, Risk, and Neutral communicate condition across every surface.
- **Do** keep Instrument Serif at display and headline scales (≥1.5rem). At smaller sizes, use IBM Plex Sans.
- **Do** use generous section padding (64–96px) and a tight content well (max-w-3xl) to maintain focus.

### Don't:
- **Don't** use gradient text (`background-clip: text` with gradients). Decorative, never meaningful. Use a single solid color and emphasis via weight or size.
- **Don't** use side-stripe borders (`border-left` or `border-right` greater than 1px as a colored accent on cards, list items, or callouts).
- **Don't** use glassmorphism as default. Blurs and glass cards are prohibited unless specifically justified.
- **Don't** use the hero-metric template (big number, small label, supporting stats, gradient accent). SaaS cliché.
- **Don't** use identical card grids with icon + heading + text repeated endlessly.
- **Don't** use modal as first thought. Exhaust inline and progressive alternatives first.
- **Don't** use em dashes. Use commas, colons, semicolons, periods, or parentheses.
- **Don't** repurpose status colors for branding, marketing, or decorative elements. They are state language only.
- **Don't** use generic SaaS landing page clichés. No "boost your productivity 10x" copy, no big-number hero metrics, no gradient accents.
- **Don't** use dark-mode-with-neon tropes. No purple gradients, neon accents, or glassmorphism used as default. The aesthetic is light-first and materially grounded.
