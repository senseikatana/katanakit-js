---
title: Telegram
description: Put the Kitt assistant on Telegram with long polling — no public URL required.
---

# Telegram

This guide puts the [Kitt assistant](/guides/assistant) on Telegram using
**long polling**, which needs no public URL and no webhook infrastructure.
Sessions map to chats one-to-one (`telegram:<chatId>`), so every conversation
keeps its own history.

## 1. Create the bot

1. Open Telegram and talk to [@BotFather](https://t.me/BotFather).
2. Send `/newbot`, then choose a name and a username.
3. Copy the token BotFather returns.
4. Set it as `TELEGRAM_BOT_TOKEN` in your environment.

## 2. Connect and start polling

```ts
import { defineTelegramConfig, useStartTelegramPolling } from "katanakit-js/adapters/telegram";

defineTelegramConfig({ token: process.env.TELEGRAM_BOT_TOKEN });
await useStartTelegramPolling();
```

`defineTelegramConfig` is config-only — it takes no methods — and
`useStartTelegramPolling()` runs until the process stops. Configure the
assistant itself (`useInitAssistant`, tools, model) first, as shown in
[Assistant (Kitt)](/guides/assistant).

## 3. Webhook instead of polling

If you prefer Telegram pushing updates over HTTPS, expose an endpoint and route
each inbound update through the same handler polling uses:

```ts
import { useHandleTelegramUpdate } from "katanakit-js/adapters/telegram";

app.post("/telegram/webhook", async (req, res) => {
	res.sendStatus(200);
	await useHandleTelegramUpdate(req.body);
});
```

## 4. Try it in this repo

```bash
DASHSCOPE_API_KEY=... TELEGRAM_BOT_TOKEN=... KITT_CHANNEL=telegram bun run examples/assistant/demo.ts
```

Message your bot on Telegram and the demo's tools (`readFile`,
`saveNote` — see [`examples/assistant/`](https://github.com/senseikatana/katanakit-js/tree/main/examples/assistant))
reply through the same session machinery as the REST channel.

## Related

- [Assistant (Kitt)](/guides/assistant) — providers, sessions and tools.
- [WhatsApp](/guides/whatsapp) — the webhook-based sibling channel.
