/**
 * Docs proxy Worker — mounts `katanakit-docs` Pages under `/en/docs/`.
 *
 * The Pages project already nests its build at `dist/en/docs/…` (see
 * `scripts/docs.mjs → mountUnderBase`), so every path is passed through
 * as-is. The Worker exists only because the apex zones serve other apps
 * and a Pages project cannot share a hostname with an unrelated origin.
 *
 * Pure reverse proxy: fetch the public Pages URL and pass the response
 * through (redirects included — Pages' own `_redirects` still applies).
 */

const PUBLIC_URL = "https://katanakit-docs.pages.dev";

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);

		// Only serve the /en/docs prefix; anything else is a 404 so the
		// zone's other routes are never shadowed.
		if (!url.pathname.startsWith("/en/docs")) {
			return new Response("Not found", { status: 404 });
		}

		const upstream = new URL(url.pathname + url.search, PUBLIC_URL);
		return fetch(upstream.href, {
			method: request.method,
			headers: request.headers,
			body: request.body,
			redirect: "follow",
		});
	},
} satisfies ExportedHandler;
