import { GET_STORAGE, SET_STORAGE } from "@/infrastructure/storage/storage.service";
import { LOGGER } from "./logger.service";

import type { StorageTarget } from "@/types";

export type SignalListener<T> = (newValue: T, oldValue: T) => void;

export interface Subscribable<T> {
	subscribe: (listener: SignalListener<T>) => () => void;
}

export interface SignalGetter<T> extends Subscribable<T> {
	(): T;
}

export type SignalSetter<T> = (newValue: T | ((prev: T) => T)) => void;

export interface ToggleSignalSetter {
	set: (value: boolean) => void;
	toggle: () => void;
}

/**
 * Contract of the reactive facade.
 */
export interface IReactiveService {
	CREATE_SIGNAL<T>(initialValue: T): [SignalGetter<T>, SignalSetter<T>];
	CREATE_EFFECT(
		callback: () => undefined | (() => void),
		signals: Subscribable<unknown>[],
	): () => void;
	CREATE_MEMO<T>(computation: () => T, signals: Subscribable<unknown>[]): SignalGetter<T>;
	CREATE_TOGGLE(initialValue?: boolean): [SignalGetter<boolean>, ToggleSignalSetter];
	CREATE_STORAGE_SIGNAL<T>(
		key: string,
		fallbackValue: T,
		target?: StorageTarget,
	): [SignalGetter<T>, SignalSetter<T>];
	CREATE_DEBOUNCED_SIGNAL<T>(initialValue: T, delayMs?: number): [SignalGetter<T>, SignalSetter<T>];
	CREATE_BATCH(): (callback: () => void) => void;
}

/**
 * Minimal reactive kernel (Observer / Publisher-Subscriber) implemented as a
 * Facade + Singleton. Signals are closures with explicit dependency tracking.
 */
export default class ReactiveService implements IReactiveService {
	private static instance: ReactiveService;

	private isBatching = false;
	private batchQueue: Set<() => void> = new Set();

	private constructor() {}

	public static getInstance(): ReactiveService {
		if (!ReactiveService.instance) {
			ReactiveService.instance = new ReactiveService();
		}
		return ReactiveService.instance;
	}

	private NOTIFY = (notifyFn: () => void): void => {
		if (this.isBatching) {
			this.batchQueue.add(notifyFn);
		} else {
			notifyFn();
		}
	};

	public CREATE_SIGNAL = <T>(initialValue: T): [SignalGetter<T>, SignalSetter<T>] => {
		let value = initialValue;
		const listeners = new Set<SignalListener<T>>();

		const get = (() => value) as SignalGetter<T>;

		const set: SignalSetter<T> = (nextValue) => {
			const oldValue = value;
			value = typeof nextValue === "function" ? (nextValue as (prev: T) => T)(oldValue) : nextValue;

			if (value !== oldValue) {
				this.NOTIFY(() => {
					for (const listener of listeners) {
						try {
							listener(value, oldValue);
						} catch (error) {
							LOGGER("error", "[CREATE_SIGNAL] Listener error:", error);
						}
					}
				});
			}
		};

		get.subscribe = (listener: SignalListener<T>): (() => void) => {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		};

		return [get, set];
	};

	public CREATE_EFFECT = (
		callback: () => undefined | (() => void),
		signals: Subscribable<unknown>[],
	): (() => void) => {
		let cleanup: undefined | (() => void);

		const execute = () => {
			if (typeof cleanup === "function") {
				try {
					cleanup();
				} catch (error) {
					LOGGER("error", "[CREATE_EFFECT] Previous cleanup error:", error);
				}
			}

			try {
				cleanup = callback() as undefined | (() => void);
			} catch (error) {
				LOGGER("error", "[CREATE_EFFECT] Effect execution error:", error);
			}
		};

		const unsubscribes = signals.map((signal) => {
			if (signal && typeof signal.subscribe === "function") {
				return signal.subscribe(execute);
			}
			return () => {};
		});

		execute();

		return () => {
			if (typeof cleanup === "function") {
				try {
					cleanup();
				} catch (error) {
					LOGGER("error", "[CREATE_EFFECT] Final cleanup error:", error);
				}
			}
			for (const unsub of unsubscribes) {
				unsub();
			}
		};
	};

	public CREATE_MEMO = <T>(
		computation: () => T,
		signals: Subscribable<unknown>[],
	): SignalGetter<T> => {
		const [get, set] = this.CREATE_SIGNAL<T>(computation());

		this.CREATE_EFFECT(() => {
			set(computation());
		}, signals);

		return get;
	};

	public CREATE_TOGGLE = (initialValue = false): [SignalGetter<boolean>, ToggleSignalSetter] => {
		const [get, set] = this.CREATE_SIGNAL<boolean>(initialValue);
		const toggle = () => set((prev) => !prev);

		return [get, { set, toggle }];
	};

	public CREATE_STORAGE_SIGNAL = <T>(
		key: string,
		fallbackValue: T,
		target: StorageTarget = "localStorage",
	): [SignalGetter<T>, SignalSetter<T>] => {
		let initial: T = fallbackValue;

		try {
			const stored = GET_STORAGE<T>(key, target);
			if (stored !== null && stored !== undefined) {
				initial = stored;
			}
		} catch (error) {
			LOGGER("error", `[CREATE_STORAGE_SIGNAL] Error reading from ${target}:`, error);
		}

		const [get, set] = this.CREATE_SIGNAL<T>(initial);

		const setWithStorage: SignalSetter<T> = (nextValue) => {
			set((prev) => {
				const newValue = typeof nextValue === "function" ? (nextValue as (p: T) => T)(prev) : nextValue;

				try {
					SET_STORAGE(key, newValue, target);
				} catch (error) {
					LOGGER("error", `[CREATE_STORAGE_SIGNAL] Error writing to ${target}:`, error);
				}

				return newValue;
			});
		};

		return [get, setWithStorage];
	};

	public CREATE_DEBOUNCED_SIGNAL = <T>(
		initialValue: T,
		delayMs = 300,
	): [SignalGetter<T>, SignalSetter<T>] => {
		const [get, set] = this.CREATE_SIGNAL<T>(initialValue);
		let timeoutId: ReturnType<typeof setTimeout> | undefined;

		const debouncedSet: SignalSetter<T> = (nextValue) => {
			if (timeoutId !== undefined) {
				clearTimeout(timeoutId);
			}

			timeoutId = setTimeout(() => {
				set(nextValue);
				timeoutId = undefined;
			}, delayMs);
		};

		return [get, debouncedSet];
	};

	public CREATE_BATCH = (): ((callback: () => void) => void) => {
		return (callback: () => void) => {
			this.isBatching = true;
			try {
				callback();
			} catch (error) {
				LOGGER("error", "[CREATE_BATCH] Batch block error:", error);
			} finally {
				this.isBatching = false;
				const queue = Array.from(this.batchQueue);
				this.batchQueue.clear();
				for (const notify of queue) {
					notify();
				}
			}
		};
	};
}

// Singleton instance and destructured exports.
export const {
	CREATE_SIGNAL,
	CREATE_EFFECT,
	CREATE_MEMO,
	CREATE_TOGGLE,
	CREATE_STORAGE_SIGNAL,
	CREATE_DEBOUNCED_SIGNAL,
	CREATE_BATCH,
}: ReactiveService = ReactiveService.getInstance();
