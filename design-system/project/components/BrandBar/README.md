# Brand bar

The 3pt full-bleed brand gradient, edge to edge at the top of every page, cover included. Figma: `Brand bar` 54:3.

```html
<div class="vn-bar"></div>
```

First child of `.vn-page`. It is the only mark allowed at a page edge and the only place the gradient appears: no left-edge spine, no gutter rule, no second bar at the foot. The five stops are `gradient-1` to `gradient-5` at 0, 25, 50, 75 and 100%, always whole and never sampled as flat colours. Height is the `topbar` token.
