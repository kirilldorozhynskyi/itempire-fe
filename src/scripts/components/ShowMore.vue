<template>
	<div ref="container" class="flex flex-col items-start gap-4">
		<div v-if="textLabel" class="text-primary text-sm leading-snug font-medium" v-html="textLabel" />

		<slot :expanded="expanded" :is-visible="isVisible" />

		<button
			v-if="hasToggle"
			type="button"
			class="text-subtile link-hover-underlined cursor-pointer tracking-tight"
			:aria-expanded="expanded"
			@click="expanded = !expanded"
			:aria-label="expanded ? lessText : moreText"
		>
			{{ expanded ? lessText : moreText }}
		</button>
	</div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'

const props = defineProps({
	visibleCount: {
		type: Number,
		default: 6
	},
	moreText: {
		type: String,
		default: 'Zobraziť viac'
	},
	lessText: {
		type: String,
		default: 'Skryť'
	},
	textLabel: {
		type: String
	}
})

const container = ref(null)
const expanded = ref(false)
const total = ref(0)
const showAll = computed(() => props.visibleCount < 0)
const hasToggle = computed(() => !showAll.value && total.value > props.visibleCount)
const isVisible = (index) => showAll.value || expanded.value || index < props.visibleCount

onMounted(async () => {
	await nextTick()
	total.value = container.value?.querySelectorAll('[data-show-more-item]').length ?? 0
})
</script>
