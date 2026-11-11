# Page footer

A hairline, then the running section crumb left and the folio right. Figma: `VN-Minimal / Page footer` 54:35.

```html
<div class="vn-footer"><div class="vn-frule"></div>
  <div class="vn-frow"><span class="vn-crumb">1 · Section title goes here</span><span class="vn-folio">Page 2</span></div></div>
```

Sits at y 786pt on the measure. The crumb is `detail-caption` in `text-muted` and names the section the page ends in; the folio is `table-cell-strong` in `text-heading`. Write the folio word in the document's language ("Page 2", "Seite 2"). `paginate.js` fills both for you.
