/**
 * Docs proxy Worker — mounts the docs Pages project under `/docs/` on the apex
 * domain that already serves other applications.
 *
 * The Pages project nests its build at `dist/docs/…` (see `scripts/docs.mjs →
 * mountUnderBase`), so every content path is passed through as-is. The Worker
 * exists only because the apex zone serves other apps and a Pages project
 * cannot share a hostname with an unrelated origin.
 *
 * Routing contract (per zone):
 *   `/docs`      → 301 to `/docs/overview` (the home page's public URL)
 *   `/docs/`     → 301 to `/docs/overview`
 *   `/docs/overview*` → the docs landing page (the build serves it as the
 *                  section root `index.html`; this Worker owns the public URL)
 *   `/docs/*`    → proxied to Pages, path for path
 *   `/en/docs*`  → 301 to the canonical `/docs…` URLs (legacy links from
 *                  published npm READMEs)
 *
 * Everything else is a 404 from this Worker — but the route list in
 * `wrangler.jsonc` only captures the paths above, so the zone's other apps
 * never see this Worker.
 */

const PUBLIC_URL = "https://katanakit-docs.pages.dev";
const DOCS_BASE = "/docs";
const DOCS_HOME = "/docs/overview";

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);
		const { pathname, search } = url;

		// Legacy /en/docs* URLs (old READMEs, shared links) → canonical /docs*.
		if (pathname === "/en/docs" || pathname.startsWith("/en/docs/")) {
			const rest = pathname.slice("/en/docs".length);
			const target = rest === "" || rest === "/" ? DOCS_HOME : `${DOCS_BASE}${rest}`;
			return Response.redirect(new URL(target + search, url).href, 301);
		}

		// Section root → the home page's public URL.
		if (pathname === DOCS_BASE || pathname === `${DOCS_BASE}/`) {
			return Response.redirect(new URL(DOCS_HOME, url).href, 301);
		}

		// The home page is published at /docs/overview; the build serves it as
		// the section root, so alias the public URL onto it here.
		if (pathname === DOCS_HOME || pathname === `${DOCS_HOME}/` || pathname === `${DOCS_HOME}.html`) {
			return fetch(`${PUBLIC_URL}${DOCS_BASE}/`, {
				headers: request.headers,
				redirect: "follow",
			});
		}

		// Docs content.
		if (pathname.startsWith(`${DOCS_BASE}/`)) {
			return fetch(`${PUBLIC_URL}${pathname}${search}`, {
				method: request.method,
				headers: request.headers,
				body: request.body,
				redirect: "follow",
			});
		}

		return new Response("Not found", { status: 404 });
	},
} satisfies ExportedHandler;
