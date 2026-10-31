/**
 * Example: Drizzle ORM with KatanaKit.
 *
 * Uses the built-in adapter — install the optional peers first:
 *
 *   bun add drizzle-orm pg
 *
 * The adapter ships a lazy singleton (`useDrizzleClient`), the
 * `conversations`/`messages` tables and a conversation store
 * (`useCreateDrizzleStore`) on `katanakit-js/adapters/drizzle`.
 */
import { useInitAssistant } from "katanakit-js";
import {
	conversations,
	useCreateDrizzleStore,
	useDrizzleClient,
} from "katanakit-js/adapters/drizzle";

/**
 * Example query: the five most recent conversations.
 * The client is resolved on first call, never at import time.
 */
export async function useRecentConversations() {
	const db = useDrizzleClient();
	return db.select().from(conversations).limit(5);
}

/** Example wiring: the assistant persists conversations in Postgres. */
export function useInitPersistentAssistant() {
	return useInitAssistant({ store: useCreateDrizzleStore() });
}
