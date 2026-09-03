import type { ICryptoStrategy, IUuidStrategy } from "../../types";

/**
 * Loads the Node.js `crypto` module lazily, only when `useEncrypt` is invoked.
 *
 * NOTE: this is a one-way hash demo, not a credential store. Do not rely on the
 * fixed default salt for real password hashing; prefer scrypt/argon2id instead.
 */
export class LazyNodeCryptoStrategy implements ICryptoStrategy {
	async useEncrypt(plainText: string, salt?: string): Promise<string> {
		const cryptoModule = await import("node:crypto");
		// Supports both CJS and pure ESM environments.
		const cryptoInstance = cryptoModule.default ?? cryptoModule;

		// Generate a random salt if none is provided (128 bits).
		const actualSalt = salt ?? cryptoInstance.randomBytes(16).toString("hex");
		const hash = cryptoInstance.pbkdf2Sync(plainText, actualSalt, 100000, 64, "sha512").toString("hex");

		return `${actualSalt}:${hash}`;
	}
}

/**
 * Native UUID strategy using `globalThis.crypto.randomUUID`, with a fallback.
 */
export class NativeUuidStrategy implements IUuidStrategy {
	useGenerate(): string {
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

	public useNumericId = (): number => ++this.counter;

	public useUuid = (): string => this.uuidStrategy.useGenerate();

	public useSlugify = (text: string): string => {
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

	public useToken = (): number => {
		if (typeof globalThis.crypto?.getRandomValues === "function") {
			const buffer = new Uint32Array(1);
			globalThis.crypto.getRandomValues(buffer);
			return 100000 + (buffer[0] % 900000);
		}
		return Math.floor(100000 + Math.random() * 900000);
	};

	public useEncrypt = async (plainText: string, salt = "default-salt"): Promise<string> =>
		this.cryptoStrategy.useEncrypt(plainText, salt);
}

// Singleton instance and destructured exports.
export const { useSlugify, useUuid, useNumericId, useToken, useEncrypt }: GeneratorService =
	GeneratorService.getInstance();
