import type { WorkerFunc, WorkerPoolEntry } from "@/types";

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

	static IS_SUPPORTED(): boolean {
		return typeof window !== "undefined" && "Worker" in window;
	}

	/**
	 * Runs a pure function in a one-shot Worker and destroys it afterwards.
	 */
	async RUN<TInput, TOutput>(
		workerFunc: WorkerFunc<TInput, TOutput>,
		data: TInput,
	): Promise<TOutput> {
		if (!WorkerService.IS_SUPPORTED()) {
			// SSR/Node fallback: run on the main thread.
			return Promise.resolve(workerFunc(data));
		}

		return new Promise((resolve, reject) => {
			try {
				const funcString = workerFunc.toString();
				const blob = new Blob([`self.onmessage = (e) => self.postMessage((${funcString})(e.data))`], {
					type: "application/javascript",
				});
				const workerUrl = URL.createObjectURL(blob);
				const worker = new Worker(workerUrl);

				worker.onmessage = (event) => {
					resolve(event.data);
					worker.terminate();
					URL.revokeObjectURL(workerUrl);
				};

				worker.onerror = (error) => {
					reject(new Error(`Worker error: ${error.message}`));
					worker.terminate();
					URL.revokeObjectURL(workerUrl);
				};

				worker.postMessage(data);
			} catch (error) {
				reject(error);
			}
		});
	}

	/**
	 * Creates a reusable Worker pool under a unique key.
	 */
	CREATE_POOL<TInput, TOutput>(key: string, workerFunc: WorkerFunc<TInput, TOutput>): this {
		if (!WorkerService.IS_SUPPORTED()) return this;

		if (this.pools.has(key)) {
			this.TERMINATE(key);
		}

		const funcString = workerFunc.toString();
		const blob = new Blob([`self.onmessage = (e) => self.postMessage((${funcString})(e.data))`], {
			type: "application/javascript",
		});
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
	 * Runs a task on an existing pool.
	 */
	RUN_POOL<TInput, TOutput>(key: string, data: TInput): Promise<TOutput> {
		const entry = this.pools.get(key) as WorkerPoolEntry<TInput, TOutput> | undefined;

		if (!entry) {
			return Promise.reject(new Error(`Worker pool "${key}" not found`));
		}

		if (!WorkerService.IS_SUPPORTED()) {
			return Promise.resolve(entry.func(data));
		}

		return new Promise((resolve, reject) => {
			entry.worker.onmessage = (event) => resolve(event.data);
			entry.worker.onerror = (error) => reject(new Error(`Worker error: ${error.message}`));
			entry.worker.postMessage(data);
		});
	}

	/**
	 * Terminates a specific pool.
	 */
	TERMINATE(key: string): this {
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
	TERMINATE_ALL(): this {
		this.pools.forEach((_, key) => {
			this.TERMINATE(key);
		});
		return this;
	}

	/**
	 * Checks whether a pool exists.
	 */
	HAS_WORKER(key: string): boolean {
		return this.pools.has(key);
	}

	/**
	 * Lists all active pool keys.
	 */
	KEYS(): string[] {
		return Array.from(this.pools.keys());
	}
}
