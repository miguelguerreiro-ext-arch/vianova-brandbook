# Vianova Brandbook — token digest

> **GENERATED** by `scripts/digest.ts` — do not edit by hand. Regenerate with `pnpm digest`.

| | |
|---|---|
| Figma file | `rBgYzyWoDFPc76K0mpuDaP` (name not readable via the Plugin API) |
| Captured | 2026-10-13 |
| Figma version | `UNVERIFIED` |
| Capture sha256 | `e0d2df1e24afa3dc…` |
| DS reference | digest 2026-09-29, repo `2eefc71` |

Three tiers, never skipping: **primitive → semantic**, with every semantic role aliasing a
primitive inside the Figma file. Roles marked *shared* are restated from the Vianova DS
because cross-file aliasing needs Organization/Enterprise and this team is on Professional;
`test/shared-values.test.ts` pins them.

## Colour

| Role | Value | Aliases | Shared | Contrast on paper |
|---|---|---|---|---|
| `accent/default` | `#112e57` | `navy/900` | — | 13.53 AA |
| `text/heading` | `#111827` | `gray/900` | — | 17.74 AA |
| `text/secondary` | `#4b5563` | `gray/600` | — | 7.56 AA |
| `text/muted` | `#6b7280` | `gray/500` | — | 4.83 AA |
| `text/body` | `#111827` | `gray/900` | — | 17.74 AA |
| `border/default` | `#e5e7eb` | `gray/200` | — | _surface — not text_ |
| `surface/page` | `#ffffff` | `neutral/white` | DS `background` | _surface — not text_ |
| `accent/tint` | `#eef7ff` | `navy/tint` | — | _surface — not text_ |
| `surface/raised` | `#f9fafb` | `gray/50` | — | _surface — not text_ |
| `text/on-accent` | `#ffffff` | `neutral/white` | DS `background` | — |
| `secondary/default` | `#1b787a` | `teal-artefact/700` | — | 5.23 AA |
| `secondary/tint` | `#e7fafa` | `teal-artefact/tint` | — | _surface — not text_ |
| `tertiary/default` | `#fc0061` | `brand-gradient/1` | — | 3.95 AA-large — display only |
| `tertiary/tint` | `#fff1f2` | `magenta/tint` | — | _surface — not text_ |
| `caveat/default` | `#b45309` | `amber/700` | — | 5.02 AA |
| `caveat/tint` | `#fff2ea` | `amber/tint` | — | _surface — not text_ |
| `1` | `#fc0061` | `brand-gradient/1` | — | _surface — not text_ |
| `2` | `#ba00c7` | `brand-gradient/2` | — | _surface — not text_ |
| `3` | `#6000f3` | `brand-gradient/3` | — | _surface — not text_ |
| `4` | `#004bd9` | `brand-gradient/4` | — | _surface — not text_ |
| `5` | `#00dc96` | `brand-gradient/5` | — | _surface — not text_ |
| `existing/surface` | `#e7fafa` | `teal-artefact/tint` | — | _surface — not text_ |
| `existing/text` | `#1b787a` | `teal-artefact/700` | — | 5.23 AA |
| `included/surface` | `#eef7ff` | `navy/tint` | — | _surface — not text_ |
| `included/text` | `#112e57` | `navy/900` | — | 13.53 AA |
| `configured/surface` | `#fff2ea` | `amber/tint` | — | _surface — not text_ |
| `configured/text` | `#b45309` | `amber/700` | — | 5.02 AA |
| `proposed/surface` | `#f9fafb` | `gray/50` | — | _surface — not text_ |
| `proposed/text` | `#4b5563` | `gray/600` | — | 7.56 AA |

## Shared with the product Vianova DS

Still bound: **2** role(s). Restated, not aliased —
cross-file aliasing needs Organization/Enterprise and this team is on Professional.

| Artefact role | DS role | Value |
|---|---|---|
| `surface/page` | `background` | `#ffffff` |
| `text/on-accent` | `background` | `#ffffff` |

**Severed 2026-10-08** — the artefact palette realigned to vianova.io, not the product DS.

| Was | DS value | Is now | New value |
|---|---|---|---|
| Artefact / Paper/rule -> DS primary | `#0f766e` | `accent/default` | `#112e57` |
| Artefact / Data/data-current -> DS primary | `#0f766e` | `secondary/default` | `#1b787a` |
| Artefact / Paper/ink -> DS foreground | `#09090b` | `text/heading` | `#111827` |
| Artefact / Paper/muted -> DS muted-foreground | `#52525b` | `text/secondary` | `#4b5563` |
| Artefact / Paper/line -> DS border | `#e4e4e7` | `border/default` | `#e5e7eb` |

## Geometry

| Token | Value | Scopes |
|---|---|---|
| `page-width` | 595.276pt | WIDTH_HEIGHT |
| `page-height` | 841.89pt | WIDTH_HEIGHT |
| `safe-edge` | 14pt | GAP |
| `margin` | 36pt | GAP |
| `content-width` | 513.276pt | WIDTH_HEIGHT |
| `column-width` | 246.638pt | WIDTH_HEIGHT |
| `column-gap` | 20pt | GAP |
| `header-height` | 24pt | WIDTH_HEIGHT |
| `card-bar` | 3pt | WIDTH_HEIGHT |
| `hairline` | 0.75pt | STROKE_FLOAT |
| `margin-doc` | 54pt | GAP |
| `content-doc` | 487.276pt | WIDTH_HEIGHT |
| `baseline` | 15pt | GAP |
| `badge` | 24pt | WIDTH_HEIGHT |
| `topbar` | 3pt | WIDTH_HEIGHT |
| `accent-rule` | 60pt | WIDTH_HEIGHT |

## Type

| Token | Value | Scopes |
|---|---|---|
| `text-eyebrow` | 6.5pt | FONT_SIZE |
| `text-caption` | 7.5pt | FONT_SIZE |
| `text-body` | 9pt | FONT_SIZE |
| `text-lede` | 11pt | FONT_SIZE |
| `text-subhead` | 13pt | FONT_SIZE |
| `display-value` | 25.5pt | FONT_SIZE |
| `display-title` | 36pt | FONT_SIZE |
| `display-xl` | 51pt | FONT_SIZE |
| `display-hero` | 72pt | FONT_SIZE |

## Font

| Token | Value | Scopes |
|---|---|---|
| `family-print` | Poppins | FONT_FAMILY |
| `weight-light` | Light | FONT_STYLE |
| `weight-regular` | Regular | FONT_STYLE |
| `weight-semibold` | SemiBold | FONT_STYLE |
| `weight-bold` | Bold | FONT_STYLE |
