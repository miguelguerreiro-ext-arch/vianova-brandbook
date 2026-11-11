# Cover page

The first page as mastered: brand bar, cover art, logo, eyebrow, title, standfirst, a rule and two reference lines. Figma: `01 — Cover` 231:213.

```html
<div class="vn-page">
  <div class="vn-bar"></div>
  <img class="vn-cover-art" src="…/cover-wash.png" alt="">
  <div class="vn-cover-logos"><img src="…/vianova-logo.svg" alt="Vianova"></div>
  <div class="vn-cover-main">
    <div class="vn-eyebrow">Document type  ·  Client or programme</div>
    <div class="vn-cover-title vn-xl">Document title<br>over two lines</div>
    <div class="vn-lede">One line of standfirst.</div>
  </div>
  <div class="vn-cover-rule"></div>
  <div class="vn-cover-note">Submitted to  ·  Organisation name
Date  ·  Reference number</div>
</div>
```

Logo 38pt tall at x 54, y 56. Eyebrow at y 258 in `detail-eyebrow`, `text-muted`. Title at y 276 in `display-cover-title` (51/54, Bold, the only Bold on the page), up to three lines. Standfirst at y 458 in `body-lede`, `text-secondary`. Rule at y 676, reference lines at y 694 in `detail-caption`, `text-muted`. No header, footer or folio on the cover.

Proposals in the kit, not in the master:

- `.vn-cover-title` without `.vn-xl` sets the title at 36/41. Use it only when a single word cannot fit the measure at 51pt.
- `.vn-cover-meta` replaces the two reference lines with a two-column grid of label, name and detail for client, bidder and partners.
- A second logo after a `.vn-sep` hairline makes a co-branded lockup for joint bids.
