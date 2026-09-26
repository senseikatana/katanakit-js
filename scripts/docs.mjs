#!/usr/bin/env node
/**
 * Docs task runner: `node scripts/docs.mjs <dev|build|gh|clean>`.
 *
 * VitePress shares `docs/.vitepress/.temp` between the dev server and the
 * build, so running both concurrently corrupts it and the build dies with
 * `Cannot find module '…/.vitepress/.temp/…'`. This runner:
 *
 *   1. takes a lock in `.cache/docs.lock.json` (dev and build are exclusive),
 *   2. removes stale locks from dead processes,
 *   3. purges `.temp`/`cache` before a build (never during a live dev server),
 *   4. fails with actionable guidance instead of a cryptic VitePress error.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LOCK_FILE = join(ROOT, ".cache", "docs.lock.json");
const VITEPRESS_DIR = join(ROOT, "docs", ".vitepress");
const TEMP_DIR = join(VITEPRESS_DIR, ".temp");
const CACHE_DIR = join(VITEPRESS_DIR, "cache");
const ROOT_VITEPRESS_DIR = join(ROOT, ".vitepress");

const MODES = new Set(["dev", "build", "gh"]);
const mode = (process.argv[2] ?? "").toLowerCase();

const run = (command, args, opts = {}) =>
	execFileSync(command, args, { cwd: ROOT, stdio: "inherit", ...opts });

const remove = (target) => rmSync(target, { recursive: true, force: true });

/** Removes the VitePress temp/cache dirs and the stray root `.vitepress/`. */
function clean() {
	remove(TEMP_DIR);
	remove(CACHE_DIR);
	remove(ROOT_VITEPRESS_DIR);
	console.log("docs: cleaned .vitepress/.temp, .vitepress/cache and ./ .vitepress");
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
					`docs: blocked — "docs:dev" is already running (pid ${existing.pid}, started ${started}).`,
					"VitePress shares docs/.vitepress/.temp between dev and build; running both fails with:",
					"  Cannot find module '.../.vitepress/.temp/...'",
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
		console.log("docs: dev server starting — do not run docs:build/docs:gh meanwhile.");
		run("node_modules/.bin/vitepress", ["dev", "docs"]);
		return;
	}

	// Build/gh: purge shared temp state so a killed process can't poison us.
	remove(TEMP_DIR);
	remove(CACHE_DIR);

	const args = ["build", "docs"];
	if (mode === "gh") args.push("--base", "/katanakit-js/");
	run("node_modules/.bin/vitepress", args);

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
