/**
 * Decoupled application error. Carries an HTTP-style status code.
 */
export class AppError extends Error {
    code;
    constructor(message = "Unknown error", code = 400) {
        super(message);
        this.code = code;
        this.name = "AppError";
        Object.setPrototypeOf(this, AppError.prototype);
    }
    useToJson = () => ({
        name: this.name,
        message: this.message,
        code: this.code,
    });
}
/**
 * Error factory implemented as a singleton (Factory Method pattern).
 */
export class ErrorFactoryService {
    static instance;
    constructor() { }
    static getInstance() {
        if (!ErrorFactoryService.instance) {
            ErrorFactoryService.instance = new ErrorFactoryService();
        }
        return ErrorFactoryService.instance;
    }
    useBadRequest = (message = "Bad Request") => new AppError(message, 400);
    useUnauthorized = (message = "Unauthorized") => new AppError(message, 401);
    useForbidden = (message = "Forbidden") => new AppError(message, 403);
    useNotFound = (message = "Not Found") => new AppError(message, 404);
    useInternal = (message = "Internal Server Error") => new AppError(message, 500);
    useCustom = (message, code) => new AppError(message, code);
}
// Singleton instance and destructured exports.
export const { useBadRequest, useUnauthorized, useForbidden, useNotFound, useInternal, useCustom, } = ErrorFactoryService.getInstance();
//# sourceMappingURL=error.service.js.map