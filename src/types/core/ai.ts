import type { z } from "zod";

import {
	AiFunctionCallSchema,
	AiMessageSchema,
	AiProviderConfigSchema,
	AiRoleSchema,
	AiToolCallSchema,
} from "@/schemas/ai.schema.js";
import {
	AgentDataSchema,
	AgentStepSchema,
	AiErrorSchema,
	AssistantReplySchema,
} from "@/schemas/core.schema.js";

import type { SafeResult } from "./http.js";

/** Role of a chat message in the OpenAI-compatible protocol. */
export type AiRole = z.infer<typeof AiRoleSchema>;

/** Function invocation requested by the model when using tools. */
export type AiFunctionCall = z.infer<typeof AiFunctionCallSchema>;

/** A single tool call emitted by the model (OpenAI-compatible wire shape). */
export type AiToolCall = z.infer<typeof AiToolCallSchema>;

/**
 * A chat message. `tool_calls` and `tool_call_id` use snake_case on purpose:
 * they mirror the OpenAI-compatible protocol so messages pass through unchanged.
 */
export type AiMessage = z.infer<typeof AiMessageSchema>;

/** Provider configuration for an OpenAI-compatible chat/agent endpoint. */
export type AiProviderConfig = z.infer<typeof AiProviderConfigSchema>;

/** Options for a single chat completion. */
export interface AiChatOptions {
	temperature?: number;
	maxTokens?: number;
	topP?: number;
	signal?: AbortSignal;
	/** Overrides the provider `systemPrompt` for this request. */
	systemPrompt?: string;
}

/** Safe error returned on non-2xx or network failures. */
export type AiError = z.infer<typeof AiErrorSchema>;

/** Safe result (discriminated union) without throwing. */
export type AiResult<T = string> = SafeResult<T, AiError>;

/**
 * A tool the agent can invoke. `parameters` is a JSON Schema object
 * describing the expected input.
 */
export interface AiTool {
	name: string;
	description: string;
	parameters: Record<string, unknown>;
	execute(input: unknown): unknown | Promise<unknown>;
}

/** One round of tool execution inside the agent loop. */
export type AgentStep = z.infer<typeof AgentStepSchema>;

/** Payload returned by a successful {@link useRunAgent} call. */
export type AgentData = z.infer<typeof AgentDataSchema>;

/** Safe result of an agent run. */
export type AgentResult = AiResult<AgentData>;

/** Options for running the tool-calling agent loop. */
export interface AgentRunOptions extends AiChatOptions {
	tools?: AiTool[];
	maxSteps?: number;
	/** Prior conversation (system messages are ignored; a system prompt is prepended). */
	history?: AiMessage[];
}

/** Contract of the AI/agent facade. */
export interface IAiService {
	useInitAgent(config: Partial<AiProviderConfig>): void;
	useChat(messages: AiMessage[], options?: AiChatOptions): Promise<AiResult<string>>;
	useRunAgent(goal: string, options?: AgentRunOptions): Promise<AgentResult>;
}

/** Persistence contract for assistant conversations. */
export interface ConversationStore {
	useCreate(channel?: string): Promise<string>;
	useExists(sessionId: string): Promise<boolean>;
	useAppend(sessionId: string, message: AiMessage): Promise<void>;
	useGetHistory(sessionId: string): Promise<AiMessage[]>;
	useReset(sessionId: string): Promise<void>;
}

/** Configuration for the assistant facade. */
export interface AssistantInitConfig extends Partial<AiProviderConfig> {
	store?: ConversationStore;
	tools?: AiTool[];
	maxSteps?: number;
}

/** Options for a single assistant reply. */
export interface AssistantReplyOptions extends AiChatOptions {
	tools?: AiTool[];
	maxSteps?: number;
}

/** Payload returned by a successful assistant reply. */
export type AssistantReply = z.infer<typeof AssistantReplySchema>;

/** Safe result of an assistant reply. */
export type AssistantResult = AiResult<AssistantReply>;

/** Contract of the assistant facade. */
export interface IAssistantService {
	useInitAssistant(config?: AssistantInitConfig): void;
	useReply(
		sessionId: string | undefined,
		text: string,
		options?: AssistantReplyOptions,
	): Promise<AssistantResult>;
	useCreateSession(channel?: string): Promise<string>;
	useSessionExists(sessionId: string): Promise<boolean>;
	useGetHistory(sessionId: string): Promise<AiMessage[]>;
	useResetSession(sessionId: string): Promise<void>;
}
