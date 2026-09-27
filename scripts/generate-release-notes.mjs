#!/usr/bin/env node
/**
 * Generates release notes from Conventional Commits between the previous tag
 * and the given tag. Prints markdown by default; use --json for structured
 * output that the docs site can consume.
 *
 * Usage:
 *   node scripts/generate-release-notes.mjs v2.14.1
 *   node scripts/generate-release-notes.mjs v2.14.1 --json
 *   node scripts/generate-release-notes.mjs v2.14.1 --changelog   # prefer CHANGELOG section
 *   node scripts/generate-release-notes.mjs v2.14.1 --write       # write the section into CHANGELOG.md
 *   node scripts/generate-release-notes.mjs --all --json
 *
 * `--write` also refreshes the version pinned in README/docs prose, so the
 * published docs always name the version that just shipped.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = "senseikatana/katanakit-js";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const SECTIONS = [
	{ type: "feat", title: "🚀 Features" },
	{ type: "fix", title: "🔧 Fixes" },
	{ type: "perf", title: "⚡ Performance" },
	{ type: "refactor", title: "♻️ Refactors" },
	{ type: "docs", title: "📝 Documentation" },
	{ type: "test", title: "🧪 Tests" },
	{ type: "build", title: "📦 Build" },
	{ type: "ci", title: "🤖 CI" },
	{ type: "chore", title: "🧹 Chores" },
];

const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();

function allTags() {
	return git("tag", "--sort=-v:refname")
		.split("\n")
		.map((tag) => tag.trim())
		.filter((tag) => /^v\d+\.\d+\.\d+$/.test(tag));
}

function previousTag(tag) {
	const tags = allTags();
	const index = tags.indexOf(tag);
	return index === -1 ? undefined : tags[index + 1];
}

function parseCommit(subject) {
	const match = subject.match(/^(\w+)(?:\(([^)]+)\))?(!)?: (.+)$/);
	if (!match) return undefined;
	const [, type, scope, breaking, message] = match;
	return { type, scope, breaking: Boolean(breaking), message };
}

function collect(tag) {
	const prev = previousTag(tag);
	const range = prev ? `${prev}..${tag}` : tag;
	const date = git("log", "-1", "--format=%cs", tag);

	const commits = git("log", "--no-merges", "--pretty=format:%s", range)
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean)
		.map(parseCommit)
		.filter(Boolean)
		.filter((commit) => !(commit.type === "chore" && /^release v/.test(commit.message)))
		// Bot-generated placeholder: describes the commit, not the change.
		.filter((commit) => !/^update documentation in \d+ files$/.test(commit.message));

	const sections = SECTIONS.map((section) => ({
		title: section.title,
		items: commits
			.filter((commit) => commit.type === section.type)
			.map((commit) => ({
				scope: commit.scope,
				message: commit.message,
				breaking: commit.breaking,
			})),
	})).filter((section) => section.items.length > 0);

	return { tag, version: tag.replace(/^v/, ""), date, previous: prev, sections };
}

function renderMarkdown(release) {
	const lines = [`## ${release.version} (${release.date})`, ""];

	for (const section of release.sections) {
		lines.push(`### ${section.title}`, "");
		for (const item of section.items) {
			const scope = item.scope ? `**${item.scope}:** ` : "";
			const breaking = item.breaking ? "**BREAKING** " : "";
			lines.push(`- ${breaking}${scope}${item.message}`);
		}
		lines.push("");
	}

	if (release.previous) {
		lines.push(
			`**Full Changelog**: https://github.com/${REPO}/compare/${release.previous}...${release.tag}`,
		);
	}

	return `${lines.join("\n").trimEnd()}\n`;
}

/**
 * Extracts the newest non-empty section from CHANGELOG.md. Used when tags
 * already captured the commits (e.g. manual GitHub releases without an npm
 * publish), so commit diffing yields nothing. CHANGELOG.md lists released
 * versions only, so the newest section *is* the release being described.
 */
function changelogBody() {
	const lines = readFileSync(join(ROOT, "CHANGELOG.md"), "utf8").split("\n");
	const sections = [];
	let current;

	for (const line of lines) {
		if (/^## \[/.test(line)) {
			if (current) sections.push(current);
			current = { heading: line, lines: [] };
		} else if (current) {
			current.lines.push(line);
		}
	}
	if (current) sections.push(current);

	const hasBody = (section) => section.lines.join("").trim().length > 0;
	const preferred = sections.find(hasBody);

	return preferred ? `${preferred.lines.join("\n").trim()}\n` : undefined;
}

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const all = args.includes("--all");
const preferChangelog = args.includes("--changelog");
const write = args.includes("--write");
const tag = args.find((arg) => !arg.startsWith("--"));

/**
 * Release-notes heading → `CHANGELOG.md` section. Tooling-only categories
 * (tests, build, ci, chores) are deliberately absent: they never reach a
 * consumer, and listing them is what made the file read like a commit log.
 */
const CHANGELOG_SECTION = {
	"🚀 Features": "Added",
	"🔧 Fixes": "Fixed",
	"⚡ Performance": "Changed",
	"♻️ Refactors": "Changed",
	"📝 Documentation": "Changed",
};
const SECTION_ORDER = ["Added", "Changed", "Fixed", "Removed", "Security", "Breaking"];

/** Files whose prose pins a version number; refreshed so docs never go stale. */
const VERSIONED_DOCS = [
	"README.md",
	"docs/guides/getting-started.md",
	"docs/guides/roadmap.md",
	"docs/guides/filesystem.md",
];

function syncVersionRefs(version) {
	const patterns = [
		[/(katanakit-js@)\d+\.\d+\.\d+/g, `$1${version}`],
		[/(@)\d+\.\d+\.\d+(\/\+esm)/g, `$1${version}$2`],
		[/(as of )\d+\.\d+\.\d+/g, `$1${version}`],
		[/(katanakit-)\d+\.\d+\.\d+(\.tgz)/g, `$1${version}$2`],
	];

	for (const file of VERSIONED_DOCS) {
		const path = join(ROOT, file);
		if (!existsSync(path)) continue;
		const before = readFileSync(path, "utf8");
		const after = patterns.reduce((text, [re, rep]) => text.replace(re, rep), before);
		if (after !== before) {
			writeFileSync(path, after);
			console.log(`Version refs: ${file} → ${version}`);
		}
	}
}

/**
 * Inserts `## [X.Y.Z] - date` at the top of CHANGELOG.md, built from the
 * commits between the previous tag and this one. The file only ever lists
 * released versions — there is no `[Unreleased]` buffer to promote.
 */
function writeChangelog(release) {
	const file = join(ROOT, "CHANGELOG.md");
	const content = readFileSync(file, "utf8");
	if (new RegExp(`^## \\[${release.version.replace(/\./g, "\\.")}\\]`, "m").test(content)) {
		console.log(`Changelog: [${release.version}] already present — skipped`);
		return;
	}

	const bySection = new Map();
	const breaking = [];

	for (const section of release.sections) {
		const title = CHANGELOG_SECTION[section.title];
		if (!title) continue;
		for (const item of section.items) {
			const line = `- ${item.scope ? `**${item.scope}:** ` : ""}${item.message}`;
			if (item.breaking) breaking.push(line);
			else bySection.set(title, [...(bySection.get(title) ?? []), line]);
		}
	}

	const body = [
		...SECTION_ORDER.filter((t) => t !== "Breaking").flatMap((title) => {
			const items = bySection.get(title);
			return items?.length ? [`### ${title}`, "", ...items, ""] : [];
		}),
		...(breaking.length ? ["### Breaking", "", ...breaking, ""] : []),
	];
	if (body.length === 0) {
		body.push("### Changed", "", "- Tooling, documentation and test updates.", "");
	}

	const section = `## [${release.version}] - ${release.date}\n\n${body.join("\n").trimEnd()}\n\n`;
	const at = content.search(/^## \[/m);
	const updated =
		at === -1 ? `${content.trimEnd()}\n\n${section}` : content.slice(0, at) + section + content.slice(at);

	writeFileSync(file, updated);
	console.log(`Changelog: wrote [${release.version}]`);
}

if (all) {
	const releases = allTags().map(collect);
	process.stdout.write(`${JSON.stringify(releases, null, 2)}\n`);
} else if (write) {
	if (!tag) {
		console.error("Usage: node scripts/generate-release-notes.mjs <tag> --write");
		process.exit(1);
	}
	try {
		execFileSync("git", ["rev-parse", "-q", "--verify", `refs/tags/${tag}`], { cwd: ROOT });
	} catch {
		// Never block a publish because the tag is missing.
		console.warn(`write: tag ${tag} not found — changelog skipped`);
		process.exit(0);
	}
	const release = collect(tag);
	writeChangelog(release);
	// Docs must name the newest release, even when backfilling an older tag —
	// syncing against `release.version` would silently downgrade them.
	syncVersionRefs(allTags()[0].replace(/^v/, ""));
} else if (tag) {
	if (preferChangelog) {
		const body = changelogBody();
		if (body) {
			process.stdout.write(body);
			process.exit(0);
		}
	}
	const release = collect(tag);
	process.stdout.write(asJson ? `${JSON.stringify(release, null, 2)}\n` : renderMarkdown(release));
} else {
	console.error(
		"Usage: node scripts/generate-release-notes.mjs <tag> [--json] [--changelog] [--write] | --all [--json]",
	);
	process.exit(1);
}
