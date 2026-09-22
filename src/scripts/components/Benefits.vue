<template>
	<div class="flex w-full min-w-0 flex-col gap-2">
		<div ref="viewport" :class="{ 'logos-wrapper': pauseOnHover, 'technology-logos': focusCenter }" class="overflow-hidden">
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
	pauseOnHover: { type: Boolean, default: false },
	focusCenter: { type: Boolean, default: false }
})

const viewport = ref(null)
const rail = ref(null)
const repeatCount = ref(2)
let resizeObserver
let visibilityObserver
let motionQuery
let frame
let visible = false

const updateFocus = () => {
	const bounds = viewport.value.getBoundingClientRect()
	const center = bounds.left + bounds.width / 2
	const items = Array.from(rail.value.querySelectorAll('.technology-logo'))
	// Measure unscaled wrappers; scaling must not alter the rail's steady movement.
	const scales = items.map((item) => {
		const rect = item.getBoundingClientRect()
		const distance = Math.abs(rect.left + rect.width / 2 - center)
		const proximity = Math.max(0, 1 - distance / 64)
		return 1 + 0.625 * proximity * proximity * (3 - 2 * proximity)
	})
	items.forEach((item, index) => item.style.setProperty('--logo-scale', scales[index]))
	frame = requestAnimationFrame(updateFocus)
}

const syncFocus = () => {
	cancelAnimationFrame(frame)
	if (visible && !motionQuery.matches) frame = requestAnimationFrame(updateFocus)
}

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
	if (props.focusCenter) {
		motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
		motionQuery.addEventListener('change', syncFocus)
		visibilityObserver = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting
			syncFocus()
		})
		visibilityObserver.observe(viewport.value)
	}
})

onBeforeUnmount(() => {
	resizeObserver?.disconnect()
	visibilityObserver?.disconnect()
	motionQuery?.removeEventListener('change', syncFocus)
	cancelAnimationFrame(frame)
})
</script>
