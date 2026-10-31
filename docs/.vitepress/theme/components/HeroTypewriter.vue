<script setup lang="ts">
import { useData } from "vitepress";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

/**
 * Hero heading with a typewriter effect and a blinking caret.
 *
 * Replaces VitePress' default `home-hero-info` slot, which is why the heading
 * and the tagline are rendered here: the slot replaces both.
 *
 * Accessibility and SEO are handled by rendering the full text twice — once
 * as the animated, `aria-hidden` copy and once as visually hidden text that
 * assistive tech and crawlers read. Without JavaScript, and under
 * `prefers-reduced-motion`, the full text is simply shown.
 */

const { frontmatter } = useData();

const hero = computed(
	() => (frontmatter.value.hero ?? {}) as { text?: string; tagline?: string },
);
const fullText = computed(() => hero.value.text ?? "");

/** Milliseconds per character — tuned so the line lands in ~1.4s. */
const SPEED = 42;
/** Pause before typing starts, so the hero has settled into place. */
const START_DELAY = 220;

// Starts complete: server-rendered HTML (and the hydration pass) carries the
// whole line, so there is no empty heading and no hydration mismatch.
const typed = ref(fullText.value);
const done = ref(true);
let timer: ReturnType<typeof setTimeout> | undefined;

function type(index: number) {
	typed.value = fullText.value.slice(0, index);
	if (index >= fullText.value.length) {
		done.value = true;
		return;
	}
	timer = setTimeout(() => type(index + 1), SPEED);
}

onMounted(() => {
	const reduced =
		typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
	if (reduced || !fullText.value) return;

	typed.value = "";
	done.value = false;
	timer = setTimeout(() => type(1), START_DELAY);
});

onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
	<h1 class="heading">
		<span class="text hero-heading" aria-hidden="true">{{ typed }}<span
			class="hero-heading__caret"
			:class="{ 'hero-heading__caret--idle': done }"
		/></span>
		<span class="visually-hidden">{{ fullText }}</span>
	</h1>
	<p v-if="hero.tagline" class="tagline">{{ hero.tagline }}</p>
</template>
