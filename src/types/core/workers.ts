export type WorkerFunc<TInput = unknown, TOutput = unknown> = (
	data: TInput,
) => TOutput | Promise<TOutput>;

export interface WorkerPoolEntry<TInput = unknown, TOutput = unknown> {
	worker: Worker;
	workerUrl: string;
	func: WorkerFunc<TInput, TOutput>;
	pending: Map<string, { reject: (reason: Error) => void; cleanup: () => void }>;
}
