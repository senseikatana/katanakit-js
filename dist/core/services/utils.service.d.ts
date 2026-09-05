import type { IAppUtils, IDataUtils, ISystemUtils } from "../../types/index.js";
/**
 * Data utilities implemented as a Singleton.
 */
export declare class DataUtils implements IDataUtils {
    private static instance;
    private constructor();
    static getInstance(): DataUtils;
    useUnique: <T>(array: T[]) => T[];
    useChunk: <T>(array: T[], size: number) => T[][];
    useGroupBy: <T>(array: T[], key: keyof T | ((item: T) => string)) => Record<string, T[]>;
    useIsObject: (item: unknown) => item is Record<string, unknown>;
    useDeepClone: <T>(value: T) => T;
    useDeepMerge: <T extends Record<string, unknown>>(target: T, source: Record<string, unknown>) => T;
    usePick: <T extends object, K extends keyof T>(obj: T, keys: K[]) => Pick<T, K>;
    useOmit: <T extends object, K extends keyof T>(obj: T, keys: K[]) => Omit<T, K>;
}
/**
 * System utilities implemented as a Singleton.
 */
export declare class SystemUtils implements ISystemUtils {
    private static instance;
    private constructor();
    static getInstance(): SystemUtils;
    useSleep: (ms: number) => Promise<void>;
    useRetry: <T>(fn: () => Promise<T>, retries?: number, delayMs?: number) => Promise<T>;
    useCopyToClipboard: (text: string) => Promise<boolean>;
    useGetUrlParams: (urlString: string) => Record<string, string>;
    useRound: (value: string | number, decimals?: number) => number;
    useAverage: (numbers: number[]) => number;
}
/**
 * Main facade composing data and system utilities.
 */
export declare class AppUtils implements IAppUtils {
    private static instance;
    readonly data: IDataUtils;
    readonly system: ISystemUtils;
    private constructor();
    static getInstance(): AppUtils;
}
export declare const useUnique: <T>(array: T[]) => T[], useChunk: <T>(array: T[], size: number) => T[][], useGroupBy: <T>(array: T[], key: ((item: T) => string) | keyof T) => Record<string, T[]>, useIsObject: (item: unknown) => item is Record<string, unknown>, useDeepClone: <T>(value: T) => T, useDeepMerge: <T extends Record<string, unknown>>(target: T, source: Record<string, unknown>) => T, usePick: <T extends object, K extends keyof T>(obj: T, keys: K[]) => Pick<T, K>, useOmit: <T extends object, K extends keyof T>(obj: T, keys: K[]) => Omit<T, K>;
export declare const useSleep: (ms: number) => Promise<void>, useRetry: <T>(fn: () => Promise<T>, retries?: number, delayMs?: number) => Promise<T>, useCopyToClipboard: (text: string) => Promise<boolean>, useGetUrlParams: (urlString: string) => Record<string, string>, useRound: (value: string | number, decimals?: number) => number, useAverage: (numbers: number[]) => number;
//# sourceMappingURL=utils.service.d.ts.map