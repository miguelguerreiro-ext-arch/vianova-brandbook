/** Roles shared with the product Vianova DS. Cross-file aliasing needs Organization/Enterprise
 *  and this team is on Professional, so these are restated in the artefact primitive tier.
 *  This test is what makes the restatement safe.
 *
 *  Independence holds: capture/ds-reference.json is a committed constant with provenance —
 *  no fetch, no package dependency, no submodule. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readCapture, readDsReference, colorEntries } from "../scripts/lib/capture.ts";

const capture = readCapture();
const ds = readDsReference();
const lookup = new Map(colorEntries(capture).map(([c, n, e]) => [`${c}|${n}`, e]));

test("the shared-role contract is non-empty", () => {
  assert.ok(Object.keys(ds.sharedRoles).length > 0, "no shared roles declared — the guard would be vacuous");
});

test("every declared shared role exists in the capture", () => {
  for (const key of Object.keys(ds.sharedRoles)) {
    assert.ok(lookup.has(key), `ds-reference declares ${key}, which is not in the Figma capture`);
  }
});

test("every shared role still matches the Vianova DS value", () => {
  for (const [key, dsRole] of Object.entries(ds.sharedRoles)) {
    const dsValue = ds.roles[dsRole];
    assert.ok(dsValue, `${key} maps to DS role "${dsRole}", which is not recorded in ds-reference.json`);
    assert.equal(
      String(lookup.get(key)!.value).toLowerCase(),
      dsValue!.value.toLowerCase(),
      `${key} is ${lookup.get(key)!.value} but Vianova DS \`${dsRole}\` is ${dsValue!.value}. ` +
        `Either the artefact library drifted, or the DS changed and ds-reference.json must be updated in the same PR.`,
    );
  }
});

test("the retired teal appears nowhere", () => {
  for (const [coll, name, e] of colorEntries(capture)) {
    assert.notEqual(
      String(e.value).toLowerCase(), "#14b7a5",
      `${coll}/${name} uses #14b7a5, retired company-wide on 2026-09-29`,
    );
  }
});

test("no marketing purple or magenta leaks into a page-body role", () => {
  // The brand gradient legitimately contains magenta; nothing else may.
  const banned = new Set(["#ba00c7", "#fc0061", "#6000f3"]);
  for (const [coll, name, e] of colorEntries(capture)) {
    if (coll === "Artefact / Brand gradient" || coll === "Artefact / Primitive") continue;
    // 2026-10-13: tertiary/default deliberately takes the gradient's first stop. It is
    // display-only at 3.95:1 and contrast.test.ts pins that marking, so the guard that
    // matters — no gradient colour as a *body* role — is still enforced, not waived.
    if (e.use === "display") continue;
    assert.ok(
      !banned.has(String(e.value).toLowerCase()),
      `${coll}|${name} uses ${e.value} — gradient-only colour used as a page or data role`,
    );
  }
});
