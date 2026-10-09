<script setup lang="ts">
import { computed } from "vue";

import { siteSignals } from "../signals";

const version = computed(() => siteSignals().version);
</script>

<template>
	<a v-if="version" class="home-announcement" href="/changelog">
		<span class="home-announcement__dot" aria-hidden="true" />
		<span>KatanaKit <b>v{{ version }}</b> is out</span>
		<span class="home-announcement__arrow" aria-hidden="true">→</span>
	</a>
</template>
