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
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "docs", ".vitepress", "dist");

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
	// Mirrors the first `_redirects` rule Pages applies at the root.
	if ((request.url ?? "/") === "/") {
		response.writeHead(301, { location: "/en/docs/" });
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
