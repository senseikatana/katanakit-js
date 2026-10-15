#!/usr/bin/env node
/**
 * Removes every build artifact the repo can regenerate.
 *
 * `bun run clean -- --dry` previews the list without touching anything.
 *
 * Why an allowlist and not a glob: the two generated Prisma contract files
 * (`src/prisma/schema.d.ts` and `src/prisma/schema.json`) are emitted by
 * `prisma contract emit` but are **committed to git**. A pattern-based sweep
 * would happily delete tracked sources, so every target is named explicitly
 * and anything outside this list is never considered.
 *
 * `rimraf` is deliberately not used — `fs.rmSync(…, { recursive, force })` is
 * native on the Node floor declared in `engines.node`, and `scripts/docs.mjs`
 * already removes trees that way.
 */
import { existsSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Regenerable paths, each paired with the command that brings it back.
 * Anything not listed here is source and must survive a clean.
 */
const TARGETS = [
	["dist", "bun run build"],
	["packages/ui/dist", "bun run build:ui"],
	["docs/api", "bun run docs"],
	["docs/changelog.md", "bun run docs"],
	["docs/.vitepress/dist", "bun run docs:build"],
	["docs/.vitepress/cache", "bun run docs:build"],
	["docs/.vitepress/.temp", "bun run docs:build"],
	["docs/.vitepress/theme/signals.json", "bun run docs"],
	[".vitepress", "bun run docs"],
	[".cache", "bun run docs"],
	["node_modules/.vite", "bun run dev"],
];

/**
 * Sums the byte size of every file under a directory.
 *
 * @param {string} directory - Absolute directory path.
 * @returns {number} Total bytes, or `0` when the tree cannot be walked.
 */
function directorySize(directory) {
	let total = 0;
	let entries;
	try {
		entries = readdirSync(directory, { withFileTypes: true });
	} catch {
		return 0;
	}
	for (const entry of entries) {
		const child = join(directory, entry.name);
		total += entry.isDirectory() ? directorySize(child) : statSync(child).size;
	}
	return total;
}

/**
 * Reports the byte size of a path, or `0` when it is absent.
 *
 * @param {string} absolute - Absolute path to measure.
 * @returns {number} Size in bytes.
 */
function bytes(absolute) {
	if (!existsSync(absolute)) return 0;
	return statSync(absolute).isDirectory() ? directorySize(absolute) : statSync(absolute).size;
}

/**
 * Formats a byte count for terminal output.
 *
 * @param {number} value - Number of bytes.
 * @returns {string} Human-readable size with a unit.
 */
function format(value) {
	const units = ["B", "KB", "MB", "GB"];
	let size = value;
	let unit = 0;
	while (size >= 1024 && unit < units.length - 1) {
		size /= 1024;
		unit += 1;
	}
	return `${size.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

const dry = process.argv.includes("--dry") || process.argv.includes("-n");
const present = TARGETS.filter(([target]) => existsSync(join(ROOT, target)));

if (present.length === 0) {
	console.log("clean: nothing to remove.");
	process.exit(0);
}

const rows = present.map(([target, restore]) => {
	const absolute = join(ROOT, target);
	return { label: relative(ROOT, absolute), absolute, restore, size: bytes(absolute) };
});

const total = rows.reduce((sum, row) => sum + row.size, 0);
const width = Math.max(...rows.map((row) => row.label.length));

console.log(dry ? "clean (dry run) — would remove:" : "clean: removing");

for (const row of rows) {
	if (!dry) rmSync(row.absolute, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
	console.log(`  ${row.label.padEnd(width)}  ${format(row.size).padStart(9)}  (${row.restore})`);
}

console.log(
	`${dry ? "clean (dry run)" : "clean"}: ${rows.length} path(s), ${format(total)}.`,
);
if (dry) console.log("clean (dry run): nothing was deleted. Re-run without --dry to apply.");