/** Committed, human- and agent-readable digest. Lives OUTSIDE any gitignored dir — the product
 *  DS learned this the hard way: its dist/ is gitignored, so a fresh clone has no resolved
 *  values until a 15-25 minute build runs. */
import { writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, readCapture, readDsReference, colorEntries, captureSha256, PRIMITIVE_COLLECTION } from "./lib/capture.ts";
import { contrast, round2 } from "./lib/color.ts";

const capture = readCapture();
const ds = readDsReference();
const lock = JSON.parse(readFileSync(join(ROOT, "capture/lock.json"), "utf8"));
const sha = captureSha256();
const byKey = new Map(colorEntries(capture).map(([c, n, e]) => [`${c}|${n}`, e]));
const white = String(byKey.get("Artefact / Colour|surface/page")!.value);

const L: string[] = [
  "# Vianova Brandbook — token digest",
  "",
  "> **GENERATED** by `scripts/digest.ts` — do not edit by hand. Regenerate with `pnpm digest`.",
  "",
  "| | |",
  "|---|---|",
  `| Figma file | \`${capture.source.fileKey}\` (name not readable via the Plugin API) |`,
  `| Captured | ${capture.source.capturedAt} |`,
  `| Figma version | \`${lock.version}\` |`,
  `| Capture sha256 | \`${sha.slice(0, 16)}…\` |`,
  `| DS reference | digest ${ds.source.digestGenerated}, repo \`${ds.source.dsRepoSha}\` |`,
  "",
  "Three tiers, never skipping: **primitive → semantic**, with every semantic role aliasing a",
  "primitive inside the Figma file. Roles marked *shared* are restated from the Vianova DS",
  "because cross-file aliasing needs Organization/Enterprise and this team is on Professional;",
  "`test/shared-values.test.ts` pins them.",
  "",
  "## Colour",
  "",
  "| Role | Value | Aliases | Shared | Contrast on paper |",
  "|---|---|---|---|---|",
];

for (const [coll, name, e] of colorEntries(capture)) {
  if (coll === PRIMITIVE_COLLECTION) continue;
  const key = `${coll}|${name}`;
  const sharedAs = ds.sharedRoles[key];
  let c = e.use === "surface" ? "_surface — not text_" : "—";
  if (e.use !== "surface" && String(e.value).toLowerCase() !== white.toLowerCase()) {
    const r = contrast(String(e.value), white);
    const grade = r >= 4.5 ? "AA" : r >= 3 ? "AA-large" : "**fail**";
    c = e.use === "display" ? `${round2(r)} ${grade} — display only` : `${round2(r)} ${grade}`;
  }
  L.push(
    `| \`${name}\` | \`${e.value}\` | \`${e.aliasOf ? e.aliasOf.name : "—"}\` | ${sharedAs ? `DS \`${sharedAs}\`` : "—"} | ${c} |`,
  );
}

L.push(
  "",
  "## Shared with the product Vianova DS",
  "",
  `Still bound: **${Object.keys(ds.sharedRoles).length}** role(s). Restated, not aliased —`,
  "cross-file aliasing needs Organization/Enterprise and this team is on Professional.",
  "",
  "| Artefact role | DS role | Value |",
  "|---|---|---|",
);
for (const [key, role] of Object.entries(ds.sharedRoles)) {
  L.push(`| \`${key.split("|")[1]}\` | \`${role}\` | \`${ds.roles[role]!.value}\` |`);
}
const div = (ds as unknown as { $divergence?: { severedOn: string; severed: { was: string; dsValue: string; nowRole: string; nowValue: string }[] } }).$divergence;
if (div) {
  L.push(
    "",
    `**Severed ${div.severedOn}** — the artefact palette realigned to vianova.io, not the product DS.`,
    "",
    "| Was | DS value | Is now | New value |",
    "|---|---|---|---|",
  );
  for (const s of div.severed) {
    L.push(`| ${s.was} | \`${s.dsValue}\` | \`${s.nowRole.split("|")[1]}\` | \`${s.nowValue}\` |`);
  }
}

for (const key of ["Artefact / Geometry", "Artefact / Type", "Artefact / Font"]) {
  L.push("", `## ${key.replace("Artefact / ", "")}`, "", "| Token | Value | Scopes |", "|---|---|---|");
  for (const [name, e] of Object.entries(capture.collections[key]!.entries)) {
    L.push(`| \`${name}\` | ${e.value}${e.unit ?? ""} | ${e.scopes.join(", ") || "—"} |`);
  }
}
L.push("");
writeFileSync(join(ROOT, "digest.md"), L.join("\n"));
console.log("digest: wrote digest.md");
