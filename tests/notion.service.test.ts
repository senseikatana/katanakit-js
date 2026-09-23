import { afterEach, describe, expect, it, vi } from "vitest";

import {
	useInitNotion,
	useNotionGetPage,
	useNotionSearchContent,
} from "@/adapters/notion/notion.service";

function jsonResponse(payload: unknown): Response {
	return new Response(JSON.stringify(payload), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("notion.service", () => {
	describe("useNotionGetPage", () => {
		it("returns the page on success", async () => {
			useInitNotion({ token: "secret_test" });
			vi.stubGlobal(
				"fetch",
				vi.fn().mockResolvedValue(
					jsonResponse({
						object: "page",
						id: "page-id",
						created_time: "2024-01-15T00:00:00.000Z",
						last_edited_time: "2024-01-16T00:00:00.000Z",
						created_by: { object: "user", id: "user-id" },
						last_edited_by: { object: "user", id: "user-id" },
						parent: { type: "page_id", page_id: "parent-id" },
						archived: false,
						url: "https://www.notion.so/page-id",
						properties: {},
					}),
				),
			);
			const result = await useNotionGetPage("page-id");
			expect(result.ok).toBe(true);
			if (result.ok) expect(result.data.id).toBe("page-id");
		});

		it("returns 502 for a malformed page payload", async () => {
			useInitNotion({ token: "secret_test" });
			vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ object: "page", id: 42 })));
			const result = await useNotionGetPage("page-id");
			expect(result.ok).toBe(false);
			if (!result.ok) {
				expect(result.status).toBe(502);
				expect(result.error.message).toMatch(/Notion Validation Error/);
			}
		});
	});

	describe("useNotionSearchContent", () => {
		it("returns 400 without fetch for an invalid filter value", async () => {
			useInitNotion({ token: "secret_test" });
			const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}));
			vi.stubGlobal("fetch", fetchMock);
			const result = await useNotionSearchContent({
				filter: { value: "nope", property: "object" },
			});
			expect(result.ok).toBe(false);
			if (!result.ok) expect(result.status).toBe(400);
			expect(fetchMock).not.toHaveBeenCalled();
		});
	});

	describe("useInitNotion", () => {
		it("throws for a bad config", () => {
			expect(() => useInitNotion({ token: 42 } as unknown as { token: string })).toThrow(
				/\[Notion\] Invalid config/,
			);
		});
	});
});
