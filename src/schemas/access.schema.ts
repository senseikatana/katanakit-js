import { z } from "zod";

/** Built-in roles, ordered from most to least privileged. */
export const AccessRoleSchema = z.enum(["owner", "admin", "editor", "author", "member", "guest"]);

/**
 * Namespaced capabilities derived from the project domain.
 * Format: `<domain>:<action>[:<scope>]`.
 */
export const AccessCapabilitySchema = z.enum([
	"content:create",
	"content:publish",
	"content:edit:own",
	"content:edit:any",
	"content:delete:own",
	"content:delete:any",
	"conversations:use",
	"conversations:moderate",
	"members:manage",
	"roles:assign",
	"system:admin",
]);

/** A role definition: slug, human label and the capabilities it grants. */
export const AccessRoleDefinitionSchema = z.object({
	slug: AccessRoleSchema,
	label: z.string().min(1),
	capabilities: z.array(AccessCapabilitySchema),
});

/**
 * Structural subject for access checks. Decoupled from the persistence layer:
 * any object with an id and a role list can be checked (e.g. a Prisma
 * `Account` row, a JWT payload, or a test fixture).
 */
export const AccessSubjectSchema = z.object({
	id: z.union([z.string(), z.number()]),
	roles: z.array(AccessRoleSchema),
});
