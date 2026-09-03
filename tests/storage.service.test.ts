import { describe, expect, it } from "vitest";

import {
	useClearStorage,
	useGetStorage,
	useRemoveStorage,
	useSetStorage,
} from "@/infrastructure/storage/storage.service";

describe("StorageService (SSR in-memory fallback)", () => {
	it("stores and retrieves primitive values", () => {
		useSetStorage("theme", "dark");
		expect(useGetStorage("theme")).toBe("dark");
	});

	it("serializes and deserializes objects", () => {
		useSetStorage("user", { id: 1, name: "John" });
		expect(useGetStorage<{ id: number; name: string }>("user")).toEqual({
			id: 1,
			name: "John",
		});
	});

	it("removes a stored value", () => {
		useSetStorage("session-token", "abc123");
		useRemoveStorage("session-token");
		expect(useGetStorage("session-token")).toBeNull();
	});

	it("clears the storage", () => {
		useSetStorage("cache-key", "value");
		useClearStorage();
		expect(useGetStorage("cache-key")).toBeNull();
	});
});
