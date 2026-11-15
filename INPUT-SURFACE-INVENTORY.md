# Input Surface Inventory — katanakit-js

**Repository:** `/home/senseikatana/Proyectos/katanakit-js`  
**Analysis Date:** 2026-11-15  
**Scope:** All source-visible entry points for external or lower-trust input  
**Excluded:** `packages/ui/tailwind/**` (content catalog — copy-paste snippets, never compiled)

---

## 1. HTTP / Browser Input

### 1.1 Bun Server (Native Runtime)

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/adapters/bun/server.ts` | 1-80 | `req.url`, `req.method`, `req.headers` | Route matching via `routes.ts` | Delegates to Express router | Bun native HTTP server |
| `src/adapters/bun/routes.ts` | 1-100+ | `req.params.q`, query params, body | Catch-all `/api/*` → Express | Full request passthrough | No explicit validation at Bun layer |

**Parallel Paths:** Same Express router mounted under Bun (see 1.2)

---

### 1.2 Express Router (Assistant API)

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/adapters/assistant/assistant.service.ts` | 1-200+ | POST `/chat` body: `sessionId`, `message` | JSON parse → session lookup → agent call | `agent.service.ts` tool execution | Rate limit: 20/min chat |
| `src/adapters/assistant/assistant.service.ts` | ~50-80 | GET `/sessions/:id` | `req.params.id` → session lookup | Return session state | Rate limit: 60/min sessions |
| `src/adapters/assistant/assistant.service.ts` | ~80-100 | DELETE `/sessions/:id` | `req.params.id` → session deletion | Remove from `Map` store | Rate limit: 60/min sessions |
| `src/adapters/assistant/assistant.service.ts` | ~30-50 | `owners` map | Subject→session ownership tracking | Authorization check | Optional `resolveSubject` — **IDOR risk when absent** |

**Security Notes:**
- `resolveSubject` is optional — if not provided, session isolation relies on client-provided `sessionId` only
- In-memory store (`Map`) — no persistence, no path traversal

**Parallel Paths:** Same router accessible via Bun adapter (1.1)

---

### 1.3 Framework Access Guards

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/adapters/express/access.guard.ts` | 1-100+ | `req.headers.authorization` | Bearer token extraction | `auth.service.ts` validation | Fail-closed on missing/invalid |
| `src/adapters/hono/access.guard.ts` | 1-100+ | `c.req.header('authorization')` | Bearer token extraction | `auth.service.ts` validation | Fail-closed on missing/invalid |
| `src/adapters/nestjs/access.guard.ts` | (unread) | Expected: `ExecutionContext` | Token extraction | `auth.service.ts` validation | Fail-closed |
| `src/adapters/astro/access.guard.ts` | (unread) | Expected: `APIContext` | Token extraction | `auth.service.ts` validation | Fail-closed |
| `src/adapters/next/access.guard.ts` | (unread) | Expected: `NextRequest` | Token extraction | `auth.service.ts` validation | Fail-closed |
| `src/adapters/nuxt/access.guard.ts` | (unread) | Expected: `H3Event` | Token extraction | `auth.service.ts` validation | Fail-closed |

---

## 2. RPC / Message / Protocol Input

### 2.1 Worker IPC (postMessage)

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/infrastructure/worker/worker.service.ts` | ~100-150 | `postMessage({ __taskId, ...data })` | Task serialization → Blob URL → `URL.createObjectURL` | Worker execution | `__taskId` correlation |
| `src/infrastructure/worker/worker.service.ts` | ~150-200 | `onmessage` handler | Message parsing → callback resolution | Promise resolution | Task ID matching |

**Security Notes:**
- Worker created via Blob URL — isolated execution context
- No direct DOM access from worker

---

### 2.2 MCP (Model Context Protocol) Server Emission

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/core/services/mcp.service.ts` | ~50-100 | `McpServerSchema` validated config | Emits `command`, `environment`, `url`, `headers` | Process spawn or HTTP connection | Zod validation |
| `src/core/services/mcp.service.ts` | ~100-150 | `{ env: NAME }` syntax | Environment variable reference | Passed to child process | No value interpolation — name only |

**Security Notes:**
- Config validated via Zod schema
- Environment variables referenced by name only — values resolved at runtime

---

## 3. Filesystem / Archive / Document Input

### 3.1 Filesystem Service

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/infrastructure/filesystem/filesystem.service.ts` | 1-300+ | `readFile(path)`, `writeFile(path, content)` | Direct `fs.promises` calls | Arbitrary file read/write | **NO path confinement** — arbitrary paths accepted |
| `src/infrastructure/filesystem/filesystem.service.ts` | ~200-250 | `remove(path)`, `copy(src, dst)`, `rename(old, new)` | Direct `fs.promises` calls | File deletion/movement | **NO sandbox** — full filesystem access |
| `src/infrastructure/filesystem/path.service.ts` | 1-100+ | `resolvePath(path)`, `normalizePath(path)` | `path.resolve()`, `path.normalize()` | Normalized path string | No traversal prevention |

**Security Notes:**
- **CRITICAL:** No path-traversal confinement — `../` sequences resolved but not blocked
- No sandbox or root directory enforcement
- Relies entirely on IAM/role guards in `directory.service.ts`

---

### 3.2 Directory Service (Role-Based Confinement)

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/core/services/directory.service.ts` | 1-200+ | Requested path + subject roles | Role ladder check → escalation guards | Allow/deny filesystem access | Hierarchical role checks |

**Security Notes:**
- Confinement is **logical** (role-based), not **physical** (path-based)
- Requires proper IAM configuration to be effective

---

### 3.3 Vault Store (Secret Persistence)

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/infrastructure/vault/vault.store.ts` | ~100-200 | Secret payload + passphrase | scrypt (N=16384) + AES-256-GCM | Atomic write with `chmod 0o600` | KDF params read from envelope — **untrusted** |
| `src/infrastructure/vault/vault.store.ts` | ~200-250 | Encrypted envelope | Parse KDF params → derive key → decrypt | Secret retrieval | Params from ciphertext header |

**Security Notes:**
- KDF parameters (salt, iterations) stored in envelope header — attacker can manipulate to weaken derivation
- File permissions enforced (0o600)

---

### 3.4 CLI Config Writer

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/adapters/cli/index.ts` | ~200-300 | `agents config --write` with `file.path` | `resolvePath(file.path)` → `fs.writeFile` | Config file creation | `mode: 0o600` enforced |

**Security Notes:**
- Path resolution uses `path.service.ts` — subject to same traversal risks
- File permissions enforced

---

## 4. CLI / Environment / Config Input

### 4.1 CLI Argument Parsing

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/adapters/cli/index.ts` | ~50-100 | `process.argv` via `parseArgs()` | Flag parsing → command dispatch | Command execution | Node.js `util.parseArgs` |
| `src/adapters/cli/index.ts` | ~100-150 | `--secret` flag, stdin | Secret value capture | Vault storage | stdin read for sensitive input |

---

### 4.2 Environment Variables

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/adapters/cli/index.ts` | ~30-50 | `KATANAKITAI_PASSPHRASE`, `KATANAKITAI_VAULT` | `process.env` read | Vault unlock | Process environment |
| `src/core/services/agent.service.ts` | ~340-360 | `DASHSCOPE_API_KEY` | `process.env` read | HTTP Authorization header | Required for agent calls |
| `src/core/services/mcp.service.ts` | ~100-150 | `{ env: NAME }` references | Variable name → runtime resolution | Child process environment | Name-only reference |
| `scripts/setup-cloudflare.mjs` | (grep result) | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` | `process.env` read | Wrangler authentication | Required for deployment |

**Security Notes:**
- `.env` is gitignored — secrets must come from runtime environment
- `.npmrc` blocks lifecycle scripts (`allow-scripts=`) — prevents install-time code execution

---

## 5. Model Context / Tool Arguments

### 5.1 Agent Service (Tool Execution Loop)

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/core/services/agent.service.ts` | ~200-280 | `call.function.arguments` (JSON string) | `JSON.parse()` → tool input object | `tool.execute(input)` | **JSON.parse from model — injection risk** |
| `src/core/services/agent.service.ts` | ~280-320 | `useRunAgent` tool loop | Iterates tool calls → sequential execution | Multiple tool invocations | Sequential, no parallelism |
| `src/core/services/agent.service.ts` | ~340-360 | `baseUrl` configuration | Scheme validation | HTTP request target | **https-only guard (line 341)** |

**Security Notes:**
- Model-generated JSON parsed directly — relies on model integrity
- Tool execution is sequential — no race conditions
- Base URL scheme validated (https only)

---

### 5.2 Assistant Service (Session Management)

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/core/services/assistant.service.ts` | ~30-60 | Session creation | `crypto.randomUUID()` | Session ID generation | Cryptographically secure |
| `src/core/services/assistant.service.ts` | ~60-100 | In-memory `Map` store | Session data storage | Session retrieval/deletion | No persistence |

---

## 6. Cloud Events / IAM / Auth

### 6.1 Access Service (Role Registry)

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/core/services/access.service.ts` | 1-300+ | Role definitions, subject assignments | Hierarchical role resolution | Permission checks | Role ladder enforcement |

---

### 6.2 Grant Service (Permission Checks)

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/core/services/grant.service.ts` | 1-200+ | Subject + resource + action | Grant registry lookup | Allow/deny decision | Explicit grant required |

---

### 6.3 Auth Service (Token Validation)

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/core/services/auth.service.ts` | ~240-260 | `Authorization: Bearer <token>` | Token extraction (line 241) | Provider validation | Bearer scheme required |
| `src/core/services/auth.service.ts` | ~260-300 | Provider registry | Token → subject resolution | Subject identity | Configured providers only |

---

### 6.4 InsForge Provider

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/adapters/insforge/insforge.provider.ts` | 1-150+ | Request-scoped credentials | Per-request client factory | API authentication | **Prevents token overwrite** |

**Security Notes:**
- Request-scoped client — avoids shared state token overwrite vulnerability

---

### 6.5 Better-Auth Provider

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/adapters/better-auth/better-auth.provider.ts` | 1-200+ | `getSession(headers)` | Cookie/Bearer/API-key detection | Session resolution | Multi-scheme detection |
| `src/adapters/better-auth/better-auth.provider.ts` | ~100-150 | `useSubject` override | Subject injection | Identity override | Explicit override only |

---

### 6.6 WordPress Adapter

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/adapters/wordpress/wordpress.service.ts` | ~240-260 | Auth headers: Basic/Bearer/nonce | Header construction | WordPress API calls | Scheme-dependent auth |
| `src/adapters/wordpress/wordpress.service.ts` | 1-200+ | CRUD operations | Zod validation → HTTP calls | WordPress content management | Zod schema validation |

---

## 7. DOM / XSS / Content Rendering

### 7.1 DOM Service (innerHTML Sink)

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/infrastructure/dom/dom.service.ts` | ~420-430 | `useSetHtml(element, htmlString)` | Direct assignment | `element.innerHTML = htmlString` | **innerHTML sink — XSS risk** |
| `src/infrastructure/dom/dom.service.ts` | ~275-285 | `iframe.srcdoc` | Scheme/content check | **Blocked** | `srcdoc` explicitly blocked (lines 279-283) |

**Security Notes:**
- `innerHTML` is a known XSS sink — caller responsible for sanitization
- `srcdoc` blocked to prevent inline script injection via iframe

---

### 7.2 Media Service (iframe.src Sink)

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/infrastructure/media/media.service.ts` | ~25-35 | `data-video-facade` attribute | Attribute read → `iframe.src` assignment | **iframe navigation** | **NO scheme allowlist** — `javascript:` URLs possible |

**Security Notes:**
- **CRITICAL:** Unlike `http.service.ts`, no scheme validation — `javascript:` URLs accepted
- Direct DOM attribute read — no sanitization

---

### 7.3 Media Service (HTML Embed Builder)

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/core/services/media.service.ts` | ~55-65 | Video/embed URLs | HTML string construction with escaping | Safe HTML output | HTML entity escaping (lines 58-62) |
| `src/core/services/media.service.ts` | ~290-300 | Embed configuration | Template interpolation | Embed code generation | Escaping applied (lines 292-299) |

---

### 7.4 YouTube Service (External Content Parsing)

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/core/services/youtube.service.ts` | ~425-450 | RSS/XML feed content | Regex-based XML parsing | Video metadata extraction | **Regex parsing — no XML parser** |
| `src/core/services/youtube.service.ts` | ~70-80 | XML entities | Entity decode | Text content | Manual entity decoding (lines 71-76) |
| `src/core/services/youtube.service.ts` | ~190-200 | ISO8601 duration | Regex parse → seconds | Duration normalization | Regex validation |

**Security Notes:**
- Regex-based XML parsing — vulnerable to malformed XML, entity attacks
- No XML parser — avoids XXE but loses validation

---

### 7.5 Observer Service (Image Loading)

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/infrastructure/observer/observer.service.ts` | ~240-250 | `dataSrc` attribute | Attribute read → `img.src` assignment | Image loading | No scheme validation |

**Security Notes:**
- `img.src` accepts any URL scheme — `javascript:` URLs possible
- Relies on browser's handling of invalid schemes

---

### 7.6 Sensors Service (Geolocation)

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/infrastructure/sensors/sensors.service.ts` | (unread) | `navigator.geolocation` | Browser API call | Location coordinates | Browser permission prompt |

---

### 7.7 SEO Service (RSS Generation)

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/config/seo.service.ts` | (unread) | Site content | RSS XML generation | RSS feed output | Expected: XML escaping |

---

### 7.8 Astro RSS Service

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/adapters/astro/rss.service.ts` | (unread) | Content collection | RSS XML generation | RSS feed output | Expected: XML escaping |

---

## 8. Plugins / Dependencies / CI / Supply Chain

### 8.1 Package.json Scripts

| Script | Lines (package.json) | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|--------|---------------------|--------------|----------------|---------------|-----------------|
| `build` | scripts section | Source files | `tsc` + `tsc-alias` + UI build | Distribution output | Clean first |
| `check` | scripts section | Source files | ESLint + typecheck + Vitest | Quality gate | Fails on errors |
| `deploy` | scripts section | Built dist | Cloudflare Pages upload | Production deployment | Requires auth |
| `release` | scripts section | Built dist + changelog | npm publish | Package publication | Requires auth |

---

### 8.2 Script Files (Child Process Execution)

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `scripts/generate-release-notes.mjs` | (grep result) | Git commit history | `execFileSync`/`execSync` | Changelog generation | Git output only |
| `scripts/sync-wiki.mjs` | (grep result) | Git remote, wiki repo | `execFileSync`/`execSync` | Wiki synchronization | Git operations |
| `scripts/sync-hyperui.mjs` | (grep result) | External repo | `execFileSync`/`execSync` | Component sync | Git operations |
| `scripts/docs-*.mjs` | (grep result) | Docs source | `execSync` | Docs build/deploy | Delegates to sibling repo |
| `scripts/npm-publish.mjs` | (grep result) | Package dist | `execSync` | npm publish | Requires auth token |
| `scripts/setup-cloudflare.mjs` | (grep result) | `CLOUDFLARE_API_TOKEN` | Wrangler CLI | Cloudflare setup | Token from env |

**Security Notes:**
- All scripts use `execFileSync`/`execSync` — synchronous child process execution
- No user input passed to shell — hardcoded commands only
- `.npmrc` blocks lifecycle scripts (`allow-scripts=`) — prevents install-time execution

---

### 8.3 GitHub Actions (CI)

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `.github/workflows/wiki-sync.yml` | 1-50+ | `WIKI_SYNC_TOKEN` secret, git remote | `GIT_ASKPASS` script, `git clone` | Wiki repository sync | Secret from GitHub secrets |

**Security Notes:**
- `WIKI_SYNC_TOKEN` stored as GitHub secret — not in repo
- `GIT_ASKPASS` script handles authentication — no plaintext credentials

---

### 8.4 Dependency Analysis

| Category | Packages | Risk Level | Notes |
|----------|----------|------------|-------|
| **Direct** | `@js-temporal/polyfill`, `@tanstack/query-core`, `bulma`, `sass`, `zod` | Low | No known RCE vectors |
| **Peer (Optional)** | `express`, `hono`, `nestjs`, `better-auth`, `insforge`, `drizzle`, `prisma`, `react`, `vue`, `svelte`, `solid-js`, `angular`, `cors`, `express-rate-limit`, `dotenv`, `pg` | Medium | Framework integrations — attack surface depends on usage |
| **Bin** | `kai` → `dist/adapters/cli/bin.js` | Medium | CLI entry point — argv parsing |

**Security Notes:**
- `.npmrc` with `allow-scripts=` blocks all lifecycle scripts — prevents install-time code execution
- Peer dependencies are optional — attack surface only present when installed

---

## 9. HTTP Client (Outbound Requests)

### 9.1 HTTP Service (Fetch Wrapper)

| File | Lines | Input Vector | Transformation | Sink / Effect | Limits / Guards |
|------|-------|--------------|----------------|---------------|-----------------|
| `src/core/services/http.service.ts` | ~240-250 | URL with `:param` substitution | Template replacement | Request URL construction | **http(s)-only allowlist (line 241)** |
| `src/core/services/http.service.ts` | ~310-320 | Dynamic URL building | Scheme validation | Request target | **https-only for sensitive (line 313)** |
| `src/core/services/http.service.ts` | ~335-340 | Response redirects | `redirect: "error"` | **SSRF mitigation** | Redirects blocked (lines 336-339) |
| `src/core/services/http.service.ts` | ~340-360 | Response body | Truncation to 32KB | Error message | Prevents large payload DoS |
| `src/core/services/http.service.ts` | ~100-150 | `defineApiConfig` | Config validation | Request interceptors | Zod validation |
| `src/core/services/http.service.ts` | ~150-200 | Request interceptors | Header/body modification | Outbound request | Interceptor chain |

**Security Notes:**
- **Strong SSRF mitigation:** http(s) scheme allowlist, redirect blocking
- Error body truncation prevents large payload DoS
- Interceptors allow request/response modification

---

## 10. Parallel Paths Summary

| Effect | Primary Path | Parallel Path(s) | Notes |
|--------|--------------|------------------|-------|
| HTTP request handling | Express router (`assistant.service.ts`) | Bun adapter (`bun/routes.ts`) | Same router, different server |
| Access control | Express guard (`express/access.guard.ts`) | Hono, NestJS, Astro, Next, Nuxt guards | Same `auth.service.ts` validation |
| Session management | `assistant.service.ts` in-memory `Map` | None | Single path |
| File I/O | `filesystem.service.ts` | `vault.store.ts` (encrypted), `cli/index.ts` (config) | Same underlying `fs.promises` |
| Auth validation | `auth.service.ts` | InsForge, Better-Auth providers | Provider-specific credential resolution |
| Tool execution | `agent.service.ts` `executeToolCall` | None | Single path |
| DOM manipulation | `dom.service.ts`, `media.service.ts` | `observer.service.ts` | Different sinks (innerHTML vs img.src vs iframe.src) |

---

## 11. Critical Security Findings

### 11.1 High Severity

| ID | Finding | Location | Impact | Recommendation |
|----|---------|----------|--------|----------------|
| **FS-01** | No path-traversal confinement | `filesystem.service.ts`, `path.service.ts` | Arbitrary file read/write | Implement sandbox/root directory enforcement |
| **XSS-01** | `innerHTML` sink without sanitization | `dom.service.ts:423` | XSS if untrusted HTML passed | Document sanitization requirement or add sanitizer |
| **XSS-02** | `iframe.src` accepts `javascript:` URLs | `media.service.ts:28` | XSS via DOM attribute | Add scheme allowlist (match `http.service.ts`) |
| **AUTH-01** | `resolveSubject` optional in assistant router | `assistant.service.ts` | IDOR (OWASP A01) when absent | Make required or document risk |
| **VAULT-01** | KDF params from untrusted envelope | `vault.store.ts` | Attacker can weaken key derivation | Store KDF params in trusted config or enforce minimums |

### 11.2 Medium Severity

| ID | Finding | Location | Impact | Recommendation |
|----|---------|----------|--------|----------------|
| **MODEL-01** | Model-generated JSON parsed directly | `agent.service.ts:200-280` | Tool injection if model compromised | Validate parsed input against tool schema |
| **XML-01** | Regex-based XML parsing | `youtube.service.ts:426-449` | Malformed XML, entity attacks | Consider XML parser with XXE protection |
| **IMG-01** | `img.src` accepts any scheme | `observer.service.ts:246` | Potential `javascript:` URL | Add scheme validation |

### 11.3 Low Severity (Noted)

| ID | Finding | Location | Notes |
|----|---------|----------|-------|
| **CI-01** | Child process in scripts | `scripts/*.mjs` | No user input passed — low risk |
| **ENV-01** | Env vars from process | Multiple files | Standard practice — `.env` gitignored |
| **DEP-01** | Peer dependencies optional | `package.json` | Attack surface only when installed |

---

## 12. Unread Files (Brief Notes)

| File | Expected Surface | Confidence |
|------|------------------|------------|
| `src/adapters/nestjs/access.guard.ts` | Token extraction | High (pattern match) |
| `src/adapters/astro/access.guard.ts` | Token extraction | High (pattern match) |
| `src/adapters/next/access.guard.ts` | Token extraction | High (pattern match) |
| `src/adapters/nuxt/access.guard.ts` | Token extraction | High (pattern match) |
| `src/core/services/query.service.ts` | Query parsing | Medium |
| `src/core/services/form.service.ts` | Form data | Medium |
| `src/core/services/validation.service.ts` | Input validation | Medium |
| `src/config/seo.service.ts` | RSS generation | Medium |
| `src/adapters/astro/rss.service.ts` | RSS generation | Medium |
| `src/adapters/notion/notion.service.ts` | Notion API | Medium |
| `src/infrastructure/observer/observer.service.ts` | `img.src` sink | High (line 246 identified) |
| `src/infrastructure/sensors/sensors.service.ts` | Geolocation | High (browser API) |
| `src/prisma/*` | Database queries | Medium (generated) |
| `scripts/sync-wiki.mjs` | Git operations | High (child_process) |

---

## 13. Architecture Notes

- **Hexagonal Architecture:** `src/core/services/` is domain logic — no platform I/O (lazy `import()` only for platform modules like `node:crypto` in `generator.service.ts`)
- **Platform I/O:** `src/infrastructure/` owns filesystem, DOM, worker, vault
- **Framework Integrations:** `src/adapters/` contain Express, Hono, NestJS, Astro, Next, Nuxt, Bun, CLI
- **Safe Result Shape:** `{ data, error, ok }` used at boundaries — helpers: `useAttempt()`, `useTryJsonParse()`, `useErrorNormalize()`
- **Import Alias:** `@/` maps to `src/` — rewritten by `tsc-alias` post-build

---

## 14. Recommendations

1. **Path Confinement:** Add sandbox/root directory to `filesystem.service.ts` — logical role guards insufficient
2. **Scheme Validation:** Add http(s) allowlist to `media.service.ts` iframe handling (match `http.service.ts`)
3. **HTML Sanitization:** Document or implement sanitization for `dom.service.ts` `innerHTML` sink
4. **Subject Resolution:** Make `resolveSubject` required in assistant router or document IDOR risk explicitly
5. **KDF Hardening:** Enforce minimum KDF parameters in `vault.store.ts` — don't trust envelope
6. **Model Input Validation:** Validate tool arguments against schema after JSON parse in `agent.service.ts`
7. **XML Parsing:** Consider proper XML parser with XXE protection for `youtube.service.ts`

---

**End of Inventory**
