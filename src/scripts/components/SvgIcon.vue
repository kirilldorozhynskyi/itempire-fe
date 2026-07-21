<template>
	<svg class="sprite-icon" :aria-hidden="decorative" :aria-label="label" :role="decorative ? undefined : 'img'" focusable="false">
		<use :xlink:href="iconHref"></use>
	</svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
	defineProps<{
		name: string
		label?: string | null
		decorative?: boolean
	}>(),
	{
		label: null,
		decorative: true
	}
)

const iconHref = computed(() => {
	return import.meta.env.DEV ? `#icon-${props.name}` : `./assets/spritemap.svg#icon-${props.name}`
})
</script>
