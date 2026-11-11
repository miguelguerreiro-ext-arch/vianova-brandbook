# Content page

A full inner page: bar, header, rule, the 702pt content area and the footer. Figma: the content pages of `★ VN-Minimal` (page 52:36).

```html
<div class="vn-page">
  <div class="vn-bar"></div>
  <div class="vn-header">…</div><div class="vn-rule"></div>
  <div class="vn-content">…</div>
  <div class="vn-footer">…</div>
</div>
```

`.vn-page` is one A4 sheet, 595.276 × 841.89pt, with the 54pt `margin-doc`. Content runs from y 72 to y 774; the footer sits at y 786. Do not place pages by hand: put the whole text in one `content.html` and let `paginate.js` measure it onto pages. Blocks with class `span` take the full measure; everything else flows in two columns.
