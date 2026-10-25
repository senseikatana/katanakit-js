# katanakitAI

API keys, MCP servers and AI agent configuration in one encrypted vault.
This package is the CLI entry point (`kai`) — the implementation ships with
[`katanakit-js`](https://www.npmjs.com/package/katanakit-js).

## Usage

No install needed:

```bash
npx katanakitai keys list       # npm
bunx katanakitai keys list      # bun
```

Or install it once and use the short command:

```bash
npm install -g katanakitai
kai help
```

Every vault command reads `KATANAKITAI_PASSPHRASE`. See the
[katanakitAI guide](https://docs.senseikatana.com/guides/services/katanakit-ai)
for the full cookbook.
