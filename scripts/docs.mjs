#!/usr/bin/env node
/**
 * Docs task runner: `node scripts/docs.mjs <dev|build|gh|clean>`.
 *
 * `bun run dev` and `bun run docs` share Astro's cache under
 * `docs/.astro`, so running both concurrently can corrupt it. This runner:
 *
 *   1. takes a lock in `.cache/docs.lock.json` (dev and build are exclusive),
 *   2. removes stale locks from dead processes,
 *   3. purges Astro's cache before a build (never during a live dev server),
 *   4. fails with actionable guidance instead of a cryptic Astro error.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LOCK_FILE = join(ROOT, ".cache", "docs.lock.json");
const ASTRO_DIR = join(ROOT, "docs");
const ASTRO_CACHE_DIR = join(ROOT, "docs", ".astro");
const ASTRO_DIST_DIR = join(ROOT, "docs", "dist");

const MODES = new Set(["dev", "build", "gh"]);
const mode = (process.argv[2] ?? "").toLowerCase();

const run = (command, args, opts = {}) =>
	execFileSync(command, args, { cwd: ROOT, stdio: "inherit", ...opts });

/** Runs the project-local Astro CLI with `docs/` as the project root. */
const astro = (args, opts = {}) =>
	run(join(ROOT, "node_modules", ".bin", "astro"), args, { cwd: ASTRO_DIR, ...opts });

const remove = (target) => rmSync(target, { recursive: true, force: true });

/** Removes the Astro cache and previous build output. */
function clean() {
	remove(ASTRO_CACHE_DIR);
	remove(join(ASTRO_DIR, "node_modules", ".astro")); // content-layer cache (stale entries)
	remove(ASTRO_DIST_DIR);
	remove(join(ASTRO_DIR, "node_modules", ".vite"));
	console.log("docs: cleaned docs/.astro, docs/node_modules/.astro, docs/dist and the Astro/Vite caches");
}

function readLock() {
	if (!existsSync(LOCK_FILE)) return null;
	try {
		return JSON.parse(readFileSync(LOCK_FILE, "utf8"));
	} catch {
		return null;
	}
}

function processAlive(pid) {
	if (!pid || pid === process.pid) return false;
	try {
		process.kill(pid, 0);
		return true;
	} catch {
		return false;
	}
}

/** Acquires the exclusive docs lock, clearing stale entries. */
function acquire() {
	mkdirSync(join(ROOT, ".cache"), { recursive: true });

	const existing = readLock();
	if (existing && processAlive(existing.pid)) {
		const started = existing.started ?? "unknown";
		if (existing.mode === "dev" && mode !== "dev") {
			console.error(
				[
					`docs: blocked — "bun run dev" is already running (pid ${existing.pid}, started ${started}).`,
					"Astro shares its cache under docs/.astro between dev and build; running both",
					"concurrently can corrupt the generated content types.",
					"Stop the dev server (Ctrl+C), then retry. Check with: `bun run docs:clean`",
				].join("\n"),
			);
		} else {
			console.error(`docs: blocked — another docs task is running (${existing.mode}, pid ${existing.pid}).`);
		}
		process.exit(1);
	}
	if (existing) {
		console.log(`docs: removed stale lock from pid ${existing.pid} (process is gone).`);
	}

	writeFileSync(
		LOCK_FILE,
		JSON.stringify({ pid: process.pid, mode, started: new Date().toISOString() }),
	);
}

function release() {
	remove(LOCK_FILE);
}

function chain() {
	run("bun", ["run", "ui:build"]);
	run("node", [join(ROOT, "scripts", "docs-prepare.mjs")]);

	if (mode === "dev") {
		console.log('docs: dev server starting — do not run `bun run docs`/`docs:gh` meanwhile.');
		astro(["dev"]);
		return;
	}

	// Build/gh: purge cached content state so a killed process can't poison us.
	remove(ASTRO_CACHE_DIR);

	const args = ["build"];
	if (mode === "gh") args.push("--base", "/katanakit-js/");
	astro(args);

	if (mode === "gh") {
		run("node", [join(ROOT, "scripts", "docs-publish.mjs")]);
	}
}

if (mode === "clean") {
	clean();
	release();
} else if (MODES.has(mode)) {
	acquire();
	const onSignal = () => {
		release();
		process.exit(130);
	};
	process.on("SIGINT", onSignal);
	process.on("SIGTERM", onSignal);
	try {
		chain();
	} finally {
		release();
	}
} else {
	console.error("Usage: node scripts/docs.mjs <dev|build|gh|clean>");
	process.exit(1);
}
