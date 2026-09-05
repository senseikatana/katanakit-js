import type { WorkerFunc } from "../../types/index.js";
/**
 * Worker facade (Singleton + Pool pattern) for running pure functions off the
 * main thread, with an SSR/main-thread fallback when Worker is unavailable.
 */
export default class WorkerService {
    private static instance;
    private pools;
    private constructor();
    static getInstance(): WorkerService;
    static useIsSupported(): boolean;
    /**
     * Runs a pure function in a one-shot Worker and destroys it afterwards.
     */
    useRun<TInput, TOutput>(workerFunc: WorkerFunc<TInput, TOutput>, data: TInput): Promise<TOutput>;
    /**
     * Creates a reusable Worker pool under a unique key.
     */
    useCreatePool<TInput, TOutput>(key: string, workerFunc: WorkerFunc<TInput, TOutput>): this;
    /**
     * Runs a task on an existing pool. Tasks are queued to prevent race conditions
     * when multiple calls target the same pool key concurrently.
     */
    useRunPool<TInput, TOutput>(key: string, data: TInput): Promise<TOutput>;
    /**
     * Terminates a specific pool.
     */
    useTerminate(key: string): this;
    /**
     * Terminates all active pools.
     */
    useTerminateAll(): this;
    /**
     * Checks whether a pool exists.
     */
    useHasWorker(key: string): boolean;
    /**
     * Lists all active pool keys.
     */
    useKeys(): string[];
}
//# sourceMappingURL=worker.service.d.ts.map