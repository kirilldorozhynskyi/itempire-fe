<template>
	<div ref="rail" class="rfm-rail flex h-auto items-center gap-6" :style="railStyle">
		<template v-for="i in repeats" :key="i">
			<slot />
		</template>
	</div>
</template>

<script setup>
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const lazyLoad = inject('lazyLoad')

const props = defineProps({
	count: {
		type: Number,
		required: true
	}
})

const repeatCount = ref(2)
const SLIDE_WIDTH = 172

const updateRepeatCount = () => {
	const screenWidth = window.innerWidth
	const totalSlides = Math.ceil(screenWidth / SLIDE_WIDTH)
	const baseCount = props.count || 0

	if (!baseCount) {
		repeatCount.value = 2
		return
	}

	repeatCount.value = Math.max(2, Math.ceil(totalSlides / baseCount) + 1)
}

const repeats = computed(() => Array.from({ length: repeatCount.value }, (_, index) => index))
const railStyle = computed(() => ({
	'--rfm-offset': `-${100 / repeatCount.value}%`
}))

onMounted(async () => {
	updateRepeatCount()
	await nextTick()
	lazyLoad?.update()
	window.addEventListener('resize', updateRepeatCount, { passive: true })
})

onBeforeUnmount(() => {
	window.removeEventListener('resize', updateRepeatCount)
})
</script>
