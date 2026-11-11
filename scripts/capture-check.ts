/** Staleness check. The product DS has no automated sync at all — its ground truth is a
 *  hand-committed capture and nothing tells you when Figma moved. Artefact templates change
 *  far more often than product tokens, so this is the guard that keeps a manual chain honest. */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./lib/capture.ts";

const lock = JSON.parse(readFileSync(join(ROOT, "capture/lock.json"), "utf8"));

if (lock.fileKey === "PENDING") {
  console.log("capture:check — SKIPPED: no Figma file captured yet (lock.fileKey is PENDING).");
  process.exit(0);
}
const token = process.env["FIGMA_TOKEN"];
if (!token) {
  console.error("capture:check — FIGMA_TOKEN not set. Export it, or run the capture through the Figma MCP.");
  process.exit(2);
}

const res = await fetch(`https://api.figma.com/v1/files/${lock.fileKey}?depth=1`, {
  headers: { "X-Figma-Token": token },
});
if (!res.ok) {
  console.error(`capture:check — Figma API ${res.status}`);
  process.exit(2);
}
const live = (await res.json()) as { version: string; lastModified: string };

if (live.version !== lock.version) {
  console.error(
    `capture:check — STALE.\n  Figma version : ${live.version} (modified ${live.lastModified})\n  Captured      : ${lock.version} (${lock.lastModified})\n\nRe-capture with the Figma MCP, then commit capture/.`,
  );
  process.exit(1);
}
console.log(`capture:check — current (Figma version ${live.version}).`);
