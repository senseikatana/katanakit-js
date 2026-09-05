import type { ObserverCallback, ObserverTarget } from "../../types/index.js";
/**
 * Singleton wrapper around the native IntersectionObserver API.
 */
export declare class ObserverService {
    private static instance;
    private registry;
    private constructor();
    static getInstance(): ObserverService;
    static useIsSupported(): boolean;
    useCreate(key: string, callback: ObserverCallback, options?: IntersectionObserverInit, autoUnobserve?: boolean): this;
    private resolveTarget;
    useObserve(key: string, element: ObserverTarget): this;
    useObserveAll(key: string, selector: string): this;
    useUnobserve(key: string, element: HTMLElement): this;
    useDisconnect(key: string): this;
    useDisconnectAll(): this;
    useHas(key: string): boolean;
    useKeys(): string[];
}
/**
 * Singleton service for lazy loading images using IntersectionObserver.
 */
export declare class LazyLoaderService {
    private static instance;
    private registry;
    private constructor();
    static getInstance(): LazyLoaderService;
    useInit(key?: string, selector?: string, rootMargin?: string): this;
    useStop(key: string): this;
    useStopAll(): this;
    useHas(key: string): boolean;
}
//# sourceMappingURL=observer.service.d.ts.map