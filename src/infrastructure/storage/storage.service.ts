// 1. Interfaz Strategy: Contrato homogéneo sin usar 'any'
export interface StorageStrategy {
	getItem<T = unknown>(key: string): T | null;
	setItem(key: string, value: unknown): void;
	removeItem(key: string): void;
	clear(): void;
}

// 2. Estrategia Base: Maneja la serialización segura de datos (JSON y unknown)
abstract class WebStorageStrategy implements StorageStrategy {
	protected constructor(private readonly storage: Storage) {}

	getItem<T = unknown>(key: string): T | null {
		try {
			const raw = this.storage.getItem(key);
			return raw ? (JSON.parse(raw) as T) : null;
		} catch {
			return this.storage.getItem(key) as unknown as T;
		}
	}

	setItem(key: string, value: unknown): void {
		const serialized =
			typeof value === "string" ? value : JSON.stringify(value);
		this.storage.setItem(key, serialized);
	}

	removeItem(key: string): void {
		this.storage.removeItem(key);
	}

	clear(): void {
		this.storage.clear();
	}
}

// Estrategias Concretas
export class LocalStorageStrategy extends WebStorageStrategy {
	constructor() {
		super(window.localStorage);
	}
}

export class SessionStorageStrategy extends WebStorageStrategy {
	constructor() {
		super(window.sessionStorage);
	}
}

// 3. Facade / Singleton Context
export type StorageTarget = "localStorage" | "sessionStorage";

export default class StorageService {
	private static instance: StorageService;
	private strategies: Record<StorageTarget, StorageStrategy>;

	private constructor() {
		this.strategies = {
			localStorage: new LocalStorageStrategy(),
			sessionStorage: new SessionStorageStrategy(),
		};
	}

	public static getInstance(): StorageService {
		if (!StorageService.instance) {
			StorageService.instance = new StorageService();
		}
		return StorageService.instance;
	}

	// Arrow functions vinculadas para permitir desestructuración segura
	public GET_STORAGE = <T = unknown>(
		key: string,
		target: StorageTarget = "localStorage",
	): T | null => {
		return this.strategies[target].getItem<T>(key);
	};

	public SET_STORAGE = (
		key: string,
		value: unknown,
		target: StorageTarget = "localStorage",
	): void => {
		this.strategies[target].setItem(key, value);
	};

	public REMOVE_STORAGE = (
		key: string,
		target: StorageTarget = "localStorage",
	): void => {
		this.strategies[target].removeItem(key);
	};

	public CLEAR_STORAGE = (target: StorageTarget = "localStorage"): void => {
		this.strategies[target].clear();
	};
}

// ============================================================
// TODO: USAGE EXAMPLES
// ============================================================
export const { CLEAR_STORAGE, GET_STORAGE, REMOVE_STORAGE, SET_STORAGE } =
	StorageService.getInstance();

SET_STORAGE("theme", "light", "localStorage");
CLEAR_STORAGE("localStorage");
GET_STORAGE<string>("theme", "localStorage");
REMOVE_STORAGE("theme", "localStorage");
