# Design System Context

## Design Direction

The site should feel like an engineer with taste, discipline, and operational clarity.

Use an engineering dashboard visual language first, portfolio language second, and client portal language third.

The overall identity is a technical editorial control center:

- editorial enough to feel personal and thoughtful
- dashboard-like enough to prove operational discipline
- technical enough for senior engineers
- polished enough for clients and recruiters
- never generic SaaS
- never sci-fi by default
- never playful at the expense of trust

The design should feel:

- calm
- precise
- technical
- premium
- transparent
- maintainable

Avoid:

- generic dark SaaS gradients
- random particle effects
- one-note palettes
- oversized marketing heroes
- vague developer portfolio copy
- decorative Three.js scenes that do not prove anything

## Impeccable Design Discipline

Adopt the Impeccable design discipline for UI work.

For HITL design issues, agents must shape before they build. The shape brief is a compact design compass, not a full implementation spec.

Required shape brief:

```md
## Shape Brief

### Purpose
What this surface must accomplish.

### Primary User
Who is looking at it and what state of mind they are in.

### Content
What real content/data must appear.

### Feeling
What it should feel like, and what it must not feel like.

### Constraints
Accessibility, responsive, performance, design-system, and anti-slop constraints.

### Review Artifact
What the human will review: screenshot, mock, palette, copy, prototype, or live URL.

### Approval Question
The exact question the human must answer before implementation continues.
```

Strict shape-brief gates apply to:

- design tokens and status semantics
- homepage trust copy and CTA direction
- About page positioning
- Three.js production pipeline map

For non-HITL UI work, agents must still follow these design rules, but they do not need a new shape brief if the context is already clear.

## Anti-Slop Rules

Avoid visible AI-generated UI tells:

- purple or blue gradients used as the core identity
- gradient text
- glassmorphism as decoration
- neon-on-dark technical aesthetic
- dark mode by default because the product is technical
- beige SaaS warmth by default
- hero metric templates
- identical icon-card grids
- nested cards
- side-tab accent borders
- centered everything
- overused font defaults as the whole identity
- monospace as a generic technical signal
- massive decorative icon tiles
- modals as the first design answer
- redundant UX copy that repeats headings
- decorative sparklines or charts that do not communicate real data

Before shipping a UI slice, agents should review:

- accessibility
- performance
- theming
- responsive behavior
- copy clarity
- edge cases
- anti-patterns

Repeated patterns used three or more times with the same intent should become tokens, components, or documented patterns.

## Theme Strategy

The MVP is light-first.

Dark technical mode is a future enhancement, not the default MVP theme.

Light-first is intentional because the site should feel transparent, professional, and credible for clients, recruiters, and senior engineers during normal work contexts.

Do not choose dark mode just because the product is technical.

## Color Strategy

Use a restrained technical palette with one committed accent.

Palette direction:

- tinted neutral base, never pure black or pure white
- muted green-cyan primary accent
- semantic status colors
- color clarifies system state, never decoration

The primary accent should feel like verified signal and clean telemetry. It should not feel neon, cyberpunk, terminal-hacker, startup royal blue, or luxury gold.

Do not lock exact OKLCH values until issue #9 explores tokens visually.

## Typography Direction

Use a two-font system plus code mono:

- `Instrument Serif` for public display headings and selected editorial moments
- `IBM Plex Sans` for body text, UI, admin, private rooms, forms, tables, and navigation
- `IBM Plex Mono` only for code, build IDs, commit refs, pipeline labels, and technical snippets

Do not use monospace as the main brand voice.

Do not use a single font for the entire site.

Body copy should remain readable and calm. Public headings can carry more editorial personality.

Body line length should stay around 65 to 75 characters where practical.

Typography hierarchy should use real scale and weight contrast, not tiny differences between adjacent sizes.

Prefer `next/font/google` for these fonts during implementation. Use local font files only if there is a licensing or loading reason.

## Design System Stack

Use:

- Tailwind CSS for layout and token-driven styling
- shadcn/ui for accessible dashboard and form primitives
- custom CSS only for global tokens, base styles, Markdown typography, and Three.js shell styling
- React components for repeated UI patterns

## CSS Boundaries

`src/app/globals.css` should be the only global CSS file at first.

It owns:

- Tailwind import
- theme tokens
- CSS variables
- light/dark tokens
- base app styles
- Markdown typography class
- Three.js shell class

Do not create feature-specific CSS files in v1.

## Component Rules

- Use shadcn components before custom primitives.
- Use semantic tokens instead of raw colors.
- Use Tailwind utilities for layout, spacing, and responsive behavior.
- Keep cards and panels restrained, around 8px radius unless a component requires otherwise.
- Do not put UI cards inside other cards.
- Use icons in action buttons where a familiar symbol exists.
- Keep public pages more editorial and admin/client rooms more dashboard-like.
- Use cards only when they frame a real object or repeated item.
- Do not use cards as the default page layout mechanism.
- Use spacing, typography, dividers, and layout rhythm before adding borders or shadows.
- Project summaries can be cards.
- Milestone items can be cards or timeline rows.
- Private-room status blocks can use restrained panels.
- Admin tables and forms can use shadcn surfaces.
- Homepage sections should not become stacks of generic cards.

## Status Language

Status color and label mappings should live in `src/design/statuses.ts`.

The same status semantics should be reused across:

- public project pages
- admin dashboard
- private rooms
- pipeline evidence
- Three.js system map

Status colors mean state, not decoration:

- `Verified / Success`: muted green-cyan for passing tests, deployed, approved, production-ready, and completed milestones
- `In Progress`: restrained blue-teal for active build, current milestone, running pipeline, and ongoing work
- `Attention / Warning`: amber for blocked, needs review, pending decision, and partial evidence
- `Risk / Error`: muted red for failed checks, revoked access, invalid token, and deployment failure
- `Neutral`: tinted gray for draft, archived, unavailable, not started, and metadata

## Three.js Role

Three.js should visualize the engineering system, not decorate the page.

The Three.js scene should make visitors think: this person thinks in systems.

The scene should feel like a living system diagram, not a 3D spectacle:

- precise
- calm
- inspectable
- lightly interactive
- connected to real project evidence
- more engineering operating model than sci-fi scene

Primary scene:

- production pipeline map
- product node
- architecture layer
- tests layer
- Docker layer
- CI/CD layer
- deployment layer
- milestones layer

Always provide accessible HTML navigation and fallback content outside the canvas.

Interaction guidance:

- hover or click highlights what each layer proves
- project nodes connect into the system
- canvas is never the only way to navigate
- fallback HTML shows the same layers in a clean diagram or list

Avoid:

- particle fields
- space scenes
- neon glow
- spinning cubes
- excessive camera motion
- hidden navigation inside the canvas only

## Localization Readiness

The MVP is English-only, but UI layouts should not assume English text will always be short.

Design public pages, admin screens, and private rooms so future Turkish or Russian copy can expand without breaking containers, buttons, navigation, tables, or cards.

Do not hide critical features on smaller screens or future localized layouts because copy becomes longer. Adapt the layout instead.
