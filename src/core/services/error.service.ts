import type { ApiError, ISerializedError } from "../../types/index.js";

/** Default error messages by HTTP status code. */
const ERROR_DEFAULTS: Record<number, string> = {
	400: "Bad Request",
	401: "Unauthorized",
	403: "Forbidden",
	404: "Not Found",
	500: "Internal Server Error",
};

/**
 * Serialize an error into a plain object.
 * Uses sensible defaults based on the status code when message is omitted.
 *
 * @param message - Error message (falls back to status code default)
 * @param code - HTTP status code (default: 400)
 * @returns Serialized error with message and code
 *
 * @example
 * ```ts
 * const err = useErrorSerialize("User not found", 404);
 * // { message: "User not found", code: 404 }
 *
 * const err2 = useErrorSerialize("", 500);
 * // { message: "Internal Server Error", code: 500 }
 * ```
 */
export function useErrorSerialize(message = "", code = 400): ISerializedError {
	return {
		message: message || ERROR_DEFAULTS[code] || "Error",
		code,
	};
}

/**
 * Create a custom error object. Use with `useLogger` for consistent error logging.
 *
 * @param msg - Error message
 * @param code - HTTP status code
 * @returns Serialized error with message and code
 *
 * @example
 * ```ts
 * import { useErrorCustom, useLogger } from "katanakit-js";
 *
 * const error = useErrorCustom("User not found", 404);
 * useLogger(error.message, error, "error");
 * // { message: "User not found", code: 404 }
 * ```
 */
export function useErrorCustom(msg: string, code: number): ISerializedError {
	return useErrorSerialize(msg, code);
}

/**
 * Normalizes any thrown value into the shared {@link ApiError} shape.
 *
 * Reads `message`, numeric `status` (or `statusCode`, used by some SDKs) and
 * `details` when present; every other value becomes a generic error. This is
 * the canonical mapper for `useAttempt()` at service boundaries.
 *
 * @param error - The caught value (`Error`, SDK error object, string, …).
 * @param fallbackStatus - Status used when the value has none (default: `0`).
 * @returns A serializable `{ message, status, details? }` error.
 *
 * @example
 * ```ts
 * import { useAttempt, useErrorNormalize } from "katanakit-js";
 *
 * const result = await useAttempt(() => sdk.call(), useErrorNormalize);
 * if (!result.ok) console.error(result.error.status, result.error.message);
 * ```
 */
export function useErrorNormalize(error: unknown, fallbackStatus = 0): ApiError {
	if (error && typeof error === "object") {
		const record = error as {
			message?: unknown;
			status?: unknown;
			statusCode?: unknown;
			details?: unknown;
		};
		const status =
			typeof record.status === "number"
				? record.status
				: typeof record.statusCode === "number"
					? record.statusCode
					: fallbackStatus;
		return {
			message: typeof record.message === "string" ? record.message : "Unknown error",
			status,
			details: record.details,
		};
	}
	return {
		message: typeof error === "string" ? error : "Unknown error",
		status: fallbackStatus,
	};
}
