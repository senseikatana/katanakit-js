import { useReply } from "../../core/services/assistant.service.js";
import { useLogger } from "../../core/services/logger.service.js";
import { useSleep } from "../../core/services/utils.service.js";
import type { AssistantResult, ConfigFacade } from "../../types/index.js";

/** Default Telegram Bot API base URL. */
export const TELEGRAM_API_BASE = "https://api.telegram.org";

/** Configuration for a Telegram bot. */
export interface TelegramConfig {
	token: string;
	apiBaseUrl?: string;
}

/** Callback producing an assistant reply for a channel session. */
export type TelegramReplyFn = (sessionId: string, text: string) => Promise<AssistantResult>;

/** Minimal inbound Telegram message shape. */
interface TelegramMessage {
	chat: { id: number };
	text?: string;
}

/** Options for the long-polling loop. */
export interface TelegramPollingOptions {
	intervalMs?: number;
	signal?: AbortSignal;
	reply?: TelegramReplyFn;
}

/**
 * TelegramService - Singleton para el bot de Telegram.
 *
 * Aplica el patrón Singleton: una única instancia centraliza la configuración,
 * el envío de mensajes y el bucle de polling. La configuración se registra una
 * sola vez y todas las operaciones comparten ese estado.
 *
 * @example
 * ```ts
 * TelegramService.getInstance().useInit({ token: process.env.TELEGRAM_BOT_TOKEN });
 * await TelegramService.getInstance().useSendMessage(chatId, "Hello");
 * ```
 */
export class TelegramService {
	private static instance: TelegramService;

	/** Module-level bot configuration. */
	private config: TelegramConfig | null = null;

	/**
	 * Constructor privado - enforce singleton.
	 */
	private constructor() {}

	/**
	 * Obtiene la instancia única del TelegramService (Singleton).
	 *
	 * @returns La instancia única de {@link TelegramService}.
	 */
	static getInstance(): TelegramService {
		if (!TelegramService.instance) {
			TelegramService.instance = new TelegramService();
		}
		return TelegramService.instance;
	}

	/** Retrieves the configured bot or throws. */
	private useGetConfig(): TelegramConfig {
		if (!this.config) {
			throw new Error("[Telegram] Not configured. Call defineTelegramConfig() first.");
		}
		return this.config;
	}

	/**
	 * Registers the Telegram bot configuration.
	 *
	 * @param cfg - Bot token (from BotFather) and optional API base URL.
	 *
	 * @example
	 * ```ts
	 * TelegramService.getInstance().useInit({ token: process.env.TELEGRAM_BOT_TOKEN });
	 * ```
	 */
	useInit(cfg: TelegramConfig): void {
		this.config = { ...cfg };
	}

	/**
	 * Sends a text message to a Telegram chat.
	 *
	 * @param chatId - Destination chat id.
	 * @param text - Message body.
	 * @returns The Telegram API response.
	 */
	async useSendMessage(chatId: number, text: string): Promise<Response> {
		const { token, apiBaseUrl } = this.useGetConfig();
		return fetch(`${apiBaseUrl ?? TELEGRAM_API_BASE}/bot${token}/sendMessage`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ chat_id: chatId, text }),
		});
	}

	/**
	 * Handles a single Telegram update: replies to inbound text messages.
	 *
	 * @param update - A Telegram update object (from `getUpdates` or a webhook).
	 * @param reply - Reply callback. Defaults to the assistant `useReply`.
	 *
	 * @example
	 * ```ts
	 * await TelegramService.getInstance().useHandleUpdate(update);
	 * ```
	 */
	async useHandleUpdate(update: unknown, reply: TelegramReplyFn = useReply): Promise<void> {
		const message = (update as { message?: TelegramMessage })?.message;
		if (!message?.text || message.text.trim() === "") return;

		const sessionId = `telegram:${message.chat.id}`;
		const result = await reply(sessionId, message.text);

		if (result.ok) {
			await this.useSendMessage(message.chat.id, result.data.reply);
		}
	}

	/**
	 * Starts the long-polling loop that keeps fetching and answering updates.
	 * Runs until the provided signal aborts (or forever).
	 *
	 * @param options - Polling cadence, abort signal and reply callback.
	 *
	 * @example
	 * ```ts
	 * await TelegramService.getInstance().useStartPolling();
	 * ```
	 */
	async useStartPolling(options: TelegramPollingOptions = {}): Promise<void> {
		const { intervalMs = 2000, signal, reply = useReply } = options;
		const { token, apiBaseUrl } = this.useGetConfig();
		const base = apiBaseUrl ?? TELEGRAM_API_BASE;

		let offset = 0;

		while (!signal?.aborted) {
			try {
				const response = await fetch(`${base}/bot${token}/getUpdates?timeout=30&offset=${offset}`, {
					signal,
				});

				if (!response.ok) {
					throw new Error(`getUpdates HTTP ${response.status}`);
				}

				const data = (await response.json()) as {
					ok: boolean;
					result?: Array<{ update_id: number }>;
				};

				for (const update of data.result ?? []) {
					offset = Math.max(offset, update.update_id + 1);
					await this.useHandleUpdate(update, reply);
				}
			} catch (error: unknown) {
				if (signal?.aborted) break;
				const message = error instanceof Error ? error.message : String(error);
				useLogger(`[Telegram] ${message}`, undefined, "error");
			}

			await useSleep(intervalMs);
		}
	}
}

/**
 * Registers the Telegram bot configuration - the config-file entry point.
 *
 * One call is the whole setup: the literal is registered and handed back on
 * `config`, so `export default defineTelegramConfig({ … })` is enough.
 *
 * @param input - Bot token (from BotFather) and optional API base URL.
 * @returns The registered config as a `ConfigFacade`.
 *
 * @example
 * ```ts
 * import { defineTelegramConfig } from "katanakit-js/adapters/telegram";
 *
 * export default defineTelegramConfig({ token: process.env.TELEGRAM_BOT_TOKEN });
 * ```
 */
export function defineTelegramConfig(input: TelegramConfig): ConfigFacade<TelegramConfig> {
	useInitTelegram(input);
	return { config: input };
}

/**
 * Registers the Telegram bot configuration.
 *
 * @deprecated Use {@link defineTelegramConfig}, which registers and returns
 * the config in one call.
 *
 * @param cfg - Bot token (from BotFather) and optional API base URL.
 *
 * @example
 * ```ts
 * useInitTelegram({ token: process.env.TELEGRAM_BOT_TOKEN });
 * ```
 */
export function useInitTelegram(cfg: TelegramConfig): void {
	TelegramService.getInstance().useInit(cfg);
}

/**
 * Sends a text message to a Telegram chat.
 *
 * @param chatId - Destination chat id.
 * @param text - Message body.
 * @returns The Telegram API response.
 */
export async function useTelegramSendMessage(chatId: number, text: string): Promise<Response> {
	return TelegramService.getInstance().useSendMessage(chatId, text);
}

/**
 * Handles a single Telegram update: replies to inbound text messages.
 *
 * @param update - A Telegram update object (from `getUpdates` or a webhook).
 * @param reply - Reply callback. Defaults to the assistant `useReply`.
 *
 * @example
 * ```ts
 * await useHandleTelegramUpdate(update);
 * ```
 */
export async function useHandleTelegramUpdate(
	update: unknown,
	reply: TelegramReplyFn = useReply,
): Promise<void> {
	return TelegramService.getInstance().useHandleUpdate(update, reply);
}

/**
 * Starts the long-polling loop that keeps fetching and answering updates.
 * Runs until the provided signal aborts (or forever).
 *
 * @param options - Polling cadence, abort signal and reply callback.
 *
 * @example
 * ```ts
 * useStartTelegramPolling();
 * ```
 */
export async function useStartTelegramPolling(options: TelegramPollingOptions = {}): Promise<void> {
	return TelegramService.getInstance().useStartPolling(options);
}
