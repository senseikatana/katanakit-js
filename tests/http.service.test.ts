import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
	defineApiConfig,
	useBuildApiUrl,
	useBuildUrl,
	useFetch,
	useGetApis,
	useInit,
	useInitApis,
} from "@/core/services/http.service";

describe("FetchApiManager", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});
	it("builds a URL with path params and query params", () => {
		useInitApis({
			pokeapi: {
				baseUri: "https://pokeapi.co/api/v2",
				endpoints: { pokemonById: "/pokemon/:id/" },
			},
		});

		const url = useBuildUrl("pokeapi", "pokemonById", {
			params: { id: "pikachu" },
			query: { limit: 20 },
		});

		expect(url).toBe("https://pokeapi.co/api/v2/pokemon/pikachu/?limit=20");
	});

	it("encodes path params safely", () => {
		useInit({
			api: {
				baseUri: "https://example.com",
				endpoints: { user: "/users/:name" },
			},
		});

		const url = useBuildUrl("api", "user", { params: { name: "john doe/2024" } });

		expect(url).toBe("https://example.com/users/john%20doe%2F2024");
	});

	it("registers apis and exposes a shallow copy", () => {
		useInitApis({ sample: { baseUri: "https://sample.com", endpoints: { all: "/all" } } });
		const apis = useGetApis();
		expect(apis.sample).toBeDefined();
		apis.sample = { baseUri: "https://mutated.com", endpoints: {} };
		expect(useGetApis().sample?.baseUri).toBe("https://sample.com");
	});

	it("returns a config error (not network) for an unknown api", async () => {
		const result = await useFetch("unknown-api-xyz", "anything");
		expect(result.ok).toBe(false);
		expect(result.error?.message).toMatch(/Config Error/);
		expect(result.status).toBe(0);
	});

	it("returns a safe result on a successful JSON response", async () => {
		useInitApis({ okApi: { baseUri: "https://example.com", endpoints: { list: "/list" } } });

		const fetchMock = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ items: [1, 2, 3] }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			}),
		);
		vi.stubGlobal("fetch", fetchMock);

		const result = await useFetch<{ items: number[] }>("okApi", "list");
		expect(result.ok).toBe(true);
		expect(result.data?.items).toEqual([1, 2, 3]);

		vi.unstubAllGlobals();
	});

	it("returns a safe error result on a 4xx response with non-JSON body", async () => {
		useInitApis({ failApi: { baseUri: "https://example.com", endpoints: { missing: "/missing" } } });

		const fetchMock = vi.fn().mockResolvedValue(
			new Response("Not Found plain text", {
				status: 404,
				statusText: "Not Found",
				headers: { "Content-Type": "text/plain" },
			}),
		);
		vi.stubGlobal("fetch", fetchMock);

		const result = await useFetch("failApi", "missing");
		expect(result.ok).toBe(false);
		expect(result.error?.status).toBe(404);
		expect(result.status).toBe(404);
		expect(result.error?.details).toBe("Not Found plain text");

		vi.unstubAllGlobals();
	});

	it("handles 204 No Content without failing JSON parse", async () => {
		useInitApis({ emptyApi: { baseUri: "https://example.com", endpoints: { noop: "/noop" } } });

		const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
		vi.stubGlobal("fetch", fetchMock);

		const result = await useFetch("emptyApi", "noop");
		expect(result.ok).toBe(true);
		expect(result.status).toBe(204);
		expect(result.data).toBeNull();

		vi.unstubAllGlobals();
	});

	it("posts FormData without forcing JSON Content-Type", async () => {
		const { usePost } = await import("@/core/services/http.service");
		useInitApis({ upload: { baseUri: "https://example.com", endpoints: { file: "/upload" } } });

		const fetchMock = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ ok: true }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			}),
		);
		vi.stubGlobal("fetch", fetchMock);

		const form = new FormData();
		form.append("file", "hello");
		await usePost("upload", "file", form);

		expect(fetchMock).toHaveBeenCalledOnce();
		const init = fetchMock.mock.calls[0][1] as RequestInit;
		expect(init.body).toBe(form);
		expect(init.headers).toBeUndefined();
	});

	it("patches JSON bodies with application/json", async () => {
		const { usePatch } = await import("@/core/services/http.service");
		useInitApis({ api: { baseUri: "https://example.com", endpoints: { item: "/item" } } });

		const fetchMock = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ ok: true }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			}),
		);
		vi.stubGlobal("fetch", fetchMock);

		await usePatch("api", "item", { name: "x" });

		const init = fetchMock.mock.calls[0][1] as RequestInit;
		expect(init.method).toBe("PATCH");
		expect(init.body).toBe(JSON.stringify({ name: "x" }));
		expect(init.headers).toEqual({ "Content-Type": "application/json" });
	});
});

describe("defineApiConfig", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("registers API entries and hands them back on `config`", () => {
		const facade = defineApiConfig({
			defapi: { baseUri: "https://example.com", endpoints: { list: "/list" } },
		});

		expect(facade.config.defapi.baseUri).toBe("https://example.com");
		expect(useGetApis().defapi).toEqual({
			baseUri: "https://example.com",
			endpoints: { list: "/list" },
		});
	});

	it("keeps boolean flags off the registry but on `config`", () => {
		const facade = defineApiConfig({
			flagapi: { baseUri: "https://example.com", endpoints: { a: "/a" } },
			verbose: true,
		});

		expect(facade.config.verbose).toBe(true);
		expect("verbose" in useGetApis()).toBe(false);
		expect(useGetApis().flagapi).toBeDefined();
	});

	it("returns declared methods bound to `this.config`", () => {
		const facade = defineApiConfig({
			boundapi: { baseUri: "https://example.com", endpoints: { a: "/a" } },
			verbose: false,
			readFlag: function () {
				return this.config.verbose;
			},
			readBase: function () {
				return this.config.boundapi.baseUri;
			},
		});

		expect(facade.readFlag()).toBe(false);
		expect(facade.readBase()).toBe("https://example.com");
		// the methods are not registered as APIs
		expect("readFlag" in useGetApis()).toBe(false);
	});

	it("registers a declared method's API so it can fetch right away", async () => {
		const fetchMock = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ ok: true }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			}),
		);
		vi.stubGlobal("fetch", fetchMock);

		const facade = defineApiConfig({
			fetchapi: { baseUri: "https://example.com", endpoints: { ping: "/ping" } },
			ping: async function () {
				const { useFetch: run } = await import("@/core/services/http.service");
				return run("fetchapi", "ping");
			},
		});

		const result = await facade.ping();
		expect(result.ok).toBe(true);
		expect(fetchMock).toHaveBeenCalledOnce();
	});

	it("throws when a non-method object is not an API entry", () => {
		// Bypass the type checker to exercise the runtime guard JS consumers hit.
		const malformed = { bad: { nope: true } } as unknown as object;

		expect(() => defineApiConfig(malformed)).toThrow(/not an API entry/);
	});
});

describe("useFetch flat options", () => {
	const okJson = (payload: unknown): Response =>
		new Response(JSON.stringify(payload), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("builds the URL from top-level `params` and `query`", async () => {
		useInitApis({ flatapi: { baseUri: "https://example.com", endpoints: { byId: "/items/:id" } } });
		const fetchMock = vi.fn().mockResolvedValue(okJson({ ok: true }));
		vi.stubGlobal("fetch", fetchMock);

		await useFetch("flatapi", "byId", {
			method: "GET",
			params: { id: 7 },
			query: { limit: 2 },
		});

		const [url] = fetchMock.mock.calls[0] as [string];
		expect(url).toBe("https://example.com/items/7?limit=2");
	});

	it("still honours the legacy `urlOptions` nest", async () => {
		useInitApis({ legacyapi: { baseUri: "https://example.com", endpoints: { byId: "/items/:id" } } });
		const fetchMock = vi.fn().mockResolvedValue(okJson({ ok: true }));
		vi.stubGlobal("fetch", fetchMock);

		await useFetch("legacyapi", "byId", {
			urlOptions: { params: { id: 9 }, query: { limit: 1 } },
		});

		const [url] = fetchMock.mock.calls[0] as [string];
		expect(url).toBe("https://example.com/items/9?limit=1");
	});

	it("lets the flat form win when both are given", async () => {
		useInitApis({ bothapi: { baseUri: "https://example.com", endpoints: { byId: "/items/:id" } } });
		const fetchMock = vi.fn().mockResolvedValue(okJson({ ok: true }));
		vi.stubGlobal("fetch", fetchMock);

		await useFetch("bothapi", "byId", {
			params: { id: 1 },
			query: { limit: 5 },
			urlOptions: { params: { id: 2 }, query: { limit: 9 } },
		});

		const [url] = fetchMock.mock.calls[0] as [string];
		expect(url).toBe("https://example.com/items/1?limit=5");
	});

	it("keeps its own options out of the RequestInit passed to fetch", async () => {
		useInitApis({ cleanapi: { baseUri: "https://example.com", endpoints: { list: "/list" } } });
		const fetchMock = vi.fn().mockResolvedValue(okJson({ ok: true }));
		vi.stubGlobal("fetch", fetchMock);

		await useFetch("cleanapi", "list", {
			method: "GET",
			params: { a: 1 },
			query: { b: 2 },
			transform: (body) => body,
		});

		const init = fetchMock.mock.calls[0][1] as Record<string, unknown>;
		for (const key of ["params", "query", "ignoreDefaultQuery", "urlOptions", "transform"]) {
			expect(init).not.toHaveProperty(key);
		}
	});
});

describe("useFetch transform", () => {
	const okJson = (payload: unknown): Response =>
		new Response(JSON.stringify(payload), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	beforeEach(() => {
		useInitApis({
			transformapi: { baseUri: "https://example.com", endpoints: { raw: "/raw" } },
		});
	});

	it("maps the parsed body before returning it", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(okJson({ count: 3 })));

		const result = await useFetch<{ total: number }>("transformapi", "raw", {
			transform: (body) => ({ total: (body as { count: number }).count }),
		});

		expect(result.ok).toBe(true);
		expect(result.data).toEqual({ total: 3 });
	});

	it("returns a Safe Result instead of throwing when the transform fails", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(okJson({ any: true })));

		const result = await useFetch("transformapi", "raw", {
			transform: () => {
				throw new Error("boom");
			},
		});

		expect(result.ok).toBe(false);
		expect(result.error?.message).toBe("Transform Error: boom");
	});

	it("does not run the transform on an HTTP error", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("nope", { status: 500 })));
		const transform = vi.fn((body: unknown) => body);

		const result = await useFetch("transformapi", "raw", { transform });

		expect(result.ok).toBe(false);
		expect(result.status).toBe(500);
		expect(transform).not.toHaveBeenCalled();
	});
});

describe("useBuildApiUrl", () => {
	it("is the deprecated alias of useBuildUrl", () => {
		useInitApis({
			aliasapi: { baseUri: "https://example.com", endpoints: { byId: "/items/:id" } },
		});

		expect(useBuildApiUrl("aliasapi", "byId", { params: { id: 4 } })).toBe(
			useBuildUrl("aliasapi", "byId", { params: { id: 4 } }),
		);
	});
});
