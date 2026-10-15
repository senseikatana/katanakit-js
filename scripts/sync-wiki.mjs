#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, posix, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DOCS_ORIGIN = "https://docs.senseikatana.com";
const REPOSITORY = process.env.GITHUB_REPOSITORY ?? "senseikatana/katanakit-js";
const MANIFEST = ".katanakit-wiki-manifest.json";

export function wikiPageName(sourcePath) {
	if (sourcePath === "README.md") return "Home";
	return sourcePath
		.replace(/\.md$/i, "")
		.split("/")
		.map((part) => (part === "index" ? part : part.charAt(0).toUpperCase() + part.slice(1)))
		.join("-");
}

function sourceFiles() {
	return execFileSync(
		"git",
		["ls-files", "-z", "README.md", "docs", "examples", "packages/ui"],
		{ cwd: ROOT, encoding: "utf8" },
	)
		.split("\0")
		.filter(
			(file) =>
				file.endsWith(".md") &&
				(file === "README.md" ||
					file.startsWith("docs/") ||
					file.startsWith("examples/") ||
					file.startsWith("packages/ui/")),
		)
		.sort();
}

function splitFrontmatter(markdown) {
	const match = /^---\r?\n([\s\S]*?)\r?\n---\s*/.exec(markdown);
	if (!match) return { title: undefined, content: markdown };
	const title = /^title:\s*["']?(.+?)["']?\s*$/m.exec(match[1])?.[1];
	return { title, content: markdown.slice(match[0].length) };
}

function pageTitle(sourcePath, content) {
	if (sourcePath === "docs/index.md") return "Documentation";
	const { title } = splitFrontmatter(content);
	if (title) return title;
	return /^#\s+(.+)$/m.exec(content)?.[1] ?? wikiPageName(sourcePath).replaceAll("-", " ");
}

function sourcePageTargets(sourcePath, destination, pagesBySource) {
	let rawPath = destination;
	let suffix = "";
	let docsRootPath = false;

	if (/^https?:\/\//i.test(destination)) {
		let url;
		try {
			url = new URL(destination);
		} catch {
			return null;
		}
		if (url.origin !== DOCS_ORIGIN) return null;
		rawPath = url.pathname;
		suffix = `${url.search}${url.hash}`;
		docsRootPath = true;
	} else {
		const suffixIndex = destination.search(/[?#]/);
		if (suffixIndex !== -1) {
			rawPath = destination.slice(0, suffixIndex);
			suffix = destination.slice(suffixIndex);
		}
		if (!rawPath || rawPath.startsWith("#")) return null;
		docsRootPath = rawPath.startsWith("/");
	}

	let decodedPath = rawPath;
	try {
		decodedPath = decodeURIComponent(rawPath);
	} catch {
		return null;
	}

	const resolvedPath = docsRootPath
		? posix.normalize(posix.join("docs", decodedPath.replace(/^\/+/, "")))
		: posix.normalize(posix.join(posix.dirname(sourcePath), decodedPath));
	if (resolvedPath === "docs" && docsRootPath) {
		const page = pagesBySource.get("docs/index.md");
		return page ? `${page}${suffix}` : null;
	}

	const candidates = /\.md$/i.test(resolvedPath)
		? [resolvedPath]
		: [`${resolvedPath}.md`, posix.join(resolvedPath, "index.md")];
	for (const candidate of candidates) {
		const page = pagesBySource.get(candidate);
		if (page) return `${page}${suffix}`;
	}

	if (docsRootPath) {
		const pathname = decodedPath.startsWith("/") ? decodedPath : `/${decodedPath}`;
		return `${DOCS_ORIGIN}${pathname}${suffix}`;
	}

	return null;
}

function rewriteDestination(sourcePath, destination, pagesBySource) {
	if (/^(?:[a-z][a-z\d+.-]*:|#|\/\/)/i.test(destination)) {
		if (/^https?:\/\//i.test(destination)) {
			return sourcePageTargets(sourcePath, destination, pagesBySource) ?? destination;
		}
		return destination;
	}

	const wikiTarget = sourcePageTargets(sourcePath, destination, pagesBySource);
	if (wikiTarget) return wikiTarget;

	const suffixIndex = destination.search(/[?#]/);
	const rawPath = suffixIndex === -1 ? destination : destination.slice(0, suffixIndex);
	const suffix = suffixIndex === -1 ? "" : destination.slice(suffixIndex);
	if (rawPath.startsWith("/")) return `${DOCS_ORIGIN}${rawPath}${suffix}`;

	const localPath = posix.normalize(posix.join(posix.dirname(sourcePath), rawPath));
	if (sourcePath.startsWith("docs/")) {
		const publicPath = localPath.startsWith("docs/public/")
			? localPath.slice("docs/public".length)
			: localPath.startsWith("docs/")
				? `/${localPath.slice("docs/".length)}`
				: null;
		return publicPath ? `${DOCS_ORIGIN}${publicPath}${suffix}` : destination;
	}

	if (!localPath.startsWith("../")) {
		return `https://github.com/${REPOSITORY}/blob/main/${localPath}${suffix}`;
	}
	return destination;
}

export function rewriteMarkdownLinks(markdown, sourcePath, pagesBySource) {
	return markdown.replace(
		/(`{3,}[\s\S]*?`{3,}|~{3,}[\s\S]*?~{3,}|`+[^`\n]*`+)/g,
		(code) => `\u0000${Buffer.from(code).toString("base64")}\u0000`,
	).replace(/(!?\[[^\]]*\]\()([^)]+)(\))/g, (match, start, rawDestination, end) => {
		const destinationMatch = /^(\S+)([\s\S]*)$/.exec(rawDestination);
		if (!destinationMatch) return match;
		const [, destination, trailing] = destinationMatch;
		const normalizedDestination =
			destination.startsWith("<") && destination.endsWith(">")
				? destination.slice(1, -1)
				: destination;
		const rewritten = rewriteDestination(sourcePath, normalizedDestination, pagesBySource);
		const formatted = destination.startsWith("<") ? `<${rewritten}>` : rewritten;
		return `${start}${formatted}${trailing}${end}`;
	}).replace(/\u0000([A-Za-z\d+/=]+)\u0000/g, (_match, code) =>
		Buffer.from(code, "base64").toString("utf8"),
	);
}

function cleanPage(sourcePath, content, pagesBySource) {
	let { content: body } = splitFrontmatter(content);
	body = body.replace(/<script setup(?:\s[^>]*)?>[\s\S]*?<\/script>\s*/g, "");
	if (sourcePath === "docs/index.md") {
		return [
			"# Documentation",
			"",
			"Browse the KatanaKit guides, tutorials, design notes and UI Kit references.",
			"",
			`- [Getting Started](${pagesBySource.get("docs/guides/getting-started.md")})`,
			`- [First API Client Tutorial](${pagesBySource.get("docs/tutorials/first-api-client.md")})`,
			`- [Services](${pagesBySource.get("docs/guides/services/index.md")})`,
			`- [Architecture](${pagesBySource.get("docs/guides/architecture.md")})`,
			`- [Explanation and decisions](${pagesBySource.get("docs/explanation/index.md")})`,
			`- [UI Kit](${pagesBySource.get("docs/ui-kit/index.md")})`,
			"",
			`The complete documentation site and generated API reference are available at [docs.senseikatana.com](${DOCS_ORIGIN}/).`,
			"",
		]
			.join("\n")
			.trimEnd()
			.concat("\n");
	}
	return `${rewriteMarkdownLinks(body, sourcePath, pagesBySource).trimEnd()}\n`;
}

function sidebar(pages, pagesBySource) {
	const sections = [
		{
			title: "Start here",
			sources: [
				"README.md",
				"docs/index.md",
				"docs/guides/getting-started.md",
				"docs/tutorials/first-api-client.md",
			],
		},
		{
			title: "Guides",
			sources: pages
				.filter(
					({ source }) =>
						source.startsWith("docs/guides/") &&
						source !== "docs/guides/getting-started.md" &&
						source !== "docs/guides/index.md",
				)
				.map(({ source }) => source),
		},
		{
			title: "Explanation",
			sources: pages
				.filter(({ source }) => source.startsWith("docs/explanation/"))
				.map(({ source }) => source),
		},
		{
			title: "UI Kit",
			sources: pages
				.filter(({ source }) => source.startsWith("docs/ui-kit/"))
				.map(({ source }) => source),
		},
		{
			title: "Examples and packages",
			sources: pages
				.filter(({ source }) => source.startsWith("examples/") || source.startsWith("packages/"))
				.map(({ source }) => source),
		},
	];

	return sections
		.map(({ title, sources }) => {
			const links = [...new Set(sources)]
				.filter((source) => pagesBySource.has(source))
				.map((source) => {
					const page = pages.find((entry) => entry.source === source);
					return `  * [${page.title}](${pagesBySource.get(source)})`;
				});
			return links.length ? [`* **${title}**`, ...links].join("\n") : "";
		})
		.filter(Boolean)
		.join("\n\n");
}

function loadPreviousManifest(output) {
	const path = join(output, MANIFEST);
	if (!existsSync(path)) return [];
	try {
		const parsed = JSON.parse(readFileSync(path, "utf8"));
		return Array.isArray(parsed.pages)
			? parsed.pages.filter(
					(page) => typeof page === "string" && page.endsWith(".md") && !page.includes("/"),
				)
			: [];
	} catch (error) {
		throw new Error(`Cannot read ${MANIFEST}; refusing to prune generated Wiki pages.`, {
			cause: error,
		});
	}
}

export function generateWiki(outputPath) {
	const output = resolve(ROOT, outputPath);
	if (output === ROOT || !existsSync(output)) {
		throw new Error(`Wiki output directory must exist and must not be the repository root: ${output}`);
	}

	const sources = sourceFiles();
	const pagesBySource = new Map(sources.map((source) => [source, wikiPageName(source)]));
	const pageNamesBySource = new Map();
	for (const [source, page] of pagesBySource) {
		const previous = pageNamesBySource.get(page);
		if (previous) {
			throw new Error(`Wiki page name collision: ${previous} and ${source} both map to ${page}.`);
		}
		pageNamesBySource.set(page, source);
	}
	const pages = sources.map((source) => {
		const content = readFileSync(join(ROOT, source), "utf8");
		const title = pageTitle(source, content);
		return {
			source,
			name: pagesBySource.get(source),
			title,
			content: cleanPage(source, content, pagesBySource),
		};
	});
	const pageNames = pages.map(({ name }) => `${name}.md`);
	const managedPages = [...pageNames, "_Sidebar.md"];

	for (const stalePage of loadPreviousManifest(output)) {
		if (!managedPages.includes(stalePage)) rmSync(join(output, stalePage), { force: true });
	}

	for (const page of pages) {
		writeFileSync(join(output, `${page.name}.md`), page.content);
	}
	writeFileSync(join(output, "_Sidebar.md"), `${sidebar(pages, pagesBySource).trimEnd()}\n`);
	writeFileSync(
		join(output, MANIFEST),
		`${JSON.stringify({ pages: managedPages }, null, 2)}\n`,
	);
	console.log(`wiki: generated ${pages.length} pages and a sidebar in ${output}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
	const output = process.argv[2];
	if (!output) {
		console.error("Usage: node scripts/sync-wiki.mjs <existing-wiki-directory>");
		process.exitCode = 1;
	} else {
		try {
			generateWiki(output);
		} catch (error) {
			console.error(`wiki: ${error instanceof Error ? error.message : String(error)}`);
			process.exitCode = 1;
		}
	}
}
