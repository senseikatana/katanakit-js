export type LogLevel = "log" | "info" | "warn" | "error" | "debug";

// 1. Interfaz Strategy: define el contrato de salida usando tipos seguros
export interface LogStrategy {
	output(level: LogLevel, message: string, data?: unknown): void;
}

// 2. Estrategia Concreta: salida por consola nativa
export class ConsoleStrategy implements LogStrategy {
	output(level: LogLevel, message: string, data?: unknown): void {
		if (data !== undefined) {
			console[level](`[${level.toUpperCase()}] ${message}`, data);
			return;
		}
		console[level](`[${level.toUpperCase()}] ${message}`);
	}
}

// 3. Singleton Context: gestiona la estrategia y mantiene el contexto 'this' intacto
export class LoggerService {
	private static instance: LoggerService;
	private strategy: LogStrategy;

	private constructor() {
		this.strategy = new ConsoleStrategy();
	}

	public static getInstance(): LoggerService {
		if (!LoggerService.instance) {
			LoggerService.instance = new LoggerService();
		}
		return LoggerService.instance;
	}

	public setStrategy(strategy: LogStrategy): void {
		this.strategy = strategy;
	}

	// Sobrecargas para permitir:
	// - Solo mensaje: LOGGER("mensaje")
	// - Mensaje + Data: LOGGER("mensaje", { id: 1 })
	// - Nivel + Mensaje + Data: LOGGER("error", "falló algo", { code: 500 })
	public log: {
		(message: string, data?: unknown): void;
		(level: LogLevel, message: string, data?: unknown): void;
	} = (param1: LogLevel | string, param2?: unknown, param3?: unknown): void => {
		const levels: LogLevel[] = ["log", "info", "warn", "error", "debug"];

		if (levels.includes(param1 as LogLevel)) {
			const level = param1 as LogLevel;
			const message =
				typeof param2 === "string" ? param2 : String(param2 ?? "");
			this.strategy.output(level, message, param3);
			return;
		}

		const message = param1;
		this.strategy.output("info", message, param2);
	};

	public error = (message: string, data?: unknown): void => {
		this.strategy.output("error", message, data);
	};

	public clear = (): void => {
		console.clear();
	};

	public table = (data: unknown): void => {
		console.table(data);
	};
}

// 4. Instancia Singleton y exportación directa
export const {
	clear: LOGGER_CLEAR,
	log: LOGGER,
	error: LOGGER_ERROR,
	table: LOGGER_TABLE,
} = LoggerService.getInstance();
