# ADR 0003: Use Tailwind And shadcn/ui For The Design System

## Status

Accepted

## Context

The site needs a premium engineering dashboard feel, public portfolio pages, admin dashboard screens, private client rooms, and maintainable styling rules.

## Decision

Use Tailwind CSS for layout and token-driven styling, shadcn/ui for accessible component primitives, and small custom CSS only for global tokens, base styles, Markdown typography, and Three.js shell styling.

## Alternatives Considered

- plain CSS only
- CSS modules for each feature
- component libraries that hide implementation details
- fully custom components from scratch

## Consequences

The project can move quickly while keeping component source code local and customizable.

The team must avoid raw color drift, feature-specific CSS files in v1, and ad hoc UI primitives when shadcn components already fit.
