import type { ICryptoStrategy, IUuidStrategy } from "../../types/index.js";
/**
 * Loads the Node.js `crypto` module lazily, only when `useEncrypt` is invoked.
 *
 * NOTE: this is a one-way hash demo, not a credential store. Do not rely on the
 * fixed default salt for real password hashing; prefer scrypt/argon2id instead.
 */
export declare class LazyNodeCryptoStrategy implements ICryptoStrategy {
    useEncrypt(plainText: string, salt?: string): Promise<string>;
}
/**
 * Native UUID strategy using `globalThis.crypto.randomUUID`, with a fallback.
 */
export declare class NativeUuidStrategy implements IUuidStrategy {
    useGenerate(): string;
}
/**
 * Generator facade (Singleton + Strategy) for ids, slugs, tokens and hashing.
 */
export default class GeneratorService {
    private static instance;
    private counter;
    private cryptoStrategy;
    private uuidStrategy;
    private constructor();
    static getInstance(): GeneratorService;
    useNumericId: () => number;
    useUuid: () => string;
    useSlugify: (text: string) => string;
    useToken: () => number;
    useEncrypt: (plainText: string, salt?: string) => Promise<string>;
}
export declare const useSlugify: (text: string) => string, useUuid: () => string, useNumericId: () => number, useToken: () => number, useEncrypt: (plainText: string, salt?: string) => Promise<string>;
//# sourceMappingURL=generator.service.d.ts.map