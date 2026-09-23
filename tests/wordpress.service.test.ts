import { afterEach, describe, expect, it, vi } from "vitest";

import {
	useInitWordPress,
	useWpCreatePost,
	useWpGetPosts,
} from "@/adapters/wordpress/wordpress.service";

function jsonResponse(payload: unknown): Response {
	return new Response(JSON.stringify(payload), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("wordpress.service", () => {
	it("lists posts and returns titles", async () => {
		useInitWordPress({ baseUrl: "https://example.com" });
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(jsonResponse([{ id: 1, title: { rendered: "Hello World" } }])),
		);
		const result = await useWpGetPosts({ per_page: 5 });
		expect(result.ok).toBe(true);
		if (result.ok) expect(result.data[0]?.title?.rendered).toBe("Hello World");
	});

	it("rejects malformed list payloads with 502", async () => {
		useInitWordPress({ baseUrl: "https://example.com" });
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ items: "nope" })));
		const result = await useWpGetPosts();
		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.status).toBe(502);
	});

	it("rejects array items with wrong types with 502", async () => {
		useInitWordPress({ baseUrl: "https://example.com" });
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse([{ id: "nan" }])));
		const result = await useWpGetPosts();
		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.status).toBe(502);
	});

	it("rejects create post without title with 400 and no fetch", async () => {
		useInitWordPress({ baseUrl: "https://example.com" });
		const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}));
		vi.stubGlobal("fetch", fetchMock);
		const result = await useWpCreatePost({ content: "No title" } as never);
		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.status).toBe(400);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("throws on invalid init config", () => {
		expect(() => useInitWordPress({} as never)).toThrow();
	});
});
