---
title: Toast
description: Transient notifications with a live-region stack, pause-on-hover countdown and a programmatic manager.
---

# Toast <span class="vp-new-badge">new</span>

`useToastStore()` returns a singleton manager that mounts toasts into a live-region
stack. `useToast(options)` builds a single detached element when you own the
lifecycle yourself, and `useToastClass()` / `useToastContainerClass()` return plain
class strings for SSR markup.

No JSX, no framework runtime — the store talks to `document.body` directly, so the
same code works from Astro, Nuxt, plain Node scripts or a static page.

## Variants

Five types. `error` escalates its own live region to `role="alert"`; everything else
is a polite `role="status"`. `loading` is indeterminate and stays pinned until you
dismiss or update it.

<ClientOnly>
  <div ref="variants" class="kk-toast-demo"></div>
</ClientOnly>

```ts
import { useToastStore } from "@katanakit/ui";

const toast = useToastStore();
toast.info("Sync started.");
toast.success("Profile saved.");
toast.warning("Quota at 90%.");
toast.error("Upload failed.");
toast.loading("Uploading 3 files…");
```

## The loading → success pattern

`update()` swaps the content in place and keeps the id, position and stacking order,
so a progress toast never jumps around the screen.

<ClientOnly>
  <div class="kk-toast-demo"><button type="button" class="kk-btn kk-btn--primary" @click="runUpload">Run the upload demo</button></div>
</ClientOnly>

```ts
const handle = toast.loading("Uploading 3 files…");

// later — the stack keeps the same slot
handle.update({ type: "success", message: "3 files uploaded." });
```

## Duration

Default is 5000 ms. `error` gets 8000 ms so it is not missed, and `loading` gets `0`
— pinned open. Pass `duration: 0` to pin any type.

| Type       | Default | Rationale                                     |
| ---------- | ------- | --------------------------------------------- |
| `info`     | 5000 ms | Reads at a glance.                            |
| `success`  | 5000 ms | Confirmation does not need extra time.        |
| `warning`  | 5000 ms |                                           |
| `error`    | 8000 ms | Should not vanish before it is read.          |
| `loading`  | pinned  | Only you know when the work finished.         |

## Pause on hover and focus

The countdown freezes on `mouseenter` and on `focusin`, and the progress bar freezes
with it via `animation-play-state` — the bar and the JS timer never desync. Keyboard
users get the same courtesy as mouse users.

<ClientOnly>
  <div class="kk-toast-demo"><button type="button" class="kk-btn kk-btn--secondary" @click="runPause">Hover the toast</button></div>
</ClientOnly>

## Positions

Six anchors: `top-right` (default), `top-center`, `top-left`, `bottom-right`,
`bottom-center`, `bottom-left`. Each position gets its own stack, created lazily.

<ClientOnly>
  <div class="kk-toast-demo kk-toast-demo--wrap">
    <button type="button" class="kk-btn kk-btn--ghost" @click="runPositions">Show all six</button>
  </div>
</ClientOnly>

```ts
toast.info("Top right", { position: "top-right" });
toast.info("Bottom center", { position: "bottom-center" });
```

## Options

| Option        | Type                                              | Default  | Notes                                                     |
| ------------- | ------------------------------------------------- | -------- | --------------------------------------------------------- |
| `type`        | `"info" \| "success" \| "warning" \| "error" \| "loading"` | `"info"` | Colors and ARIA role.                                      |
| `title`       | `string`                                          | —        | Bold heading line.                                         |
| `message`     | `string`                                          | —        | Body text.                                                 |
| `size`        | `"sm" \| "md" \| "lg"`                            | `"md"`   |                                                           |
| `position`    | six-anchor union                                  | `"top-right"` | Stack to mount into.                                 |
| `duration`    | `number` (ms)                                     | per type | `0` pins the toast open.                                  |
| `dismissible` | `boolean`                                         | `true`   | Renders the close button.                                 |
| `closeLabel`  | `string`                                          | `"Dismiss notification"` | Accessible name for that button.              |
| `onClose`     | `(id: string) => void`                            | —        | Called once the toast leaves the DOM.                     |

## Store API

| Method                  | Returns        | Notes                                                   |
| ----------------------- | -------------- | ------------------------------------------------------- |
| `show(options?)`        | `ToastHandle`  | Full control over every option.                         |
| `info(message, opts?)`  | `ToastHandle`  | Sugar for `show({ type: "info", message })`.             |
| `success(message, …)`   | `ToastHandle`  |                                                           |
| `warning(message, …)`   | `ToastHandle`  |                                                           |
| `error(message, …)`     | `ToastHandle`  | Assertive role.                                          |
| `loading(message, …)`   | `ToastHandle`  | Pinned open.                                             |
| `dismiss(id?)`          | `void`         | One by id, or every toast when omitted.                  |
| `clear()`               | `void`         | Every toast across all positions.                        |

`ToastHandle` is `{ id, update(partial), dismiss() }`. `ToastService.getInstance()`
returns the same store for dependency-injection call sites.

## Accessibility

- The stack is `role="region"` + `aria-live="polite"` + `aria-label="Notifications"`.
- Each toast is `role="status"`, escalating to `role="alert"` for `error`.
- Status icons are inline SVG marked `aria-hidden="true"` — the message carries the
  meaning, so the glyph is decorative.
- The countdown bar is `aria-hidden="true"`; it is a timing cue, not content.
- `prefers-reduced-motion: reduce` removes every animation and the slide-in transform.

::: info SSR
`useToastStore()`, `useToast()` and `useToastContainer()` all need a DOM and throw
with a pointer to the fix. On the server use `useToastClass()` and
`useToastContainerClass()` — both are pure functions returning stable strings.
:::

```astro
---
// Astro: markup from the pure surface, behaviour from a client script
import { useToastClass, useToastContainerClass } from "@katanakit/ui";
---

<div class={useToastContainerClass({ position: "top-right" })} role="region" aria-label="Notifications">
  <div class={useToastClass({ type: "success" })} role="status">
    <div class="kk-toast__content"><p class="kk-toast__message">Deployed.</p></div>
  </div>
</div>
```

<script>
  import { useToastStore } from "@katanakit/ui";
  useToastStore().success("Deployed.");
</script>
```

<style scoped>
.kk-toast-demo {
	display: flex;
	gap: var(--spacing-3);
	align-items: flex-start;
	margin: var(--spacing-4) 0;
}

.kk-toast-demo--wrap {
	flex-wrap: wrap;
}
</style>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import { useToastStore } from "@katanakit/ui";

const variants = ref<HTMLElement>();

onMounted(() => {
	const toast = useToastStore();
	const stack = variants.value;
	if (!stack) return;

	// The store mounts into document.body so positions work; for the inline
	// demo we move each toast into the local container afterwards.
	const local = stack.closest(".kk-toast-demo") as HTMLElement | null;
	const host = document.createElement("div");
	if (local) local.prepend(host);

	toast.info("Sync started.");
	toast.success("Profile saved.");
	toast.warning("Quota at 90%.");
	toast.error("Upload failed.");

	// Mirror the fixed stack into the inline preview, offset from the edge.
	window.setTimeout(() => {
		for (const node of document.querySelectorAll(".kk-toast-stack--top-right > .kk-toast")) {
			if (!host.contains(node)) host.append(node);
		}
	}, 0);
});

function runUpload() {
	const toast = useToastStore();
	const handle = toast.loading("Uploading 3 files…", { position: "bottom-right" });
	window.setTimeout(() => handle.update({ type: "success", message: "3 files uploaded." }), 2500);
}

function runPause() {
	useToastStore().success("Hover me — the countdown pauses.", { duration: 6000 });
}

function runPositions() {
	const toast = useToastStore();
	const spots = [
		["top-right", "Top right"],
		["top-center", "Top center"],
		["top-left", "Top left"],
		["bottom-right", "Bottom right"],
		["bottom-center", "Bottom center"],
		["bottom-left", "Bottom left"],
	] as const;

	for (const [position, label] of spots) {
		toast.info(label, { position, duration: 4000 });
	}
}
</script>