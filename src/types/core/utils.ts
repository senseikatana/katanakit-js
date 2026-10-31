/** Contract of the data utilities. */
export interface IDataUtils {
	useUnique<T>(array: T[]): T[];
	useChunk<T>(array: T[], size: number): T[][];
	useGroupBy<T>(array: T[], key: keyof T | ((item: T) => string)): Record<string, T[]>;
	useIsObject(item: unknown): item is Record<string, unknown>;
	useDeepClone<T>(value: T): T;
	useDeepMerge<T extends Record<string, unknown>>(target: T, source: Record<string, unknown>): T;
	usePick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
	useOmit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
}

/** Contract of the system utilities. */
export interface ISystemUtils {
	useSleep(ms: number): Promise<void>;
	useRetry<T>(fn: () => Promise<T>, retries?: number, delayMs?: number): Promise<T>;
	useCopyToClipboard(text: string): Promise<boolean>;
	useGetUrlParams(urlString: string): Record<string, string>;
	useRound(value: string | number, decimals?: number): number;
	useAverage(numbers: number[]): number;
}

/** Contract of the app utilities facade. */
export interface IAppUtils {
	readonly data: IDataUtils;
	readonly system: ISystemUtils;
}
