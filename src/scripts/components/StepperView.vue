<template>
	<div>
		<slot :open-item="openItem" :hover-item="hoverItem" :leave-item="leaveItem" :active="active" :progross="progross" />
	</div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
	speed: {
		type: Number,
		default: 1000
	},
	duration: {
		type: Number,
		default: 0
	}
})

const active = ref(1)
const progross = ref(0)

let animationFrame = 0
let startedAt = 0
let pausedElapsed = 0
let hoveredItem = null
let isPaused = false

const updateTimer = (now) => {
	const speed = Math.max(1, props.speed)
	const elapsed = now - startedAt

	if (elapsed >= speed) {
		const passedSteps = Math.floor(elapsed / speed)
		const stepsCount = Math.max(1, props.duration)

		active.value = ((active.value - 1 + passedSteps) % stepsCount) + 1
		startedAt += passedSteps * speed

		if (hoveredItem === active.value) {
			pausedElapsed = now - startedAt
			progross.value = Math.min(100, (pausedElapsed / speed) * 100)
			isPaused = true
			animationFrame = 0
			return
		}
	}

	progross.value = Math.min(100, ((now - startedAt) / speed) * 100)
	animationFrame = requestAnimationFrame(updateTimer)
}

const resetTimer = () => {
	cancelAnimationFrame(animationFrame)
	startedAt = performance.now()
	pausedElapsed = 0
	isPaused = false
	progross.value = 0

	if (hoveredItem === active.value) {
		isPaused = true
		animationFrame = 0
	} else {
		animationFrame = requestAnimationFrame(updateTimer)
	}
}

const pauseTimer = () => {
	if (isPaused) return

	const speed = Math.max(1, props.speed)
	pausedElapsed = Math.min(performance.now() - startedAt, speed)
	progross.value = Math.min(100, (pausedElapsed / speed) * 100)
	isPaused = true
	cancelAnimationFrame(animationFrame)
	animationFrame = 0
}

const resumeTimer = () => {
	if (!isPaused) return

	startedAt = performance.now() - pausedElapsed
	isPaused = false
	animationFrame = requestAnimationFrame(updateTimer)
}

const hoverItem = (index) => {
	hoveredItem = Number(index)

	if (hoveredItem === active.value) pauseTimer()
}

const leaveItem = (index) => {
	if (hoveredItem !== Number(index)) return

	hoveredItem = null
	resumeTimer()
}

const openItem = (index) => {
	const lastItem = Math.max(1, props.duration)

	active.value = Math.min(Math.max(1, Number(index) || 1), lastItem)
	resetTimer()
}

onMounted(resetTimer)
onBeforeUnmount(() => cancelAnimationFrame(animationFrame))
</script>
