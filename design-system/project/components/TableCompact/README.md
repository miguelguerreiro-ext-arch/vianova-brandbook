# Compact table

**Dense-document addition.** In the Figma master since 2026-11-10 (Components page, section "Dense documents"). This card predates that step; where it differs from Figma, Figma is right.

The table at a tighter density, with an optional comparison head.

```html
<div class="vn-table">
  <div class="vn-tr vn-head" style="grid-template-columns: 150pt minmax(0, 1fr)"><div class="vn-td">Required</div><div class="vn-td vn-plus">Offered in addition</div></div>
  <div class="vn-tr" style="grid-template-columns: 150pt minmax(0, 1fr)"><div class="vn-td">…</div><div class="vn-td">…</div></div>
</div>
```

Cell padding 5 / 8 / 5.5pt on 7.5/11.5, against the master's 8 / 10 / 9pt on 7.5/12. A one-line row drops from 29pt to about 22pt. In the kit this is what `.vn-table` gives by default; add `.vn-regular` for the master density. That default is the wrong way round and should flip if the proposal is accepted.

**Comparison head** (`.vn-plus`): one column head on `accent-tint` with `accent-default` type marks the "what we add" column in a required-versus-offered table without a new colour.
