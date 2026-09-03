import type { IErrorFactory, ISerializedError } from "@/types";

/**
 * Decoupled application error. Carries an HTTP-style status code.
 */
export class AppError extends Error {
	constructor(
		message: string = "Unknown error",
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

	public useBadRequest = (message: string = "Bad Request"): AppError =>
		new AppError(message, 400);

	public useUnauthorized = (message: string = "Unauthorized"): AppError =>
		new AppError(message, 401);

	public useForbidden = (message: string = "Forbidden"): AppError =>
		new AppError(message, 403);

	public useNotFound = (message: string = "Not Found"): AppError =>
		new AppError(message, 404);

	public useInternal = (message: string = "Internal Server Error"): AppError =>
		new AppError(message, 500);

	public useCustom = (message: string, code: number): AppError =>
		new AppError(message, code);
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
