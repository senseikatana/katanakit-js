<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import { useRoute } from "vitepress";
import { nextTick, onBeforeUnmount, onMounted, watch } from "vue";

import GitHubStars from "./components/GitHubStars.vue";
import SiteVersion from "./components/SiteVersion.vue";
import WhatNew from "./components/WhatNew.vue";
import { newPagePaths, decorateNewPages } from "./newBadges";

const route = useRoute();
let observer: MutationObserver | undefined;
let frame = 0;

const decorate = () => {
	cancelAnimationFrame(frame);
	frame = requestAnimationFrame(() => decorateNewPages(newPagePaths()));
};

onMounted(() => {
	nextTick(decorate);
	const sidebar = document.querySelector(".VPSidebar");
	if (sidebar) {
		observer = new MutationObserver(decorate);
		observer.observe(sidebar, { childList: true, subtree: true });
	}
});

onBeforeUnmount(() => {
	observer?.disconnect();
	cancelAnimationFrame(frame);
});

watch(() => route.path, () => nextTick(decorate));
</script>

<template>
	<DefaultTheme.Layout>
		<template #nav-bar-title-after>
			<SiteVersion />
		</template>
		<template #nav-bar-content-after>
			<GitHubStars />
		</template>
		<template #layout-bottom>
			<WhatNew />
		</template>
	</DefaultTheme.Layout>
</template>
