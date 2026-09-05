/**
 * Base strategy handling safe JSON serialization over a Web Storage backend.
 */
class WebStorageStrategy {
    storage;
    constructor(storage) {
        this.storage = storage;
    }
    useGetItem(key) {
        try {
            const raw = this.storage.getItem(key);
            return raw ? JSON.parse(raw) : null;
        }
        catch {
            return this.storage.getItem(key);
        }
    }
    useSetItem(key, value) {
        const serialized = typeof value === "string" ? value : JSON.stringify(value);
        this.storage.setItem(key, serialized);
    }
    useRemoveItem(key) {
        this.storage.removeItem(key);
    }
    useClear() {
        this.storage.clear();
    }
}
/**
 * In-memory Web Storage implementation used as an SSR fallback.
 */
class MemoryStorage {
    store = new Map();
    get length() {
        return this.store.size;
    }
    clear() {
        this.store.clear();
    }
    getItem(key) {
        return this.store.get(key) ?? null;
    }
    key(index) {
        return Array.from(this.store.keys())[index] ?? null;
    }
    removeItem(key) {
        this.store.delete(key);
    }
    setItem(key, value) {
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
    static instance;
    strategies = null;
    constructor() { }
    static getInstance() {
        if (!StorageService.instance) {
            StorageService.instance = new StorageService();
        }
        return StorageService.instance;
    }
    getStrategies() {
        if (!this.strategies) {
            const hasWindow = typeof window !== "undefined";
            this.strategies = {
                localStorage: hasWindow ? new LocalStorageStrategy() : new MemoryStorageStrategy(),
                sessionStorage: hasWindow ? new SessionStorageStrategy() : new MemoryStorageStrategy(),
            };
        }
        return this.strategies;
    }
    useGetStorage = (key, target = "localStorage") => this.getStrategies()[target].useGetItem(key);
    useSetStorage = (key, value, target = "localStorage") => this.getStrategies()[target].useSetItem(key, value);
    useRemoveStorage = (key, target = "localStorage") => this.getStrategies()[target].useRemoveItem(key);
    useClearStorage = (target = "localStorage") => this.getStrategies()[target].useClear();
}
// Singleton instance and destructured exports.
export const { useClearStorage, useGetStorage, useRemoveStorage, useSetStorage } = StorageService.getInstance();
//# sourceMappingURL=storage.service.js.map