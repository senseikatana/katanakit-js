import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (path: string) => JSON.parse(readFileSync(path, "utf8"));

const mirror = readJson(join(ROOT, "scripts", "docs-site.json"));
const sourcePath = join(ROOT, "..", "senseikatana", "config", "docs-site.json");

describe("docs-site URL scheme", () => {
	it("exposes the fields the docs scripts consume", () => {
		expect(mirror.siteOrigin).toMatch(/^https:\/\//);
		expect(mirror.docsBase).toMatch(/^\/[^/]/);
		expect(mirror.docsHome.startsWith(`${mirror.docsBase}/`)).toBe(true);
		expect(mirror.docsPublicUrl).toMatch(/^https:\/\//);
		expect(typeof mirror.docsPagesProject).toBe("string");
	});

	// The sibling senseikatana repository holds the single source of truth.
	// GitHub Actions only checks this repository out, so the mirror is what
	// runs there; locally both must agree. `_comment` is exempt: each file
	// documents its own role.
	it.skipIf(!existsSync(sourcePath))("matches senseikatana/config/docs-site.json", () => {
		const { _comment: _sourceNote, ...source } = readJson(sourcePath);
		const { _comment: _mirrorNote, ...mirrored } = mirror;
		expect(mirrored).toEqual(source);
	});
});
