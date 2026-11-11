# Table cell

One table cell in three types: Head carries the tinted band, Label is the first column, Value the rest. Figma: `VN-Minimal / Table cell` 193:1202.

```html
<div class="vn-table vn-regular">
  <div class="vn-tr vn-head" style="grid-template-columns: 150pt minmax(0, 1fr)"><div class="vn-td">Column</div><div class="vn-td">Column</div></div>
  <div class="vn-tr" style="grid-template-columns: 150pt minmax(0, 1fr)"><div class="vn-td vn-lead">Label</div><div class="vn-td">Value</div></div>
</div>
```

A table is a column of rows; each row is a grid and repeats the same `grid-template-columns`, with the last column set to fill. Rows end in a 0.75pt `border-default` rule; there are no vertical rules and no zebra. Head: `table-head` in `text-secondary` on `surface-raised`, padding 7 / 10pt, 24pt tall. Label: `table-cell-strong` in `text-heading`. Value: `table-cell` in `text-secondary`. Body cells pad 8 / 10 / 9pt, 29pt for one line.

`.vn-regular` is the master density. Without it the kit gives the compact proposal. Tables take the full measure, never a column.
