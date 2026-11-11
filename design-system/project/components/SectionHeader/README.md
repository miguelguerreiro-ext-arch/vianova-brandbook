# Section header

Numbered section opener: a 24pt navy badge hanging in the left margin and the title on the measure. Figma: `VN-Minimal / Section header` 54:42.

```html
<h1 class="vn-section"><span class="vn-badge">1</span>Section title sits here<br>and may run to two lines</h1>
```

The badge sits at x −36pt so the headline aligns with the body column; it needs the 54pt margin and does not work on the 36pt short-artefact margin. Title is `display-section-title` in `text-heading`, the digit `heading-badge-number` in `text-on-accent` on `accent-default`, radius 4pt. The master breaks headlines by hand; the kit uses `text-wrap: balance`, so add a `<br>` only where the balance reads badly. One badge digit per section, never a word.

Proposal, not in the master: sections run on without a page break, 22pt above and 10pt below, and never start with less than 100pt beneath them.
