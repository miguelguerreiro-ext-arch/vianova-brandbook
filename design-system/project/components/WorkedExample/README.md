# Worked example

**Dense-document addition.** In the Figma master since 2026-11-10 (Components page, section "Dense documents"). This card predates that step; where it differs from Figma, Figma is right.

A callout that holds a paragraph: a micro label, then body-weight text.

```html
<div class="vn-example"><span class="vn-micro">Worked example</span><p>…</p></div>
```

The master Callout holds one emphasised line; a calculation or a case needs a paragraph. Same surface, border and radius as the Callout, padding 9 / 11 / 10pt, label in `detail-micro-label`, text at the body size in `text-heading`. One per subsection at most, and it never splits across columns.
