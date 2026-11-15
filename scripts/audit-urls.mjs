/**
 * Audits every http(s) URL across tracked files in the repository.
 *
 * - Extracts URLs from git-tracked text files (excludes node_modules, dist, and this script).
 * - Skips templates/placeholders, localhost, RFC-reserved hosts, API bases, and test fixtures.
 * - Performs HEAD (fallback GET) with timeout + concurrency.
 * - Exits 1 on any URL that returns status >= 400.
 *
 * Usage: bun run audit:urls
 */
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

// Skip these URL patterns entirely (templates, placeholders, local, RFC-reserved, API bases, fixtures)
const SKIP_PATTERNS = [
	// Template/placeholder markers
	(u) => u.includes("${") || u.includes("<") || u.includes("{"),
	// Localhost and loopback
	(u) => /^https?:\/\/(127\.0\.0\.1|localhost)(:|$)/.test(u),
	// RFC 2606 / 6761 reserved test hosts
	(u) => /^https?:\/\/([^/]+\.)?example\.(com|org|net|test|invalid|localhost)(\/|$)/.test(u),
	(u) => /^https?:\/\/[^/]+\.(test|invalid|example)(\/|$)/.test(u),
	// Known non-resolving fixture hosts from the codebase
	(u) =>
		/^https?:\/\/([^/]+\.)?(katanakit\.dev|katanakit\.invalid|app\.insforge\.app|demo\.insforge\.app|x\.insforge\.app|appKey\.region\.insforge\.app|mysite\.com|fallback\.com|other\.dev|other\.com|mutated\.com|one\.dev|two\.dev|sample\.com|insecure\.example|cdn\.example\.com|auth\.example\.com|gateway\.example\.com|a\.example\.com|b\.example\.com)\b/.test(u),
	// Example.com used in JSDoc examples (not real endpoints)
	(u) => /^https?:\/\/example\.com([/?#]|$)/.test(u),
	// cdn/a.png is a test fixture in insforge tests
	(u) => u === "https://cdn/a.png",
	// API base URLs: return 4xx without auth/params/methods — not page URLs
	(u) => u.startsWith("https://www.googleapis.com/youtube/v3"),
	(u) => u.startsWith("https://api.notion.com/v1"),
	(u) => u.startsWith("https://api.cloudflare.com/client/v4"),
	(u) => u.startsWith("https://mcp.context7.com/mcp"),
	(u) => u.startsWith("https://dashscope-intl.aliyuncs.com/compatible-mode/v1"),
	(u) => u.startsWith("https://www.youtube.com/feeds/videos.xml"),
	// MCP endpoint (POST-only, GET returns 405)
	(u) => u === "https://mcp.context7.com/mcp",
	// Test fixtures and intentionally fake URLs
	(u) => u.startsWith("https://player.vimeo.com/video/"),
	(u) => u.startsWith("http://www.youtube.com/xml/schemas/"),
	(u) => u.startsWith("https://pokeapi.co/api/v2/pokemon/99999"),
	(u) => u.startsWith("https://github.com/your-org/"),
	// Deprecated Tailwind UI image URLs (site redirects to tailwindcss.com/plus/login)
	(u) => u.startsWith("https://tailwindui.com/img/"),
	// Wayback Machine references in comments (not page URLs to audit)
	(u) => u.startsWith("https://web.archive.org/"),
];

function shouldSkip(url) {
	for (const fn of SKIP_PATTERNS) {
		if (fn(url)) return true;
	}
	return false;
}

async function checkUrl(url, controller) {
	const timeout = 15000;
	const start = Date.now();

	// HEAD first
	let res;
	try {
		res = await fetch(url, {
			method: "HEAD",
			redirect: "follow",
			signal: controller.signal,
			headers: {
				"User-Agent": "Mozilla/5.0 (compatible; katanakit-url-audit/1.0)",
				Accept: "*/*",
			},
		});
	} catch (e) {
		// Network error or timeout — try GET as fallback
	}
	if (res && res.status < 400) {
		return { url, status: res.status, ok: true, ms: Date.now() - start };
	}
	if (res && (res.status >= 400 || res.status === 0)) {
		// Some servers don't support HEAD; fall through to GET
	}

	// GET fallback
	const getController = new AbortController();
	const getTimeout = setTimeout(() => getController.abort(), timeout);
	try {
		res = await fetch(url, {
			method: "GET",
			redirect: "follow",
			signal: getController.signal,
			headers: {
				"User-Agent": "Mozilla/5.0 (compatible; katanakit-url-audit/1.0)",
				Accept: "*/*",
			},
		});
	} catch (e) {
		clearTimeout(getTimeout);
		return { url, status: 0, ok: false, error: e instanceof Error ? e.message : String(e), ms: Date.now() - start };
	}
	clearTimeout(getTimeout);
	return { url, status: res.status, ok: res.status < 400, ms: Date.now() - start };
}

async function main() {
	// Extract unique URLs from git-tracked text files (exclude this script to avoid auditing its own patterns)
	const out = execFileSync("git", ["grep", "-n", "-I", "-E", "https?://", "--", ":(exclude)scripts/audit-urls.mjs"], {
		cwd: root,
		encoding: "utf8",
		maxBuffer: 1e9,
	});

	const pattern = /https?:\/\/[^\s"'`<>)\]}\]]+/g;
	const urlToFiles = new Map();

	for (const line of out.split("\n")) {
		if (!line) continue;
		const idx = line.indexOf(":");
		const rest = line.slice(idx + 1);
		const m = rest.match(pattern);
		if (!m) continue;
		for (const raw of m) {
			const url = raw.replace(/[.,;:!?'*]+$/, "");
			if (!urlToFiles.has(url)) urlToFiles.set(url, []);
			const file = line.slice(0, idx);
			const refs = urlToFiles.get(url);
			if (refs.length < 3) refs.push(file);
		}
	}

	const allUrls = [...urlToFiles.keys()];
	console.log(`audit-urls: discovered ${allUrls.length} unique URLs in tracked files`);

	// Filter
	const toCheck = [];
	const skipped = [];
	for (const url of allUrls) {
		if (shouldSkip(url)) {
			skipped.push({ url, reason: "skip-pattern" });
			continue;
		}
		toCheck.push(url);
	}

	console.log(`audit-urls: ${toCheck.length} to check, ${skipped.length} skipped`);

	if (skipped.length > 0) {
		const byReason = new Map();
		for (const s of skipped) {
			if (!byReason.has(s.reason)) byReason.set(s.reason, []);
			byReason.get(s.reason).push(s.url);
		}
		for (const [reason, urls] of byReason) {
			console.log(`  skip:${reason} (${urls.length})`);
		}
	}

	// Concurrent checks
	const concurrency = 8;
	const results = [];
	const errors = [];

	const controller = new AbortController();
	let index = 0;

	async function worker() {
		while (index < toCheck.length) {
			const i = index++;
			const url = toCheck[i];
			const result = await checkUrl(url, controller);
			results.push(result);

			if (result.ok) {
				process.stdout.write(".");
			} else {
				errors.push(result);
				process.stdout.write("!");
			}
		}
	}

	const workers = Array.from({ length: Math.min(concurrency, toCheck.length) }, () => worker());
	await Promise.all(workers);
	console.log(); // newline after progress dots

	// Report
	console.log("\n=== URL Audit Report ===");
	console.log(`Total unique URLs: ${allUrls.length}`);
	console.log(`Checked: ${toCheck.length}`);
	console.log(`Skipped: ${skipped.length}`);
	console.log(`OK (2xx/3xx): ${results.filter((r) => r.ok).length}`);
	console.log(`Failures: ${errors.length}`);

	if (errors.length > 0) {
		console.log("\n--- FAILURES ---");
		for (const r of errors) {
			const refs = urlToFiles.get(r.url) || [];
			const err = r.error ? ` error: ${r.error}` : "";
			console.log(`  ${r.status || "ERR"}${err} ${r.url}  (${refs[0]})`);
		}
		console.log("\naudit-urls: FAIL — broken URLs found");
		process.exit(1);
	}

	console.log("\naudit-urls: PASS — all checked URLs reachable");
}

main().catch((err) => {
	console.error("audit-urls: fatal error", err);
	process.exit(1);
});