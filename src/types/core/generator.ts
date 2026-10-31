/** Contract for a crypto strategy. */
export interface ICryptoStrategy {
	useHash(plainText: string, salt?: string): Promise<string>;
}

/** Contract for a UUID strategy. */
export interface IUuidStrategy {
	useGenerate(): string;
}
