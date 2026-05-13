# Three.js Pipeline Map Redesign

**Issue:** [#49 — Build Three.js Pipeline Map With HTML Fallback](https://github.com/bagtyyarkovusov/personal-engineering-portfolio/issues/49)

**Status:** Approved design, pending implementation

**Parent:** [#1 — PRD: Tracer-bullet MVP and delivery workflow](https://github.com/bagtyyarkovusov/personal-engineering-portfolio/issues/1)

---

## Goal

Rebuild the homepage Three.js pipeline map to feel like an engineering control center — calm, technical, emissive, scroll-driven — replacing the current static abstract-geometry scene.

## What's Wrong With the Current Scene

- Abstract colored shapes on a horizontal spine — communicates nothing about software delivery
- Bright status colors (Tailwind hex values) look like debug rendering, not finished design
- Static (`frameloop="demand"`) — frozen image unless the visitor drags the camera
- OrbitControls let the visitor break composition by spinning the scene upside down
- No integration with page scroll — the scene sits in a 500px panel, disconnected from the page narrative

## Redesign Decisions

### 1. Metaphor: Engineering Control Center

The scene communicates "I monitor, I verify, I ship." Dark background with emissive nodes, subtle glow, slow data pulses. Feels like a Grafana dashboard or Bloomberg terminal — data-driven, operational, calm — not a particle-effect screensaver.

### 2. Layout: Horizontal Flow River With Z-Depth Staging

Six flow stages arranged continuously left-to-right (Product → Architecture → Tests → Docker → CI/CD → Deployment). Two support rows below (Milestones, Evidence). Stages are spaced along the X-axis with shallow Z-axis offset per stage so the camera pushes slightly forward as it advances — each stage emerges from behind the last.

### 3. Surface: Emissive Terminal Aesthetic

Dark background. Nodes glow with muted green-cyan accent mapped to your design tokens. Subtle bloom post-processing pass (EffectComposer + UnrealBloomPass). Edge connections carry faint directional light. No standardMeshMaterial with flat Tailwind colors. The scene should feel like verified telemetry, not a toy.

**Color mapping:**
- `verified`: muted green-cyan glow (#22c55e → tone-mapped through bloom)
- `inProgress`: restrained blue-teal (#3b82f6 → dim pulse)
- `attention`: amber (#f59e0b → soft flicker)
- `risk`: muted red (#ef4444 → warning flicker, faster pulse)
- `neutral`: dim gray (#6b7280 → barely lit)

### 4. Motion: Subtle Autonomous Pulse + Hover Interaction

- **Autonomous:** Verified nodes emit a slow glow pulse (3-5s cycle). InProgress nodes pulse at medium tempo (~2s). Attention nodes flicker softly. Edges carry faint slow directional flow.
- **Hover:** Node scales to 1.3x, glow ring intensifies, a detail card appears (name, status label, one-line description). Connected edges brighten. Unrelated nodes dim.
- **Frameloop:** `frameloop="always"` — the scene is a living background, not a frozen diorama.
- **Performance cap:** DPR capped at `[1, 1.5]`. Frameloop paused via visibility observer when off-screen.

### 5. Camera: Scroll-Driven Horizontal Pan, No OrbitControls

- The scene replaces the hero section as a sticky viewport-filling element (~600px).
- As the user scrolls, the camera tracks left-to-right through the 6 flow stages.
- Camera also pushes slightly forward (Z-depth) per stage, creating a sense of progression.
- When the pipeline completes (Deployment stage), the page releases into normal scroll (Work section, etc.).
- No OrbitControls. No click-and-drag to rotate. Scroll IS the interaction.
- On touch devices: touch scroll drives the same camera pan.

### 6. Pipeline Stages (Unchanged From Current)

**Flow stages (spine):** Product → Architecture → Tests → Docker → CI/CD → Deployment
**Support rows (below):** Milestones, Evidence

### 7. Data Source: Static Curated PipelineMap

The scene uses the existing `PipelineMap` type contract from `src/features/pipeline-map/types.ts` with static data. No database dependency. The example data is updated manually when content changes. This keeps the component simple and the data contract the same whether static or live.

### 8. HTML Fallback: Static Accessible Diagram

For visitors with `prefers-reduced-motion` or WebGL issues — a clean, static HTML diagram showing all pipeline stages, status colors, labels, and connections. Screen-reader accessible. Keyboard-navigable. No scroll dependency. The fallback communicates the same pipeline system without animation or 3D. Uses `role="region"` with `aria-label`.

### 9. Hover Micro-Interaction Detail

When a node is hovered:
1. Node scales 1.3x over 150ms ease-out
2. Glow ring around node intensifies (emissive bloom radius increases)
3. Detail card fades in near the node showing: **name**, **status label** (verified/in-progress/attention/risk), **one-line description**
4. All edges connected to this node brighten to full opacity
5. Edges not connected to this node dim to 0.15 opacity
6. Upstream nodes dim slightly, downstream nodes dim slightly less (preserving flow direction)

On unhover: all resets over 300ms ease-in.

### 10. Page Integration: Hero Takeover

```
┌──────────────────────────────┐
│  Trust claim + CTAs          │  ← fixed text, positioned over or beside canvas
│                              │
│  ┌────────────────────────┐  │
│  │                        │  │
│  │   Three.js Pipeline    │  │  ← sticky viewport section
│  │   (scroll drives cam)  │  │     ~600px height
│  │                        │  │
│  │  Product ▶ Architecture │  │
│  │  ▶ Tests ▶ ...        │  │
│  │                        │  │
│  └────────────────────────┘  │
├──────────────────────────────┤
│  Work section                 │  ← normal scroll resumes
│  Car marketplace card         │
├──────────────────────────────┤
│  Engineering System           │
│  ...                          │
└──────────────────────────────┘
```

The trust claim and CTAs remain visible (positioned over the canvas or in a fixed top zone) while the pipeline scrolls behind them. After the pipeline completes, both release and normal page scroll resumes.

## Architecture

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `src/components/three/pipeline-scene-client.tsx` | Rewrite | New control-center scene: emissive materials, bloom, scroll-driven camera, hover interaction, pulse animation |
| `src/components/three/pipeline-scene.tsx` | Modify | Adapt wrapper for scroll-driven interaction, remove OrbitControls imports |
| `src/components/three/pipeline-diagram-html.tsx` | Keep (minor polish) | Static fallback — already solid, may need minor style tweaks |
| `src/app/(public)/page.tsx` | Modify | Hero takeover layout: sticky scene section, trust claim overlay, scroll release into Work section |
| `src/features/pipeline-map/example-data.ts` | Keep (no changes) | Static data re-used as-is |
| `src/features/pipeline-map/types.ts` | Keep (no changes) | Type contract unchanged |

### New Implementation Details

**Bloom post-processing:**
- Add `@react-three/postprocessing` package
- `EffectComposer` + `UnrealBloomPass` (threshold: 0.6, strength: 0.4, radius: 0.8)
- Only emissive materials trigger bloom — background remains dark

**Scroll-driven camera:**
- Extend `PipelineSceneClient` with a `useFrame` hook that reads scroll position
- Map scroll offset to camera position: `camera.position.x = lerp(currentX, targetX, 0.08)` per frame
- Target X derived from scroll progress (0% = Product, 100% = Deployment)
- Z offset per stage: shallow forward push as stages advance

**Pulse animation:**
- `useFrame` updates an elapsed time uniform or directly modulates emissive intensity
- `sin(elapsed * frequency) * amplitude` mapped per status
- Pulse frequency: verified=0.3hz, inProgress=0.5hz, attention=0.8hz, risk=1.2hz, neutral=0hz

**Hover interaction:**
- Raycasting on pointermove over the canvas
- Three-stage hover: detect (raycast), expand (gsap-like spring to 1.3x scale), detail (fade in HTML overlay or 3D text panel)
- Detail card positioned in screen space near the hovered node, or as a 3D panel in world space

**Performance:**
- DPR cap: `[1, 1.5]`
- `frameloop="always"` but pause via IntersectionObserver when scene is off-screen
- Node geometries instanced where practical
- Bloom resolution: half-res (default in drei/EffectComposer)

## Testing

- Unit: `src/components/three/pipeline-scene.test.tsx` — update existing tests for new scroll/camera behavior, hover state changes, status-to-color mapping
- E2E: `e2e/pipeline-map.spec.ts` — verify canvas renders, verify HTML fallback shows when reduced-motion is emulated, verify scroll-to-pan works
- CI: `threejs-gate` job continues to gate on pipeline map render/fallback verification

## Acceptance Criteria (From Issue #49)

- [ ] Homepage renders the Three.js pipeline map on supported clients.
- [ ] Fallback HTML communicates the same pipeline when WebGL/reduced-motion constraints apply.
- [ ] Scene uses design/status semantics rather than arbitrary colors.
- [ ] Human visual review confirms the scene supports trust rather than decoration.

## Out of Scope

- Database-driven pipeline data (stays static)
- Mobile-specific layout changes beyond responsive canvas sizing
- Animating the HTML fallback (stays static)
- Custom shader materials beyond standard + emissive + bloom
- Post-processing beyond bloom (no DOF, no color grading, no SSAO)
- Particle effects along edges (phase 2 possibility)
- Audio or sound design
