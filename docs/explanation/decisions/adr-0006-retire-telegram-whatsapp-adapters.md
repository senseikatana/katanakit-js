---
title: "ADR-0006: Retire the Telegram and WhatsApp adapters"
description: Both channel adapters are removed from the exports map in v7; the rule in ADR-0003 stands, its list is shorter.
---

# ADR-0006: Retire the Telegram and WhatsApp adapters

**Status:** Accepted · **Date:** 2026-10-18 (released in v7.0.0)
**Amends:** [ADR-0003](/explanation/decisions/adr-0003-adapter-subpath-exports)

## Context

ADR-0003 publishes every framework adapter only through the `exports` map, so
`/telegram` and `/whatsapp` became public subpath API. Both then carried
defects that the Safe Result contract exists to prevent:

- `useSendMessage` and `useSendWhatsAppMessage` returned a bare
  `Promise<Response>` from a raw third-party `fetch`, and no caller inspected
  `response.ok`. A revoked token, a `429`, or a provider `4xx` was
  indistinguishable from success — the assistant reported `ok`, nothing was
  delivered, and no error surfaced.
- The WhatsApp webhook acknowledged `200` **before** attempting the reply
  ("ack fast so Meta does not retry"), so a failed send could never be retried
  by the provider and never surfaced an error on either end.
- Both adapters depended on `express-rate-limit`, which is declared as a hard
  runtime `dependency` even though it is reachable only from these two
  subpaths.

The adapters were never used by the maintainer. The maintenance cost was real
and the correctness cost was a silent failure mode, not a loud one.

## Decision

Remove `src/adapters/telegram/` and `src/adapters/whatsapp/`, their tests,
their guide pages, and the `./adapters/telegram` and `./adapters/whatsapp`
entries from `package.json#exports`. The assistant keeps its REST channel, its
session store and its free-form `channel` tag — only the two shipped channel
implementations go away.

This is a **breaking change**, released as **7.0.0**. ADR-0003's *rule* — every
adapter lives on a subpath, every framework is an optional peer — is unchanged
and still applies to the 24 remaining subpaths. Only its enumeration shrinks.

ADR-0003 is left untouched on purpose. Its list was accurate when written, and
a superseded record is not rewritten; this record amends it.

## Consequences

**Better.** Two adapters that failed silently are gone instead of patched. The
`exports` map no longer advertises entry points that no one uses. The
assistant's channel surface is one transport instead of three, and the example
in `examples/assistant` no longer branches on `KITT_CHANNEL`.

**Worse.** Anyone importing `katanakit-js/adapters/telegram` or
`/adapters/whatsapp` gets `ERR_PACKAGE_PATH_NOT_EXPORTED` on upgrade and must
pin `^6` or call the provider API directly. The assistant loses its
long-polling channel, which needed no public URL, and its Meta webhook
integration with `X-Hub-Signature-256` verification.

**Not fixed by this record.** `express-rate-limit` remains a hard runtime
`dependency`. It is now reachable only from `src/adapters/assistant`, which
still imports it, so the ADR-0003 peer-dependency rule is still violated —
narrower, but not closed. Moving it to an optional peer is separate work.

## Links

- [ADR-0003 — adapter subpath exports](/explanation/decisions/adr-0003-adapter-subpath-exports)
- [Architecture](/guides/architecture) — the exports map in context.
- [Assistant (Kitt)](/guides/assistant) — the surviving REST channel.
- [Upgrade to v6](/guides/upgrade-to/v6) — the v6 rename tables, annotated.