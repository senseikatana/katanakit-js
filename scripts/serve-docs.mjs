#!/usr/bin/env node
/**
 * Serves `docs/.vitepress/dist` the way Cloudflare Pages does: at the domain
 * root, with the docs mounted under `/en/docs/`.
 *
 * `vitepress preview` mounts the output at VitePress' `base`, which would look
 * for `dist/en/docs/en/docs/…` now that the build is nested for Pages. This
 * server reads the same tree Pages sees, resolves clean URLs (`/x` → `x.html`)
 * and falls back to the generated 404 page.
 *
 * Usage: `node scripts/serve-docs.mjs [--port 4173] [--host]`
 */
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "docs", ".vitepress", "dist");

/**
 * Cloudflare Pages applies `dist/_redirects` before serving; the preview must
 * do the same or a legacy URL 404s locally while it 301s in production.
 * Only the literal `from`/`to`/`status` form used in this project is parsed.
 */
function loadRedirects() {
	const file = join(DIST, "_redirects");
	if (!existsSync(file)) return [];
	return readFileSync(file, "utf8")
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line && !line.startsWith("#"))
		.map((line) => line.split(/\s+/))
		.filter((parts) => parts.length >= 2 && /^\d{3}$/.test(parts[2] ?? "301"))
		.map(([from, to, status]) => ({ from, to, status: Number(status ?? 301) }));
}

/** Expands `:splat` in the destination, Cloudflare-style. */
function applyRedirect(pathname, rules) {
	for (const rule of rules) {
		if (rule.from.includes("*")) {
			const [prefix, suffix = ""] = rule.from.split("*");
			if (!pathname.startsWith(prefix) || !pathname.endsWith(suffix)) continue;
			const splat = pathname.slice(prefix.length, pathname.length - suffix.length);
			return rule.to.replace(":splat", splat);
		}
		if (pathname === rule.from) return rule.to;
		if (pathname === `${rule.from}/`) return rule.to;
	}
	return null;
}

const redirects = loadRedirects();

const args = process.argv.slice(2);
const portIndex = args.indexOf("--port");
const port = Number(portIndex === -1 ? process.env.DOCS_PORT ?? 4173 : args[portIndex + 1]);
const host = args.includes("--host") ? "0.0.0.0" : "127.0.0.1";

const TYPES = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".mjs": "text/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".map": "application/json; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".webp": "image/webp",
	".ico": "image/x-icon",
	".woff": "font/woff",
	".woff2": "font/woff2",
	".txt": "text/plain; charset=utf-8",
	".xml": "application/xml; charset=utf-8",
};

/** Resolves a URL pathname to a file inside DIST, or null. */
function resolveFile(urlPath) {
	let pathname;
	try {
		pathname = decodeURIComponent(urlPath.split("?")[0] ?? "/");
	} catch {
		return null;
	}
	const target = resolve(DIST, `.${normalize(pathname)}`);
	if (target !== DIST && !target.startsWith(`${DIST}${sep}`)) return null;

	const candidates = [];
	if (pathname.endsWith("/")) candidates.push(join(target, "index.html"));
	else {
		candidates.push(target);
		if (!extname(target)) candidates.push(`${target}.html`, join(target, "index.html"));
	}
	return candidates.find((file) => existsSync(file) && statSync(file).isFile()) ?? null;
}

const server = createServer((request, response) => {
	// Mirrors `_redirects` exactly as Pages applies it, so legacy URLs behave
	// the same locally (301) as they do in production.
	const redirect = applyRedirect((request.url ?? "/").split("?")[0], redirects);
	if (redirect) {
		response.writeHead(301, { location: redirect });
		response.end();
		return;
	}
	const file = resolveFile(request.url ?? "/");
	if (!file) {
		const notFound = join(DIST, "404.html");
		response.writeHead(404, { "content-type": TYPES[".html"] });
		if (existsSync(notFound)) createReadStream(notFound).pipe(response);
		else response.end("Not found");
		return;
	}
	response.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
	createReadStream(file).pipe(response);
});

server.listen(port, host, () => {
	console.log(`docs: preview at http://localhost:${port}/en/docs/`);
});

const stop = () => server.close(() => process.exit(0));
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
