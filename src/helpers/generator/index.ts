// ============================================================
/** biome-ignore-all lint/style/useNodejsImportProtocol: <explanation> */
// 1. ESTRATEGIAS (STRATEGY PATTERN)
// ============================================================

export interface ICryptoStrategy {
	ENCRYPT(plainText: string, salt?: string): Promise<string>;
}

export interface IUuidStrategy {
	GENERATE(): string;
}

// Estrategia que carga crypto únicamente al invocar ENCRYPT()
export class LazyNodeCryptoStrategy implements ICryptoStrategy {
	async ENCRYPT(
		plainText: string,
		salt: string = "default-salt",
	): Promise<string> {
		const cryptoModule = await import("crypto");
		// Soporte compatible tanto para CJS como para ESM puro
		const cryptoInstance = cryptoModule.default ?? cryptoModule;

		const rounds = cryptoInstance.randomBytes(32).toString("hex");
		const hash = cryptoInstance
			.pbkdf2Sync(plainText, salt, 100000, 64, "sha512")
			.toString("hex");

		return `${rounds}:${hash}`;
	}
}

// Estrategia UUID nativa (usa globalThis.crypto si existe, o fallback sin imports)
export class NativeUuidStrategy implements IUuidStrategy {
	GENERATE(): string {
		if (
			typeof globalThis.crypto !== "undefined" &&
			typeof globalThis.crypto.randomUUID === "function"
		) {
			return globalThis.crypto.randomUUID();
		}
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
			const r = (Math.random() * 16) | 0;
			const v = c === "x" ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}
}

// ============================================================
// 2. SERVICIO FACHADA (SINGLETON PATTERN)
// ============================================================

export default class GeneratorService {
	private static instance: GeneratorService;
	private counter: number = 0;

	private cryptoStrategy: ICryptoStrategy;
	private uuidStrategy: IUuidStrategy;

	private constructor(
		cryptoStrategy: ICryptoStrategy = new LazyNodeCryptoStrategy(),
		uuidStrategy: IUuidStrategy = new NativeUuidStrategy(),
	) {
		this.cryptoStrategy = cryptoStrategy;
		this.uuidStrategy = uuidStrategy;
	}

	public static getInstance(): GeneratorService {
		if (!GeneratorService.instance) {
			GeneratorService.instance = new GeneratorService();
		}
		return GeneratorService.instance;
	}

	protected SET_CRYPTO_STRATEGY = (strategy: ICryptoStrategy): void => {
		this.cryptoStrategy = strategy;
	};

	protected SET_UUID_STRATEGY = (strategy: IUuidStrategy): void => {
		this.uuidStrategy = strategy;
	};

	public NUMERIC_ID = (): number => ++this.counter;

	public UUID = (): string => this.uuidStrategy.GENERATE();

	public SLUGIFY = (text: string): string => {
		if (!text) throw new Error("Text is required for slugify");

		return text
			.toString()
			.trim()
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/\s+/g, "-")
			.replace(/[^\w-]+/g, "")
			.replace(/--+/g, "-")
			.replace(/^-+/, "")
			.replace(/-+$/, "");
	};

	public TOKEN = (): number => Math.floor(100000 + Math.random() * 900000);

	public ENCRYPT = async (
		plainText: string,
		salt: string = "default-salt",
	): Promise<string> => {
		return this.cryptoStrategy.ENCRYPT(plainText, salt);
	};
}

// ============================================================
// 3. EXPORTACIÓN SEGURA
// ============================================================

export const { SLUGIFY, UUID, NUMERIC_ID, TOKEN, ENCRYPT }: GeneratorService =
	GeneratorService.getInstance();

// ============================================================
// 4. EJECUCIÓN (Manejando la promesa de ENCRYPT)
// ============================================================

console.log("UUID:", UUID());
console.log("NUMERIC_ID:", NUMERIC_ID());
console.log("SLUGIFY:", SLUGIFY("Hello World! This is a test."));
console.log("TOKEN:", TOKEN());

// ENCRYPT retorna una promesa, se resuelve con await o .then():
ENCRYPT("Hello, World!", "default-salt").then((encryptedHash) => {
	console.log("ENCRYPT:", encryptedHash);
});
