import type { WorkerFunc, WorkerPoolEntry } from "../../types";

/**
 * Worker facade (Singleton + Pool pattern) for running pure functions off the
 * main thread, with an SSR/main-thread fallback when Worker is unavailable.
 */
export default class WorkerService {
	private static instance: WorkerService;
	private pools: Map<string, WorkerPoolEntry> = new Map();

	private constructor() {}

	static getInstance(): WorkerService {
		if (!WorkerService.instance) {
			WorkerService.instance = new WorkerService();
		}
		return WorkerService.instance;
	}

	static useIsSupported(): boolean {
		return typeof window !== "undefined" && "Worker" in window;
	}

	/**
	 * Runs a pure function in a one-shot Worker and destroys it afterwards.
	 */
	async useRun<TInput, TOutput>(
		workerFunc: WorkerFunc<TInput, TOutput>,
		data: TInput,
	): Promise<TOutput> {
		if (!WorkerService.useIsSupported()) {
			// SSR/Node fallback: run on the main thread.
			return Promise.resolve(workerFunc(data));
		}

		return new Promise((resolve, reject) => {
			let worker: Worker | undefined;
			let workerUrl: string | undefined;

			const cleanup = () => {
				if (worker) {
					worker.terminate();
					worker = undefined;
				}
				if (workerUrl) {
					URL.revokeObjectURL(workerUrl);
					workerUrl = undefined;
				}
			};

			try {
				const funcString = workerFunc.toString();
				const blob = new Blob([`self.onmessage = (e) => self.postMessage((${funcString})(e.data))`], {
					type: "application/javascript",
				});
				workerUrl = URL.createObjectURL(blob);
				worker = new Worker(workerUrl);

				worker.onmessage = (event) => {
					cleanup();
					resolve(event.data);
				};
				worker.onerror = (error) => {
					cleanup();
					reject(new Error(`Worker error: ${error.message}`));
				};
				worker.onmessageerror = () => {
					cleanup();
					reject(new Error("Worker returned a non-cloneable value."));
				};

				worker.postMessage(data);
			} catch (error) {
				cleanup();
				reject(error);
			}
		});
	}

	/**
	 * Creates a reusable Worker pool under a unique key.
	 */
	useCreatePool<TInput, TOutput>(key: string, workerFunc: WorkerFunc<TInput, TOutput>): this {
		if (!WorkerService.useIsSupported()) return this;

		if (this.pools.has(key)) {
			this.useTerminate(key);
		}

		const funcString = workerFunc.toString();
		const blob = new Blob(
			[`self.onmessage = (e) => self.postMessage({ __taskId: e.data.__taskId, payload: (${funcString})(e.data.payload) })`],
			{ type: "application/javascript" },
		);
		const workerUrl = URL.createObjectURL(blob);
		const worker = new Worker(workerUrl);

		this.pools.set(key, {
			worker,
			workerUrl,
			func: workerFunc,
		} as WorkerPoolEntry);
		return this;
	}

	/**
	 * Runs a task on an existing pool. Tasks are queued to prevent race conditions
	 * when multiple calls target the same pool key concurrently.
	 */
	useRunPool<TInput, TOutput>(key: string, data: TInput): Promise<TOutput> {
		const entry = this.pools.get(key) as WorkerPoolEntry<TInput, TOutput> | undefined;

		if (!entry) {
			return Promise.reject(new Error(`Worker pool "${key}" not found`));
		}

		if (!WorkerService.useIsSupported()) {
			return Promise.resolve(entry.func(data));
		}

		// Queue the task to prevent onmessage race conditions.
		const taskId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

		return new Promise((resolve, reject) => {
			const handler = (event: MessageEvent) => {
				if (event.data?.__taskId === taskId) {
					entry.worker.removeEventListener("message", handler);
					resolve(event.data.payload as TOutput);
				}
			};

			entry.worker.addEventListener("message", handler);
			entry.worker.onerror = (error) => {
				entry.worker.removeEventListener("message", handler);
				reject(new Error(`Worker error: ${error.message}`));
			};
			entry.worker.postMessage({ __taskId: taskId, payload: data });
		});
	}

	/**
	 * Terminates a specific pool.
	 */
	useTerminate(key: string): this {
		const entry = this.pools.get(key);
		if (!entry) return this;

		entry.worker.terminate();
		URL.revokeObjectURL(entry.workerUrl);
		this.pools.delete(key);
		return this;
	}

	/**
	 * Terminates all active pools.
	 */
	useTerminateAll(): this {
		for (const key of this.pools.keys()) {
			this.useTerminate(key);
		}
		return this;
	}

	/**
	 * Checks whether a pool exists.
	 */
	useHasWorker(key: string): boolean {
		return this.pools.has(key);
	}

	/**
	 * Lists all active pool keys.
	 */
	useKeys(): string[] {
		return Array.from(this.pools.keys());
	}
}
