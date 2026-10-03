<script setup lang="ts">
import { computed } from "vue";

import { siteSignals } from "../signals";

const version = computed(() => siteSignals().version);
</script>

<template>
	<a v-if="version" class="site-version" href="/changelog" title="Release history">
		v{{ version }}
	</a>
</template>
