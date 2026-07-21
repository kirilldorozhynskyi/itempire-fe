<template>
	<div class="embla__slide shrink-0 grow-0">
		<slot />
	</div>
</template>

<script setup>
import { onMounted, inject } from 'vue'

const lazyLoad = inject('lazyLoad')

onMounted(() => {
	lazyLoad.update()
})
</script>
