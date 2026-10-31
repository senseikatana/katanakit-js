/**
 * Framework-agnostic Drizzle ORM client singleton for KatanaKit.
 *
 * Provides a lazy-initialized Postgres client built with Drizzle ORM over
 * the node-postgres driver (`pg`), working in any Node.js or Bun
 * environment.
 *
 * ## Installation
 *
 * ```bash
 * # Runtime: Drizzle ORM + the node-postgres driver
 * bun add drizzle-orm pg
 *
 * # CLI (dev): migrations and studio
 * bun add -D drizzle-kit
 * ```
 *
 * ## Environment
 *
 * `DATABASE_URL` must be present in the process environment — this module
 * never loads `.env` files itself (no side effects on import):
 *
 * ```env
 * DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
 * ```
 *
 * Bun reads `.env` automatically; on Node run the app with
 * `node --env-file=.env`, or let your framework load it.
 *
 * ## Usage
 *
 * ```ts
 * import { useDrizzleClient } from "katanakit-js/adapters/drizzle";
 *
 * // Get the singleton client
 * const db = useDrizzleClient();
 *
 * // Query with the drizzle builder API
 * const rows = await db.select().from(conversations);
 * ```
 *
 * @module adapters/drizzle/use-drizzle
 */
import { drizzle } from "drizzle-orm/node-postgres";

/** Typed database client returned by {@link useDrizzleClient}. */
export type DrizzleClient = ReturnType<typeof drizzle>;

/** Module-level singleton instance. */
let client: DrizzleClient | null = null;

/**
 * Get the Drizzle database client singleton.
 * Creates the client on first call from `DATABASE_URL`.
 *
 * @param datasourceUrl - Optional database URL override (defaults to `process.env.DATABASE_URL`)
 * @returns Typed database client
 *
 * @example
 * ```ts
 * // Basic usage (reads DATABASE_URL from env)
 * const db = useDrizzleClient();
 * const rows = await db.select().from(conversations);
 *
 * // With a custom URL
 * const testDb = useDrizzleClient("postgresql://localhost:5432/test");
 * ```
 */
export function useDrizzleClient(datasourceUrl?: string): DrizzleClient {
	if (!client) {
		const url = datasourceUrl ?? process.env.DATABASE_URL;
		if (!url) {
			throw new Error(
				"[useDrizzleClient] DATABASE_URL is not set. Export it in the environment (Bun and `node --env-file=.env` read .env) or pass a URL.",
			);
		}
		client = drizzle(url);
	}

	return client;
}
