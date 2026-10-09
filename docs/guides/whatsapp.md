---
title: WhatsApp
description: Put the Kitt assistant on WhatsApp through the Meta Cloud API — webhook, signature verification and rate limits included.
---

# WhatsApp

This guide connects the [Kitt assistant](/guides/assistant) to WhatsApp through
the **Meta Cloud API**. Sessions map to phone numbers (`wa:<phone>`), and the
adapter handles webhook verification, HMAC signature checks and Meta's retry
semantics for you.

## 1. Create the Meta app

1. Create a Meta Business account and an app at
   [developers.facebook.com](https://developers.facebook.com).
2. Add the **WhatsApp** product to the app.
3. Copy the temporary (or permanent) token, the **Phone number ID** and the
   **App Secret**.

## 2. Configure the adapter

```env
WHATSAPP_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_APP_SECRET=
```

```ts
import { defineWhatsAppConfig, useStartWhatsApp } from "katanakit-js/adapters/whatsapp";

defineWhatsAppConfig({
	token: process.env.WHATSAPP_TOKEN,
	phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
	verifyToken: process.env.WHATSAPP_VERIFY_TOKEN,
	appSecret: process.env.WHATSAPP_APP_SECRET,
});
useStartWhatsApp();
```

`defineWhatsAppConfig` is config-only — it takes no methods. This serves the
webhook at `GET`/`POST` `/whatsapp/webhook`.

## 3. Expose HTTPS and register the webhook

1. Expose your server over public HTTPS (Cloudflare Tunnel or ngrok work for
   development).
2. In Meta, set the webhook URL to `https://your-host/whatsapp/webhook` and the
   verify token to `WHATSAPP_VERIFY_TOKEN`.
3. Subscribe to the `messages` field.

## 4. Mount the webhook on your own server

The handlers are exported individually, so the webhook can live inside an
existing Express app:

```ts
import {
	useVerifyWhatsAppWebhook,
	useVerifyWhatsAppSignature,
	useHandleWhatsAppMessage,
} from "katanakit-js/adapters/whatsapp";
```

`useVerifyWhatsAppWebhook` answers Meta's `GET` challenge,
`useVerifyWhatsAppSignature` checks `X-Hub-Signature-256`, and
`useHandleWhatsAppMessage` processes one inbound message.

## 5. Security and limits

- Inbound deliveries are verified against `X-Hub-Signature-256` (HMAC-SHA256 of
  the raw body with your App Secret) and rejected with `401` when the signature
  is missing or invalid.
- The webhook acks `200` immediately and processes replies asynchronously, so
  Meta does not retry.
- `POST /webhook` is rate-limited to 60 req/min per IP, and at most 5 messages
  are processed per webhook payload (cost-amplification guard).

## 6. Try it in this repo

```bash
KITT_CHANNEL=whatsapp WHATSAPP_TOKEN=... WHATSAPP_PHONE_NUMBER_ID=... \
  WHATSAPP_VERIFY_TOKEN=... bun run examples/assistant/demo.ts
```

See [`examples/assistant/`](https://github.com/senseikatana/katanakit-js/tree/main/examples/assistant)
for the demo tools and the `.env` template.

## Related

- [Assistant (Kitt)](/guides/assistant) — providers, sessions and tools.
- [Telegram](/guides/telegram) — the long-polling sibling channel.
