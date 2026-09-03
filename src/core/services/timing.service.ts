import { useLog } from "./logger.service.js";

import type { IntervalControl, TimeoutControl } from "../../types/index.js";

type TimerId = ReturnType<typeof setTimeout>;

/**
 * Timing utilities: delays, debouncing, throttling and timeouts.
 * Implemented as a Singleton facade with factory methods.
 */
export default class TimingService {
	private static instance: TimingService;

	private constructor() {}

	public static getInstance(): TimingService {
		if (!TimingService.instance) {
			TimingService.instance = new TimingService();
		}
		return TimingService.instance;
	}

	public useDelay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

	/** Alias for delay, more semantic for sleep operations. */
	public useSleep = (ms: number): Promise<void> => this.useDelay(ms);

	public useSetTimeout = <T>(callback: () => T | Promise<T>, ms: number): TimeoutControl<T> => {
		let timerId: TimerId;
		let isCancelled = false;

		const promise = new Promise<T>((resolve, reject) => {
			timerId = setTimeout(async () => {
				if (isCancelled) return;

				try {
					const result = await callback();
					resolve(result);
				} catch (error) {
					reject(error);
				}
			}, ms);
		});

		const cancel = () => {
			isCancelled = true;
			clearTimeout(timerId);
		};

		return { promise, cancel };
	};

	public useInterval = (
		callback: () => void | Promise<void>,
		ms: number,
		immediate = false,
	): IntervalControl => {
		let timerId: TimerId | null = null;
		let isPaused = false;
		let isStopped = false;
		let isExecuting = false;

		const execute = async () => {
			if (isPaused || isStopped || isExecuting) return;

			isExecuting = true;
			try {
				await callback();
			} catch (error) {
				useLog("error", "[interval] Callback error:", error);
			} finally {
				isExecuting = false;
			}
		};

		const scheduleNext = () => {
			if (isStopped || isPaused) return;
			timerId = setTimeout(async () => {
				await execute();
				scheduleNext();
			}, ms);
		};

		const stop = () => {
			isStopped = true;
			isPaused = false;
			if (timerId) {
				clearTimeout(timerId);
				timerId = null;
			}
		};

		const pause = () => {
			if (isStopped) return;
			isPaused = true;
			if (timerId) {
				clearTimeout(timerId);
				timerId = null;
			}
		};

		const resume = () => {
			if (isStopped || !isPaused) return;
			isPaused = false;
			scheduleNext();
		};

		const isRunning = () => !isStopped && !isPaused;

		if (immediate) {
			execute().then(() => scheduleNext());
		} else {
			scheduleNext();
		}

		return { pause, resume, stop, isRunning };
	};

	public useDebounce = <T extends (...args: unknown[]) => unknown>(
		func: T,
		delayMs: number,
	): ((...args: Parameters<T>) => void) => {
		let timeoutId: TimerId | undefined;

		return (...args: Parameters<T>) => {
			if (timeoutId !== undefined) {
				clearTimeout(timeoutId);
			}

			timeoutId = setTimeout(() => {
				try {
					func(...args);
				} catch (error) {
					useLog("error", "[debounce] Callback error:", error);
				}
				timeoutId = undefined;
			}, delayMs);
		};
	};

	public useDebounceImmediate = <T extends (...args: unknown[]) => unknown>(
		func: T,
		delayMs: number,
	): ((...args: Parameters<T>) => void) => {
		let timeoutId: TimerId | undefined;
		let lastCallTime: number | undefined;

		return (...args: Parameters<T>) => {
			const now = Date.now();
			const isFirstCall = lastCallTime === undefined;

			lastCallTime = now;

			if (isFirstCall) {
				try {
					func(...args);
				} catch (error) {
					useLog("error", "[debounceImmediate] Callback error:", error);
				}
			}

			if (timeoutId !== undefined) {
				clearTimeout(timeoutId);
			}

			timeoutId = setTimeout(() => {
				if (Date.now() - Number(lastCallTime) >= delayMs) {
					try {
						func(...args);
					} catch (error) {
						useLog("error", "[debounceImmediate] Callback error:", error);
					}
				}
				timeoutId = undefined;
				lastCallTime = undefined;
			}, delayMs);
		};
	};

	public useThrottle = <T extends (...args: unknown[]) => unknown>(
		func: T,
		limitMs: number,
	): ((...args: Parameters<T>) => void) => {
		let inThrottle = false;

		return (...args: Parameters<T>) => {
			if (!inThrottle) {
				try {
					func(...args);
				} catch (error) {
					useLog("error", "[throttle] Callback error:", error);
				}
				inThrottle = true;
				setTimeout(() => {
					inThrottle = false;
				}, limitMs);
			}
		};
	};

	public useThrottleTrailing = <T extends (...args: unknown[]) => unknown>(
		func: T,
		limitMs: number,
	): ((...args: Parameters<T>) => void) => {
		let inThrottle = false;
		let lastArgs: Parameters<T> | null = null;

		return (...args: Parameters<T>) => {
			if (!inThrottle) {
				try {
					func(...args);
				} catch (error) {
					useLog("error", "[throttleTrailing] Callback error:", error);
				}
				inThrottle = true;
				lastArgs = null;

				setTimeout(() => {
					inThrottle = false;
					if (lastArgs) {
						try {
							func(...lastArgs);
						} catch (error) {
							useLog("error", "[throttleTrailing] Callback error:", error);
						}
					}
				}, limitMs);
			} else {
				lastArgs = args;
			}
		};
	};

	public useRepeat = async (
		callback: (iteration: number) => void | Promise<void>,
		iterations: number,
		delayMs = 0,
	): Promise<void> => {
		for (let i = 0; i < iterations; i++) {
			try {
				await callback(i);
			} catch (error) {
				useLog("error", "[repeat] Callback error:", error);
			}

			if (i < iterations - 1 && delayMs > 0) {
				await this.useDelay(delayMs);
			}
		}
	};

	public useRace = async <T>(
		promise: Promise<T>,
		timeoutMs: number,
		errorMessage = "Operation timed out",
	): Promise<T> => {
		const timeoutPromise = new Promise<never>((_, reject) => {
			setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
		});

		return Promise.race([promise, timeoutPromise]);
	};
}

// Singleton instance and destructured exports.
export const {
	useDelay,
	useSetTimeout,
	useInterval,
	useDebounce,
	useDebounceImmediate,
	useThrottle,
	useThrottleTrailing,
	useRepeat,
	useRace,
}: TimingService = TimingService.getInstance();
