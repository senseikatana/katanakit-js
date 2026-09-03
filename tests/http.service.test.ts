import { describe, expect, it, vi } from "vitest";

import {
	BUILD_URL,
	FETCH,
	GET_APIS,
	INIT,
} from "@/core/services/http.service";

describe("FetchApiManager", () => {
	it("builds a URL with path params and query params", () => {
		INIT({
			pokeapi: {
				baseUri: "https://pokeapi.co/api/v2",
				endpoints: { pokemonById: "/pokemon/:id/" },
			},
		});

		const url = BUILD_URL("pokeapi", "pokemonById", {
			params: { id: "pikachu" },
			query: { limit: 20 },
		});

		expect(url).toBe("https://pokeapi.co/api/v2/pokemon/pikachu/?limit=20");
	});

	it("encodes path params safely", () => {
		INIT({
			api: {
				baseUri: "https://example.com",
				endpoints: { user: "/users/:name" },
			},
		});

		const url = BUILD_URL("api", "user", { params: { name: "john doe/2024" } });

		expect(url).toBe("https://example.com/users/john%20doe%2F2024");
	});

	it("registers apis and exposes them", () => {
		INIT({ sample: { baseUri: "https://sample.com", endpoints: { all: "/all" } } });
		expect(GET_APIS().sample).toBeDefined();
	});

	it("throws for an unknown api", () => {
		expect(() => BUILD_URL("unknown-api", "anything")).toThrow(/is not registered/);
	});

	it("returns a safe result on a successful JSON response", async () => {
		INIT({ okApi: { baseUri: "https://example.com", endpoints: { list: "/list" } } });

		const fetchMock = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ items: [1, 2, 3] }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			}),
		);
		vi.stubGlobal("fetch", fetchMock);

		const result = await FETCH<{ items: number[] }>("okApi", "list");
		expect(result.ok).toBe(true);
		expect(result.data?.items).toEqual([1, 2, 3]);

		vi.unstubAllGlobals();
	});

	it("returns a safe error result on a 4xx response", async () => {
		INIT({ failApi: { baseUri: "https://example.com", endpoints: { missing: "/missing" } } });

		const fetchMock = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ error: "Not Found" }), {
				status: 404,
				headers: { "Content-Type": "application/json" },
			}),
		);
		vi.stubGlobal("fetch", fetchMock);

		const result = await FETCH("failApi", "missing");
		expect(result.ok).toBe(false);
		expect(result.error?.status).toBe(404);

		vi.unstubAllGlobals();
	});
});
