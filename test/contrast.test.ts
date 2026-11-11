/** Pins the real pairs at their real names. Re-pointed 2026-10-13 when the semantic tier
 *  was restructured: Paper+Data merged into "Artefact / Colour" and the pill roles moved
 *  to "Artefact / Status". The intent is unchanged — every role a reader actually reads
 *  must clear AA body on the ground it actually sits on. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readCapture, colorEntries } from "../scripts/lib/capture.ts";
import { contrast, round2 } from "../scripts/lib/color.ts";

const capture = readCapture();
/** Keyed by "Collection|name": role names repeat across collections now. */
const byKey = new Map(colorEntries(capture).map(([c, n, e]) => [`${c}|${n}`, e]));
const v = (k: string) => {
  const e = byKey.get(k);
  assert.ok(e, `capture has no colour role ${k}`);
  return String(e.value);
};

const C = "Artefact / Colour";
const S = "Artefact / Status";
const AA_BODY = 4.5;

const pairs: [string, string, string][] = [
  [`${C}|accent/default`, `${C}|surface/page`, "numbering, rules, headline accents"],
  [`${C}|text/heading`, `${C}|surface/page`, "headings"],
  [`${C}|text/body`, `${C}|surface/page`, "running body"],
  [`${C}|text/secondary`, `${C}|surface/page`, "supporting copy and table bodies"],
  [`${C}|text/muted`, `${C}|surface/page`, "captions, folios, eyebrows"],
  [`${C}|secondary/default`, `${C}|surface/page`, "highlights and callouts"],
  [`${C}|caveat/default`, `${C}|surface/page`, "client-specific qualifications"],
  [`${C}|accent/default`, `${C}|accent/tint`, "navy type on its own tint"],
  [`${C}|secondary/default`, `${C}|secondary/tint`, "teal type on its own tint"],
  [`${C}|caveat/default`, `${C}|caveat/tint`, "amber type on its own tint"],
  [`${C}|text/heading`, `${C}|tertiary/tint`, "ink on the magenta tint, which magenta itself cannot do"],
  [`${C}|text/on-accent`, `${C}|accent/default`, "reversed type on the accent ground"],
  [`${C}|text/secondary`, `${C}|surface/raised`, "card and table-header body"],
  [`${C}|text/muted`, `${C}|surface/raised`, "card captions"],
  [`${S}|existing/text`, `${S}|existing/surface`, "pill — exists today"],
  [`${S}|included/text`, `${S}|included/surface`, "pill — in the configured scope"],
  [`${S}|configured/text`, `${S}|configured/surface`, "pill — configured for this client"],
  [`${S}|proposed/text`, `${S}|proposed/surface`, "pill — proposed"],
];

for (const [fg, bg, use] of pairs) {
  test(`${fg.split("|")[1]} on ${bg.split("|")[1]} passes AA body (${use})`, () => {
    const r = contrast(v(fg), v(bg));
    assert.ok(r >= AA_BODY, `is ${round2(r)}:1, below ${AA_BODY}:1 — ${use}`);
  });
}

test("tertiary is marked display-only, because it cannot pass AA body", () => {
  // 3.95:1 on paper. Not a defect — a documented limit. Marking it is what keeps it out
  // of the pair list above instead of someone quietly lowering the threshold.
  const e = byKey.get(`${C}|tertiary/default`)!;
  assert.equal(e.use, "display", "tertiary/default must carry use:\"display\"");
  assert.ok(
    contrast(String(e.value), v(`${C}|surface/page`)) < AA_BODY,
    "tertiary now passes AA body — promote it out of display-only and add it to the pairs",
  );
});

test("surface roles are declared as surfaces, so nothing scores them as text", () => {
  const surfaces = [
    `${C}|surface/page`, `${C}|surface/raised`, `${C}|border/default`,
    `${C}|accent/tint`, `${C}|secondary/tint`, `${C}|tertiary/tint`, `${C}|caveat/tint`,
    `${S}|existing/surface`, `${S}|included/surface`, `${S}|configured/surface`, `${S}|proposed/surface`,
  ];
  for (const k of surfaces) {
    assert.equal(byKey.get(k)!.use, "surface", `${k} is a surface and must be marked as one`);
  }
});

test("greyscale separation of the two extreme semantic roles is recorded, not assumed", () => {
  // Accepted and documented: navy and amber are far apart in hue (the safest
  // colour-vision-deficiency pair) but closer in luminance, so a greyscale office print
  // flattens them. docs/design-brief.md open item 2. Pinned so a change cannot quietly worsen it.
  const r = contrast(v(`${C}|accent/default`), v(`${C}|caveat/default`));
  assert.ok(r >= 2.5, `accent/caveat luminance separation fell to ${round2(r)}:1`);
});
