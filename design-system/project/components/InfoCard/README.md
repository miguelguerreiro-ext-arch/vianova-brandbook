# Info card

Boxed fact block for addresses, contacts and parties: label, name, detail. Figma: `VN-Minimal / Info card` 54:51.

```html
<div class="vn-info"><div class="vn-micro">Label</div><div class="vn-nm">Organisation name</div><div class="vn-det">Street address<br>City, region, postcode</div></div>
```

Label is `detail-micro-label` in `text-secondary`, name `body-strong`, detail `table-cell` in `text-secondary`; `surface-raised`, hairline border, radius 4pt, padding 9 / 11 / 10pt, 5pt between lines. 233.6pt wide, two across the measure with the 20pt `column-gap` (wrap pairs in `.vn-features`). The master card has no top bar. `.vn-card`, with the 3pt bar, is the org-chart proposal.
