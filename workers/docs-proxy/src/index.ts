/**
 * Docs proxy Worker — mounts the docs Pages project under `/en/docs/` and
 * lands the site root on the language root (`/en/`).
 *
 * The Pages project already nests its build at `dist/en/docs/…` (see
 * `scripts/docs.mjs → mountUnderBase`), so every path is passed through
 * as-is. The Worker exists only because the apex zones serve other apps
 * and a Pages project cannot share a hostname with an unrelated origin.
 *
 * Routing contract (per zone):
 *   `/`        → 301 to `/en/` (the homepage is the language root — never
 *                the docs section and never another app)
 *   `/en`      → 301 to `/en/`
 *   `/en/`     → the docs landing page (VitePress writes absolute
 *                `/en/docs/…` asset URLs, so the page works unchanged)
 *   `/en/docs*` → proxied to Pages
 *
 * Everything else is a 404 from this Worker — but the route list in
 * `wrangler.jsonc` only captures the paths above, so the zone's other apps
 * never see this Worker.
 */

const PUBLIC_URL = "https://katanakit-docs.pages.dev";
const LANG_ROOT = "/en";
const DOCS_BASE = "/en/docs";

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);
		const { pathname, search } = url;

		// Site root → language root. Same-host redirect so the backup domain
		// keeps its own visitors.
		if (pathname === "/" || pathname === LANG_ROOT) {
			return Response.redirect(new URL(`${LANG_ROOT}/`, url).href, 301);
		}

		// Language root renders the docs landing page.
		if (pathname === `${LANG_ROOT}/`) {
			return fetch(`${PUBLIC_URL}${DOCS_BASE}/`, {
				headers: request.headers,
				redirect: "follow",
			});
		}

		// Docs content.
		if (pathname === DOCS_BASE || pathname.startsWith(`${DOCS_BASE}/`)) {
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
