import { afterEach, describe, expect, it } from "vitest";

import {
	DrizzleConversationStore,
	useCreateDrizzleStore,
	useDrizzleClient,
} from "@/adapters/drizzle/index.js";

describe("drizzle adapter", () => {
	const originalDatabaseUrl = process.env.DATABASE_URL;

	afterEach(() => {
		if (originalDatabaseUrl === undefined) delete process.env.DATABASE_URL;
		else process.env.DATABASE_URL = originalDatabaseUrl;
	});

	it("exposes the ConversationStore contract from the factory", () => {
		const store = useCreateDrizzleStore();

		expect(Object.keys(store).sort()).toEqual([
			"useAppend",
			"useCreate",
			"useExists",
			"useGetHistory",
			"useReset",
		]);
		for (const method of Object.values(store)) expect(typeof method).toBe("function");
	});

	it("fails with a clear error when DATABASE_URL is missing (lazy client)", async () => {
		delete process.env.DATABASE_URL;

		await expect(DrizzleConversationStore.useExists("missing")).rejects.toThrow(/DATABASE_URL/);
	});

	it("memoizes the client once a URL is provided", () => {
		delete process.env.DATABASE_URL;

		const first = useDrizzleClient("postgresql://user:pass@localhost:5432/test");
		const second = useDrizzleClient();

		expect(second).toBe(first);
	});
});
