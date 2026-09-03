/**
 * Contract for a crypto strategy.
 */
export interface ICryptoStrategy {
	ENCRYPT(plainText: string, salt?: string): Promise<string>;
}

/**
 * Contract for a UUID strategy.
 */
export interface IUuidStrategy {
	GENERATE(): string;
}

/**
 * Loads the Node.js `crypto` module lazily, only when `ENCRYPT` is invoked.
 */
export class LazyNodeCryptoStrategy implements ICryptoStrategy {
	async ENCRYPT(plainText: string, salt = "default-salt"): Promise<string> {
		const cryptoModule = await import("node:crypto");
		// Supports both CJS and pure ESM environments.
		const cryptoInstance = cryptoModule.default ?? cryptoModule;

		const rounds = cryptoInstance.randomBytes(32).toString("hex");
		const hash = cryptoInstance.pbkdf2Sync(plainText, salt, 100000, 64, "sha512").toString("hex");

		return `${rounds}:${hash}`;
	}
}

/**
 * Native UUID strategy using `globalThis.crypto.randomUUID`, with a fallback.
 */
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

/**
 * Generator facade (Singleton + Strategy) for ids, slugs, tokens and hashing.
 */
export default class GeneratorService {
	private static instance: GeneratorService;
	private counter = 0;

	private cryptoStrategy: ICryptoStrategy;
	private uuidStrategy: IUuidStrategy;

	private constructor() {
		this.cryptoStrategy = new LazyNodeCryptoStrategy();
		this.uuidStrategy = new NativeUuidStrategy();
	}

	public static getInstance(): GeneratorService {
		if (!GeneratorService.instance) {
			GeneratorService.instance = new GeneratorService();
		}
		return GeneratorService.instance;
	}

	public NUMERIC_ID = (): number => ++this.counter;

	public UUID = (): string => this.uuidStrategy.GENERATE();

	public SLUGIFY = (text: string): string => {
		if (!text) throw new Error("Text is required for slugify");

		return text
			.toString()
			.trim()
			.toLowerCase()
			.normalize("NFD")
			.replace(/\p{M}/gu, "")
			.replace(/\s+/g, "-")
			.replace(/[^\w-]+/g, "")
			.replace(/--+/g, "-")
			.replace(/^-+/, "")
			.replace(/-+$/, "");
	};

	public TOKEN = (): number => Math.floor(100000 + Math.random() * 900000);

	public ENCRYPT = async (plainText: string, salt = "default-salt"): Promise<string> =>
		this.cryptoStrategy.ENCRYPT(plainText, salt);
}

// Singleton instance and destructured exports.
export const { SLUGIFY, UUID, NUMERIC_ID, TOKEN, ENCRYPT }: GeneratorService =
	GeneratorService.getInstance();
