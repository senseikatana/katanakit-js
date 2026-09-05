import type { IErrorFactory, ISerializedError } from "../../types/index.js";
/**
 * Decoupled application error. Carries an HTTP-style status code.
 */
export declare class AppError extends Error {
    readonly code: number;
    constructor(message?: string, code?: number);
    useToJson: () => ISerializedError;
}
/**
 * Error factory implemented as a singleton (Factory Method pattern).
 */
export declare class ErrorFactoryService implements IErrorFactory {
    private static instance;
    private constructor();
    static getInstance(): ErrorFactoryService;
    useBadRequest: (message?: string) => AppError;
    useUnauthorized: (message?: string) => AppError;
    useForbidden: (message?: string) => AppError;
    useNotFound: (message?: string) => AppError;
    useInternal: (message?: string) => AppError;
    useCustom: (message: string, code: number) => AppError;
}
export declare const useBadRequest: (message?: string) => AppError, useUnauthorized: (message?: string) => AppError, useForbidden: (message?: string) => AppError, useNotFound: (message?: string) => AppError, useInternal: (message?: string) => AppError, useCustom: (message: string, code: number) => AppError;
//# sourceMappingURL=error.service.d.ts.map