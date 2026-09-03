import type { WorkerFunc, WorkerPoolEntry } from "../../types";

export default class WORKER {
	private static instance: WORKER;
	private pools: Map<string, WorkerPoolEntry> = new Map();

	private constructor() {
		// Constructor privado para forzar Singleton
	}

	static getInstance(): WORKER {
		if (!WORKER.instance) {
			WORKER.instance = new WORKER();
		}
		return WORKER.instance;
	}

	static IS_SUPPORTED(): boolean {
		return typeof window !== "undefined" && "Worker" in window;
	}

	/**
	 * Ejecuta una función pura en un Worker one-shot.
	 * Crea el worker, ejecuta, y lo destruye automáticamente.
	 */
	async RUN<TInput, TOutput>(
		workerFunc: WorkerFunc<TInput, TOutput>,
		data: TInput,
	): Promise<TOutput> {
		if (!WORKER.IS_SUPPORTED()) {
			// Fallback SSR/Node: ejecutar en hilo principal
			return Promise.resolve(workerFunc(data));
		}

		return new Promise((resolve, reject) => {
			try {
				const funcString = workerFunc.toString();
				const blob = new Blob(
					[`self.onmessage = (e) => self.postMessage((${funcString})(e.data))`],
					{ type: "application/javascript" },
				);
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
	 * Crea un Worker reutilizable bajo una key única.
	 * Ideal para cálculos secuenciales sin overhead de creación/destrucción.
	 */
	CREATE_POOL<TInput, TOutput>(
		key: string,
		workerFunc: WorkerFunc<TInput, TOutput>,
	): this {
		if (!WORKER.IS_SUPPORTED()) return this;

		if (this.pools.has(key)) {
			this.TERMINATE(key);
		}

		const funcString = workerFunc.toString();
		const blob = new Blob(
			[`self.onmessage = (e) => self.postMessage((${funcString})(e.data))`],
			{ type: "application/javascript" },
		);
		const workerUrl = URL.createObjectURL(blob);
		const worker = new Worker(workerUrl);

		this.pools.set(key, { worker, workerUrl, func: workerFunc });
		return this;
	}

	/**
	 * Ejecuta una tarea en un pool existente.
	 */
	RUN_POOL<TInput, TOutput>(key: string, data: TInput): Promise<TOutput> {
		const entry = this.pools.get(key) as
			| WorkerPoolEntry<TInput, TOutput>
			| undefined;

		if (!entry) {
			return Promise.reject(new Error(`Worker pool "${key}" not found`));
		}

		if (!WORKER.IS_SUPPORTED()) {
			return Promise.resolve(entry.func(data));
		}

		return new Promise((resolve, reject) => {
			entry.worker.onmessage = (event) => resolve(event.data);
			entry.worker.onerror = (error) =>
				reject(new Error(`Worker error: ${error.message}`));
			entry.worker.postMessage(data);
		});
	}

	/**
	 * Termina un pool específico.
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
	 * Termina todos los pools activos.
	 */
	TERMINATE_ALL(): this {
		this.pools.forEach((_, key) => {
			this.TERMINATE(key);
		});
		return this;
	}

	/**
	 * Verifica si un pool existe.
	 */
	HASWORKER(key: string): boolean {
		return this.pools.has(key);
	}

	/**
	 * Lista todas las keys de pools activos.
	 */
	KEYS(): string[] {
		return Array.from(this.pools.keys());
	}
}
