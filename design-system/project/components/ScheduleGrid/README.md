# Schedule grid

**Dense-document addition.** In the Figma master since 2026-11-10 (Components page, section "Dense documents"). This card predates that step; where it differs from Figma, Figma is right.

Month columns on the table pattern, in two forms: tinted cells for meeting rounds, and solid bars for work steps with milestone marks in the bar.

```html
<div class="vn-sched">
  <div class="vn-sr vn-head" style="grid-template-columns: 44pt repeat(6, minmax(0, 1fr))"><div></div><div>Month 1</div>…</div>
  <div class="vn-sr" style="grid-template-columns: 44pt repeat(6, minmax(0, 1fr))">
    <div class="vn-rl">WP 1</div>
    <div class="vn-sc"><div class="vn-rd vn-navy"><b>Round 1</b>Method agreed</div></div>
    <div class="vn-sc"></div>…
  </div>
</div>
```

Rounds: one `.vn-sc` per month, a `.vn-rd` inside where something happens; `.vn-navy` and `.vn-teal` put the party's hue on its tint, plain is neutral. Gantt: a `.vn-gt` track of six months holding one `.vn-gb` bar placed with `grid-column: start / span n`; a `<span>` per month carries a milestone mark such as ◆1. Trailing `.vn-gv` cells hold staff and, with `.vn-num`, a right-aligned number.

Every row repeats the same `grid-template-columns`. Head and row label follow the table styles. Six months are built in; another span needs the track's `repeat(6, …)` changed. The teal question raised on the org chart applies here too.
