// ============================================================
// 1. PRODUCTO: Clase de Error desacoplada
// ============================================================

export interface ISerializedError {
	name: string;
	message: string;
	code: number;
}

export class AppError extends Error {
	constructor(
		message: string = "Unknown error",
		public readonly code: number = 400,
	) {
		super(message);
		this.name = "AppError";
		Object.setPrototypeOf(this, AppError.prototype);
	}

	public TO_JSON = (): ISerializedError => {
		return {
			name: this.name,
			message: this.message,
			code: this.code,
		};
	};
}

// ============================================================
// 2. CONTRATO DE LA FÁBRICA
// ============================================================

export interface IErrorFactory {
	BAD_REQUEST(message?: string): AppError;
	UNAUTHORIZED(message?: string): AppError;
	FORBIDDEN(message?: string): AppError;
	NOT_FOUND(message?: string): AppError;
	INTERNAL(message?: string): AppError;
	CUSTOM(message: string, code: number): AppError;
}

// ============================================================
// 3. FÁBRICA IMPLEMENTADA COMO SINGLETON (Factory Method)
// ============================================================

export class ErrorFactoryService implements IErrorFactory {
	private static instance: ErrorFactoryService;

	// Constructor privado: regla esencial del patrón Singleton[cite: 1, 3]
	private constructor() {}

	public static getInstance(): ErrorFactoryService {
		if (!ErrorFactoryService.instance) {
			ErrorFactoryService.instance = new ErrorFactoryService();
		}
		return ErrorFactoryService.instance;
	}

	// Métodos en UPPERCASE definidos como funciones flecha para desestructuración segura
	public BAD_REQUEST = (message: string = "Bad Request"): AppError => {
		return new AppError(message, 400);
	};

	public UNAUTHORIZED = (message: string = "Unauthorized"): AppError => {
		return new AppError(message, 401);
	};

	public FORBIDDEN = (message: string = "Forbidden"): AppError => {
		return new AppError(message, 403);
	};

	public NOT_FOUND = (message: string = "Not Found"): AppError => {
		return new AppError(message, 404);
	};

	public INTERNAL = (message: string = "Internal Server Error"): AppError => {
		return new AppError(message, 500);
	};

	public CUSTOM = (message: string, code: number): AppError => {
		return new AppError(message, code);
	};
}

// ============================================================
// 4. EXPORTACIÓN SEGURA
// ============================================================

export const {
	BAD_REQUEST,
	UNAUTHORIZED,
	FORBIDDEN,
	NOT_FOUND,
	INTERNAL,
	CUSTOM,
}: ErrorFactoryService = ErrorFactoryService.getInstance();

// ============================================================
// 5. EJEMPLOS DE USO
// ============================================================

console.log(BAD_REQUEST("Invalid input").TO_JSON());

console.log(
	UNAUTHORIZED("No tienes autorizacion para entrar en esta route").TO_JSON(),
);

console.log(
	FORBIDDEN("No tienes permisos para acceder a este recurso").TO_JSON(),
);

console.log(NOT_FOUND("El recurso solicitado no fue encontrado").TO_JSON());

console.log(INTERNAL().code, INTERNAL().message);

console.log(CUSTOM("Error personalizado", 418).TO_JSON());
