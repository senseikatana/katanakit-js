/**
 * Docs proxy Worker — mounts `katanakit-docs` Pages under `/en/docs/`.
 *
 * The Pages project already nests its build at `dist/en/docs/…` (see
 * `scripts/docs.mjs → mountUnderBase`), so every path is passed through
 * as-is. The Worker exists only because the apex zones serve other apps
 * and a Pages project cannot share a hostname with an unrelated origin.
 *
 * No mutation, no caching headers, no auth: pure reverse proxy.
 */

interface Env {
	/** Service Binding to the katanakit-docs Pages project. */
	DOCS_PAGES: Fetcher;
}

const PUBLIC_URL = "https://katanakit-docs.pages.dev";

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		// Only serve the /en/docs/ prefix; anything else is a 404 so the
		// zone's other routes are never shadowed.
		if (!url.pathname.startsWith("/en/docs")) {
			return new Response("Not found", { status: 404 });
		}

		// Prefer the Service Binding (no network hop, respects Workers'
		// internal routing). Fall back to the public URL when the binding
		// is unavailable (first deploy before the Pages project exists).
		try {
			const bound = await env.DOCS_PAGES.fetch(request);
			// Pages returns 404 for unknown paths; pass through so the
			// caller gets the generated 404 page rather than a bare Worker 404.
			return bound;
		} catch {
			// Binding not wired yet — HTTP fallback.
			const upstream = new URL(url.pathname + url.search, PUBLIC_URL);
			const upstreamRequest = new Request(upstream.href, {
				method: request.method,
				headers: request.headers,
				body: request.body,
				redirect: "follow",
			});
			return fetch(upstreamRequest);
		}
	},
} satisfies ExportedHandler<Env>;
