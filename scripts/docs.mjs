#!/usr/bin/env node
/**
 * Docs task runner: `node scripts/docs.mjs <dev|build|preview|gh|clean>`.
 *
 * VitePress shares `docs/.vitepress/.temp` between the dev server and the
 * build, so running both concurrently corrupts it and the build dies with
 * `Cannot find module '…/.vitepress/.temp/…'`. This runner:
 *
 *   1. takes a lock in `.cache/docs.lock.json` (dev and build are exclusive),
 *   2. removes stale locks from dead processes,
 *   3. purges `.temp`/`cache` before a build (never during a live dev server),
 *   4. fails with actionable guidance instead of a cryptic VitePress error.
 *
 * `preview` builds first and then serves that build, so the previewed site is
 * always the complete, current one (UI CSS, TypeDoc reference, changelog).
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

const MODES = new Set(["dev", "build", "preview", "gh"]);
const mode = (process.argv[2] ?? "").toLowerCase();

const run = (command, args, opts = {}) =>
	execFileSync(command, args, { cwd: ROOT, stdio: "inherit", ...opts });

/**
 * Removes a tree. `maxRetries` covers the window where another task is still
 * writing into it (ENOTEMPTY/EBUSY), which is exactly the race the lock above
 * exists to prevent in the first place.
 */
const remove = (target) =>
	rmSync(target, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });

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
		// A truncated lock (process killed between create and write) must not
		// deadlock the pipeline forever: an unreadable lock is a stale lock.
		remove(LOCK_FILE);
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
					"VitePress shares docs/.vitepress/.temp between dev and build; running both fails with:",
					"  Cannot find module '.../.vitepress/.temp/...'",
					"Stop the dev server (Ctrl+C), then retry — the lock is released automatically.",
				].join("\n"),
			);
		} else {
			console.error(`docs: blocked — another docs task is running (${existing.mode}, pid ${existing.pid}).`);
		}
		process.exit(1);
	}
	if (existing) {
		console.log(`docs: removed stale lock from pid ${existing.pid} (process is gone).`);
		remove(LOCK_FILE);
	}

	// `wx` makes the lock atomic: two tasks starting at the same instant cannot
	// both observe "no lock" and both proceed, which is what corrupts
	// docs/.vitepress/.temp (ENOTEMPTY / missing module).
	try {
		writeFileSync(
			LOCK_FILE,
			JSON.stringify({ pid: process.pid, mode, started: new Date().toISOString() }),
			{ flag: "wx" },
		);
	} catch (error) {
		if (error?.code !== "EEXIST") throw error;
		const holder = readLock();
		console.error(
			`docs: blocked — another docs task grabbed the lock (${holder?.mode ?? "unknown"}, pid ${holder?.pid ?? "unknown"}).`,
		);
		process.exit(1);
	}
}

/**
 * Drops the lock, but only when this process owns it: `docs:clean` and a
 * foreign task must never delete the lock of a live run.
 */
function release() {
	const lock = readLock();
	if (lock && lock.pid !== process.pid) return;
	remove(LOCK_FILE);
}

function chain() {
	run("bun", ["run", "ui:build"]);
	run("node", [join(ROOT, "scripts", "docs-prepare.mjs")]);

	if (mode === "dev") {
		console.log("docs: dev server starting — do not run docs/docs:gh meanwhile.");
		run("node_modules/.bin/vitepress", ["dev", "docs"]);
		return;
	}

	// Build/preview/gh: purge shared temp state so a killed process can't poison us.
	remove(TEMP_DIR);
	remove(CACHE_DIR);

	const args = ["build", "docs"];
	if (mode === "gh") args.push("--base", "/katanakit-js/");
	run("node_modules/.bin/vitepress", args);

	if (mode === "preview") {
		// Serves the build that just ran, so the preview is the complete site
		// (UI CSS, TypeDoc reference and changelog included), never a stale one.
		// `--strictPort` keeps it non-interactive: without it a busy port makes
		// VitePress prompt for another one while we hold the lock, and a
		// non-TTY run (CI) would hang there forever.
		console.log("docs: preview server starting on http://localhost:4173/");
		run("node_modules/.bin/vitepress", ["preview", "docs", "--port", "4173", "--strictPort"]);
		return;
	}

	if (mode === "gh") {
		run("node", [join(ROOT, "scripts", "docs-publish.mjs")]);
	}
}

if (mode === "clean") {
	// Take the lock first: purging `.temp` while a dev server is live is the
	// corruption this runner exists to prevent.
	acquire();
	try {
		clean();
	} finally {
		release();
	}
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
	} catch (error) {
		// `chain()` blocks in `execFileSync`, so a Ctrl+C reaches the child
		// first and surfaces here as a signal error instead of the handler
		// above. Translate it into a quiet exit; anything else is a real
		// failure and keeps its stack. The lock is dropped by `finally` on
		// every path (a second `release()` here could delete a lock another
		// task took in the meantime).
		if (error?.signal === "SIGINT" || error?.signal === "SIGTERM") {
			console.log("\ndocs: stopped");
			process.exit(130);
		}
		throw error;
	} finally {
		release();
	}
} else {
	console.error("Usage: node scripts/docs.mjs <dev|build|preview|gh|clean>");
	process.exit(1);
}
