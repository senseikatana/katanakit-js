/**
 * Drizzle table definitions for the assistant conversation store.
 *
 * Mirrors the Prisma contract (`src/prisma/schema.prisma`, tables
 * `conversations` and `messages`) so both integrations describe the same
 * database shape — switching adapters does not require a data migration.
 *
 * Column names stay camelCase on purpose: they match the Prisma schema
 * field names (`conversationId`, `createdAt`, …).
 */
import { pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";

/** Assistant conversation; `id` is a database-generated UUID. */
export const conversations = pgTable("conversations", {
	id: uuid("id").primaryKey().defaultRandom(),
	channel: text("channel"),
	createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
});

/** One message inside a conversation; deleting the conversation cascades. */
export const messages = pgTable("messages", {
	id: serial("id").primaryKey(),
	conversationId: uuid("conversationId")
		.notNull()
		.references(() => conversations.id, { onDelete: "cascade" }),
	role: text("role").notNull(),
	content: text("content").notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
});

/** Selected shape of a `conversations` row. */
export type ConversationRow = typeof conversations.$inferSelect;

/** Selected shape of a `messages` row. */
export type MessageRow = typeof messages.$inferSelect;
