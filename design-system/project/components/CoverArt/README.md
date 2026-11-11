# Cover art

The art block on a cover, 439.63 × 571pt at x 141.37, y 26. Figma: `VN-Minimal / Cover art` 199:1207, variants `Art=Wash` and `Art=Photo`.

```html
<img class="vn-cover-art" src="…/cover-wash.png" alt="">
```

Wash is the pastel mesh in the Art asset group; use that file, do not regenerate it. Photo is an empty slot in Figma: for a photographic cover, swap the `src` for an image cropped to the same 439.63 × 571 box (`object-fit: cover`). The block stops 14.3pt short of the right edge, which keeps the `safe-edge` rule.
