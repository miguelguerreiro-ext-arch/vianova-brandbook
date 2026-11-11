/** Re-running the transform over an unchanged capture must produce no diff.
 *  This is what turns "code is authoritative" from a slogan into a checkable claim. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "../scripts/lib/capture.ts";

const srcDir = join(ROOT, "tokens/src");
const snapshot = () =>
  Object.fromEntries(
    readdirSync(srcDir)
      .filter((f) => f.endsWith(".tokens.json"))
      .sort()
      .map((f) => [f, readFileSync(join(srcDir, f), "utf8")]),
  );

test("import-figma is deterministic", () => {
  const before = snapshot();
  assert.ok(Object.keys(before).length > 0, "no tokens built yet — run `pnpm import` first");
  execFileSync("npx", ["tsx", "scripts/import-figma.ts"], { cwd: ROOT, stdio: "pipe" });
  assert.deepEqual(snapshot(), before, "re-running the transform changed its own output");
});

test("the transform performs no network access", () => {
  const src = readFileSync(join(ROOT, "scripts/import-figma.ts"), "utf8");
  for (const banned of ["fetch(", "https://", "http://", "node:https"]) {
    assert.ok(!src.includes(banned), `import-figma.ts references ${banned} — it must stay offline`);
  }
});
