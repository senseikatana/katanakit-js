import { asc, eq } from "drizzle-orm";

import type { AiMessage, AiRole, ConversationStore } from "@/types/index.js";

import { conversations, messages } from "./schema.js";
import { useDrizzleClient } from "./use-drizzle.js";

/**
 * Drizzle-backed conversation store for the assistant.
 *
 * Persists conversations and messages so history survives restarts. Requires
 * `DATABASE_URL` to be set and the tables to exist — push them with
 * `drizzle-kit push` or the migrations generated from the
 * `conversations`/`messages` tables in `src/adapters/drizzle/schema.ts`.
 *
 * The client is resolved lazily on first use so that importing
 * `katanakit-js/adapters/drizzle` never throws when `DATABASE_URL` is absent.
 */
export function useCreateDrizzleStore(): ConversationStore {
	let client: ReturnType<typeof useDrizzleClient> | null = null;

	const getDb = (): ReturnType<typeof useDrizzleClient> => (client ??= useDrizzleClient());

	const useCreate = async (channel?: string): Promise<string> => {
		const rows = await getDb()
			.insert(conversations)
			.values(channel ? { channel } : {})
			.returning({ id: conversations.id });
		return rows[0].id;
	};

	const useExists = async (sessionId: string): Promise<boolean> => {
		const rows = await getDb()
			.select({ id: conversations.id })
			.from(conversations)
			.where(eq(conversations.id, sessionId))
			.limit(1);
		return rows.length > 0;
	};

	const useAppend = async (sessionId: string, message: AiMessage): Promise<void> => {
		await getDb()
			.insert(messages)
			.values({
				conversationId: sessionId,
				role: message.role,
				content: message.content ?? "",
			});
	};

	const useGetHistory = async (sessionId: string): Promise<AiMessage[]> => {
		const rows = await getDb()
			.select({ role: messages.role, content: messages.content })
			.from(messages)
			.where(eq(messages.conversationId, sessionId))
			.orderBy(asc(messages.createdAt), asc(messages.id));

		return rows.map((row) => ({
			role: row.role as AiRole,
			content: row.content,
		}));
	};

	const useReset = async (sessionId: string): Promise<void> => {
		await getDb().delete(conversations).where(eq(conversations.id, sessionId));
	};

	return { useCreate, useExists, useAppend, useGetHistory, useReset };
}

/** Shared default store backed by the Drizzle client. */
export const DrizzleConversationStore: ConversationStore = useCreateDrizzleStore();
