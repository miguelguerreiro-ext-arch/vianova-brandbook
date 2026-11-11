# TOC row

Contents line: number, title, folio. Sub-rows indent and drop to body weight. Figma: `VN-Minimal / TOC row` 54:83.

```html
<div class="vn-toc">
  <div class="vn-toc-row"><span class="vn-tn">1</span><span class="vn-tt">Section title</span><span class="vn-tp">3</span></div>
  <div class="vn-toc-row vn-toc-sub"><span class="vn-tn">1.1</span><span class="vn-tt">Subsection title</span><span class="vn-tp">3</span></div>
</div>
```

Main rows are `heading-card-title`: number in `accent-default` in a 24pt column, folio right-aligned in a 22pt column. Sub-rows are `body-default` in `text-secondary`, indented 34pt. No dot leaders and no rules between rows. The contents page is titled in `display-section-title` without a badge. `paginate.js` builds the rows from the headings and their real page numbers.
