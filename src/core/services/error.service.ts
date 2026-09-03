/**
 * Serialized shape returned by {@link AppError.TO_JSON}.
 */
export interface ISerializedError {
	name: string;
	message: string;
	code: number;
}

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

	public TO_JSON = (): ISerializedError => ({
		name: this.name,
		message: this.message,
		code: this.code,
	});
}

/**
 * Contract of the error factory.
 */
export interface IErrorFactory {
	BAD_REQUEST(message?: string): AppError;
	UNAUTHORIZED(message?: string): AppError;
	FORBIDDEN(message?: string): AppError;
	NOT_FOUND(message?: string): AppError;
	INTERNAL(message?: string): AppError;
	CUSTOM(message: string, code: number): AppError;
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

	public BAD_REQUEST = (message = "Bad Request"): AppError => new AppError(message, 400);

	public UNAUTHORIZED = (message = "Unauthorized"): AppError => new AppError(message, 401);

	public FORBIDDEN = (message = "Forbidden"): AppError => new AppError(message, 403);

	public NOT_FOUND = (message = "Not Found"): AppError => new AppError(message, 404);

	public INTERNAL = (message = "Internal Server Error"): AppError => new AppError(message, 500);

	public CUSTOM = (message: string, code: number): AppError => new AppError(message, code);
}

// Singleton instance and destructured exports.
export const {
	BAD_REQUEST,
	UNAUTHORIZED,
	FORBIDDEN,
	NOT_FOUND,
	INTERNAL,
	CUSTOM,
}: ErrorFactoryService = ErrorFactoryService.getInstance();
