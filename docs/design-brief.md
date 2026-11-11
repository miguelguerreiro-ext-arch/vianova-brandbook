# Vianova Brandbook — design brief

> Phase 1 deliverable. This is what the Figma library is built from.
> Settled 2026-10-01. Direction chosen: **B — Gradient Spine**.

Every colour below is **exact** — either a Vianova DS semantic role or a verbatim
Tailwind primitive from `packages/tokens/figma-ground-truth.json`. No value in
this system is an approximation. That was a deliberate entry condition: if a
value isn't exact, it doesn't become a variable.

DS values read from `vianova-ds` token digest, generated 2026-09-29, DS repo
`2eefc71`.

---

## 1. The four reconciliations, answered

The previous record contradicted itself. These are now single answers.

| Question | Decision |
|---|---|
| Gradient on the page | **Yes — but vertical, on the outer edge, not a horizontal top-bar.** A top-bar competes with the headline; a spine does not, and it survives at A4 |
| Which gradient | **The real 5-stop brand gradient.** `#FC0061 → #BA00C7 → #6000F3 → #004BD9 → #00DC96`, verbatim from `primitive/brand.tokens.json`. The previously recorded `#8b3dff → #ff3aa4 → teal` was an approximation of this and is retired |
| Magenta in the body | **Absent.** Magenta exists only as a stop inside the spine gradient. It is never page chrome, never an accent, never a data colour. The `#fc0061` pager accent is retired, not grandfathered |
| `#14b7a5`, `#4a2fa8`, `#ff3aa4` | **All out.** `#14b7a5` is retired company-wide; the other two were flagged approximations and no approximation becomes a variable |

## 2. Palette

### Shared roles — Figma **aliases** to the product DS library, never local literals

These are the drift guard. A teal change in the DS propagates automatically.

| Artefact role | Aliases DS | Value | Note |
|---|---|---|---|
| `rule` | `--primary` | `#0f766e` | teal-700. **Not named `accent`** — `accent` already means `#f4f4f5`, a muted neutral surface, in the DS. Naming collision avoided deliberately |
| `ink` | `--foreground` | `#09090b` | zinc-950 |
| `muted` | `--muted-foreground` | `#52525b` | zinc-600 |
| `line` | `--border` | `#e4e4e7` | zinc-200 |
| `paper` | `--background` | `#ffffff` | |

### Paper-local roles — exact primitives, no DS equivalent

| Role | Value | Primitive |
|---|---|---|
| `rule-deep` | `#134e4a` | teal-900 |
| `tint` | `#f0fdfa` | teal-50 |
| `ink-2` | `#18181b` | zinc-900 |
| `caption` | `#71717a` | zinc-500 |
| `surface` | `#fafafa` | zinc-50 |

### Semantic data roles — three, and they hold across a whole document

| Role | Value | Primitive |
|---|---|---|
| `data-baseline` | `#172554` | blue-950 |
| `data-current` | `#0f766e` | teal-700 (same as `rule`) |
| `data-outcome` | `#b45309` | amber-700 |

### Brand gradient stops — spine only

`#FC0061` · `#BA00C7` · `#6000F3` · `#004BD9` · `#00DC96`, at 0 / 24 / 48 / 72 / 100 %.

### Contrast, measured

| Pair | Ratio | AA body |
|---|---|---|
| `rule` on paper | 5.47 | PASS |
| `data-outcome` on paper | 5.02 | PASS |
| `data-outcome` on tint | 4.81 | PASS |
| `data-baseline` on paper | 14.69 | PASS |
| `muted` on paper | 7.73 | PASS |
| `caption` on paper | 4.83 | PASS |
| `rule` on tint | 5.25 | PASS |
| `rule-deep` on tint | 9.09 | PASS |

`amber-600 #d97706` was rejected at 3.19:1 — it failed AA body and would have
been numerals-only. `amber-700` passes everywhere, so the role carries no usage
caveat.

## 3. Geometry

A4 595.276 × 841.890 pt.

| | |
|---|---|
| Spine | 10 pt wide, full height, **inset 14 pt from the left edge** |
| Margins | 36 pt top / right / bottom; text starts at 46 pt left |
| Content width | 513.276 pt |
| Columns | 2 × 246.638 pt, 20 pt gap |
| Header row | 24 pt |
| Folio | bottom-right, 36 pt in |

**Why the spine is inset.** A typical office laser has an unprintable margin of
~4.2 mm ≈ 11.9 pt. A spine at x = 0–10 pt sits entirely inside it and vanishes on
any desktop print — which is exactly how a tender or paper gets printed. At 14 pt
it clears the zone, and text position is unchanged. This is a hard constraint, not
a preference: **no element of this system may sit within 14 pt of a page edge.**

## 4. Type — Poppins

Poppins for print. Inter stays for product, web and decks. Two ladders, each with
a stated ratio.

**Text ladder — ratio 1.2, base 9 pt**

| Size | Role |
|---|---|
| 6.5 | eyebrow, section label, card label |
| 7.5 | caption, folio |
| 9 | body, card description |
| 11 | standfirst, lede, callout |
| 13 | subsection heading |

**Display ladder — ratio √2, base 18 pt**

√2 is the A-series ratio, so the display scale and the paper share one geometry.

| Size | Role |
|---|---|
| 18 | section title |
| 25.5 | card value |
| 36 | document title |
| 51 | — reserved |
| 72 | hero numeral |

Weights: 300 / 400 / 600 / 700 only. **Never set a named weight such as "Poppins
SemiBold" programmatically** — it exports as Times in Google Docs and Slides, two
of the four authoring routes.

> Changed from the specimen, to be re-verified when the template is drawn: section
> title 15 → 18, card value 24 → 25.5. Both were accumulated values; the ladder
> above is the stated one.

## 5. Components

Section header · callout (tint fill, 2 pt `rule` left border) · TOC row ·
data card (3 pt semantic top bar) · hero numeral band (2 pt `rule` rule above) ·
image slot · CTA block.

## 6. Page architecture

Cover · section opener · content page (2 col) · results/findings · conclusion.

## 7. Open items — not decided, do not invent

1. **CMYK.** If papers are physically printed, `#0f766e` needs a defined CMYK
   equivalent or it shifts on press. The DS stores semantics as `oklch()` and
   resolves to hex; neither helps. Needs a press profile decision.
2. **Greyscale collapse.** `data-baseline #172554` and `data-outcome #b45309` are
   only **2.93:1** apart in luminance. In hue they are maximally distinct (and
   blue/orange is the safest colour-vision-deficiency pair), but a greyscale
   office print flattens them to near-identical. Either the 3 pt top bar carries a
   second differentiator, or the roles need a luminance spread.
3. **White-label bids.** These carry zero Vianova branding. Either a separate
   explicitly unbranded template, or a stated omission. Not resolved here.
