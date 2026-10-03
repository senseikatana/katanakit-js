<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { siteSignals } from "../signals";

const CHANGELOG_URL = "/changelog";
const STORAGE_KEY = "katanakit:whats-new-seen";

const release = computed(() => siteSignals().changelog ?? null);
const open = ref(false);
const visible = computed(() => Boolean(release.value));

const title = computed(() => {
	const data = release.value;
	if (!data) return "";
	return `Changelog ${formatDate(data.date)}`;
});

function formatDate(iso: string): string {
	const [year, month, day] = iso.split("-").map(Number);
	const months = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December",
	];
	return `${months[(month ?? 1) - 1]} ${day}, ${year}`;
}

function seen(): string | null {
	try {
		return localStorage.getItem(STORAGE_KEY);
	} catch {
		return null;
	}
}

function dismiss() {
	open.value = false;
	try {
		localStorage.setItem(STORAGE_KEY, release.value?.version ?? "");
	} catch {
		/* private mode — the modal just shows again next visit */
	}
}

onMounted(() => {
	if (!release.value) return;
	if (seen() === release.value.version) return;
	// Open right away: the panel animates in through CSS, and a timer here only
	// adds a window where a route change can remount the layout and close it.
	open.value = true;
});
</script>

<template>
	<div v-if="visible" class="whats-new" :class="{ open }">
		<button
			class="whats-new__launcher"
			type="button"
			:aria-expanded="open"
			aria-controls="whats-new-panel"
			@click="open = !open"
		>
			<span class="whats-new__dot" aria-hidden="true" />
			v{{ release?.version }}
			<span class="whats-new__label">What's new</span>
		</button>

		<section v-show="open" id="whats-new-panel" class="whats-new__panel" role="dialog" aria-label="Changelog">
			<header class="whats-new__header">
				<h2>{{ title }}</h2>
				<button class="whats-new__close" type="button" aria-label="Close" @click="dismiss">✕</button>
			</header>

			<div class="whats-new__body">
				<ul v-for="section in release?.sections" :key="section.title">
					<li v-for="(item, index) in section.items" :key="index" v-html="item" />
				</ul>
			</div>

			<footer class="whats-new__footer">
				<a class="whats-new__cta" :href="CHANGELOG_URL">See Full Changelog</a>
			</footer>
		</section>
	</div>
</template>
