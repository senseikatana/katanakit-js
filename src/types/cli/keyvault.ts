import type { z } from "zod";

import {
	EncryptedVaultSchema,
	KeyRecordSchema,
	KeyStatusSchema,
	McpServerSchema,
	VaultDataSchema,
} from "@/schemas/keyvault.schema.js";

/** Lifecycle status of a stored API key. */
export type KeyStatus = z.infer<typeof KeyStatusSchema>;

/** One API key record as stored in the vault. */
export type KeyRecord = z.infer<typeof KeyRecordSchema>;

/** Input accepted when creating a key record (id/status/timestamps are assigned). */
export interface KeyRecordInput {
	provider: string;
	label: string;
	secret: string;
	note?: string;
}

/** One MCP server registry entry. */
export type McpServerEntry = z.infer<typeof McpServerSchema>;

/** Input accepted when creating an MCP server entry. */
export type McpServerInput = z.input<typeof McpServerSchema>;

/** Decrypted vault payload — the complete state of the key manager. */
export type VaultData = z.infer<typeof VaultDataSchema>;

/** Encrypted vault file as stored on disk. */
export type EncryptedVault = z.infer<typeof EncryptedVaultSchema>;

/** A coding tool whose configuration the key manager can generate. */
export interface AgentDefinition {
	id: string;
	name: string;
	description: string;
	docsUrl: string;
	configPath: string;
}

/** Input accepted when emitting agent configuration. */
export interface AgentConfigInput {
	provider: string;
	secret: string;
	/** Environment variable name the tool should read; defaults per provider. */
	apiKeyEnv?: string;
	/** Optional gateway/proxy endpoint. */
	baseUrl?: string;
	/** MCP servers to embed in the generated config. */
	mcpServers?: McpServerEntry[];
	/** Emit real secret values; when omitted every printed value is masked. */
	reveal?: boolean;
}

/** One file the auto-configuration would write. */
export interface AgentConfigFile {
	path: string;
	content: string;
}

/** One "manual connection" line (env export, endpoint, …). */
export interface AgentConfigManualEntry {
	label: string;
	value: string;
}

/** Output of agent config emission: files, manual entries and safety notes. */
export interface AgentConfigOutput {
	agent: AgentDefinition;
	files: AgentConfigFile[];
	manual: AgentConfigManualEntry[];
	notes: string[];
}
