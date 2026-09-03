export interface IDataUtils {
	UNIQUE<T>(array: T[]): T[];
	CHUNK<T>(array: T[], size: number): T[][];
	GROUP_BY<T>(
		array: T[],
		key: keyof T | ((item: T) => string),
	): Record<string, T[]>;
	IS_OBJECT(item: unknown): item is Record<string, unknown>;
	DEEP_CLONE<T>(value: T): T;
	DEEP_MERGE<T extends Record<string, unknown>>(
		target: T,
		source: Record<string, unknown>,
	): T;
	PICK<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
	OMIT<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
}

export interface ISystemUtils {
	SLEEP(ms: number): Promise<void>;
	RETRY<T>(
		fn: () => Promise<T>,
		retries?: number,
		delayMs?: number,
	): Promise<T>;
	COPY_TO_CLIPBOARD(text: string): Promise<boolean>;
	GET_URL_PARAMS(urlString: string): Record<string, string>;
	ROUND(value: string | number, decimals?: number): number;
	AVERAGE(numbers: number[]): number;
}

export interface IAppUtils {
	readonly data: IDataUtils;
	readonly system: ISystemUtils;
}

// ==========================================
// 1. DATA UTILS (Singleton)
// ==========================================
export class DataUtils implements IDataUtils {
	private static instance: DataUtils;

	private constructor() {}

	public static getInstance(): DataUtils {
		if (!DataUtils.instance) {
			DataUtils.instance = new DataUtils();
		}
		return DataUtils.instance;
	}

	public UNIQUE<T>(array: T[]): T[] {
		return [...new Set(array)];
	}

	public CHUNK<T>(array: T[], size: number): T[][] {
		if (size <= 0) throw new Error("Chunk size must be greater than 0");
		return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
			array.slice(i * size, i * size + size),
		);
	}

	public GROUP_BY<T>(
		array: T[],
		key: keyof T | ((item: T) => string),
	): Record<string, T[]> {
		if (typeof Object.groupBy === "function" && typeof key === "string") {
			Object.groupBy(array, (item) => String(item[key as keyof T]));
		}
		return array.reduce(
			(acc, item) => {
				const groupKey: string =
					typeof key === "function" ? key(item) : String(item[key]);
				(acc[groupKey] ??= []).push(item);
				return acc;
			},
			{} as Record<string, T[]>,
		);
	}

	public IS_OBJECT(item: unknown): item is Record<string, unknown> {
		return typeof item === "object" && item !== null && !Array.isArray(item);
	}

	public DEEP_CLONE<T>(value: T): T {
		if (typeof structuredClone === "function") {
			return structuredClone(value);
		}
		return JSON.parse(JSON.stringify(value)) as T;
	}

	public DEEP_MERGE<T extends Record<string, unknown>>(
		target: T,
		source: Record<string, unknown>,
	): T {
		if (!target || !source) return { ...target };
		const output = { ...target } as Record<string, unknown>;

		for (const key of Object.keys(source)) {
			const targetVal = target[key];
			const sourceVal = source[key];

			if (this.IS_OBJECT(targetVal) && this.IS_OBJECT(sourceVal)) {
				output[key] = this.DEEP_MERGE(targetVal, sourceVal);
			} else {
				output[key] = sourceVal;
			}
		}
		return output as T;
	}

	public PICK<T extends object, K extends keyof T>(
		obj: T,
		keys: K[],
	): Pick<T, K> {
		return keys.reduce(
			(acc, key) => {
				if (key in obj) acc[key] = obj[key];
				return acc;
			},
			{} as Pick<T, K>,
		);
	}

	public OMIT<T extends object, K extends keyof T>(
		obj: T,
		keys: K[],
	): Omit<T, K> {
		const result = this.DEEP_CLONE(obj) as Record<string, unknown>;
		for (const key of keys) delete result[key as string];
		return result as Omit<T, K>;
	}
}

// ==========================================
// 2. SYSTEM UTILS (Singleton)
// ==========================================
export class SystemUtils implements ISystemUtils {
	private static instance: SystemUtils;

	private constructor() {}

	public static getInstance(): SystemUtils {
		if (!SystemUtils.instance) {
			SystemUtils.instance = new SystemUtils();
		}
		return SystemUtils.instance;
	}

	public SLEEP(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	public async RETRY<T>(
		fn: () => Promise<T>,
		retries = 3,
		delayMs = 1000,
	): Promise<T> {
		try {
			return await fn();
		} catch (error) {
			if (retries <= 0) throw error;
			await this.SLEEP(delayMs);
			return this.RETRY(fn, retries - 1, delayMs);
		}
	}

	public async COPY_TO_CLIPBOARD(text: string): Promise<boolean> {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch {
			return false;
		}
	}

	public GET_URL_PARAMS(urlString: string): Record<string, string> {
		try {
			const url = new URL(urlString);
			return Object.fromEntries(url.searchParams.entries());
		} catch {
			return {};
		}
	}

	public ROUND(value: string | number, decimals = 2): number {
		const num = typeof value === "string" ? parseFloat(value) : value;
		if (Number.isNaN(num)) return 0;
		const factor = 10 ** decimals;
		return Math.round(num * factor) / factor;
	}

	public AVERAGE(numbers: number[]): number {
		if (numbers.length === 0) return 0;
		const sum = numbers.reduce((acc, n) => acc + n, 0);
		return sum / numbers.length;
	}
}

// ==========================================
// 3. FACHADA PRINCIPAL (Singleton)
// ==========================================
export class AppUtils implements IAppUtils {
	private static instance: AppUtils;

	public readonly data: IDataUtils;
	public readonly system: ISystemUtils;

	private constructor() {
		this.data = DataUtils.getInstance();
		this.system = SystemUtils.getInstance();
	}

	public static getInstance(): AppUtils {
		if (!AppUtils.instance) {
			AppUtils.instance = new AppUtils();
		}
		return AppUtils.instance;
	}
}

// ============================================================
// TODO: USAGE EXAMPLES
// ============================================================

export const {
	COPY_TO_CLIPBOARD,
	GET_URL_PARAMS,
	SLEEP,
	AVERAGE,
	RETRY,
	ROUND,
}: SystemUtils = SystemUtils.getInstance();

COPY_TO_CLIPBOARD("Hello, World!").then((success) => {
	console.log("Copy to clipboard success:", success);
});

const urlParams: Record<string, string> = GET_URL_PARAMS(
	"https://example.com/?name=John&age=30",
);
console.log("URL Params:", urlParams);

SLEEP(2000).then(() => {
	console.log("Slept for 2 seconds");
});
