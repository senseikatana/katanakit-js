#!/usr/bin/env node
/**
 * Publishes the current `package.json` version to npm, but only after the
 * whole release is coherent. Preflight, in order:
 *
 *   1. the working tree is clean
 *   2. `v<version>` exists locally and on origin
 *   3. CHANGELOG.md has a `## [<version>]` section
 *   4. README/docs version refs are synced (`--sync-versions` is a no-op)
 *   5. the version is not already on the registry
 *   6. `dist/` exists (npm publishes the built output)
 *
 * Then runs `npm publish --access public` with inherited stdio, so npm's web
 * 2FA approval (EOTP: open the printed URL) can complete in a real terminal.
 *
 * Usage:
 *   bun run publish:npm                # preflight + publish
 *   bun run publish:npm -- --check     # preflight only, never publishes
 *   bun run publish:npm -- --dry-run   # npm publish --dry-run (no upload)
 *   bun run publish:npm -- --otp=123456
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PKG = "katanakit-js";
const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const npmArgs = args.filter((arg) => arg !== "--check");

const run = (cmd, cmdArgs, opts = {}) =>
	execFileSync(cmd, cmdArgs, { cwd: ROOT, encoding: "utf8", ...opts }).trim();

const runOr = (cmd, cmdArgs) => {
	try {
		// Probe: stderr stays quiet (e.g. `npm view` 404s are expected here).
		return execFileSync(cmd, cmdArgs, {
			cwd: ROOT,
			encoding: "utf8",
			stdio: ["ignore", "pipe", "ignore"],
		}).trim();
	} catch {
		return undefined;
	}
};

function fail(message, hint) {
	console.error(`\n✖ ${message}`);
	if (hint) console.error(`  → ${hint}`);
	process.exit(1);
}

const version = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).version;
const tag = `v${version}`;
console.log(`\n📦 ${PKG}@${version} (tag ${tag})\n`);

if (run("git", ["status", "--porcelain"])) {
	fail("El árbol de trabajo no está limpio.", "Terminá tu flujo de release (useGit push) antes de publicar.");
}

if (!runOr("git", ["rev-parse", "-q", "--verify", `refs/tags/${tag}`])) {
	fail(`El tag ${tag} no existe localmente.`, "Cortá el release primero (useGit push --release).");
}

if (!runOr("git", ["ls-remote", "--exit-code", "--tags", "origin", `refs/tags/${tag}`])) {
	fail(`El tag ${tag} no está en origin.`, `Subilo con: git push origin ${tag}`);
}

const changelog = readFileSync(join(ROOT, "CHANGELOG.md"), "utf8");
if (!new RegExp(`^## \\[${version.replace(/\./g, "\\.")}\\]`, "m").test(changelog)) {
	fail(
		`CHANGELOG.md no tiene la sección [${version}].`,
		`Generala con: node scripts/generate-release-notes.mjs ${tag} --write`,
	);
}

run("node", [join("scripts", "generate-release-notes.mjs"), "--sync-versions"]);
if (run("git", ["status", "--porcelain"])) {
	fail(
		"Las refs de versión no estaban sincronizadas (README/docs/package.json).",
		"El sync las cambió: commitealas y reintentá.",
	);
}

if (!existsSync(join(ROOT, "dist", "index.js"))) {
	fail("No hay build en dist/.", "Corré: bun run build (o directamente bun run release).");
}

if (runOr("npm", ["view", `${PKG}@${version}`, "version"])) {
	fail(`${PKG}@${version} ya está publicado en npm.`, "No hay nada para publicar: bumpeá la versión primero.");
}

console.log("✔ Preflight OK");
if (checkOnly) {
	console.log("(--check: no se publicó nada)\n");
	process.exit(0);
}

if (!runOr("npm", ["whoami"])) {
	console.log("→ npm login");
	execFileSync("npm", ["login"], { cwd: ROOT, stdio: "inherit" });
}

console.log(`→ npm publish --access public${npmArgs.length ? ` ${npmArgs.join(" ")}` : ""}`);
console.log("  (si npm pide 2FA, abrí la URL que imprime y aprobá; el publish sigue solo)\n");
execFileSync("npm", ["publish", "--access", "public", ...npmArgs], { cwd: ROOT, stdio: "inherit" });
console.log(`\n✅ ${PKG}@${version} publicado.\n`);
