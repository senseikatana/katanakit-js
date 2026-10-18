---
title: Access Control
description: "Roles, capabilities and hierarchy — the authorization half of security, and how it differs from authentication."
---

# Access Control

`access.service.ts` answers one question: **may this subject do this thing?**
It ships no identity provider. Authentication is somebody else's job.

## Authentication vs Authorization

These are two different questions, and conflating them is one of the most
common causes of a security bug.

| | **Authentication** | **Authorization** |
| --- | --- | --- |
| Question | *Who are you?* | *What may you do?* |
| Verifies | A credential | A permission |
| Input | Password, token, session cookie, OAuth callback | A subject and a capability |
| Failure means | `401 Unauthorized` | `403 Forbidden` |
| Implemented by | Better Auth, your IdP, your session layer | `AccessService` |
| Page | [Better Auth](/guides/better-auth) | This page |

**They are independent.** You can be perfectly authenticated and still not
allowed to do something — that is the normal case for an ordinary user hitting
an admin route. And a request can be *neither* authenticated *nor* authorized:
it never got far enough to be identified.

The order matters, and this is where hand-rolled guards usually go wrong:

```ts
// 1. Who is this?          -> null means we do not know. 401.
// 2. May they do this?      -> false means we know, and no. 403.
const subject = resolveSubject(request);

if (!subject) return response.status(401).end();       // Authentication failed
if (!useCan(subject, "content:publish")) {
  return response.status(403).end();                    // Authorization failed
}
```

Returning `403` for an unknown subject is the classic error: it tells an
anonymous attacker *that the route exists* and *that some account would be
allowed*, which is reconnaissance for free. Returning `200` because the subject
is unknown is worse. `useRequireCapability()` implements both steps in the
right order, and fails closed on a malformed subject.

### Where the boundary sits

```ts
import { useRequireCapability } from "katanakit-js/adapters/express";
```

The guard never authenticates. You hand it a function that maps the request to
a subject — a JWT payload, a session row, an API key lookup:

```ts
useStartAssistant(3000, "localhost", "/assistant", {
  guard: useRequireCapability("conversations:use", (request) => request.account ?? null),
});
```

Returning `null` produces `401`. A subject without the capability produces
`403`.

## The roles

Six built-in roles, ordered from most to least privileged. Every role
**inherits everything from the roles below it**, so the table lists only what
each role *adds*.

| Role | Rank | Adds | Effectively can |
| --- | --- | --- | --- |
| `owner` | 0 | `roles:assign`, `system:admin` | Everything, including granting roles and administering the system. **The developer seat.** |
| `admin` | 1 | `members:manage` | Everything an owner can, minus role assignment — manage members |
| `editor` | 2 | `content:publish`, `content:edit:any`, `content:delete:any`, `conversations:moderate` | Edit and delete **anyone's** content, publish, moderate conversations |
| `author` | 3 | `content:create`, `content:edit:own`, `content:delete:own` | Create content and manage **only their own** |
| `member` | 4 | `conversations:use` | Use the assistant, nothing else |
| `guest` | 5 | *(none)* | Read-only, where reading is public |

The hierarchy is the point: an `editor` can publish because publishing is
*above* them in the rank, not because it was listed for them.

```ts
useCan({ id: 1, roles: ["editor"] }, "content:publish");     // true  (inherited + own)
useCan({ id: 1, roles: ["editor"] }, "content:edit:any");    // true  (own)
useCan({ id: 1, roles: ["editor"] }, "roles:assign");        // false (above)
useCan({ id: 2, roles: ["author"] }, "content:edit:any");    // false (below)
```

## `owner` is the developer seat

`owner` sits above `admin` on purpose and exists for a specific person: **you,
the developer, or whoever runs the deployment**. It is the only role that can
grant other roles (`roles:assign`) and the only one with `system:admin`.

In practice this is how you keep yourself out of day-to-day user management.
Give staff `admin` — they manage members, content and conversations. Keep
`owner` for the handful of accounts that configure the system itself.

> **Do not hand `owner` to a shared account.** It is a single point of
> compromise that bypasses every other role. One named human (plus a break-glass
> account in a password manager) is the usual shape.

## Capabilities

Capabilities are namespaced strings, `<domain>:<action>[:<scope>]`. The scope
suffix is what keeps `edit:own` and `edit:any` from being confused:

| Capability | Meaning |
| --- | --- |
| `content:create` | Create a draft |
| `content:publish` | Publish — the editor's threshold |
| `content:edit:own` / `content:delete:own` | Act on your own content only |
| `content:edit:any` / `content:delete:any` | Act on **anyone's** content |
| `conversations:use` | Talk to the assistant |
| `conversations:moderate` | Moderate other users' conversations |
| `members:manage` | Invite, remove and change user roles |
| `roles:assign` | Change which role a user holds |
| `system:admin` | System-level administration |

A `subject` is structural, not a database row:

```ts
interface AccessSubject {
  id: string | number;
  roles: AccessRole[];
}
```

That keeps the core free of any persistence concern — a Prisma `Account`, a JWT
payload and a test fixture all satisfy it.

```ts
useCan({ id: user.id, roles: user.roles }, "content:publish");
```

## The two strategies

`AccessService` resolves capabilities through a strategy, and ships two.

**`HierarchicalAccessStrategy` (default)** — a role inherits every capability of
the roles below it, per the table above.

**`FlatAccessStrategy`** — no inheritance. A role grants exactly the
capabilities listed for it, nothing more. Use it when a role must be *exactly*
what it says — for example, granting `author` without the `conversations:use`
that `author` would otherwise pick up from `member`.

```ts
import { AccessService, FlatAccessStrategy } from "katanakit-js";

AccessService.getInstance().useSetStrategy(new FlatAccessStrategy());
```

Under the flat strategy the built-in table must list each role's *complete*
capability set, because nothing is inherited. Check
[`useRoles()`](/api/) for the resolved registry before relying on it.

## Subjects can hold several roles

Roles union — a subject is allowed anything any of their roles allows. This is
how you model "an author who is also a support agent" without inventing a new
role.

```ts
const subject = { id: 7, roles: ["member", "author"] };

useCan(subject, "conversations:use");  // true  — from member
useCan(subject, "content:create");     // true  — from author
useCan(subject, "conversations:moderate"); // false
```

## Extending the registry

`useRegisterRole` adds or replaces a definition. Because capabilities are a Zod
enum, a custom role must reuse existing capabilities — the registry is
designed for a fixed vocabulary of permissions with a new grouping of them, not
for inventing permissions per tenant.

```ts
import { useRegisterRole } from "katanakit-js";

useRegisterRole({
  slug: "moderator",           // needs a custom AccessRole schema first
  label: "Moderator",
  capabilities: ["conversations:use", "conversations:moderate"],
});
```

> Registering a new `slug` requires widening `AccessRoleSchema`, which is a
> change to the public enum. Prefer **assigning existing roles** unless the
> domain genuinely needs a new one.

`useResetRoles()` restores the built-ins — useful between tests, since the
registry is process-global.

## Ownership is not a capability

A role answers *what kind of thing* a subject may do; it does not answer *which
instance*. `content:edit:own` says "edit your own content", and enforcing the
"own" part is still your job:

```ts
router.put("/articles/:id", (req, res) => {
  const subject = resolveSubject(req);
  if (!subject) return res.status(401).end();
  if (!useCan(subject, "content:edit:any")) {
    const article = load(req.params.id);
    // The "own" half needs the resource, not the role.
    if (article.authorId !== subject.id) return res.status(403).end();
  }
  res.json(update(req.params.id, req.body));
});
```

Skipping the resource check and trusting `edit:own` alone is an IDOR. The role
narrows the set; your handler confirms membership.

## Related

- [Better Auth](/guides/better-auth) — the authentication half.
- [Error Handling](/guides/errors) — Safe Results and the error shapes used by
  the guard.
- [API Reference](/api/classes/AccessService) — generated from source.