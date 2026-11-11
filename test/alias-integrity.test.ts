/** Within-file aliasing works on Figma Professional — only cross-FILE library aliasing
 *  needs Organization. So the semantic tier genuinely aliases the primitive tier, and this
 *  test pins that structure: a semantic role that stops aliasing has been detached and
 *  hand-typed, which is exactly how a palette starts to rot. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readCapture, semanticColorEntries, aliasLabel, PRIMITIVE_COLLECTION } from "../scripts/lib/capture.ts";

const capture = readCapture();
const primitives = capture.collections[PRIMITIVE_COLLECTION]!.entries;
const semantic = semanticColorEntries(capture);

test("there is a semantic tier to check", () => {
  assert.ok(semantic.length > 0, "no semantic colour roles found — this test would be vacuous");
});

test("every semantic colour aliases a primitive, none is a hand-typed literal", () => {
  for (const [coll, name, e] of semantic) {
    assert.ok(e.aliasOf, `${coll}/${name} has no aliasOf — it was detached from the primitive tier`);
  }
});

test("every alias target exists in the primitive tier", () => {
  for (const [coll, name, e] of semantic) {
    const { collection: targetColl, name: targetName } = e.aliasOf!;
    assert.equal(targetColl, PRIMITIVE_COLLECTION, `${coll}/${name} aliases outside the primitive tier`);
    assert.ok(primitives[targetName], `${coll}/${name} aliases ${aliasLabel(e.aliasOf!)}, which does not exist`);
  }
});

test("each semantic value equals the primitive it aliases", () => {
  for (const [coll, name, e] of semantic) {
    const target = primitives[e.aliasOf!.name]!;
    assert.equal(
      String(e.value).toLowerCase(),
      String(target.value).toLowerCase(),
      `${coll}/${name} resolves to ${e.value} but its alias target is ${target.value} — the capture is inconsistent`,
    );
  }
});

test("no component token skips a tier", () => {
  // Three tiers, never skipping — the product DS rule, carried over.
  for (const [coll, name, e] of semantic) {
    assert.notEqual(e.aliasOf, undefined, `${coll}/${name} skips the primitive tier`);
  }
});
