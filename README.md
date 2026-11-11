# Vianova Brandbook

White papers, one-pagers, tenders and case studies. **Independent of `vianova-ds`**
(the product design system): no workspace link, no package dependency, no submodule,
no build-time fetch, no shared CI.

## What is here

| Folder | What it is |
|---|---|
| `capture/` | A snapshot of the Figma file's variables (colours, geometry, type sizes, fonts, status, gradient). |
| `tokens/src/`, `digest.md` | The snapshot converted to design tokens, and a readable table of every value with its contrast ratio. |
| `kit/vn-minimal/` | The VN-Minimal template as code: `vn-minimal.css` (tokens and components) and `paginate.js`, which lays a long text out on A4 pages by measuring it in Chrome. |
| `design-system/` | Source of the "Vianova Brandbook" design system used on Claude Design canvases: `build.py` plus `project/` (tokens, component cards, logos). |
| `scripts/`, `test/` | The token transform, and the checks on it. |
| `docs/design-brief.md` | The original brief. It predates the current template in places. |

Documents built with the kit (tenders, papers) are not kept here.

## Direction of truth

Figma is where the Brandbook is designed. Everything in this repository is a copy
made from it, so when the two disagree, Figma is right.

```
Figma "Vianova Brandbook"  (rBgYzyWoDFPc76K0mpuDaP)
  ↓  read-only MCP capture — committed, never hand-edited
capture/variables.json
  ↓  offline deterministic transform, no network
tokens/src/*.tokens.json   (DTCG)
  ↓  build
public/tokens.json · app/styles/paper.css · digest.md

Figma components and text styles
  ↓  read by hand, component by component
kit/vn-minimal/vn-minimal.css
  ↓  design-system/build.py
design-system/project/
```

**Status, 2026-11-11.** The capture is from 2026-10-13 and holds 78 variables. Figma
has since gained two type-size variables, four text styles, seven components and two
variants for dense documents. The kit has them; the capture, the tokens and the
design-system cards do not yet.

## Using the kit

A document is one `content.html` plus a small build script that loads
`kit/vn-minimal/vn-minimal.css` and `paginate.js` in headless Chrome. Blocks marked
`span` take the full measure; everything else flows in two columns. The paginator
picks the loosest body size that fits a page limit, builds the contents page, and
reports overflow. It needs Google Chrome and network access to Google Fonts for
Poppins. No npm packages.

Poppins is licensed under the SIL Open Font License. Its font files are not
committed; `design-system/build.py` copies them from the local font folder.

## Commands

```bash
pnpm build          # transform capture -> tokens -> css + digest
pnpm test           # the three guards
pnpm capture:check  # has the Figma file moved since the capture?
```

## The three guards

| Test | Catches |
|---|---|
| `shared-values` | A role shared with the product DS drifting away from it, and any reappearance of the retired `#14b7a5` |
| `contrast` | A colour change that drops a real pair below WCAG AA body |
| `determinism` | A hand-edited generated file, and any network call smuggled into the offline transform |

Each is verified by deliberately breaking it, not merely by passing.

## Why `capture/ds-reference.json` exists

Cross-file Figma variable aliasing requires an **Organization or Enterprise** plan.
The Vianova team is on **Professional** (verified 2026-10-01), so roles shared with
the product DS cannot be aliased — they are restated as local variables in the
artefact library.

`capture/ds-reference.json` is a committed constant with provenance that makes the
restatement checkable. It is **not** a live dependency, so independence holds. If a
DS value changes, update that file and the Figma library in the same PR.

## Editing rules

- `capture/` is the only directory edited by hand — and only by re-capturing from Figma.
- `tokens/src/` and `digest.md` are **generated but committed**, so a fresh clone has
  resolved values with no build. CI re-runs the transform and fails on any diff, which
  is what stops someone hand-editing them. Never edit them directly.
- `public/` and `app/styles/paper.css` are generated build output and gitignored.
- No element may sit within **14 pt** of a page edge: a typical office laser cannot
  print inside ~11.9 pt. See `docs/design-brief.md`.
- Never set a named font weight such as "Poppins SemiBold" programmatically — it
  exports as Times in Google Docs and Slides.
