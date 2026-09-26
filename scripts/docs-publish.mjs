#!/usr/bin/env node
/**
 * Publishes `docs/.vitepress/dist` to the `gh-pages` branch.
 *
 * A throwaway clone in the OS temp directory keeps the project checkout and its
 * index untouched (the `gh-pages` npm package staged the whole working tree,
 * `node_modules/` included, in the project index).
 *
 * Run via `bun run docs:gh`, which builds with the GitHub Pages base first.
 */
import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "docs", ".vitepress", "dist");
const BRANCH = "gh-pages";

const git = (args, cwd) => execFileSync("git", args, { cwd, stdio: "inherit" });
const output = (args, cwd) => execFileSync("git", args, { cwd, encoding: "utf8" }).trim();

const remote = output(["remote", "get-url", "origin"], ROOT);
const sha = output(["rev-parse", "--short", "HEAD"], ROOT);
const work = mkdtempSync(join(tmpdir(), "katanakit-gh-pages-"));

try {
	try {
		git(["clone", "--branch", BRANCH, "--single-branch", "--depth", "1", remote, work], ROOT);
	} catch {
		// First publish: start an orphan branch instead of failing.
		git(["init", "-b", BRANCH], work);
		try {
			git(["remote", "add", "origin", remote], work);
		} catch {
			git(["remote", "set-url", "origin", remote], work);
		}
	}

	for (const entry of readdirSync(work)) {
		if (entry !== ".git") {
			rmSync(join(work, entry), { recursive: true, force: true });
		}
	}
	for (const entry of readdirSync(DIST)) {
		cpSync(join(DIST, entry), join(work, entry), { recursive: true });
	}

	git(["add", "-A"], work);
	git(["commit", "-m", `docs: publish preview ${sha}`], work);
	git(["push", "origin", `HEAD:${BRANCH}`], work);
	console.log(`Published docs/.vitepress/dist to ${BRANCH} (${sha}).`);
} finally {
	rmSync(work, { recursive: true, force: true });
}
