import type { IErrorFactory, ISerializedError } from "../../types/index.js";

/**
 * Decoupled application error. Carries an HTTP-style status code.
 */
export class AppError extends Error {
	constructor(
		message = "Unknown error",
		public readonly code: number = 400,
	) {
		super(message);
		this.name = "AppError";
		Object.setPrototypeOf(this, AppError.prototype);
	}

	public useToJson = (): ISerializedError => ({
		name: this.name,
		message: this.message,
		code: this.code,
	});
}

/**
 * Error factory implemented as a singleton (Factory Method pattern).
 */
export class ErrorFactoryService implements IErrorFactory {
	private static instance: ErrorFactoryService;

	private constructor() {}

	public static getInstance(): ErrorFactoryService {
		if (!ErrorFactoryService.instance) {
			ErrorFactoryService.instance = new ErrorFactoryService();
		}
		return ErrorFactoryService.instance;
	}

	public useBadRequest = (message = "Bad Request"): AppError => new AppError(message, 400);

	public useUnauthorized = (message = "Unauthorized"): AppError => new AppError(message, 401);

	public useForbidden = (message = "Forbidden"): AppError => new AppError(message, 403);

	public useNotFound = (message = "Not Found"): AppError => new AppError(message, 404);

	public useInternal = (message = "Internal Server Error"): AppError => new AppError(message, 500);

	public useCustom = (message: string, code: number): AppError => new AppError(message, code);
}

// Singleton instance and destructured exports.
export const {
	useBadRequest,
	useUnauthorized,
	useForbidden,
	useNotFound,
	useInternal,
	useCustom,
}: ErrorFactoryService = ErrorFactoryService.getInstance();
