import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

export type AliasRef = { collection: string; name: string };
export type Entry = {
  type: "COLOR" | "FLOAT" | "STRING";
  scopes: string[];
  value: string | number;
  /** Structured, not "Collection/name": variable names themselves now contain slashes
   *  (`gray/900`, `text/heading`), so a flat string could not be parsed unambiguously. */
  aliasOf?: AliasRef;
  use?: "surface" | "display";
  unit?: string;
  ladder?: string;
  stop?: number;
  description?: string;
};
export type Collection = { mode: string; hidden: boolean; entries: Record<string, Entry> };
export type Capture = {
  source: { fileKey: string; fileName: string; capturedAt: string; pages: string[] };
  collections: Record<string, Collection>;
};
export type DsReference = {
  source: Record<string, string>;
  roles: Record<string, { value: string; cssVar: string; primitive: string }>;
  sharedRoles: Record<string, string>;
};

const raw = (p: string) => readFileSync(join(ROOT, p), "utf8");
export const readCapture = (): Capture => JSON.parse(raw("capture/variables.json"));
export const readDsReference = (): DsReference => JSON.parse(raw("capture/ds-reference.json"));
export const captureSha256 = (): string =>
  createHash("sha256").update(raw("capture/variables.json")).digest("hex");

export const PRIMITIVE_COLLECTION = "Artefact / Primitive";

/** [collection, name, entry] for every variable. */
export function allEntries(c: Capture): [string, string, Entry][] {
  return Object.entries(c.collections).flatMap(([cn, coll]) =>
    Object.entries(coll.entries).map(([n, e]) => [cn, n, e] as [string, string, Entry]),
  );
}
export const colorEntries = (c: Capture) => allEntries(c).filter(([, , e]) => e.type === "COLOR");
/** Semantic = every colour collection that is not the primitive tier. */
export const semanticColorEntries = (c: Capture) =>
  colorEntries(c).filter(([cn]) => cn !== PRIMITIVE_COLLECTION);

/** Display form of an alias target, for digests and assertion messages. */
export const aliasLabel = (a: AliasRef): string => `${a.collection} › ${a.name}`;
