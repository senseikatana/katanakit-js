#!/usr/bin/env node
/**
 * Bumps the version in package.json, promotes the CHANGELOG `[Unreleased]`
 * section to `[X.Y.Z] - date`, commits, and creates the annotated release tag.
 *
 * Usage:
 *   node scripts/bump-version.mjs patch|minor|major ["release message"]
 *   node scripts/bump-version.mjs --sync   # mirror the latest git tag, no commit
 *
 * The optional message becomes the annotated tag subject:
 *   v1.2.3 — feat: add Zod validation everywhere
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFESTS = [join(ROOT, "package.json")];

const args = process.argv.slice(2);
const kind = args[0];
const message = (args[1] ?? "").trim();

function readVersion(manifest) {
	return JSON.parse(readFileSync(manifest, "utf8")).version;
}

function writeVersion(manifest, version) {
	const content = readFileSync(manifest, "utf8");
	const updated = content.replace(/("version":\s*)"[^"]+"/, `$1"${version}"`);
	writeFileSync(manifest, updated);
}

function bump(current, release) {
	const [major, minor, patch] = current.split(".").map(Number);
	if (release === "major") return `${major + 1}.0.0`;
	if (release === "minor") return `${major}.${minor + 1}.0`;
	return `${major}.${minor}.${patch + 1}`;
}

/**
 * Moves the `[Unreleased]` entries into a `[X.Y.Z] - date` section and leaves a
 * fresh empty `[Unreleased]` on top. Refuses to release an empty section, so a
 * release always ships a changelog.
 */
function promoteChangelog(version) {
	const file = join(ROOT, "CHANGELOG.md");
	const content = readFileSync(file, "utf8");
	const marker = "## [Unreleased]";
	const start = content.indexOf(marker);
	if (start === -1) {
		console.error("CHANGELOG.md is missing the '## [Unreleased]' section.");
		process.exit(1);
	}

	const rest = content.slice(start + marker.length);
	const next = rest.search(/\n## /);
	const body = (next === -1 ? rest : rest.slice(0, next)).trim();
	if (!body) {
		console.error(
			"CHANGELOG.md [Unreleased] is empty — add an entry for every user-visible change before releasing.",
		);
		process.exit(1);
	}

	const date = new Date().toISOString().slice(0, 10);
	const tail = next === -1 ? "" : rest.slice(next + 1);
	const updated = (
		content.slice(0, start) + `${marker}\n\n## [${version}] - ${date}\n\n${body}\n\n${tail}`
	).replace(/\n{3,}/g, "\n\n");

	writeFileSync(file, updated);
	console.log(`Changelog: [Unreleased] promoted to [${version}]`);
}

if (kind === "--sync") {
	const tag = execFileSync("git", ["tag", "--sort=-v:refname"], { cwd: ROOT, encoding: "utf8" })
		.split("\n")[0]
		.trim();
	const version = tag.replace(/^v/, "");
	for (const manifest of MANIFESTS) {
		writeVersion(manifest, version);
	}
	console.log(`Synced to v${version}`);
	process.exit(0);
}

if (kind !== "patch" && kind !== "minor" && kind !== "major") {
	console.error("Usage: node scripts/bump-version.mjs <patch|minor|major> | --sync");
	process.exit(1);
}

const version = bump(readVersion(MANIFESTS[0]), kind);
for (const manifest of MANIFESTS) {
	writeVersion(manifest, version);
}
promoteChangelog(version);

const git = (...gitArgs) => execFileSync("git", gitArgs, { cwd: ROOT, stdio: "inherit" });
git("add", "-u");
git("commit", "-m", `chore: release v${version}`);
const tagSubject = message ? `v${version} — ${message}` : `v${version}`;
git("tag", "-a", `v${version}`, "-m", tagSubject);
console.log(`Released ${tagSubject}`);
