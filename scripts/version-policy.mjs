/**
 * Release version policy: a version that repeats the digit 3 — two or more
 * 3s, in the same component or dots apart (`7.3.3` and `7.3.13` both count)
 * — is skipped, never published. After 7.3.2 comes 7.3.4; 7.3.13 is skipped
 * for 7.3.14.
 *
 * The rule is major-agnostic (8.x, 9.x, …) and forward-only: existing tags
 * and releases are never rewritten. `generate-release-notes.mjs` and
 * `npm-publish.mjs` refuse a forbidden version and name the next allowed
 * one; the rule lives here so it can be tested on its own:
 *
 *   node scripts/version-policy.mjs 7.3.13   # exits 1 and prints 7.3.14
 */
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

/** Occurrences of the digit 3 in the whole version (a dot does not separate them). */
function countThrees(version) {
	return (version.match(/3/g) ?? []).length;
}

/** True when the version repeats the digit 3 and must be skipped. */
export function isForbiddenVersion(version) {
	return countThrees(version) >= 2;
}

/**
 * First allowed version strictly newer than the given one — patch first,
 * then the minor — so a rejected release knows the exact number to use:
 * 7.3.3 → 7.3.4, 7.3.13 → 7.3.14, 3.3.3 → 3.4.0.
 */
export function nextAllowedVersion(version) {
	const [major, minor, patch] = version.split(".").map(Number);
	let nextMinor = minor;
	let nextPatch = patch + 1;

	for (let step = 0; step < 10_000; step++) {
		if (nextPatch > 999) {
			nextMinor += 1;
			nextPatch = 0;
		}
		const candidate = `${major}.${nextMinor}.${nextPatch}`;
		if (!isForbiddenVersion(candidate)) return candidate;
		nextPatch += 1;
	}

	throw new Error(`no allowed version found after ${version}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
	const version = (process.argv[2] ?? "").replace(/^v/, "");
	if (!version) {
		console.error("Usage: node scripts/version-policy.mjs <version>");
		process.exitCode = 1;
	} else if (isForbiddenVersion(version)) {
		console.log(
			`${version}: skipped (repeats the digit 3) — use ${nextAllowedVersion(version)} instead.`,
		);
		process.exitCode = 1;
	} else {
		console.log(`${version}: allowed`);
	}
}
