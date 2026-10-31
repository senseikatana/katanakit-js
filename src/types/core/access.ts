import type { z } from "zod";

import {
	AccessCapabilitySchema,
	AccessRoleDefinitionSchema,
	AccessRoleSchema,
	AccessSubjectSchema,
	BUILT_IN_CAPABILITIES,
	BUILT_IN_ROLE_SLUGS,
} from "@/schemas/access.schema.js";

/**
 * Role slugs the kit ships with. A convenience alias for autocomplete — the
 * schema itself accepts any slug, and deployments register their own.
 */
export type BuiltInRole = (typeof BUILT_IN_ROLE_SLUGS)[number];

/**
 * Capabilities the kit ships with. A convenience alias for autocomplete — the
 * schema itself accepts any `<domain>:<action>[:<scope>]` string.
 */
export type BuiltInCapability = (typeof BUILT_IN_CAPABILITIES)[number];

/**
 * A role slug. Closed vocabulary by convention (`BuiltInRole`), open by
 * schema: `useRegisterRole` takes any slug matching the pattern.
 *
 * - `owner` — the site owner; the only role that can manage roles and perform
 *   system-level operations. There should be exactly one owner.
 * - `admin` — day-to-day administration: manage members and moderate anything.
 * - `editor` — act on anyone's resource.
 * - `author` — create and act on their own, including publishing.
 * - `contributor` — act on their own but not publish.
 * - `member` — registered account; can use the assistant and read content.
 * - `guest` — anonymous default; read-only, never persisted.
 */
export type AccessRole = z.infer<typeof AccessRoleSchema>;

/**
 * A namespaced capability, `<domain>:<action>[:<scope>]`.
 *
 * Independent of how the subject authenticated: a role never reveals whether
 * the session came from a password, an OAuth provider or a passkey.
 */
export type AccessCapability = z.infer<typeof AccessCapabilitySchema>;

/** A role definition: slug, label, hierarchy rank and the capabilities it grants. */
export type AccessRoleDefinition = z.infer<typeof AccessRoleDefinitionSchema>;

/**
 * Structural subject for access checks. Decoupled from the persistence layer:
 * any object with an id and a role list can be checked (e.g. a Prisma
 * `Account` row, a JWT payload, or a test fixture). Extra keys are preserved,
 * so a subject can also carry the principal it was resolved from.
 */
export type AccessSubject = z.infer<typeof AccessSubjectSchema>;

/** Contract of the access-control facade. Pure, no I/O. */
export interface IAccessService {
	useCan(subject: AccessSubject, capability: AccessCapability): boolean;
	useHasRole(subject: AccessSubject, role: AccessRole): boolean;
	useCapabilitiesFor(role: AccessRole): AccessCapability[];
	useRegisterRole(definition: AccessRoleDefinition): void;
	useRoles(): AccessRoleDefinition[];
}
