# Design System Context

## Design Direction

The site should feel like an engineer with taste, discipline, and operational clarity.

Use an engineering dashboard visual language first, portfolio language second, and client portal language third.

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

## Status Language

Status color and label mappings should live in `src/design/statuses.ts`.

The same status semantics should be reused across:

- public project pages
- admin dashboard
- private rooms
- pipeline evidence
- Three.js system map

## Three.js Role

Three.js should visualize the engineering system, not decorate the page.

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
