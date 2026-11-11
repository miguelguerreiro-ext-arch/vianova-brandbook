#!/usr/bin/env python3
"""Vianova Brandbook design system: regenerate the generated half of project/.

    python3 build.py

Reads (never writes):
  ../capture/variables.json                           the 78 captured Figma variables
  ../kit/vn-minimal/vn-minimal.css                    the working VN-Minimal kit
  ../../Vianova DS/apps/www/public/brand/*.svg        the logo files, from the vianova-ds checkout beside this one (skipped if absent)
  ~/Library/Fonts/Poppins-{Light,Regular,SemiBold,Bold}.ttf

Writes:
  project/tokens.json              design-system list shape, one theme ("print")
  project/components/bundle.css    the kit, its variables bound to the tokens, plus two preview helpers
  project/assets/Logos/*.svg       artboard guide rect stripped
  project/fonts/Poppins-*.ttf      copied from the local font folder; not committed (SIL Open Font License)

project/assets/Art/cover-wash.png is an export from Figma (Cover art, Art=Wash) and is kept as it is.

Hand-written and left alone: project/README.md, project/components/*/{README.md,preview.html},
project/assets/*/README.md, project/design-system.json.

Lengths: Figma units are points on A4. Token families the page treats as plain values keep `pt`.
Type styles must be px for the page, so they are converted (1pt = 4/3 px) and the pt value is
repeated in each style's usage note.
"""
import json, re, shutil
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent
CAPTURE = REPO / "capture" / "variables.json"
KIT = REPO / "kit" / "vn-minimal" / "vn-minimal.css"
LOGOS = REPO.parent / "Vianova DS" / "apps" / "www" / "public" / "brand"
FONTS = Path.home() / "Library" / "Fonts"
OUT = HERE / "project"

cap = json.loads(CAPTURE.read_text())
C = cap["collections"]
slug = lambda n: n.replace("/", "-")

# ---------- contrast, for the usage notes ----------
def lum(hexv):
    r, g, b = (int(hexv[i:i + 2], 16) / 255 for i in (1, 3, 5))
    f = lambda c: c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)
col = {n: e["value"] for n, e in C["Artefact / Colour"]["entries"].items()}
def on(fg, *grounds):
    return ", ".join(f"`{slug(g)}` {ratio(col[fg], col[g]):.1f}:1" for g in grounds)

GROUNDS = {  # text role -> the grounds it is set on in VN-Minimal
    "accent/default": ("surface/page", "surface/raised", "accent/tint"),
    "secondary/default": ("surface/page", "secondary/tint"),
    "caveat/default": ("surface/page", "caveat/tint"),
    "text/heading": ("surface/page", "surface/raised"),
    "text/body": ("surface/page", "surface/raised"),
    "text/secondary": ("surface/page", "surface/raised"),
    "text/muted": ("surface/page", "surface/raised"),
    "text/on-accent": ("accent/default",),
}
ORDER = ["accent/default", "accent/tint", "secondary/default", "secondary/tint", "tertiary/default", "tertiary/tint",
         "caveat/default", "caveat/tint", "text/heading", "text/body", "text/secondary", "text/muted", "text/on-accent",
         "surface/page", "surface/raised", "border/default"]

colors = []
sem = C["Artefact / Colour"]["entries"]
assert sorted(ORDER) == sorted(sem), "Artefact / Colour changed: update ORDER"
for n in ORDER:
    e = sem[n]
    note = f"{e['description']} {e['value']}."
    if n in GROUNDS:
        note += f" As type on {on(n, *GROUNDS[n])}."
    if n == "tertiary/default":
        note += " Fails 4.5:1 on paper by design: 18pt and up, or a fill. Not used in VN-Minimal."
    colors.append({"name": slug(n), "value": "{" + slug(e["aliasOf"]["name"]) + "}", "usage": note})

st = C["Artefact / Status"]["entries"]
for tone in ("existing", "included", "configured", "proposed"):
    s, t = st[f"{tone}/surface"], st[f"{tone}/text"]
    r = ratio(t["value"], s["value"])
    colors.append({"name": f"status-{tone}-surface", "value": "{" + slug(s["aliasOf"]["name"]) + "}",
                   "usage": f"{s['description']} {s['value']}. Only ever under `status-{tone}-text`."})
    colors.append({"name": f"status-{tone}-text", "value": "{" + slug(t["aliasOf"]["name"]) + "}",
                   "usage": f"{t['description'].split('.')[0]}. {t['value']}. On `status-{tone}-surface` {r:.1f}:1."})

# Stops as drawn on the live Brand bar (54:3) on 2026-11-10. The capture annotates 0/24/48/72/100.
LIVE_STOPS = [0, 25, 50, 75, 100]
for i, (n, e) in enumerate(C["Artefact / Brand gradient"]["entries"].items()):
    colors.append({"name": f"gradient-{n}", "value": "{" + slug(e["aliasOf"]["name"]) + "}",
                   "usage": f"Brand gradient stop {n} of 5, at {LIVE_STOPS[i]}%. {e['value']}. Used whole, on the brand bar. Never sampled as a flat colour."})

for n, e in C["Artefact / Primitive"]["entries"].items():
    colors.append({"name": slug(n), "value": e["value"], "usage": "Primitive, hidden in Figma. Bind a semantic role instead. " + e["description"]})

def plain(collection, prefix="", extra=None):
    out = []
    for n, e in C[collection]["entries"].items():
        v = f"{e['value']}{e.get('unit', '')}" if isinstance(e["value"], (int, float)) else e["value"]
        note = e["description"].replace("&quot;", '"')
        if extra and n in extra:
            note += " " + extra[n]
        out.append({"name": prefix + n, "value": str(v), "usage": note})
    return out

geometry = plain("Artefact / Geometry", extra={
    "header-height": "Stale, says the Grid page: the long document runs its header at 20pt, and the page is right.",
    "column-width": "On the 487.276pt long-document measure the two columns are 233.638pt each.",
    "accent-rule": "Not used by any VN-Minimal component.",
    "card-bar": "Not on the master Info card. The org-chart proposal uses it.",
})
sizes = plain("Artefact / Type", prefix="size-", extra={
    "display-value": "Now the section title (Display / Section title); the name is stale.",
    "display-xl": "Now the cover title (Display / Cover title); no longer reserved.",
})
font = plain("Artefact / Font")

# ---------- text styles: the fifteen on the Brandbook's Type page (124:3), read 2026-11-10 ----------
# (group, style, size pt, leading pt, tracking %, weight, usage, sample)
STYLES = [
    ("Detail", "detail-eyebrow", 6.5, 9, 14, 600, "Tracked caps above a title; the header reference.", "TRANSIT PLANNING SOFTWARE"),
    ("Detail", "detail-micro-label", 7.5, 10, 8, 600, "Field label in a card.", "SUBMITTED TO:"),
    ("Detail", "detail-caption", 7.5, 11, 0, 400, "Figure caption, footnote, footer crumb.", "Operating calculations linking service inputs."),
    ("Detail", "detail-caption-strong", 7.5, 11, 0, 600, "The prefix inside a caption.", "Figure 2."),
    ("Table", "table-head", 6.5, 10, 10, 600, "Column header, in caps.", "PROPOSED COMMITMENT"),
    ("Table", "table-cell", 7.5, 12, 0, 400, "Table body; card detail.", "Edit route alignments, stops and service frequency."),
    ("Table", "table-cell-strong", 7.5, 12, 0, 600, "First column of a table; status pill; folio.", "Data ownership"),
    ("Body", "body-default", 9, 14, 0, 400, "Running body. Body is 9/14; any other size has to be one of the fifteen styles.", "Vianova provides mobility intelligence to cities."),
    ("Body", "body-strong", 9, 14, 0, 600, "Emphasis inside body; the callout line; a card name.", "incorporated where applicable"),
    ("Body", "body-lede", 11, 17, 0, 400, "Opening paragraph; the cover standfirst.", "Vianova acknowledges Addendum 1."),
    ("Heading", "heading-card-title", 11, 15, -1, 600, "Title in a feature card; a contents row.", "Design service changes"),
    ("Heading", "heading-badge-number", 13, 13, 0, 600, "Digit in the section badge.", "3"),
    ("Heading", "heading-subsection", 13, 18, -1, 600, "Numbered subsection.", "2.1 Company Overview"),
    ("Display", "display-section-title", 25.5, 29, -2, 600, "Numbered section.", "Qualifications"),
    ("Display", "display-cover-title", 51, 54, -2.5, 700, "Document title, cover only.", "Transit"),
]
px = lambda pt: f"{round(pt * 4 / 3, 3):g}px"
groups = {}
for g, name, size, lead, track, weight, usage, sample in STYLES:
    spec = f"{size:g}/{lead:g} pt" + (f", {track:+g}%" if track else "") + f", {'Bold' if weight == 700 else 'SemiBold' if weight == 600 else 'Regular'}."
    style = {"name": name, "fontSize": px(size), "lineHeight": px(lead), "fontWeight": weight, "usage": f"{spec} {usage}", "sample": sample}
    if track:
        style["letterSpacing"] = px(size * track / 100)
    groups.setdefault(g, []).append(style)

tokens = {
    "name": "Vianova Brandbook",
    "version": 1,
    "meta": {"source": "Figma rBgYzyWoDFPc76K0mpuDaP via Vianova Brandbook/capture/variables.json", "capturedAt": cap["source"]["capturedAt"]},
    "color": {"themes": [{"id": "print", "name": "Print"}], "tokens": colors},
    "type": {
        "fonts": [{"family": "Poppins", "file": f"fonts/Poppins-{s}.ttf", "weight": w}
                  for s, w in (("Light", "300"), ("Regular", "400"), ("SemiBold", "600"), ("Bold", "700"))],
        "families": {"print": "\"Poppins\", system-ui, sans-serif"},
        "groups": [{"name": g, "family": "print", "styles": s} for g, s in groups.items()],
    },
    "geometry": {"note": "Artefact / Geometry. Points on A4.", "tokens": geometry},
    "typeSize": {"note": "Artefact / Type. The nine sizes every text style draws from, in points.", "tokens": sizes},
    "font": {"note": "Artefact / Font. Figma style names, not CSS weights: Light 300, Regular 400, SemiBold 600, Bold 700.", "tokens": font},
}
names = [t["name"] for fam in ("color", "geometry", "typeSize", "font") for t in tokens[fam]["tokens"]]
assert len(names) == len(set(names)) == 78, (len(names), len(set(names)))
assert all(re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_.-]{0,63}", n) for n in names)

OUT.mkdir(exist_ok=True)
(OUT / "tokens.json").write_text(json.dumps(tokens, indent=1, ensure_ascii=False) + "\n")

# ---------- bundle.css: the kit, with its variables bound to the tokens ----------
kit = KIT.read_text()
head, rest = kit.split(".vn-page {", 1)
block, tail = rest.split("\n}\n", 1)
BIND = {"margin": "margin-doc", "measure": "content-doc", "col-gap": "column-gap", "hair": "hairline"}
var_lines, box_lines = [], []
for line in block.split("\n"):
    m = re.match(r"\s*--([a-z-]+):\s*([^;]+);\s*(?:/\*\s*([^,*]+?)\s*(?:,[^*]*)?\*/)?", line)
    if m:
        name, value, figma = m.groups()
        token = BIND.get(name) or (slug(figma) if figma and re.fullmatch(r"[a-z-]+/[a-z-]+", figma) else None)
        assert token is None or token in names, token
        var_lines.append(f"  --{name}: var(--{token}, {value});" if token else f"  --{name}: {value};")
    elif line.strip() and not line.strip().startswith("/*"):
        box_lines.append(line)
TYPO = ("color:", "font-", "line-height:", "-webkit-font-smoothing", "hyphens", "-webkit-hyphens")
typo = [l for l in box_lines if l.strip().startswith(TYPO)]
box = [l for l in box_lines if l not in typo]
bundle = f"""/* Vianova Brandbook — VN-Minimal components.
   GENERATED by design-system/build.py from kit/vn-minimal/vn-minimal.css. Edit the kit, not this file.
   The kit's variables are bound to this system's tokens, with the kit's own value as the fallback.
   .vn-scope and .vn-stage exist only here: they carry the kit's variables and type without the A4 page box. */

.vn-page, .vn-scope {{
{chr(10).join(var_lines)}
{chr(10).join(typo)}
}}
.vn-page {{
{chr(10).join(box)}
}}
.vn-scope *, .vn-scope *::before, .vn-scope *::after {{ box-sizing: border-box; }}
:where(.vn-scope) :where(p, h1, h2, h3, h4, ul, figure) {{ margin: 0; padding: 0; }}
.vn-scope strong, .vn-scope b {{ font-weight: 600; }}
.vn-stage {{ box-sizing: content-box; width: var(--measure); padding: 16pt 18pt 16pt var(--margin); background: var(--paper); }}
.vn-stage > :first-child {{ margin-top: 0; }}
.vn-stage > :last-child {{ margin-bottom: 0; }}
"""
bundle += tail.replace(head, "")
assert "</style" not in bundle.lower()
(OUT / "components").mkdir(exist_ok=True)
(OUT / "components" / "bundle.css").write_text(bundle)

# ---------- assets ----------
logos = OUT / "assets" / "Logos"
logos.mkdir(parents=True, exist_ok=True)
GUIDE = re.compile(r'<rect[^>]*stroke="#8A38F5"[^>]*/>\s*')
for svg in sorted(LOGOS.glob("*.svg")):
    text, n = GUIDE.subn("", svg.read_text())
    assert "#8A38F5" not in text
    (logos / svg.name).write_text(text)
    print(f"logo {svg.name}: guide rects stripped {n}")
(OUT / "fonts").mkdir(exist_ok=True)
for s in ("Light", "Regular", "SemiBold", "Bold"):
    if (FONTS / f"Poppins-{s}.ttf").exists():
        shutil.copyfile(FONTS / f"Poppins-{s}.ttf", OUT / "fonts" / f"Poppins-{s}.ttf")
    else:
        print(f"font Poppins-{s}.ttf not found in {FONTS}: install Poppins or copy it into project/fonts/")

print(f"tokens.json: {len(colors)} colour, {len(geometry)} geometry, {len(sizes)} type size, {len(font)} font = {len(names)} variables; {len(STYLES)} text styles")
print(f"bundle.css: {len(bundle)} bytes")
