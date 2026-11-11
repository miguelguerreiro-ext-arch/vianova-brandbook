The Vianova Brandbook is the system for A4 documents: white papers, tenders, concepts and case studies. It holds one template so far, **VN-Minimal**, for long documents. It is not the product system. Product UI, the website and decks use Vianova DS (Inter, teal `#0f766e`, zinc); nothing here applies to them, and nothing from there applies here.

Do not use this system for a white-label deliverable. Those carry no Vianova branding at all.

## The page

Set every length in points. One Figma unit is one point on A4, and the kit's CSS uses `pt` so each number matches the variable it came from.

| | Value | Token |
|---|---|---|
| Sheet | 595.276 × 841.89pt | `page-width`, `page-height` |
| Margin, all four sides | 54pt | `margin-doc` |
| Measure | 487.276pt | `content-doc` |
| Columns for prose | 2 × 233.638pt, 20pt gap | `column-gap` |
| Brand bar | 3pt, full bleed, top edge | `topbar` |
| Header | y 30, 20pt tall; hairline at y 56 | |
| Content | y 72 to y 774 | |
| Footer | y 786 | |
| Rules and borders | 0.75pt | `hairline` |
| Keep clear of every edge | 14pt | `safe-edge` |

Four rules hold on every page:

1. **Nothing within 14pt of an edge.** An office printer cannot print there. `safe-edge` answers to the printer, not to the design.
2. **The bar is the only edge mark.** The 3pt gradient bar across the top is the one exception to rule 1. No left-edge spine, no gutter rule, no bar at the foot.
3. **One measure per document.** VN-Minimal runs 487.276pt on the 54pt margin. `margin` (36pt) and `content-width` (513.276pt) belong to one-pagers and the Brandbook's own sheets. Never mix them in one document.
4. **Running prose goes in two columns.** At body size the full measure runs to about 103 characters a line; a column runs to about 51. Section titles, tables, figures, callouts and cards take the full measure. Body text does not.

## Colour

Four hues, each with one tint, and six neutrals: thirteen colours. That is the budget; anything new has to replace something.

| Hue | Tokens | Means | Use it for |
|---|---|---|---|
| Navy `#112e57` | `accent-default`, `accent-tint` | Structure and authority | The section badge, subsection and contents numbers, bullets, the Included pill |
| Teal `#1b787a` | `secondary-default`, `secondary-tint` | The affirmative signal: what already exists | The feature-card dot, the Existing pill |
| Amber `#b45309` | `caveat-default`, `caveat-tint` | Conditional: client-specific, configured, qualified | The Configured pill, a step that carries a caveat |
| Magenta `#fc0061` | `tertiary-default`, `tertiary-tint` | Emphasis at size | Display only, 18pt and up or a fill. VN-Minimal does not use it |

Neutrals: `text-heading` and `text-body` (ink `#111827`, shared), `text-secondary` (slate `#4b5563`, supporting copy and table bodies), `text-muted` (`#6b7280`, captions, folios, eyebrows), `border-default` (`#e5e7eb`), `surface-raised` (`#f9fafb`, cards, table heads, callouts) and `surface-page` (`#ffffff`, the only pure white).

- Navy is the accent. Teal is the secondary and is a different teal from the product's `#0f766e`; do not substitute one for the other.
- **One hue, one meaning.** A fifth meaning gets a legend, not a fifth hue.
- **A tint never appears without type on it.** A pale ground alone is decoration. Each tint carries its own hue as type; `tertiary-tint` carries ink, because magenta is not legible on it.
- **Magenta is never body, caption or pill.** It is 3.9:1 on paper.
- **A gradient is used whole.** `gradient-1` to `gradient-5` exist to draw the brand bar at 0, 25, 50, 75 and 100%. No stop is ever a flat colour. The Brandbook also defines `gradient/cool` (`#004bd9` to `#00dc96`) and `gradient/hot` (`#fc0061` to `#1804e4`); VN-Minimal uses neither.
- Bind the semantic tokens. The primitives (`navy-900`, `gray-600` and the rest) are listed so the aliases resolve, not for direct use.

## Type

Poppins, three weights, fifteen styles. Regular for body, captions and table cells. SemiBold for headings, labels and emphasis. Bold for the cover title and nothing else. Light is declared and never used.

| Style | Size / leading | Tracking | Weight | For |
|---|---|---|---|---|
| `display-cover-title` | 51 / 54 | −2.5% | Bold | Document title, cover only |
| `display-section-title` | 25.5 / 29 | −2% | SemiBold | Numbered section |
| `heading-subsection` | 13 / 18 | −1% | SemiBold | Numbered subsection |
| `heading-badge-number` | 13 / 13 | 0 | SemiBold | Digit in the section badge |
| `heading-card-title` | 11 / 15 | −1% | SemiBold | Feature-card title, contents row |
| `body-lede` | 11 / 17 | 0 | Regular | Cover standfirst, opening paragraph |
| `body-default` | 9 / 14 | 0 | Regular | Running body |
| `body-strong` | 9 / 14 | 0 | SemiBold | Emphasis in body, the callout, a card name |
| `table-cell` | 7.5 / 12 | 0 | Regular | Table body, card detail |
| `table-cell-strong` | 7.5 / 12 | 0 | SemiBold | First column, status pill, folio |
| `table-head` | 6.5 / 10 | +10% | SemiBold | Column header, caps |
| `detail-caption` | 7.5 / 11 | 0 | Regular | Figure caption, footnote, footer crumb |
| `detail-caption-strong` | 7.5 / 11 | 0 | SemiBold | The prefix inside a caption |
| `detail-micro-label` | 7.5 / 10 | +8% | SemiBold | Field label in a card, caps |
| `detail-eyebrow` | 6.5 / 9 | +14% | SemiBold | Tracked caps above a title, the header reference |

- **Body is 9/14.** Any other size has to be one of the fifteen styles.
- Tracking follows size: tight on display, zero at body, open on small caps.
- The table gives sizes in points. The page shows the same styles in px (1pt = 4/3px) because it cannot hold points; a style's note repeats the point value. Write points in a document.
- In Figma and in Google Docs the weight name is "SemiBold", with no space. Never set that name programmatically in Google Docs or Slides: it exports as Times.

## Components

Fourteen components are in the Figma master. Each has a card here with markup and rules.

| Group | Components |
|---|---|
| Brand | Logo, Brand bar |
| Page chrome | Page header, Page footer, Cover art |
| Structure | Section header, Subsection header, TOC row |
| Content | Callout, Info card, Feature card |
| Data | Table cell, Status pill |
| Figures | Figure block |

Cover page and Content page show how they compose on a sheet.

All cards and callouts share one surface: `surface-raised`, a 0.75pt `border-default` stroke, radius 4pt (3pt on figures and pills). No shadows, no left accent rule, no icons in headings. Colour enters through type, badges, dots and pills, never through a card's fill.

### Dense-document additions

These were prototyped in the first long document set in VN-Minimal and were added to the Figma master on 2026-11-10 (Components page, section "Dense documents"; Brandbook sheet 06). The cards here are still in the Proposals group, and the values in this table predate that step: see the note under "Where this comes from".

| Proposal | What it adds |
|---|---|
| Two-column prose as the default | `.vn-cols` for every paragraph, with the run-in head and the column-width figure |
| Body / Dense | Body stepping from 9/14 down to 8.5/12.75 when a page limit forces it; a sixteenth style |
| Worked example | A callout holding a labelled paragraph |
| Compact table | Cell padding 5 / 8 / 5.5pt on 7.5/11.5, and a comparison column head on `accent-tint` |
| Process stepper | Numbered 16pt badges on a hairline |
| Org chart | Cards with the 3pt `card-bar`, hue by party |
| Schedule grid | Month columns for meeting rounds and for Gantt bars |
| Continuous sections | A section header that runs on mid-page, 22pt above and 10pt below |
| Cover variants | Title at 36/41 for a word too long for 51pt; a party grid; a co-branded logo pair |

Two of them are open questions, not just additions. Body / Dense breaks "body is 9/14". The org chart and schedule use teal for a partner, a second meaning for a hue whose meaning is "what already exists".

## Writing on the page

The template fixes a few forms. Keep them, in the document's language.

- Cover eyebrow: `DOCUMENT TYPE  ·  CLIENT OR PROGRAMME`. Two spaces either side of the dot.
- Header reference: `DOCUMENT TITLE  |  REFERENCE`.
- Footer: the section crumb `1 · Section title` on the left, `Page 2` on the right.
- Captions: a bold prefix, then one sentence saying what the reader should see. `Figure 1.` in English.
- Sections are numbered 1, 2, 3 and subsections 1.1, 1.2. Two levels, no third.
- Status pills say Existing, Included, Configured or Proposed. Sentence case, one word.
- Section titles are short enough for two lines at 25.5pt.

## Logo

Use the files in the Logos group as images. The full lockup goes on the cover at 38pt tall and in the page header at 16.772pt. The symbol alone is for small or repeating placements and never replaces the lockup on a cover. Never redraw, recolour or rebuild the mark. On navy use `vianova-logo-dark.svg` or `vianova-logo-white.svg`.

## Building a document

The working kit lives beside this system's source, in `kit/vn-minimal/` of the same repository:

- `vn-minimal.css` holds every class used in the component cards. `components/bundle.css` here is that file with its variables bound to these tokens.
- `paginate.js` lays one `content.html` out on A4 pages by measuring the real text in Chrome. It builds the contents page from the headings, fills crumbs and folios, and reports overflow. Do not place text on pages by hand or estimate what fits.

Wrap each sheet in `.vn-page`. Blocks marked `span` take the full measure and everything else flows in two columns. Load Poppins in 400, 600 and 700.

## Where this comes from

Figma is where the Brandbook is designed (file `rBgYzyWoDFPc76K0mpuDaP`). The `Vianova Brandbook` repository holds the captured copy of its 78 variables, and the tokens here are generated from that capture, dated 2026-10-13. Token names are the Figma variable names with `/` written as `-`; status and gradient variables carry their collection as a prefix, and the nine type sizes carry `size-`. Text styles and component values were read from the Figma file on 2026-11-10.

**Out of step since 2026-11-10.** Figma has since gained two type-size variables (`text-body-dense` 8.5, `text-table` 8), four text styles (Body / Dense, Body / Dense strong, Table / Cell compact, Table / Cell compact strong), seven components and two variants. This copy has not been regenerated; where the two disagree, Figma is right.

Change the design in Figma, re-capture, regenerate. Do not edit values here by hand, and do not push a proposal to Figma before it has been reviewed.

Known differences between this copy and the master, kept visible on purpose:

- `header-height` says 24pt; the header is 20pt. The Figma Grid page calls the variable stale.
- `size-display-value` is the section title and `size-display-xl` is the cover title; the names no longer describe the use.
- The kit sets 6pt between a subsection number and its title; the master sets 8pt.
- The kit's default table is the compact proposal; the master density needs `.vn-regular`.
- Six of the seven Figure block layouts exist only in Figma.
