import { describe, expect, it } from "vitest";

import {
	CLEAR_STORAGE,
	GET_STORAGE,
	REMOVE_STORAGE,
	SET_STORAGE,
} from "@/infrastructure/storage/storage.service";

describe("StorageService (SSR in-memory fallback)", () => {
	it("stores and retrieves primitive values", () => {
		SET_STORAGE("theme", "dark");
		expect(GET_STORAGE("theme")).toBe("dark");
	});

	it("serializes and deserializes objects", () => {
		SET_STORAGE("user", { id: 1, name: "John" });
		expect(GET_STORAGE<{ id: number; name: string }>("user")).toEqual({
			id: 1,
			name: "John",
		});
	});

	it("removes a stored value", () => {
		SET_STORAGE("session-token", "abc123");
		REMOVE_STORAGE("session-token");
		expect(GET_STORAGE("session-token")).toBeNull();
	});

	it("clears the storage", () => {
		SET_STORAGE("cache-key", "value");
		CLEAR_STORAGE();
		expect(GET_STORAGE("cache-key")).toBeNull();
	});
});
