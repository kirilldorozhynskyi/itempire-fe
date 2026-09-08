<template>
	<div class="flex w-full min-w-0 flex-col gap-2">
		<div ref="viewport" :class="{ 'logos-wrapper': pauseOnHover }" class="overflow-hidden">
			<div ref="rail" class="rfm-rail flex items-center" :style="railStyle">
				<div v-for="i in repeats" :key="i" class="rfm-group flex shrink-0 items-center gap-6 pe-6" :aria-hidden="i > 0 ? 'true' : undefined">
					<slot />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const lazyLoad = inject('lazyLoad')
const props = defineProps({
	count: { type: Number, required: true },
	direction: { type: String, default: 'left' },
	pauseOnHover: { type: Boolean, default: false }
})

const viewport = ref(null)
const rail = ref(null)
const repeatCount = ref(2)
let resizeObserver

const updateRepeatCount = () => {
	const groupWidth = rail.value?.firstElementChild?.getBoundingClientRect().width || 0
	repeatCount.value = props.count && groupWidth ? Math.max(2, Math.ceil(viewport.value.clientWidth / groupWidth) + 1) : 2
}

const repeats = computed(() => Array.from({ length: repeatCount.value }, (_, index) => index))
const railStyle = computed(() => ({
	'--rfm-offset': `-${100 / repeatCount.value}%`,
	animationDirection: props.direction === 'right' ? 'reverse' : 'normal',
	animationDuration: props.pauseOnHover ? `${Math.max(30, props.count * 4)}s` : undefined
}))

onMounted(async () => {
	updateRepeatCount()
	await nextTick()
	lazyLoad?.update()
	resizeObserver = new ResizeObserver(updateRepeatCount)
	resizeObserver.observe(viewport.value)
	if (rail.value?.firstElementChild) resizeObserver.observe(rail.value.firstElementChild)
})

onBeforeUnmount(() => resizeObserver?.disconnect())
</script>
