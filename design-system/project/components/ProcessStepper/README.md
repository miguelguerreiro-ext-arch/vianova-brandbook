# Process stepper

**Dense-document addition.** In the Figma master since 2026-11-10 (Components page, section "Dense documents"). This card predates that step; where it differs from Figma, Figma is right.

A method in one line: 16pt numbered badges on a hairline, a label beneath each.

```html
<div class="vn-steps">
  <div class="vn-step"><div class="vn-n">1</div><div class="vn-t">Write the text</div></div>
  <div class="vn-step vn-caveat"><div class="vn-n">6</div><div class="vn-t">Review on the canvas</div></div>
</div>
```

Badges in `accent-default`, radius 3pt; `.vn-caveat` turns one `caveat-default` for a step that carries a qualification. Labels are 7.5/10.5 SemiBold, two lines at most. The grid is fixed at seven columns; change `grid-template-columns` for another count. About 45pt tall, full measure only.
