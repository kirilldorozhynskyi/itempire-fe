<template>
	<div>
		<div v-if="topNav" class="mb-6">
			<div class="flex items-center gap-2.5">
				<button type="button" class="btn-white size-11 p-0!" @click="scrollPrev" :disabled="isPrevDisabled" aria-label="Previous">
					<SvgIcon name="angle" class="rotate-180 text-xl!" />
				</button>
				<button class="btn-white size-11 p-0!" @click="scrollNext" aria-label="Next">
					<SvgIcon name="angle" class="text-xl!" />
				</button>
			</div>
		</div>

		<div class="relative w-full" :class="{ 'overflow-hidden': overflow }">
			<div ref="emblaRef" :class="[{ 'overflow-hidden': overflow }, wrapperClass]">
				<div class="slider-wrapper flex" :class="{ 'transform-none!': isPrevDisabled && isNextDisabled }">
					<slot />
				</div>
			</div>

			<div
				v-if="!(isPrevDisabled && isNextDisabled) && nav && sideNav"
				class="nav-side pointer-events-none absolute inset-y-0 -right-12 -left-12 z-10 flex items-center justify-between"
			>
				<button
					type="button"
					class="btn-primary pointer-events-auto size-11 -translate-x-1/2 p-0! max-md:translate-x-0"
					@click="scrollPrev"
					:disabled="isPrevDisabled"
					aria-label="Previous"
				>
					<SvgIcon name="angle" class="rotate-180 text-xl!" />
				</button>
				<button
					type="button"
					class="btn-primary pointer-events-auto size-11 translate-x-1/2 p-0! max-md:translate-x-0"
					@click="scrollNext"
					:disabled="isNextDisabled"
					aria-label="Next"
				>
					<SvgIcon name="angle" class="text-xl!" />
				</button>
			</div>

			<div v-if="dots && scrollSnaps.length > 1" class="dots flex items-center justify-center gap-2" :class="dotsClass ? dotsClass : 'mt-6'">
				<div class="flex gap-2">
					<button
						v-for="(_, index) in scrollSnaps"
						:key="`dot-${index}`"
						type="button"
						class="transit size-2 cursor-pointer rounded-xs"
						:class="{
							'bg-white': dotsClass,
							'opacity-60': index != selectedIndex
						}"
						@click="scrollTo(index)"
						:aria-label="`Go to slide ${index + 1}`"
					/>
				</div>
			</div>

			<div v-if="!(isPrevDisabled && isNextDisabled) && nav" class="mt-8 flex items-center gap-2">
				<button type="button" class="btn-outline-neutral p-2" @click="scrollPrev" :disabled="isPrevDisabled" aria-label="Previous">
					<SvgIcon name="arrow-left" />
				</button>
				<button class="btn-outline-neutral p-2" @click="scrollNext" aria-label="Next">
					<SvgIcon name="arrow-right" />
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import Fade from 'embla-carousel-fade'
import emblaCarouselVue from 'embla-carousel-vue'
import { ref, watch } from 'vue'
import SvgIcon from '../SvgIcon.vue'

const props = defineProps({
	align: { type: String, default: 'start' },
	wrapperClass: { type: String, default: 'start' },
	overflow: { type: Boolean, default: true },
	loop: { type: Boolean, default: false },
	fade: { type: Boolean, default: false },
	dots: { type: Boolean, default: false },
	nav: { type: Boolean, default: true },
	sideNav: { type: Boolean, default: false },
	topNav: { type: Boolean, default: false },
	dark: { type: Boolean, default: false },
	dotsNode: { type: String, default: '' },
	dotsClass: { type: String, default: '' }
})

const [emblaRef, emblaApi] = emblaCarouselVue({ align: props.align, loop: props.loop }, props.fade ? [Fade()] : [])
const isPrevDisabled = ref(true)
const isNextDisabled = ref(true)
const selectedIndex = ref(0)
const scrollSnaps = ref([])

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

const handleSelect = () => {
	updateButtons()
	updateDots()
}

const handleReInit = () => {
	updateButtons()
	updateDots()
}

watch(
	emblaApi,
	(api) => {
		if (!api) {
			return
		}
		api.on('select', handleSelect)
		api.on('reInit', handleReInit)
		handleReInit()
	},
	{ immediate: true }
)
</script>
