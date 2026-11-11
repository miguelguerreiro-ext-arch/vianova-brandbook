# Page header

Logo left, document reference right, on one line; repeated on every page but the cover. Figma: `VN-Minimal / Page header` 54:29.

```html
<div class="vn-header"><img src="…/vianova-logo.svg" alt="Vianova"><div class="vn-ref">Document title  |  Reference</div></div>
<div class="vn-rule"></div>
```

Sits at y 30pt, 20pt tall, on the measure; the hairline follows at y 56pt and content starts at y 72pt. The reference is `detail-eyebrow` in `text-muted`: caps, two spaces either side of the bar. You provide the logo file and the reference string. The `header-height` token says 24pt and is stale; 20pt is right.
