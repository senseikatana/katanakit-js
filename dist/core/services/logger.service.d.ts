import type { LogLevel, LogStrategy } from "../../types/index.js";
/**
 * Concrete strategy: native console output.
 */
export declare class ConsoleStrategy implements LogStrategy {
    useOutput(level: LogLevel, message: string, data?: unknown): void;
}
/**
 * Singleton context: holds the active strategy and keeps `this` bound through
 * arrow-function methods so destructured exports remain safe.
 */
export declare class LoggerService {
    private static instance;
    private strategy;
    private constructor();
    static getInstance(): LoggerService;
    useSetStrategy: (strategy: LogStrategy) => void;
    /**
     * Overloads allow:
     * - message only: `useLog("message")`
     * - message + data: `useLog("message", { id: 1 })`
     * - level + message + data: `useLog("error", "something failed", { code: 500 })`
     */
    useLog: {
        (message: string, data?: unknown): void;
        (level: LogLevel, message: string, data?: unknown): void;
    };
    useError: (message: string, data?: unknown) => void;
    useClear: () => void;
    useTable: (data: unknown) => void;
}
export declare const useClear: () => void, useLog: {
    (message: string, data?: unknown): void;
    (level: LogLevel, message: string, data?: unknown): void;
}, useError: (message: string, data?: unknown) => void, useTable: (data: unknown) => void, useSetStrategy: (strategy: LogStrategy) => void;
//# sourceMappingURL=logger.service.d.ts.map