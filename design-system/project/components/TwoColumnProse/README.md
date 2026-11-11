# Two-column prose

**Dense-document addition.** In the Figma master since 2026-11-10 (Components page, section "Dense documents"). This card predates that step; where it differs from Figma, Figma is right.

Running text in two columns of 233.64pt with the 20pt `column-gap`, with run-in heads and navy bullets.

```html
<div class="vn-cols">
  <h4 class="vn-runin">Run-in head</h4>
  <p>…</p>
  <ul><li>…</li></ul>
</div>
```

The rule is master: the Grid and Type pages say prose past 75 characters wants two columns, and the 487pt measure runs to about 103. What is new is making it the default for every paragraph, and three things that come with it:

- **Run-in head** (`.vn-runin`): `body-strong` on its own line, one level below the numbered subsection.
- **Column figure** (`.vn-cols .vn-fig`): a figure at column width inside the text.
- **Body / Dense**: `--body`, `--lh` and `--gap` on `.vn-page` step from 9/14 down to 8.5/12.75 when a page limit forces it. The master says body is 9/14 and any other size must be one of the fifteen styles, so this would be a sixteenth. Start at 9/14 and step down only as far as the limit requires.

`.vn-balance` evens the columns of a short block; `.vn-single` sets one column at column width.
