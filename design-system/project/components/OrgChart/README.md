# Org chart

**Dense-document addition.** In the Figma master since 2026-11-10 (Components page, section "Dense documents"). This card predates that step; where it differs from Figma, Figma is right.

Info cards in a two-column grid, each with a 3pt bar that says which party a role belongs to.

```html
<div class="vn-org">
  <div class="vn-card"><div class="vn-lab">Client</div><div class="vn-nm">Contracting authority</div></div>
  <div class="vn-org-row">
    <div class="vn-card vn-navy"><div class="vn-lab">Main contact</div><div class="vn-nm">Name · Vianova</div><div class="vn-det">Deputy: name</div></div>
    <div class="vn-card vn-teal">…</div>
  </div>
</div>
```

It reuses the `card-bar` token, which the master defines for a data card. `.vn-card` is tighter than the master Info card: label 6.5/9, name 9/13, detail 7.5/11, 2pt between lines. The bar is `text-muted` by default, `.vn-navy` for Vianova, `.vn-teal` for the partner.

Open question: the Colour page gives teal the meaning "what already exists". Using it for a partner is a second meaning for one hue; that wants a legend or another pair before this goes to Figma.
