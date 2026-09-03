import type { StorageStrategy, StorageTarget } from "../../types";

/**
 * Base strategy handling safe JSON serialization over a Web Storage backend.
 */
abstract class WebStorageStrategy implements StorageStrategy {
	protected constructor(private readonly storage: Storage) {}

	useGetItem<T = unknown>(key: string): T | null {
		try {
			const raw = this.storage.getItem(key);
			return raw ? (JSON.parse(raw) as T) : null;
		} catch {
			return this.storage.getItem(key) as unknown as T;
		}
	}

	useSetItem(key: string, value: unknown): void {
		const serialized = typeof value === "string" ? value : JSON.stringify(value);
		this.storage.setItem(key, serialized);
	}

	useRemoveItem(key: string): void {
		this.storage.removeItem(key);
	}

	useClear(): void {
		this.storage.clear();
	}
}

/**
 * In-memory Web Storage implementation used as an SSR fallback.
 */
class MemoryStorage implements Storage {
	private store = new Map<string, string>();

	get length(): number {
		return this.store.size;
	}

	clear(): void {
		this.store.clear();
	}

	getItem(key: string): string | null {
		return this.store.get(key) ?? null;
	}

	key(index: number): string | null {
		return Array.from(this.store.keys())[index] ?? null;
	}

	removeItem(key: string): void {
		this.store.delete(key);
	}

	setItem(key: string, value: string): void {
		this.store.set(key, value);
	}
}

/**
 * Concrete strategy backed by `window.localStorage`.
 */
export class LocalStorageStrategy extends WebStorageStrategy {
	constructor() {
		super(window.localStorage);
	}
}

/**
 * Concrete strategy backed by `window.sessionStorage`.
 */
export class SessionStorageStrategy extends WebStorageStrategy {
	constructor() {
		super(window.sessionStorage);
	}
}

/**
 * Concrete strategy backed by an in-memory store (SSR fallback).
 */
export class MemoryStorageStrategy extends WebStorageStrategy {
	constructor() {
		super(new MemoryStorage());
	}
}

/**
 * Storage facade (Singleton + Strategy). Lazily picks browser storage or an
 * in-memory fallback so importing this module never crashes in SSR (Node/Bun).
 */
export default class StorageService {
	private static instance: StorageService;
	private strategies: Record<StorageTarget, StorageStrategy> | null = null;

	private constructor() {}

	public static getInstance(): StorageService {
		if (!StorageService.instance) {
			StorageService.instance = new StorageService();
		}
		return StorageService.instance;
	}

	private getStrategies(): Record<StorageTarget, StorageStrategy> {
		if (!this.strategies) {
			const hasWindow = typeof window !== "undefined";
			this.strategies = {
				localStorage: hasWindow ? new LocalStorageStrategy() : new MemoryStorageStrategy(),
				sessionStorage: hasWindow ? new SessionStorageStrategy() : new MemoryStorageStrategy(),
			};
		}
		return this.strategies;
	}

	public useGetStorage = <T = unknown>(
		key: string,
		target: StorageTarget = "localStorage",
	): T | null => this.getStrategies()[target].useGetItem<T>(key);

	public useSetStorage = (
		key: string,
		value: unknown,
		target: StorageTarget = "localStorage",
	): void => this.getStrategies()[target].useSetItem(key, value);

	public useRemoveStorage = (key: string, target: StorageTarget = "localStorage"): void =>
		this.getStrategies()[target].useRemoveItem(key);

	public useClearStorage = (target: StorageTarget = "localStorage"): void =>
		this.getStrategies()[target].useClear();
}

// Singleton instance and destructured exports.
export const { useClearStorage, useGetStorage, useRemoveStorage, useSetStorage } =
	StorageService.getInstance();
