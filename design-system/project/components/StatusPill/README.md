# Status pill

Scope status marker in four tones, each a hue on its own tint. Figma: `VN-Minimal / Status pill` 54:78.

```html
<span class="vn-pill">Included</span>
<span class="vn-pill vn-existing">Existing</span>
<span class="vn-pill vn-configured">Configured</span>
<span class="vn-pill vn-proposed">Proposed</span>
```

| Tone | Means | Tokens |
|---|---|---|
| Existing | a capability today | `status-existing-text` on `status-existing-surface` (teal) |
| Included | in the configured scope | `status-included-text` on `status-included-surface` (navy) |
| Configured | built for this client | `status-configured-text` on `status-configured-surface` (amber) |
| Proposed | a commitment, not yet a capability | `status-proposed-text` on `status-proposed-surface` (neutral, the quietest) |

`table-cell-strong`, sentence case, padding 3 / 6 / 3.5pt, radius 3pt, 18.5pt tall. Use these four words and these four meanings only; a fifth meaning gets a legend, not a fifth colour. Never magenta: a pill label is small type. The tone always comes with its word, so the pill still reads in greyscale.
