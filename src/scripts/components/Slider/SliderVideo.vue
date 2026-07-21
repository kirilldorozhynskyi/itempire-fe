<template>
	<div>
		<div class="relative" :class="[{ 'overflow-hidden': overflow }, wrapperClass]">
			<div ref="emblaRef" :class="[{ 'overflow-hidden': overflow, 'slider-video--fade': fade }]">
				<div
					class="slider-wrapper flex"
					:class="{
						'transform-none!': isPrevDisabled && isNextDisabled
					}"
				>
					<slot />
				</div>
			</div>

			<div v-if="!(isPrevDisabled && isNextDisabled) && nav" class="mt-12">
				<div class="flex items-center justify-center gap-5">
					<button type="button" class="btn-idle p-3" @click="scrollPrev" :disabled="isPrevDisabled" aria-label="Previous">
						<SvgIcon name="angle" class="rotate-180 text-xl!" />
					</button>

					<slot name="caption" :selected-index="selectedIndex" />

					<button type="button" class="btn-idle p-3" @click="scrollNext" :disabled="isNextDisabled" aria-label="Next">
						<SvgIcon name="angle" class="text-xl!" />
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import Fade from 'embla-carousel-fade'
import emblaCarouselVue from 'embla-carousel-vue'
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import SvgIcon from '../SvgIcon.vue'

const props = defineProps({
	align: { type: String, default: 'start' },
	wrapperClass: { type: String, default: 'start' },
	overflow: { type: Boolean, default: true },
	loop: { type: Boolean, default: false },
	fade: { type: Boolean, default: true },
	fadeDuration: { type: Number, default: 500 },
	autoplay: { type: Boolean, default: false },
	playOnSelect: { type: Boolean, default: true },
	dots: { type: Boolean, default: false },
	nav: { type: Boolean, default: true },
	dark: { type: Boolean, default: false },
	dotsNode: { type: String, default: '' }
})

const [emblaRef, emblaApi] = emblaCarouselVue({ align: props.align, loop: props.loop }, props.fade ? [Fade()] : [])
const isPrevDisabled = ref(true)
const isNextDisabled = ref(true)
const selectedIndex = ref(0)
const scrollSnaps = ref([])
let videoTimeout = 0
let activeVideoElement = null
let pendingPlayElement = null

function scrollPrev() {
	emblaApi.value?.scrollPrev()
}
function scrollNext() {
	emblaApi.value?.scrollNext()
}
function scrollTo(index) {
	emblaApi.value?.scrollTo(index)
}

const updateButtons = () => {
	const api = emblaApi.value
	if (!api) {
		isPrevDisabled.value = true
		isNextDisabled.value = true
		return
	}
	if (props.loop) {
		isPrevDisabled.value = false
		isNextDisabled.value = false
		return
	}
	isPrevDisabled.value = api.canScrollPrev() === false
	isNextDisabled.value = api.canScrollNext() === false
}

const updateDots = () => {
	const api = emblaApi.value
	if (!api) {
		scrollSnaps.value = []
		selectedIndex.value = 0
		return
	}

	scrollSnaps.value = api.scrollSnapList() ?? []
	selectedIndex.value = api.selectedScrollSnap() ?? 0
}

const loadVideo = (video) => {
	let sourceChanged = false

	if (!video.getAttribute('src') && video.dataset.src) {
		video.setAttribute('src', video.dataset.src)
		sourceChanged = true
	}

	video.querySelectorAll('source[data-src]').forEach((source) => {
		if (!source.getAttribute('src')) {
			source.setAttribute('src', source.dataset.src)
			sourceChanged = true
		}
	})

	if (sourceChanged || video.readyState === 0) {
		video.load()
	}
}

const pauseVideo = (video) => {
	video.removeEventListener('canplay', handlePendingVideoCanPlay)

	if (pendingPlayElement === video) {
		pendingPlayElement = null
	}

	video.pause()

	try {
		video.currentTime = 0
	} catch {
		// Some browsers block currentTime changes until metadata exists.
	}
}

const playVideo = (video) => {
	video.muted = true
	video.defaultMuted = true

	const playPromise = video.play()

	if (playPromise?.catch) {
		playPromise.catch(() => {
			if (activeVideoElement !== video) {
				return
			}

			pendingPlayElement?.removeEventListener('canplay', handlePendingVideoCanPlay)
			pendingPlayElement = video
			pendingPlayElement.addEventListener('canplay', handlePendingVideoCanPlay, { once: true })
		})
	}
}

function handlePendingVideoCanPlay() {
	if (!pendingPlayElement) {
		return
	}

	const video = pendingPlayElement
	pendingPlayElement = null

	if (activeVideoElement !== video) {
		return
	}

	playVideo(video)
}

const handleActiveVideoEnded = () => {
	const api = emblaApi.value
	if (!props.autoplay || !api) {
		return
	}

	if (props.loop || api.canScrollNext()) {
		api.scrollNext()
	}
}

const setActiveVideoElement = (video) => {
	if (activeVideoElement === video) {
		return
	}

	activeVideoElement?.removeEventListener('ended', handleActiveVideoEnded)
	activeVideoElement = video
	activeVideoElement?.addEventListener('ended', handleActiveVideoEnded)
}

const updateFadeSlides = () => {
	const api = emblaApi.value
	if (!api) {
		return
	}

	const slides = api.slideNodes()
	const selected = api.selectedScrollSnap() ?? 0

	slides.forEach((slide, index) => {
		const isActive = index === selected
		slide.classList.toggle('is-active', isActive)
		slide.setAttribute('aria-hidden', isActive ? 'false' : 'true')
	})
}

const syncVideoPlayback = (delay = 0) => {
	const api = emblaApi.value
	if (!api) {
		return
	}

	window.clearTimeout(videoTimeout)

	const slides = api.slideNodes()
	const selected = api.selectedScrollSnap() ?? 0
	const activeVideo = slides[selected]?.querySelector('video') ?? null
	setActiveVideoElement(props.autoplay ? activeVideo : null)

	slides.forEach((slide) => {
		slide.querySelectorAll('video').forEach((video) => {
			if (video !== activeVideo) {
				pauseVideo(video)
			}
		})
	})

	if (!props.playOnSelect || !activeVideo) {
		return
	}

	videoTimeout = window.setTimeout(() => {
		loadVideo(activeVideo)

		try {
			activeVideo.currentTime = 0
		} catch {
			// Some browsers block currentTime changes until metadata exists.
		}

		playVideo(activeVideo)
	}, delay)
}

const handleSelect = () => {
	updateButtons()
	updateDots()
	updateFadeSlides()
	syncVideoPlayback(props.fade ? props.fadeDuration : 0)
}

const handleReInit = () => {
	updateButtons()
	updateDots()
	updateFadeSlides()
	syncVideoPlayback()
}

watch(
	emblaApi,
	(api) => {
		if (!api) {
			return
		}
		api.on('select', handleSelect)
		api.on('reInit', handleReInit)
		api.on('resize', handleReInit)
		nextTick(() => {
			window.requestAnimationFrame(handleReInit)
		})
	},
	{ immediate: true }
)

onBeforeUnmount(() => {
	window.clearTimeout(videoTimeout)
	pendingPlayElement?.removeEventListener('canplay', handlePendingVideoCanPlay)
	pendingPlayElement = null
	setActiveVideoElement(null)
})
</script>

<style>
.slider-video--fade video {
	display: block;
	height: auto;
	width: 100%;
}
</style>
