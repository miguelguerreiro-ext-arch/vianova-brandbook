# Figure block

One figure with its caption; the image fills the block at the measure. Figma: `VN-Minimal / Figure block` 72:974, seven layouts.

```html
<figure class="vn-fig">
  <img class="vn-shot" src="…" alt="What the image shows">
  <div class="vn-cap"><b>Figure 1.</b> Short description of what the reader should see in this view.</div>
</figure>
```

Image: 0.75pt `border-default`, radius 3pt. Caption 7pt below: prefix in `detail-caption-strong` and `text-heading`, sentence in `detail-caption` and `text-secondary`. Number figures through the document and write the prefix in the document's language ("Figure 1.", "Abb. 1:"). Give every image real `alt` text.

Only `Layout=Full measure` (72:915) exists in the kit. The master's other six layouts are Figma-only so far: Full bleed, Figure + rail, Sidecar, Figure-led, Pair and Grid 2x2. Full measure and Full bleed are for landscape images; Figure + rail, Sidecar and Figure-led for tall portraits; Pair and Grid 2x2 for sets. The column-width figure inside two-column prose is a proposal.
